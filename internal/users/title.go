package users

import (
	"context"
	"errors"
	"fmt"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type TitleId struct {
	ID       int  `json:"title_id"`
	Selected bool `json:"selected"`
	UserID   int  `json:"user_id"`
}

func getTitle(titleId int, db *gorm.DB) (*models.Title, error) {
	var cachedTitle models.Title
	err := db.
		Session(&gorm.Session{}).
		Model(&models.Title{}).
		Where("id = ?", titleId).
		First(&cachedTitle).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		actualTitle, err := api.Do[models.Title](
			api.NewRequest(fmt.Sprintf("/v2/titles/%d", titleId)).
				Authenticated())
		if err != nil {
			return nil, err
		}

		// We ignore the error since it could happen
		// that another goroutine, since the last time
		// we checked whether the record already existed
		// (above), added the same record in the database!
		// Which is very unfortunate. So we don't care.
		db.Create(actualTitle)
		return actualTitle, nil
	}
	return &cachedTitle, err
}

func GetTitles(ctx context.Context, db *gorm.DB, errstream chan error) {
	titles, err := api.DoPaginated[[]TitleId](
		api.NewRequest("/v2/titles_users").
			Authenticated().
			WithPageSize(100).
			WithMaxConcurrentFetches(ConcurrentPagesFetch))
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
		user.CreateIfNeeded(db)
		go func(titleId int) {
			actualTitle, err := getTitle(titleId, db)
			if err != nil {
				errstream <- err
				return
			}
			user.SetTitle(*actualTitle, db)
		}(title.ID)
	}
}
