package users

import (
	"context"
	"errors"
	"fmt"
	"maps"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"golang.org/x/sync/semaphore"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

var (
	DefaultParams = map[string]string{
		"sort":              "-level",
		"filter[cursus_id]": "21",
	}
	ConcurrentCampusesFetch = int64(5)
	ConcurrentPagesFetch    = int64(20)
	ConcurrentUsersFetch    = int64(10)
)

func getPageCount(campusId string) (int, error) {
	params := maps.Clone(DefaultParams)
	params["filter[campus_id]"] = campusId

	var headers *http.Header
	_, err := api.Do[any](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithMethod("HEAD").
			WithParams(params).
			OutputHeadersIn(&headers))

	return api.GetPageCount(headers, "&", err)
}

func fetchOnePage(
	ctx context.Context, page int, campusId string,
	db *gorm.DB, errstream chan error,
) {
	params := maps.Clone(DefaultParams)
	params["page"] = strconv.Itoa(page)
	params["filter[campus_id]"] = campusId

	users, err := api.Do[[]models.User](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithParams(params))
	if err != nil {
		errstream <- err
		return
	}

	var wg sync.WaitGroup
	weights := semaphore.NewWeighted(ConcurrentUsersFetch)

	for _, user := range *users {
		if strings.HasPrefix(user.Login, "3b3-") {
			continue
		}

		campusId, _ := strconv.Atoi(campusId)

		weights.Acquire(ctx, 1)
		wg.Add(1)

		go func(user models.User) {
			start := time.Now()

			err := db.
				Model(&models.User{}).
				Where("id = ?", user.ID).
				First(nil).Error
			if errors.Is(err, gorm.ErrRecordNotFound) {
				db.Error = nil
				db.Create(&user)
			}

			var userWg sync.WaitGroup

			userWg.Add(5)
			go func() {
				if err = setIsTest(user, db); err != nil {
					errstream <- fmt.Errorf("users.setIsTest: %w", err)
				}
				userWg.Done()
			}()
			go func() {
				if err = setTitle(user, db); err != nil {
					errstream <- fmt.Errorf("users.setTitle: %w", err)
				}
				userWg.Done()
			}()
			go func() {
				if err = setCoalition(user, db); err != nil {

					errstream <- fmt.Errorf("users.setCoalition: %w", err)
				}
				userWg.Done()
			}()
			go func() {
				if err = setCampus(user, campusId, db); err != nil {
					errstream <- fmt.Errorf("users.setCampus: %w", err)
				}
				userWg.Done()
			}()
			go func() {
				if err = user.UpdateFields(db); err != nil {
					errstream <- fmt.Errorf("users.UpdateFields: %w", err)
				}
				userWg.Done()
			}()

			userWg.Wait()
			wg.Done()
			weights.Release(1)
			fmt.Printf("took %dms\n", time.Now().Sub(start).Milliseconds())
		}(user)
	}

	wg.Wait()
	fmt.Printf("fetched page %d...\n", page)
}

func GetUsers(ctx context.Context, db *gorm.DB, errstream chan error) {
	start := time.Now()
	campusesWeights := semaphore.NewWeighted(ConcurrentCampusesFetch)

	var campusesToFetch []models.Campus
	db.Find(&campusesToFetch)
	if len(campusesToFetch) == 0 {
		time.Sleep(100) // wait some time for campuses to be fetched...
		GetUsers(ctx, db, errstream)
		return
	}
	fmt.Printf("fetching %d campuses...\n", len(campusesToFetch))

	var wgForTimeTaken sync.WaitGroup
	for _, campus := range campusesToFetch {
		campusId := strconv.Itoa(campus.ID)
		// temporary, obv...
		if campusId != "62" {
			continue
		}

		wgForTimeTaken.Add(1)
		campusesWeights.Acquire(ctx, 1)

		go func(campusId string) {
			pageCount, err := getPageCount(campusId)
			if err != nil {
				errstream <- fmt.Errorf("failed to get page count for users: %v", err)
				return
			}

			fmt.Printf("fetching %d user pages...\n", pageCount)

			var wg sync.WaitGroup
			pagesWeights := semaphore.NewWeighted(ConcurrentCampusesFetch)

			for page := 1; page <= pageCount; page++ {
				pagesWeights.Acquire(ctx, 1)
				wg.Add(1)

				go func(page int) {
					fetchOnePage(ctx, page, campusId, db, errstream)
					pagesWeights.Release(1)
					wg.Done()
				}(page)
			}

			wg.Wait()
			wgForTimeTaken.Done()
			campusesWeights.Release(1)
		}(campusId)
	}

	wgForTimeTaken.Wait()
	fmt.Printf("took %.2f minutes to fetch all users\n",
		time.Now().Sub(start).Minutes())
}
