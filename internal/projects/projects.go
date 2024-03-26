package projects

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/internal/users"
	"gorm.io/gorm"
)

var cursus21Begin = "2019-07-29T08:45:17.896Z"

func getLatestPageFetched(db *gorm.DB) int {
	var latestPageFetched int

	db.
		Raw(`SELECT IFNULL(MAX(page), 1)
			FROM projects
			WHERE page + 1
			NOT IN (
				SELECT page
				FROM projects
			)`).
		Scan(&latestPageFetched)
	return latestPageFetched
}

func prepareProjectForDb(db *gorm.DB, project *models.Project) {
	project.SubjectID = project.Subject.ID
	for i := range project.Teams {
		team := &project.Teams[i]
		team.ProjectID = i

		for j := range team.Users {
			user := &team.Users[j]
			user.TeamID = team.ID
		}
	}
}

func GetProjects(ctx context.Context, db *gorm.DB, errstream chan error) {
	users.WaitForUsers()

	page := getLatestPageFetched(db)
	projects, err := api.DoPaginated[[]models.Project](
		api.NewRequest("/v2/projects_users").
			WithParams(map[string]string{
				"range[created_at]": cursus21Begin + "," + time.Now().Format(time.RFC3339),
			}).
			FromPage(page).
			Authenticated())
	if err != nil {
		errstream <- err
	}

	start := time.Now()

	projectsFetched := 1
	for {
		project, err := (<-projects)()
		if err != nil {
			errstream <- err
		}
		if project == nil {
			break
		}

		if len(project.CursusIds) > 0 && project.CursusIds[0] == 21 &&
			len(project.Teams) > 0 && len(project.Teams[0].Users) > 0 {
			// TODO: might not take the right team
			var exists models.Team
			err = db.
				Session(&gorm.Session{}).
				Where("id = ?", project.Teams[0].ID).
				Model(&models.Team{}).
				First(&exists).Error

			if errors.Is(err, gorm.ErrRecordNotFound) {
				project.Page = page
				prepareProjectForDb(db, project)
				err = db.Save(&project).Error
				if err != nil {
					errstream <- err
				}
			}
		}

		projectsFetched++
		if projectsFetched == 100 {
			projectsFetched = 1
			page++
		}
	}

	fmt.Printf("took %.2f minutes to fetch all projects\n",
		time.Since(start).Minutes())
}
