package api

import (
	"encoding/json"
	"errors"
	"io"
	"maps"
	"net/http"
)

const ApiUrl = "https://api.intra.42.fr"

var clients []*RLHTTPClient

type ApiRequest struct {
	method          string
	endpoint        string
	headers         map[string]string
	params          map[string]string
	outputHeadersIn **http.Header
	authenticated   bool
}

func NewRequest(endpoint string) *ApiRequest {
	return &ApiRequest{
		"GET",
		endpoint,
		map[string]string{},
		map[string]string{},
		nil,
		false,
	}
}

func (apiReq *ApiRequest) Authenticated() *ApiRequest {
	apiReq.authenticated = true
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
		client = findNonRateLimitedClient()
	} else {
		client = RateLimitedClient("")
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
		return nil, err
	}
	return &result, nil
}
