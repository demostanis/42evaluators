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

func getTitle(user models.User, db *gorm.DB) models.Title {
	titles, err := api.Do[[]TitleId](
		api.NewRequest(fmt.Sprintf("/v2/users/%d/titles_users", user.ID)).
			Authenticated())
	if err == nil {
		for _, title := range *titles {
			if title.Selected {
				var cachedTitle models.Title
				err := db.
					Model(&models.Title{}).
					Where("id = ?", title.Id).
					First(&cachedTitle)

				if errors.Is(err.Error, gorm.ErrRecordNotFound) {
					actualTitle, err := api.Do[models.Title](
						api.NewRequest(fmt.Sprintf("/v2/titles/%d", title.Id)).
							Authenticated())
					if err == nil {
						db.Error = nil // That fucking sucks
						db.Create(&actualTitle)
						return *actualTitle
					} else {
						break
					}
				}
				return cachedTitle
			}
		}
	}
	return models.DefaultTitle
}

func setTitle(user models.User, db *gorm.DB) {
	title := getTitle(user, db)
	if title.ID != -1 {
		db.Model(&user).Updates(models.User{
			TitleID: title.ID,
		})
	}
}
