package api

import (
	"errors"
	"fmt"

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

func OauthToken(apiKey models.APIKey, code string, next string) (string, error) {
	params := make(map[string]string)
	params["grant_type"] = "client_credentials"
	params["client_id"] = apiKey.UID
	params["client_secret"] = apiKey.Secret
	if code != "" {
		params["code"] = code
		params["redirect_uri"] = fmt.Sprintf(
			"%s?next=%s",
			apiKey.RedirectURI,
			next,
		)
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
		return "", errors.New("no access token in response")
	}

	return resp.AccessToken, nil
}

func InitClients(apiKeys []models.APIKey) error {
	clients = make(map[int][]*RLHTTPClient)

	var total float32
	for _, target := range targets {
		total += target.Percent
	}
	if total > 1 {
		return errors.New("total percentage of targets is bigger than 1")
	}

	for _, apiKey := range apiKeys {
		accessToken, err := OauthToken(apiKey, "", "")
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
