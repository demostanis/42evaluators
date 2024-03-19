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
	SleepBetweenTries = 100 * time.Millisecond
)

var id = 0

func newTarget(urls []string, percent float32) Target {
	id++
	return Target{
		urls,
		percent,
		id,
	}
}

var (
	oauthTarget = newTarget(
		[]string{
			"/oauth/client",
		},
		1./30.,
	)
	targets = []Target{
		oauthTarget,
		newTarget(
			[]string{
				"/v2/campus",
				"/v2/cursus_users",
				"/v2/groups_users",
				"/v2/coalitions_users",
				"/v2/coalitions",
				"/v2/titles_users",
				"/v2/titles",
			},
			3./5.,
		),
		newTarget(
			[]string{
				"/v2/locations",
			},
			1./3.,
		),
	}
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

func findNonRateLimitedClientFor(target Target) *RLHTTPClient {
	mu.Lock()
	for _, potentialClient := range clients[target.ID] {
		if !potentialClient.getIsRateLimited() {
			potentialClient.setIsRateLimited(true)
			mu.Unlock()
			return potentialClient
		}
	}
	mu.Unlock()

	time.Sleep(SleepBetweenTries)
	return findNonRateLimitedClientFor(target)
}

func OauthApiKey() *models.ApiKey {
	return &clients[oauthTarget.ID][0].apiKey
}
