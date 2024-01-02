package campus

import (
	"fmt"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

var (
	waitForCampuses       = make(chan bool)
	waitForCampusesClosed = false
)

func WaitForCampuses() {
	if !waitForCampusesClosed {
		<-waitForCampuses
	}
}

func GetCampuses(db *gorm.DB, errstream chan error) {
	campuses, err := api.DoPaginated[[]models.Campus](
		api.NewRequest("/v2/campus").
			Authenticated())
	if err != nil {
		errstream <- err
		return
	}

	for {
		campus, err := (<-campuses)()
		if err != nil {
			errstream <- fmt.Errorf("error while fetching campuses: %w", err)
			continue
		}
		if campus == nil {
			break
		}
		err = db.Save(&campus).Error
		if err != nil {
			errstream <- err
		}
	}
	if !waitForCampusesClosed {
		close(waitForCampuses)
		waitForCampusesClosed = true
	}
}
