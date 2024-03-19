package users

import (
	"context"
	"fmt"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type Group struct {
	Group struct {
		Name string `json:"name"`
	} `json:"group"`
	UserID int `json:"user_id"`
}

func GetTests(ctx context.Context, db *gorm.DB, errstream chan error) {
	groups, err := api.DoPaginated[[]Group](
		api.NewRequest("/v2/groups_users").
			Authenticated().
			WithPageSize(100).
			WithMaxConcurrentFetches(ConcurrentPagesFetch))
	if err != nil {
		errstream <- err
		return
	}

	for {
		group, err := (<-groups)()
		if err != nil {
			errstream <- fmt.Errorf("error while fetching groups: %w", err)
			continue
		}
		if group == nil {
			break
		}

		if group.Group.Name == "Test account" {
			user := models.User{ID: group.UserID}
			user.CreateIfNeeded(db)
			user.YesItsATestAccount(db)
		}
	}
}
