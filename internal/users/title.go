package users

import (
	"context"
	"errors"
	"fmt"
	"sync"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type TitleID struct {
	ID       int  `json:"title_id"`
	Selected bool `json:"selected"`
	UserID   int  `json:"user_id"`
}

func getTitle(titleID int, db *gorm.DB) (*models.Title, error) {
	var cachedTitle models.Title
	err := db.
		Session(&gorm.Session{}).
		Model(&models.Title{}).
		Where("id = ?", titleID).
		First(&cachedTitle).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		actualTitle, err := api.Do[models.Title](
			api.NewRequest(fmt.Sprintf("/v2/titles/%d", titleID)).
				Authenticated())
		if err != nil {
			return nil, err
		}

		db.Save(actualTitle)
		return actualTitle, nil
	}
	return &cachedTitle, err
}

func GetTitles(
	ctx context.Context,
	db *gorm.DB,
	errstream chan error,
	wg *sync.WaitGroup,
) {
	wg.Add(1)

	titles, err := api.DoPaginated[[]TitleID](
		api.NewRequest("/v2/titles_users").
			Authenticated())
	if err != nil {
		errstream <- err
		return
	}

	for {
		title, err := (<-titles)()
		if err != nil {
			errstream <- fmt.Errorf("error while fetching titles: %w", err)
			continue
		}
		if title == nil {
			break
		}
		if !title.Selected {
			continue
		}

		user := models.User{ID: title.UserID}
		err = user.CreateIfNeeded(db)
		if err != nil {
			errstream <- err
			continue
		}
		go func(titleID int) {
			actualTitle, err := getTitle(titleID, db)
			if err != nil {
				errstream <- err
				return
			}
			err = user.SetTitle(*actualTitle, db)
			if err != nil {
				errstream <- err
				return
			}
		}(title.ID)
	}

	wg.Done()
}
