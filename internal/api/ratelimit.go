package api

import (
	"context"
	"golang.org/x/time/rate"
	"net/http"
	"time"
)

const (
	RequestsPerSecond = 2
	SleepBetweenTries = 100
)

type RLHTTPClient struct {
	client        *http.Client
	rateLimiter   *rate.Limiter
	isRateLimited bool
	accessToken   string
}

func RateLimitedClient(accessToken string) *RLHTTPClient {
	return &RLHTTPClient{
		client: http.DefaultClient,
		rateLimiter: rate.NewLimiter(
			rate.Every(1*time.Second), RequestsPerSecond),
		isRateLimited: false,
		accessToken:   accessToken,
	}
}

func (c *RLHTTPClient) Do(req *http.Request) (*http.Response, error) {
	c.isRateLimited = true
	err := c.rateLimiter.Wait(context.Background())
	if err != nil {
		return nil, err
	}

	resp, err := c.client.Do(req)
	c.isRateLimited = false
	return resp, err
}

func findNonRateLimitedClient() *RLHTTPClient {
	for _, potentialClient := range clients {
		if !potentialClient.isRateLimited {
			return potentialClient
		}
	}

	time.Sleep(SleepBetweenTries)
	return findNonRateLimitedClient()
}
