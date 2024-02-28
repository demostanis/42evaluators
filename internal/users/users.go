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
	_, _ = api.Do[any](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithMethod("HEAD").
			WithParams(params).
			OutputHeadersIn(&headers))

	if headers == nil {
		return 0, errors.New("request did not contain any headers")
	}
	_, after, _ := strings.Cut(headers.Get("link"), "page=")
	pageCountRaw, _, _ := strings.Cut(after, "&")
	pageCount, err := strconv.Atoi(pageCountRaw)
	if err != nil {
		return 0, errors.New("failed to find page count")
	}
	return pageCount, nil
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
				errstream <- fmt.Errorf("users.setIsTest: %v",
					setIsTest(user, db))
				userWg.Done()
			}()
			go func() {
				errstream <- fmt.Errorf("users.setTitle: %v",
					setTitle(user, db))
				userWg.Done()
			}()
			go func() {
				errstream <- fmt.Errorf("users.setCoalition: %v",
					setCoalition(user, db))
				userWg.Done()
			}()
			go func() {
				errstream <- fmt.Errorf("users.setCampus: %v",
					setCampus(user, campusId, db))
				userWg.Done()
			}()
			go func() {
				errstream <- fmt.Errorf("users.UpdateFields: %v",
					user.UpdateFields(db))
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
				errstream <- fmt.Errorf("failed to get page count: %v", err)
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
