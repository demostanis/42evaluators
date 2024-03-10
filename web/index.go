package web

import (
	"net/http"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

func handleIndex(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := api.OauthApiKey()

		templates.
			Index(apiKey.UID, apiKey.RedirectUri).
			Render(r.Context(), w)
	})
}
