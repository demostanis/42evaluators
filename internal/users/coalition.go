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

func getCoalition(coalitionId int, db *gorm.DB) (*models.Coalition, error) {
	var cachedCoalition models.Coalition
	err := db.
		Session(&gorm.Session{}).
		Model(&models.Coalition{}).
		Where("id = ?", coalitionId).
		First(&cachedCoalition).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		actualCoalition, err := api.Do[models.Coalition](
			api.NewRequest(fmt.Sprintf("/v2/coalitions/%d", coalitionId)).
				Authenticated())
		if err != nil {
			return nil, err
		}

		db.Create(actualCoalition)
		return actualCoalition, nil
	}
	return &cachedCoalition, err
}

func GetCoalitions(
	ctx context.Context,
	db *gorm.DB,
	errstream chan error,
	wg sync.WaitGroup,
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
		user.CreateIfNeeded(db)
		go func(coalitionId int) {
			actualCoalition, err := getCoalition(coalitionId, db)
			if err != nil {
				errstream <- err
				return
			}
			user.SetCoalition(*actualCoalition, db)
		}(coalition.ID)
	}

	wg.Done()
}
