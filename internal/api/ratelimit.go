package api

import (
	"context"
	"net/http"
	"sync"
	"time"

	"github.com/demostanis/42evaluators/internal/models"
	"golang.org/x/time/rate"
)

const (
	RequestsPerSecond = 2
	RequestsPerHour   = 1200
	SleepBetweenTries = 100
)

var mu sync.Mutex

type RLHTTPClient struct {
	client              *http.Client
	secondlyRateLimiter *rate.Limiter
	hourlyRateLimiter   *rate.Limiter
	isRateLimited       bool
	accessToken         string
	apiKey              models.ApiKey
}

func RateLimitedClient(accessToken string, apiKey models.ApiKey) *RLHTTPClient {
	return &RLHTTPClient{
		client: http.DefaultClient,
		secondlyRateLimiter: rate.NewLimiter(
			rate.Every(1*time.Second), RequestsPerSecond),
		hourlyRateLimiter: rate.NewLimiter(
			rate.Every(1*time.Hour), RequestsPerHour),
		isRateLimited: false,
		accessToken:   accessToken,
		apiKey:        apiKey,
	}
}

func (c *RLHTTPClient) Do(req *http.Request) (*http.Response, error) {
	err := c.secondlyRateLimiter.Wait(context.Background())
	if err != nil {
		return nil, err
	}
	err = c.hourlyRateLimiter.Wait(context.Background())
	if err != nil {
		return nil, err
	}

	resp, err := c.client.Do(req)
	c.isRateLimited = false
	return resp, err
}

func findNonRateLimitedClient() *RLHTTPClient {
	mu.Lock()
	for _, potentialClient := range clients {
		if !potentialClient.isRateLimited {
			potentialClient.isRateLimited = true
			mu.Unlock()
			return potentialClient
		}
	}
	mu.Unlock()

	time.Sleep(SleepBetweenTries)
	return findNonRateLimitedClient()
}

func OauthApiKey() *models.ApiKey {
	if len(clients) < 1 {
		return nil
	}
	return &clients[0].apiKey
}
