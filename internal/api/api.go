package api

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"maps"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/demostanis/42evaluators/internal/models"
	"golang.org/x/sync/semaphore"
)

const ApiUrl = "https://api.intra.42.fr"

type ApiRequest struct {
	method               string
	endpoint             string
	headers              map[string]string
	params               map[string]string
	outputHeadersIn      **http.Header
	authenticated        bool
	authenticatedAs      string
	maxConcurrentFetches int64
	pageSize             string
}

func NewRequest(endpoint string) *ApiRequest {
	return &ApiRequest{
		"GET",
		endpoint,
		map[string]string{},
		map[string]string{},
		nil,
		false,
		"",
		0,
		"",
	}
}

func (apiReq *ApiRequest) Authenticated() *ApiRequest {
	apiReq.authenticated = true
	return apiReq
}

func (apiReq *ApiRequest) AuthenticatedAs(accessToken string) *ApiRequest {
	apiReq.authenticatedAs = accessToken
	return apiReq
}

func (apiReq *ApiRequest) WithMethod(method string) *ApiRequest {
	apiReq.method = method
	return apiReq
}

func (apiReq *ApiRequest) WithHeaders(headers map[string]string) *ApiRequest {
	maps.Copy(apiReq.headers, headers)
	return apiReq
}

func (apiReq *ApiRequest) WithParams(params map[string]string) *ApiRequest {
	maps.Copy(apiReq.params, params)
	return apiReq
}

func (apiReq *ApiRequest) WithMaxConcurrentFetches(n int64) *ApiRequest {
	apiReq.maxConcurrentFetches = n
	return apiReq
}

func (apiReq *ApiRequest) WithPageSize(n int) *ApiRequest {
	apiReq.pageSize = strconv.Itoa(n)
	return apiReq
}

func (apiReq *ApiRequest) OutputHeadersIn(output **http.Header) *ApiRequest {
	apiReq.outputHeadersIn = output
	return apiReq
}

func Do[T any](apiReq *ApiRequest) (*T, error) {
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
		client = RateLimitedClient("", models.ApiKey{})
	}

	req, err := http.NewRequest(apiReq.method, ApiUrl+apiReq.endpoint, nil)
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
	}
	if apiReq.authenticatedAs != "" {
		req.Header.Add("Authorization", "Bearer "+apiReq.authenticatedAs)
	}

	DebugRequest(req)
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	DebugResponse(req, resp)

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
		if strings.HasPrefix(string(body), "429") {
			time.Sleep(1 * time.Second)
			return Do[T](apiReq)
		}
		return nil, fmt.Errorf("failed to parse body: %w (%s)", err, string(body))
	}
	return &result, nil
}

func getPageCount(apiReq *ApiRequest) (int, error) {
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

	var syntaxErrorCheck *json.SyntaxError
	// we don't care about JSON parsing errors, since
	// since HEAD requests aren't supposed to have content
	if err != nil && !errors.As(err, &syntaxErrorCheck) {
		return 0, err
	}
	if headers == nil {
		return 0, errors.New("response did not contain any headers")
	}
	total, err := strconv.Atoi(headers.Get("X-Total"))
	if err != nil {
		return 0, err
	}
	perPage, err := strconv.Atoi(headers.Get("X-Per-Page"))
	if err != nil {
		return 0, err
	}
	return 1 + (total-1)/perPage, nil
}

func DoPaginated[T []E, E any](apiReq *ApiRequest) (chan func() (*E, error), error) {
	resps := make(chan func() (*E, error))
	pageCount, err := getPageCount(apiReq)
	if err != nil {
		return resps, err
	}

	fmt.Printf("fetching %d pages in %s...\n", pageCount, apiReq.endpoint)

	var weights *semaphore.Weighted
	if apiReq.maxConcurrentFetches != 0 {
		weights = semaphore.NewWeighted(apiReq.maxConcurrentFetches)
	}
	go func() {
		var wg sync.WaitGroup
		for i := 1; i <= pageCount; i++ {
			if weights != nil {
				weights.Acquire(context.Background(), 1)
			}
			wg.Add(1)
			go func(i int) {
				newReq := *apiReq
				newReq.params = maps.Clone(newReq.params)
				newReq.params["page[number]"] = strconv.Itoa(i)
				newReq.params["page[size]"] = apiReq.pageSize

				elems, err := Do[T](&newReq)
				if err != nil {
					resps <- func() (*E, error) { return nil, err }
				} else {
					for _, elem := range *elems {
						func(elem E) {
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
