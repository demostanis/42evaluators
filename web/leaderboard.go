package web

import (
	"net/http"
	"strconv"

	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

func handleLeaderboard(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		page, err := strconv.Atoi(r.URL.Query().Get("page"))
		if err != nil || page <= 0 {
			page = 1
		}

		var totalPages int64
		db.
			Model(&models.User{}).
			Where("is_staff = false AND is_test = false").
			Count(&totalPages)

		if page > int(totalPages) {
			page = int(totalPages)
		}

		var users []models.User
		offset := (page - 1) * UsersPerPage
		db.
			Preload("Coalition").
			Preload("Title").
			Offset(offset).
			Limit(UsersPerPage).
			Order("correction_points DESC").
			Where("is_staff = false AND is_test = false").
			Find(&users)

		leaderboard(users,
			page, totalPages/UsersPerPage,
			offset).Render(r.Context(), w)
	})
}
