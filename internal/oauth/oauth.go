package oauth

import (
	"github.com/demostanis/42evaluators2.0/internal/secrets"
	"github.com/demostanis/42evaluators2.0/internal/api"
)

type OauthTokenResponse struct {
	AccessToken string `json:"access_token"`
}

func OauthToken(secrets secrets.Secrets) (string, error) {
	params := make(map[string]string)
	params["grant_type"] = "client_credentials"
	params["client_id"] = secrets.Uid
	params["client_secret"] = secrets.Secret

	resp, err := api.ApiRequest[OauthTokenResponse]("POST", "/oauth/token", &params, nil)
	if err != nil {
		return "", err
	}

	return resp.AccessToken, nil
}
