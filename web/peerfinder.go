package web

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/demostanis/42evaluators/internal/database"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

const (
	usersPerQuery = 10000
)

func isValidProject(project models.Project) bool {
	// we need this bunch of conditions since GORM will give us
	// zeroed projects which don't meet the preload condition...
	return len(project.Teams) > 0 &&
		len(project.Teams) > project.ActiveTeam &&
		len(project.Teams[project.ActiveTeam].Users) > 0 &&
		project.Teams[project.ActiveTeam].Users[0].User.ID != 0
}

func handlePeerFinder(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var subjects []models.Subject

		err := db.
			Model(&models.Subject{}).
			Order("position, name").
			Where(database.UnwantedSubjectsCondition).
			Find(&subjects).Error
		if err != nil {
			internalServerError(w, err)
			return
		}

		campuses, err := getAllCampuses(db)
		if err != nil {
			internalServerError(w, err)
			return
		}

		var campusID int
		campusIDRaw := r.URL.Query().Get("campus")
		if campusIDRaw == "any" {
			campusID = -1
		} else {
			campusID, err = strconv.Atoi(campusIDRaw)
			if err != nil {
				campusID = getLoggedInUser(r).them.CampusID
			}
		}

		status := r.URL.Query().Get("status")
		if status == "" {
			status = "active"
		}
		isValidStatus := false
		for _, possibleStatus := range []string{
			"active", "finished", "waiting_for_correction",
			"creating_group", "in_progress",
		} {
			if status == possibleStatus {
				isValidStatus = true
			}
		}
		if !isValidStatus {
			status = "active"
		}

		var wantedSubjects []string
		wantedSubjectsRaw := r.URL.Query().Get("subjects")
		if wantedSubjectsRaw != "" {
			wantedSubjects = strings.Split(wantedSubjectsRaw, ",")
		} else {
			for _, subject := range subjects {
				wantedSubjects = append(wantedSubjects, subject.Name)
			}
		}

		checkedSubjects := make(map[string]bool)
		for _, subject := range wantedSubjects {
			checkedSubjects[subject] = true
		}

		withStatus := func(search string) func(db *gorm.DB) *gorm.DB {
			return func(db *gorm.DB) *gorm.DB {
				if status == "active" {
					return db.
						Where("status != 'finished'")
				}
				return db.
					Where("status = ?", status)
			}
		}

		projectsMap := make(map[int][]models.Project)

		preloadCondition := ""
		if campusID != -1 {
			preloadCondition += fmt.Sprintf("campus_id = %d AND ", campusID)
		}
		preloadCondition += database.OnlyRealUsersCondition

		var projects []models.Project
		db.
			Preload("Teams.Users.User",
				preloadCondition).
			Preload("Subject", "name IN ? AND "+database.UnwantedSubjectsCondition,
				wantedSubjects).
			Scopes(withStatus(status)).
			Model(&models.Project{}).
			// We need to fetch by batches of users, else GORM
			// generates way too large queries...
			FindInBatches(&projects, usersPerQuery,
				func(db *gorm.DB, batch int) error {
					for _, project := range projects {
						if isValidProject(project) {
							projectsMap[project.Subject.ID] = append(
								projectsMap[project.Subject.ID], project)
						}
					}
					return nil
				})

		_ = templates.PeerFinder(
			subjects, projectsMap, checkedSubjects,
			status, campuses, campusID,
		).Render(r.Context(), w)
	})
}
