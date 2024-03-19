package web

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

var mu sync.Mutex

type LoggedInUser struct {
	accessToken string
	them        *templates.Me
}

var loggedInUsers []LoggedInUser

func getLoggedInUser(r *http.Request) *LoggedInUser {
	token, err := r.Cookie("token")
	if err != nil {
		return nil
	}

	for _, user := range loggedInUsers {
		if user.accessToken == token.Value {
			return &user
		}
	}
	return nil
}

func handleIndex(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := api.OauthApiKey()
		if apiKey == nil {
			w.WriteHeader(http.StatusPreconditionRequired)
			w.Write([]byte("The server is currently restarting, please wait a few seconds. If this issue persists, please report to @cgodard on Slack."))
			return
		}

		code := r.URL.Query().Get("code")
		if code != "" {
			accessToken, err := api.OauthToken(*apiKey, code)
			if err != nil {
				fmt.Println(err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			them, err := api.Do[templates.Me](api.NewRequest("/v2/me").
				AuthenticatedAs(accessToken))

			if err == nil {
				w.Header().Add("Set-Cookie", "token="+accessToken+"; HttpOnly")
				mu.Lock()
				loggedInUsers = append(loggedInUsers, LoggedInUser{
					accessToken,
					them,
				})
				mu.Unlock()
			}
			templates.
				LoggedInIndex(them, err).
				Render(r.Context(), w)
		} else {
			user := getLoggedInUser(r)
			if user != nil {
				templates.
					LoggedInIndex(user.them, nil).
					Render(r.Context(), w)
			} else {
				needsLogin := r.URL.Query().Get("needslogin") != ""
				templates.
					LoggedOutIndex(apiKey.UID, apiKey.RedirectUri, needsLogin).
					Render(r.Context(), w)
			}
		}
	})
}
