package web

import (
	"encoding/json"
	"net/http"
	"slices"
	"strconv"
	"time"

	"github.com/demostanis/42evaluators/internal/database"
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

		campusId := r.URL.Query().Get("campus")
		if campusId == "" {
			// TODO: what if the user has multiple campuses?
			campusId = strconv.Itoa(getLoggedInUser(r).them.Campus[0].ID)
		}
		var users []models.User
		err := db.
			Scopes(database.OnlyRealUsers()).
			Scopes(database.WithCampus(campusId)).
			Find(&users).Error
		if err != nil {
			internalServerError(w, err)
			return
		}

		for _, user := range users {
			if !user.BlackholedAt.IsZero() {
				if user.ImageLinkSmall == "" {
					user.ImageLinkSmall = models.DefaultImageLink
				}
				result = append(result, Blackhole{
					user.Login,
					user.BlackholedAt,
					user.ImageLinkSmall,
				})
			}
		}

		slices.SortFunc(result, func(a, b Blackhole) int {
			return a.Date.Compare(b.Date)
		})

		json.NewEncoder(w).Encode(result)
	})
}
