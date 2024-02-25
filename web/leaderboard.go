package web

import (
	"net/http"
	"strconv"

	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

func WithCampus(campusId string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if campusId != "" {
			return db.Where("campus_id = ?", campusId)
		}
		return db
	}
}

func handleLeaderboard(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		page, err := strconv.Atoi(r.URL.Query().Get("page"))
		if err != nil || page <= 0 {
			page = 1
		}

		// TODO: check sorting
		sorting := r.URL.Query().Get("sort")
		if sorting == "" {
			sorting = "level"
		}

		campus := r.URL.Query().Get("campus")

		var totalPages int64
		db.
			Model(&models.User{}).
			Where("is_staff = false AND is_test = false").
			Scopes(WithCampus(campus)).
			Count(&totalPages)

		if page > int(totalPages) {
			page = int(totalPages)
		}

		var users []models.User
		offset := (page - 1) * UsersPerPage
		db.
			Preload("Coalition").
			Preload("Title").
			Preload("Campus").
			Offset(offset).
			Limit(UsersPerPage).
			Order(sorting + " DESC").
			Where("is_staff = false AND is_test = false").
			Scopes(WithCampus(campus)).
			Find(&users)

		leaderboard(users, r.URL,
			page, totalPages/UsersPerPage,
			offset).Render(r.Context(), w)
	})
}
