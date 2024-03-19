package api

import (
	"errors"

	"github.com/demostanis/42evaluators/internal/models"
)

type Target struct {
	URLs    []string
	Percent float32
	ID      int
}

var clients map[int][]*RLHTTPClient

type OauthTokenResponse struct {
	AccessToken string `json:"access_token"`
}

func OauthToken(apiKey models.ApiKey, code string) (string, error) {
	params := make(map[string]string)
	params["grant_type"] = "client_credentials"
	params["client_id"] = apiKey.UID
	params["client_secret"] = apiKey.Secret
	if code != "" {
		params["code"] = code
		params["redirect_uri"] = apiKey.RedirectUri
		params["grant_type"] = "authorization_code"
	}

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
	clients = make(map[int][]*RLHTTPClient)

	for _, apiKey := range apiKeys {
		accessToken, err := OauthToken(apiKey, "")
		if err != nil {
			continue
		}
		var targetInNeed int
		for _, target := range targets {
			if len(clients[target.ID]) < max(1, int(float32(len(apiKeys))*target.Percent)) {
				targetInNeed = target.ID
				break
			}
		}
		clients[targetInNeed] = append(clients[targetInNeed],
			RateLimitedClient(accessToken, apiKey))
	}
	return nil
}
