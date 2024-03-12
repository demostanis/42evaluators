package web

import (
	"fmt"
	"net/http"
	"slices"
	"strconv"
	"strings"

	"github.com/demostanis/42evaluators/internal/database"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

var (
	SortableFields = []templates.Field{
		{"level", "Level", false},
		{"weekly_logtime", "Weekly logtime", false},
		{"correction_points", "Correction points", false},
		{"campus", "Campus", false},
		{"coalition", "Coalition", false},
	}
)

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
		shownFieldsRawRaw := r.URL.Query().Get("fields")
		shownFieldsRaw := strings.Split(shownFieldsRawRaw, ",")
		if shownFieldsRawRaw == "" {
			shownFieldsRaw = []string{"level", "campus"}
		}
		shownFields := make(map[string]templates.Field, 0)
		for _, field := range SortableFields {
			found := false
			for _, allowedField := range shownFieldsRaw {
				if field.Name == allowedField {
					found = true
				}
			}
			shownFields[field.Name] = templates.Field{
				Name:       field.Name,
				PrettyName: field.PrettyName,
				Checked:    found,
			}
		}

		var totalPages int64
		db.
			Model(&models.User{}).
			Scopes(database.OnlyRealUsers()).
			Scopes(database.WithCampus(campus)).
			Scopes(database.WithPromo(promo)).
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
			Scopes(database.OnlyRealUsers()).
			Scopes(database.WithCampus(campus)).
			Scopes(database.WithPromo(promo)).
			Find(&users).Error

		var campuses []models.Campus
		db.Find(&campuses)

		var campusUsers []models.User
		db.
			Scopes(database.WithCampus(campus)).
			Scopes(database.OnlyRealUsers()).
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
				shownFields, offset).Render(r.Context(), w)
		}
	})
}
