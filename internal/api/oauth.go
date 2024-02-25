package api

import (
	"errors"

	"github.com/demostanis/42evaluators/internal/models"
)

type OauthTokenResponse struct {
	AccessToken string `json:"access_token"`
}

func OauthToken(apiKey models.ApiKey) (string, error) {
	params := make(map[string]string)
	params["grant_type"] = "client_credentials"
	params["client_id"] = apiKey.UID
	params["client_secret"] = apiKey.Secret

	resp, err := Do[OauthTokenResponse](
		NewRequest("/oauth/token").
			WithMethod("POST").
			WithParams(params))
	if err != nil {
		return "", err
	}
	if resp.AccessToken == "" {
		return "", errors.New("No access token in response")
	}

	return resp.AccessToken, nil
}

func InitClients(apiKeys []models.ApiKey) error {
	for _, apiKey := range apiKeys {
		accessToken, err := OauthToken(apiKey)
		if err != nil {
			continue
		}
		clients = append(clients, RateLimitedClient(accessToken))
	}
	return nil
}
