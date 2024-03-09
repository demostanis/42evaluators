package users

import (
	"fmt"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

func getCoalition(user models.User) (*models.Coalition, error) {
	coalitions, err := api.Do[[]models.Coalition](
		api.NewRequest(fmt.Sprintf("/v2/users/%d/coalitions", user.ID)).
			Authenticated())
	if err != nil {
		return nil, err
	}
	if len(*coalitions) >= 1 {
		return &(*coalitions)[0], nil
	}
	return nil, nil
}

func setCoalition(user models.User, db *gorm.DB) error {
	coalition, err := getCoalition(user)
	if err != nil {
		return err
	}

	if coalition != nil {
		user.Coalition = *coalition
		return db.Model(&user).Updates(models.User{
			CoalitionID: coalition.ID,
		}).Error
	}
	return nil
}
