package projects

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

var cursus21Begin = "2019-07-29T08:45:17.896Z"

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
	projects, err := api.DoPaginated[[]models.Project](
		api.NewRequest("/v2/projects_users").
			WithParams(map[string]string{
				"range[created_at]": cursus21Begin + "," + time.Now().Format(time.RFC3339),
			}).
			Authenticated())
	if err != nil {
		errstream <- err
	}

	start := time.Now()

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
			var team models.Team
			err = db.
				Session(&gorm.Session{}).
				Where("id = ?", project.Teams[0].ID).
				Model(&models.Team{}).
				First(&team).Error

			if !errors.Is(err, gorm.ErrRecordNotFound) {
				prepareProjectForDb(db, project)
				err = db.Save(&project).Error
				if err != nil {
					errstream <- err
				}
			}
		}
	}

	fmt.Printf("took %.2f minutes to fetch all projects\n",
		time.Since(start).Minutes())
}
