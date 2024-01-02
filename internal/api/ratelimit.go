package api

import (
	"time"
	"net/http"
	"golang.org/x/time/rate"
	"strconv"
	"context"
	"os"
)

type RLHTTPClient struct {
	client *http.Client
	rateLimiter *rate.Limiter
}

func RateLimitedClient() *RLHTTPClient {
	requestsPerSecond, err := strconv.Atoi(os.Getenv("REQUESTS_PER_SECOND"))
	if err != nil {
		requestsPerSecond = 2
	}

	return &RLHTTPClient{
		client: http.DefaultClient,
		rateLimiter: rate.NewLimiter(
			rate.Every(1 * time.Second), requestsPerSecond),
	}
}

func (c *RLHTTPClient) Do(req *http.Request) (*http.Response, error) {
	err := c.rateLimiter.Wait(context.Background())
	if err != nil {
		return nil, err
	}
	return c.client.Do(req)
}
