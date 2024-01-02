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

var cursus21Begin, _ = time.Parse(time.RFC3339, "2019-07-29T08:45:17.896Z")

const maxConcurrentFetches = 100

type ProjectData struct {
	X          float64 `json:"x"`
	Y          float64 `json:"y"`
	ProjectID  int     `json:"project_id"`
	Difficulty int     `json:"difficulty"`
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
			subject.XP = projectData.Difficulty
			subject.Position =
				int(math.Hypot(
					projectData.X-libft.X,
					projectData.Y-libft.Y))
			break
		}
	}
}

func prepareProjectForDB(db *gorm.DB, project *models.Project) {
	project.SubjectID = project.Subject.ID

	for i := range project.Teams {
		team := &project.Teams[i]
		team.ProjectID = i

		if team.ID == project.CurrentTeamID {
			project.ActiveTeam = i
		}

		for j := range team.Users {
			user := &team.Users[j]
			user.TeamID = team.ID
		}
	}

	setPositionInGraph(db, &project.Subject)
}

func GetProjects(ctx context.Context, db *gorm.DB, errstream chan error) {
	projects, err := api.DoPaginated[[]models.Project](
		api.NewRequest("/v2/projects_users").
			WithMaxConcurrentFetches(maxConcurrentFetches).
			SinceLastFetch(db, cursus21Begin).
			Authenticated())
	if err != nil {
		errstream <- err
	}

	start := time.Now()

	for {
		project, err := (<-projects)()
		if err != nil {
			errstream <- err
			continue
		}
		if project == nil {
			break
		}

		if len(project.CursusIDs) > 0 && project.CursusIDs[0] == 21 &&
			len(project.Teams) > 0 && len(project.Teams[0].Users) > 0 {
			prepareProjectForDB(db, project)
			err = db.
				Session(&gorm.Session{FullSaveAssociations: true}).
				Save(&project).Error
			if err != nil {
				errstream <- err
			}
		}
	}

	fmt.Printf("took %.2f minutes to fetch all projects\n",
		time.Since(start).Minutes())
}
