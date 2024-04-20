package users

import (
	"context"
	"fmt"
	"sync"

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

func GetTests(
	ctx context.Context,
	db *gorm.DB,
	errstream chan error,
	wg *sync.WaitGroup,
) {
	wg.Add(1)

	groups, err := api.DoPaginated[[]Group](
		api.NewRequest("/v2/groups_users").
			Authenticated())
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
			err = user.CreateIfNeeded(db)
			if err != nil {
				errstream <- err
				continue
			}
			err = user.YesItsATestAccount(db)
			if err != nil {
				errstream <- err
			}
		}
	}

	wg.Done()
}
