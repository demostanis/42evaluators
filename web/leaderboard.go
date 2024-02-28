package web

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

const (
	PromoFormat = "01/2006"
)

// TODO: refactor in another file
func WithCampus(campusId string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if campusId != "" {
			return db.Where("campus_id = ?", campusId)
		}
		return db
	}
}

func WithPromo(promo string) func(db *gorm.DB) *gorm.DB {
	promoBeginAt, err := time.Parse(PromoFormat, promo)

	return func(db *gorm.DB) *gorm.DB {
		if err != nil {
			return db
		}
		return db.Where("begin_at LIKE ?", fmt.Sprintf("%d-%02d-%%",
			promoBeginAt.Year(), promoBeginAt.Month()))
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
		promo := r.URL.Query().Get("promo")

		var totalPages int64
		db.
			Model(&models.User{}).
			Where("is_staff = false AND is_test = false").
			Scopes(WithCampus(campus)).
			Scopes(WithPromo(promo)).
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
			Scopes(WithPromo(promo)).
			Find(&users)

		templates.Leaderboard(users, r.URL,
			page, totalPages/UsersPerPage,
			offset).Render(r.Context(), w)
	})
}
