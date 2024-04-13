package projects

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"os"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

const cursus21Begin = "2019-07-29T08:45:17.896Z"

type ProjectData struct {
	X         float64 `json:"x"`
	Y         float64 `json:"y"`
	ProjectID int     `json:"project_id"`
}

var allProjectData []ProjectData

func OpenProjectData() error {
	file, err := os.Open("assets/project_data.json")
	if err != nil {
		return err
	}
	bytes, err := io.ReadAll(file)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bytes, &allProjectData)
	if err != nil {
		return err
	}
	return nil
}

func setPositionInGraph(
	db *gorm.DB,
	subject *models.Subject,
) {
	libft := struct {
		X float64
		Y float64
	}{2999., 2999.}

	subject.Position = 99999
	for _, projectData := range allProjectData {
		if projectData.ProjectID == subject.ID {
			subject.Position =
				int(math.Hypot(
					projectData.X-libft.X,
					projectData.Y-libft.Y))
			break
		}
	}
}

func prepareProjectForDb(db *gorm.DB, project *models.Project) {
	project.SubjectID = project.Subject.ID

	for i := range project.Teams {
		team := &project.Teams[i]
		team.ProjectID = i

		if team.ID == project.CurrentTeamID {
			project.ActiveTeam = i

			setPositionInGraph(db, &project.Subject)
		}

		for j := range team.Users {
			user := &team.Users[j]
			user.TeamID = team.ID
		}
	}
}

func GetProjects(ctx context.Context, db *gorm.DB, errstream chan error) {
	// TODO: only fetch what's changed
	updatedAt := cursus21Begin
	projects, err := api.DoPaginated[[]models.Project](
		api.NewRequest("/v2/projects_users").
			WithParams(map[string]string{
				"range[updated_at]": updatedAt + "," + time.Now().Format(time.RFC3339),
				"filter[campus]":    "62",
			}).
			WithMaxConcurrentFetches(100).
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
			prepareProjectForDb(db, project)
			err = db.Save(&project).Error
			if err != nil {
				errstream <- err
			}
		}
	}

	fmt.Printf("took %.2f minutes to fetch all projects\n",
		time.Since(start).Minutes())
}
