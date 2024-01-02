package users

import (
	"context"
	"fmt"
	"maps"
	"strconv"
	"strings"
	"sync"
	"time"

	"golang.org/x/sync/semaphore"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/campus"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

var (
	DefaultParams = map[string]string{
		"filter[cursus_id]": "21",
	}
	ConcurrentCampusesFetch = int64(5)
)

var (
	waitForUsers       = make(chan bool)
	waitForUsersClosed = false
)

func WaitForUsers() {
	if !waitForUsersClosed {
		<-waitForUsers
	}
}

func fetchOneCampus(ctx context.Context, campusID int, db *gorm.DB, errstream chan error) {
	params := maps.Clone(DefaultParams)
	params["filter[campus_id]"] = strconv.Itoa(campusID)

	users, err := api.DoPaginated[[]models.User](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithParams(params))
	if err != nil {
		errstream <- err
		return
	}

	var wg sync.WaitGroup
	for {
		user, err := (<-users)()
		if err != nil {
			errstream <- err
			continue
		}
		if user == nil {
			break
		}
		if strings.HasPrefix(user.Login, "3b3-") {
			continue
		}

		wg.Add(1)
		go func() {
			defer wg.Done()
			err = user.CreateIfNeeded(db)
			if err != nil {
				errstream <- err
				return
			}
			err = user.UpdateFields(db)
			if err != nil {
				errstream <- err
				return
			}
			err = user.SetCampus(campusID, db)
			if err != nil {
				errstream <- err
			}
		}()
	}
	wg.Wait()
}

func GetUsers(ctx context.Context, db *gorm.DB, errstream chan error) {
	campus.WaitForCampuses()
	var campuses []models.Campus
	db.Find(&campuses)

	var wg sync.WaitGroup
	go GetTests(ctx, db, errstream, &wg)
	go GetCoalitions(ctx, db, errstream, &wg)
	go GetTitles(ctx, db, errstream, &wg)
	go GetLogtimes(ctx, db, errstream, &wg)

	start := time.Now()
	weights := semaphore.NewWeighted(ConcurrentCampusesFetch)

	for _, campus := range campuses {
		err := weights.Acquire(ctx, 1)
		if err != nil {
			errstream <- err
			continue
		}
		wg.Add(1)

		go func(campusID int) {
			fetchOneCampus(ctx, campusID, db, errstream)
			weights.Release(1)
			wg.Done()
		}(campus.ID)
	}

	wg.Wait()
	fmt.Printf("took %.2f minutes to fetch all users\n",
		time.Since(start).Minutes())

	if !waitForUsersClosed {
		close(waitForUsers)
		waitForUsersClosed = true
	}
}
