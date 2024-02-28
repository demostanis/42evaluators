package users

import (
	"errors"
	"fmt"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type TitleId struct {
	Id       int  `json:"title_id"`
	Selected bool `json:"selected"`
}

func getTitle(user models.User, db *gorm.DB) (*models.Title, error) {
	titles, err := api.Do[[]TitleId](
		api.NewRequest(fmt.Sprintf("/v2/users/%d/titles_users", user.ID)).
			Authenticated())
	if err != nil {
		return nil, err
	}

	for _, title := range *titles {
		if title.Selected {
			var cachedTitle models.Title
			err := db.
				Model(&models.Title{}).
				Where("id = ?", title.Id).
				First(&cachedTitle).Error

			if errors.Is(err, gorm.ErrRecordNotFound) {
				actualTitle, err := api.Do[models.Title](
					api.NewRequest(fmt.Sprintf("/v2/titles/%d", title.Id)).
						Authenticated())
				if err != nil {
					return nil, err
				}

				db.Error = nil // That fucking sucks
				err = db.Create(&actualTitle).Error
				return actualTitle, err
			}
			return &cachedTitle, err
		}
	}
	return nil, nil
}

func setTitle(user models.User, db *gorm.DB) error {
	title, err := getTitle(user, db)
	if err != nil {
		return err
	}

	if title != nil {
		return db.Model(&user).Updates(models.User{
			TitleID: (*title).ID,
		}).Error
	}
	return nil
}
