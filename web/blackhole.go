package web

import (
	"encoding/json"
	"net/http"
	"slices"
	"strconv"
	"time"

	"github.com/demostanis/42evaluators/internal/database"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

type Blackhole struct {
	Login string    `json:"login"`
	Date  time.Time `json:"date"`
	Image string    `json:"image"`
}

func handleBlackhole(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		currentCampusID := getLoggedInUser(r).them.CampusID
		currentCampusIDRaw := r.URL.Query().Get("campus")
		if currentCampusIDRaw != "" {
			currentCampusID, _ = strconv.Atoi(currentCampusIDRaw)
		}

		var campuses []models.Campus
		err := db.
			Model(&models.Campus{}).
			Find(&campuses).Error
		if err != nil {
			internalServerError(w, err)
			return
		}

		_ = templates.Blackhole(
			campuses,
			currentCampusID,
		).Render(r.Context(), w)
	})
}

func blackholeMap(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		result := make([]Blackhole, 0)

		campusID := r.URL.Query().Get("campus")
		if campusID == "" {
			campusID = strconv.Itoa(getLoggedInUser(r).them.CampusID)
		}
		var users []models.User
		err := db.
			Scopes(database.OnlyRealUsers()).
			Scopes(database.WithCampus(campusID)).
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

		_ = json.NewEncoder(w).Encode(result)
	})
}
