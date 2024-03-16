package api

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/demostanis/42evaluators/internal/models"
	"golang.org/x/time/rate"
)

const (
	RequestsPerSecond = 2
	RequestsPerHour   = 1200
	SleepBetweenTries = 100 * time.Millisecond
)

var mu sync.Mutex

type RLHTTPClient struct {
	sync.Mutex
	client              *http.Client
	secondlyRateLimiter *rate.Limiter
	hourlyRateLimiter   *rate.Limiter
	isRateLimited       bool
	accessToken         string
	apiKey              models.ApiKey
}

func (c *RLHTTPClient) setIsRateLimited(isRateLimited bool) {
	c.Lock()
	c.isRateLimited = isRateLimited
	c.Unlock()
}

func (c *RLHTTPClient) getIsRateLimited() bool {
	c.Lock()
	defer c.Unlock()
	return c.isRateLimited
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
	c.setIsRateLimited(false)
	return resp, err
}

func findNonRateLimitedClient() *RLHTTPClient {
	mu.Lock()
	for _, potentialClient := range clients {
		if !potentialClient.getIsRateLimited() {
			potentialClient.setIsRateLimited(true)
			mu.Unlock()
			return potentialClient
		}
	}
	mu.Unlock()

	fmt.Fprintln(os.Stderr, "all clients rate limited, waiting to find a new one...")
	time.Sleep(SleepBetweenTries)
	return findNonRateLimitedClient()
}

func OauthApiKey() *models.ApiKey {
	if len(clients) < 1 {
		return nil
	}
	return &clients[0].apiKey
}
