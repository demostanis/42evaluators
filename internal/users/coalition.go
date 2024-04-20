package users

import (
	"context"
	"errors"
	"fmt"
	"maps"
	"sync"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

var (
	ActiveCoalitions = map[string]string{
		// Filters out old coalitions
		"range[this_year_score]": "1,999999999",
	}
)

type CoalitionID struct {
	ID     int `json:"coalition_id"`
	UserID int `json:"user_id"`
}

func getCoalition(coalitionID int, db *gorm.DB) (*models.Coalition, error) {
	var cachedCoalition models.Coalition
	err := db.
		Session(&gorm.Session{}).
		Model(&models.Coalition{}).
		Where("id = ?", coalitionID).
		First(&cachedCoalition).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		actualCoalition, err := api.Do[models.Coalition](
			api.NewRequest(fmt.Sprintf("/v2/coalitions/%d", coalitionID)).
				Authenticated())
		if err != nil {
			return nil, err
		}

		db.Save(actualCoalition)
		return actualCoalition, nil
	}
	return &cachedCoalition, err
}

func GetCoalitions(
	ctx context.Context,
	db *gorm.DB,
	errstream chan error,
	wg *sync.WaitGroup,
) {
	wg.Add(1)

	coalitions, err := api.DoPaginated[[]CoalitionID](
		api.NewRequest("/v2/coalitions_users").
			Authenticated().
			WithParams(maps.Clone(ActiveCoalitions)))
	if err != nil {
		errstream <- err
		return
	}

	for {
		coalition, err := (<-coalitions)()
		if err != nil {
			errstream <- fmt.Errorf("error while fetching coalitions: %w", err)
			continue
		}
		if coalition == nil {
			break
		}

		user := models.User{ID: coalition.UserID}
		err = user.CreateIfNeeded(db)
		if err != nil {
			errstream <- err
			continue
		}
		go func(coalitionID int) {
			actualCoalition, err := getCoalition(coalitionID, db)
			if err != nil {
				errstream <- err
				return
			}
			err = user.SetCoalition(*actualCoalition, db)
			if err != nil {
				errstream <- err
			}
		}(coalition.ID)
	}

	wg.Done()
}
