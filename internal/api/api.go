package api

import (
	"net/http"
	"io/ioutil"
	"encoding/json"
)

const API_URL = "https://api.intra.42.fr"

var client *RLHTTPClient = nil

func ApiRequest[T any](
	method string,
	endpoint string,
	params *map[string]string,
	headers *map[string]string,
) (*T, error) {
	if client == nil {
		client = RateLimitedClient()
	}

	req, err := http.NewRequest(method, API_URL+endpoint, nil)
	if err != nil {
		return nil, err
	}

	if params != nil {
		q := req.URL.Query()
		for key, value := range *params {
			q.Add(key, value)
		}
		req.URL.RawQuery = q.Encode()
	}

	if headers != nil {
		for key, value := range *headers {
			req.Header.Add(key, value)
		}
	}

	debugRequest(req)
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	debugResponse(resp)

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result T
	err = json.Unmarshal([]byte(body), &result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func AuthenticatedRequest[T any](
	method string,
	endpoint string,
	accessToken string,
	params *map[string]string,
) (*T, error) {
	headers := make(map[string]string)
	headers["Authorization"] = "Bearer " + accessToken

	return ApiRequest[T](method, endpoint, params, &headers)
}
