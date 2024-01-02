package web

import (
	"fmt"
	"net/http"

	"github.com/demostanis/42evaluators/internal/database"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

func handleCalculator(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var subjects []models.Subject
		err := db.
			Model(&models.Subject{}).
			Where(database.UnwantedSubjectsCondition).
			Where("xp > 0").
			Order("position").
			Find(&subjects).Error
		if err != nil {
			internalServerError(w, fmt.Errorf("failed to get subjects: %w", err))
			return
		}

		user := getLoggedInUser(r)

		var level float64
		err = db.
			Model(&models.User{}).
			Select("level").
			Where("id = ?", user.them.ID).
			Find(&level).Error
		if err != nil {
			internalServerError(w, fmt.Errorf("failed to get user level: %w", err))
			return
		}

		// TODO: once we find a more optimized way of
		// fetching the logged-in user's active projects,
		// we should display them above others in the
		// project select

		_ = templates.Calculator(subjects, level).
			Render(r.Context(), w)
	})
}
