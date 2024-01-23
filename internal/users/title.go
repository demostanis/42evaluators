package users

import (
	"fmt"
	"github.com/demostanis/42evaluators2.0/internal/api"
	"github.com/demostanis/42evaluators2.0/internal/database/models"
	"gorm.io/gorm"
)

type TitleId struct {
	Id       int  `json:"title_id"`
	Selected bool `json:"selected"`
}

type Title struct {
	Name string `json:"name"`
}

func getTitle(user models.User) string {
	titles, err := api.Do[[]TitleId](
		api.NewRequest(fmt.Sprintf("/v2/users/%d/titles_users", user.ID)).
			Authenticated())
	if err == nil {
		for _, title := range *titles {
			if title.Selected {
				actualTitle, err := api.Do[Title](
					api.NewRequest(fmt.Sprintf("/v2/titles/%d", title.Id)).
						Authenticated())
				if err == nil {
					return (*actualTitle).Name
				} else {
					break
				}
			}
		}
	}
	return "%login"
}

func setTitle(user models.User, db *gorm.DB) {
	user.Title = getTitle(user)
	db.Save(&user)
}
