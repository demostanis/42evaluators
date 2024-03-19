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
	ConcurrentPagesFetch    = int64(100)
)

func fetchOneCampus(ctx context.Context, campusId int, db *gorm.DB, errstream chan error) {
	params := maps.Clone(DefaultParams)
	params["filter[campus_id]"] = strconv.Itoa(campusId)

	users, err := api.DoPaginated[[]models.User](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithPageSize(100).
			WithMaxConcurrentFetches(ConcurrentPagesFetch).
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
			user.CreateIfNeeded(db)
			user.UpdateFields(db)
			user.SetCampus(campusId, db)
			wg.Done()
		}()
	}
	wg.Wait()
}

func GetUsers(ctx context.Context, db *gorm.DB, errstream chan error) {
	<-campus.WaitForCampuses
	var campuses []models.Campus
	db.Find(&campuses)

	go GetTests(ctx, db, errstream)
	go GetCoalitions(ctx, db, errstream)
	go GetTitles(ctx, db, errstream)
	go GetLogtimes(ctx, db, errstream)

	// TODO: should show the time for requests above too
	start := time.Now()
	weights := semaphore.NewWeighted(ConcurrentCampusesFetch)

	var wg sync.WaitGroup
	for _, campus := range campuses {
		weights.Acquire(ctx, 1)
		wg.Add(1)

		go func(campusId int) {
			fetchOneCampus(ctx, campusId, db, errstream)
			weights.Release(1)
			wg.Done()
		}(campus.ID)
	}

	wg.Wait()
	fmt.Printf("took %.2f minutes to fetch all users\n",
		time.Now().Sub(start).Minutes())
}
