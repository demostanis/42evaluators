package web

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type Blackhole struct {
	Login string    `json:"login"`
	Date  time.Time `json:"date"`
	Image string    `json:"image"`
}

func blackholeMap(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		result := make([]Blackhole, 0)

		// TODO: only query the database every few minutes
		// and cache the result
		var users []models.User
		db.
			Where("is_staff = false AND is_test = false").
			Scopes(WithCampus("62")).
			Find(&users)

		for _, user := range users {
			if !user.BlackholedAt.IsZero() {
				result = append(result, Blackhole{
					user.Login,
					user.BlackholedAt,
					user.ImageLinkSmall,
				})
			}
		}

		json.NewEncoder(w).Encode(result)
	})
}
