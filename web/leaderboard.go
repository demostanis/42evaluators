package web

import (
	"fmt"
	"net/http"
	"slices"
	"strconv"
	"strings"
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
		if err == nil {
			promoStr := fmt.Sprintf("%d-%02d-%%",
				promoBeginAt.Year(), promoBeginAt.Month())

			var count int64
			err = db.
				Model(&models.User{}).
				Where("begin_at LIKE ?", promoStr).
				Session(&gorm.Session{}).
				Count(&count).
				Error
			if err == nil && count > 0 {
				return db.Where("begin_at LIKE ?", promoStr)
			}
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
		err = db.
			Preload("Coalition").
			Preload("Title").
			Preload("Campus").
			Offset(offset).
			Limit(UsersPerPage).
			Order(sorting + " DESC").
			Where("is_staff = false AND is_test = false").
			Scopes(WithCampus(campus)).
			Scopes(WithPromo(promo)).
			Find(&users).Error

		var campuses []models.Campus
		db.Find(&campuses)

		var campusUsers []models.User
		db.
			Scopes(WithCampus(campus)).
			Where("is_staff = false AND is_test = false").
			Find(&campusUsers)

		promos := make([]templates.Promo, 0)
		for _, user := range campusUsers {
			userPromo := fmt.Sprintf("%02d/%d",
				user.BeginAt.Month(),
				user.BeginAt.Year())
			shouldAdd := true
			for _, alreadyAddedPromo := range promos {
				if userPromo == alreadyAddedPromo.Name {
					shouldAdd = false
					break
				}
			}
			if shouldAdd {
				promos = append(promos, templates.Promo{
					Name:   userPromo,
					Active: promo == userPromo,
				})
			}
		}
		slices.SortFunc(promos, func(a, b templates.Promo) int {
			parseDate := func(promo templates.Promo) (int, int) {
				parts := strings.Split(promo.Name, "/")
				month, _ := strconv.Atoi(parts[0])
				year, _ := strconv.Atoi(parts[1])
				return month, year
			}
			monthA, yearA := parseDate(a)
			monthB, yearB := parseDate(b)

			return (monthA | yearA<<5) - (monthB | yearB<<5)
		})

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			activeCampusId, _ := strconv.Atoi(campus)
			templates.Leaderboard(users,
				promos, campuses, activeCampusId,
				r.URL, page, totalPages/UsersPerPage,
				offset).Render(r.Context(), w)
		}
	})
}
