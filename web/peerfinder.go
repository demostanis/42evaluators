package web

import (
	"net/http"
	"strings"

	"github.com/demostanis/42evaluators/internal/database"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

const (
	usersPerQuery = 10000
)

func handlePeerFinder(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var subjects []models.Subject

		err := db.
			Model(&models.Subject{}).
			Order("position").
			Where(database.UnwantedSubjectsCondition).
			Find(&subjects).Error
		if err != nil {
			internalServerError(w, err)
			return
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

		i := 0
		var totalProjects []models.Project
		for {
			// We need to fetch by batches of users, else GORM
			// generates way too large queries...
			campusId := getLoggedInUser(r).them.CampusID
			var projects []models.Project
			db.
				Where("status != 'finished'").
				Preload("Teams.Users.User",
					"campus_id = ? AND "+database.OnlyRealUsersCondition,
					campusId).
				Preload("Subject", "name IN ? AND "+database.UnwantedSubjectsCondition,
					wantedSubjects).
				Limit(usersPerQuery).
				Offset(usersPerQuery * i).
				Model(&models.Project{}).
				Find(&projects)
			if len(projects) == 0 {
				break
			}
			totalProjects = append(totalProjects, projects...)
			i++
		}

		projectsMap := make(map[int][]models.Project)
		for _, project := range totalProjects {
			// we need this bunch of conditions since GORM will give us
			// zeroed projects which don't meet the preload condition...
			if len(project.Teams) > 0 &&
				len(project.Teams) > project.ActiveTeam &&
				len(project.Teams[project.ActiveTeam].Users) > 0 &&
				project.Teams[project.ActiveTeam].Users[0].User.ID != 0 {
				projectsMap[project.Subject.ID] = append(
					projectsMap[project.Subject.ID], project)
			}
		}

		templates.PeerFinder(subjects, projectsMap, checkedSubjects).
			Render(r.Context(), w)
	})
}
