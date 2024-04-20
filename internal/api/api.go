package api

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"maps"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/demostanis/42evaluators/internal/models"

	"golang.org/x/sync/semaphore"
)

const (
	defaultPageSize             = 100
	defaultMaxConcurrentFetches = 50
	apiURL                      = "https://api.intra.42.fr"
)

type ParseError struct {
	err  error
	body []byte
}

func (parseError ParseError) Error() string {
	return fmt.Sprintf("failed to parse body: %v (%s)",
		parseError.err, parseError.body)
}

type APIRequest struct {
	method               string
	endpoint             string
	headers              map[string]string
	params               map[string]string
	outputHeadersIn      **http.Header
	authenticated        bool
	authenticatedAs      string
	maxConcurrentFetches int64
	pageSize             string
	startingPage         int
}

func NewRequest(endpoint string) *APIRequest {
	return &APIRequest{
		method:               "GET",
		endpoint:             endpoint,
		headers:              map[string]string{},
		params:               map[string]string{},
		outputHeadersIn:      nil,
		authenticated:        false,
		authenticatedAs:      "",
		maxConcurrentFetches: defaultMaxConcurrentFetches,
		pageSize:             strconv.Itoa(defaultPageSize),
		startingPage:         1,
	}
}

func (apiReq *APIRequest) Authenticated() *APIRequest {
	apiReq.authenticated = true
	return apiReq
}

func (apiReq *APIRequest) AuthenticatedAs(accessToken string) *APIRequest {
	apiReq.authenticatedAs = accessToken
	return apiReq
}

func (apiReq *APIRequest) WithMethod(method string) *APIRequest {
	apiReq.method = method
	return apiReq
}

func (apiReq *APIRequest) WithHeaders(headers map[string]string) *APIRequest {
	maps.Copy(apiReq.headers, headers)
	return apiReq
}

func (apiReq *APIRequest) WithParams(params map[string]string) *APIRequest {
	maps.Copy(apiReq.params, params)
	return apiReq
}

func (apiReq *APIRequest) WithMaxConcurrentFetches(n int64) *APIRequest {
	apiReq.maxConcurrentFetches = n
	return apiReq
}

func (apiReq *APIRequest) WithPageSize(n int) *APIRequest {
	apiReq.pageSize = strconv.Itoa(n)
	return apiReq
}

func (apiReq *APIRequest) FromPage(n int) *APIRequest {
	if n > 0 {
		apiReq.startingPage = n
	}
	return apiReq
}

func (apiReq *APIRequest) OutputHeadersIn(output **http.Header) *APIRequest {
	apiReq.outputHeadersIn = output
	return apiReq
}

func Do[T any](apiReq *APIRequest) (*T, error) {
	var client *RLHTTPClient

	if apiReq.authenticated {
		if len(clients) == 0 {
			return nil, errors.New("no clients available")
		}
		var targetTarget *Target
		for _, target := range targets {
			for _, url := range target.URLs {
				if strings.HasPrefix(apiReq.endpoint, url) {
					targetTarget = &target
					goto end
				}
			}
		}
	end:
		if targetTarget == nil {
			return nil, fmt.Errorf("no target for request %s", apiReq.endpoint)
		}
		client = findNonRateLimitedClientFor(*targetTarget)
	} else {
		client = RateLimitedClient("", models.APIKey{})
	}

	req, err := http.NewRequest(apiReq.method, apiURL+apiReq.endpoint, nil)
	if err != nil {
		return nil, err
	}

	q := req.URL.Query()
	for key, value := range apiReq.params {
		q.Add(key, value)
	}
	req.URL.RawQuery = q.Encode()

	for key, value := range apiReq.headers {
		req.Header.Add(key, value)
	}

	if apiReq.authenticated {
		req.Header.Add("Authorization", "Bearer "+client.accessToken)
	} else if apiReq.authenticatedAs != "" {
		req.Header.Add("Authorization", "Bearer "+apiReq.authenticatedAs)
	}

	DebugRequest(req)
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	DebugResponse(resp)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if apiReq.outputHeadersIn != nil {
		*apiReq.outputHeadersIn = &resp.Header
	}

	var result T
	err = json.Unmarshal(body, &result)
	if err != nil {
		if bytes.HasPrefix(body, []byte("429")) {
			time.Sleep(1 * time.Second)
			return Do[T](apiReq)
		}
		return nil, &ParseError{err, body}
	}
	return &result, nil
}

type PageCountError struct {
	err error
}

func (pageCountErr PageCountError) Error() string {
	return fmt.Sprintf("failed to get page count: %v", pageCountErr.err)
}

func getPageCount(apiReq *APIRequest) (int, error) {
	params := make(map[string]string)
	params["page[size]"] = apiReq.pageSize

	var headers *http.Header
	apiReqCopy := *apiReq
	newReq := &apiReqCopy
	newReq = newReq.
		WithMethod("HEAD").
		WithParams(params).
		OutputHeadersIn(&headers)
	_, err := Do[any](newReq)

	var parseError *ParseError
	// we don't care about JSON parsing errors, since
	// since HEAD requests aren't supposed to have content
	if err != nil && !errors.As(err, &parseError) {
		return 0, PageCountError{err}
	}
	if headers == nil {
		return 0, PageCountError{errors.New("response did not contain any headers")}
	}
	total, err := strconv.Atoi(headers.Get("X-Total"))
	if err != nil {
		return 0, PageCountError{err}
	}
	perPage, err := strconv.Atoi(headers.Get("X-Per-Page"))
	if err != nil {
		return 0, PageCountError{err}
	}
	return 1 + (total-1)/perPage, nil
}

func DoPaginated[T []E, E any](apiReq *APIRequest) (chan func() (*E, error), error) {
	resps := make(chan func() (*E, error))
	pageCount, err := getPageCount(apiReq)
	if err != nil {
		return resps, err
	}

	fmt.Printf("fetching %d pages in %s...\n",
		pageCount-apiReq.startingPage+1, apiReq.endpoint)

	var weights *semaphore.Weighted
	if apiReq.maxConcurrentFetches != 0 {
		weights = semaphore.NewWeighted(apiReq.maxConcurrentFetches)
	}
	go func() {
		var wg sync.WaitGroup
		for i := apiReq.startingPage; i <= pageCount; i++ {
			if weights != nil {
				err = weights.Acquire(context.Background(), 1)
				if err != nil {
					resps <- func() (*E, error) { return nil, err }
					return
				}
			}
			wg.Add(1)
			go func(i int) {
				newReq := *apiReq
				newReq.params = maps.Clone(newReq.params)
				newReq.params["page[number]"] = strconv.Itoa(i)
				if apiReq.pageSize != "" {
					newReq.params["page[size]"] = apiReq.pageSize
				}

				elems, err := Do[T](&newReq)
				if err != nil {
					resps <- func() (*E, error) { return nil, err }
				} else {
					for _, elem := range *elems {
						func(elem E) {
							value := reflect.ValueOf(&elem).Elem()
							if value.Kind() == reflect.Struct {
								field := value.FieldByName("Page")
								if field.IsValid() &&
									field.CanSet() &&
									field.Kind() == reflect.Int {
									field.Set(reflect.ValueOf(i))
								}
							}
							resps <- func() (*E, error) { return &elem, nil }
						}(elem)
					}
				}
				if weights != nil {
					weights.Release(1)
				}
				wg.Done()
			}(i)
		}

		wg.Wait()
		// To indicate every page has been fetched
		resps <- func() (*E, error) { return nil, nil }
	}()

	return resps, nil
}
