package users

import (
	"encoding/json"
	"fmt"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type GroupUsers struct {
	Group struct {
		Name string `json:"name"`
	} `json:"group"`
}

type Group struct {
	Name string
}

func (group *Group) UnmarshalJSON(data []byte) error {
	var groupUsers GroupUsers

	if err := json.Unmarshal(data, &groupUsers); err != nil {
		return err
	}

	group.Name = groupUsers.Group.Name
	return nil
}

func isTest(user models.User) bool {
	whether := false

	groups, err := api.Do[[]Group](
		api.NewRequest(fmt.Sprintf("/v2/users/%d/groups_users", user.ID)).
			Authenticated())
	if err == nil {
		for _, group := range *groups {
			if group.Name == "Test account" {
				whether = true
				break
			}
		}
	}

	return whether
}

func setIsTest(user models.User, db *gorm.DB) error {
	// No need to update, it never changes...
	// Actually, this condition will fetch if
	// IsTest has already been fetched but that
	// it's false... TODO: find something better
	if user.IsTest {
		return nil
	}

	return db.Model(&user).Updates(map[string]any{
		"IsTest": isTest(user),
	}).Error
}
