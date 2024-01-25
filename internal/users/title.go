package users

import (
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
					Where("id = ?", title.Id).
					First(&cachedTitle)

				if err.Error == gorm.ErrRecordNotFound {
					actualTitle, err := api.Do[models.Title](
						api.NewRequest(fmt.Sprintf("/v2/titles/%d", title.Id)).
							Authenticated())
					if err == nil {
						db.Save(&actualTitle)
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
	user.Title = getTitle(user, db)
	db.Save(&user)
	// Why the fuck do I need to save the title here?
	db.Save(&user.Title)
}
