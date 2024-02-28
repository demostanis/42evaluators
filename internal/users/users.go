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

	"golang.org/x/sync/errgroup"
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

func fetchOnePage(ctx context.Context, page int, campusId string, db *gorm.DB) {
	params := maps.Clone(DefaultParams)
	params["page"] = strconv.Itoa(page)
	params["filter[campus_id]"] = campusId

	users, err := api.Do[[]models.User](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithParams(params))
	if err != nil {
		return
	}

	var wg sync.WaitGroup
	weights := semaphore.NewWeighted(ConcurrentUsersFetch)

	for _, user := range *users {
		if strings.HasPrefix(user.Login, "3b3-") {
			continue
		}

		campusId, _ := strconv.Atoi(campusId)

		wg.Add(1)
		weights.Acquire(ctx, 1)
		go func(user models.User) {
			start := time.Now()
			grp, _ := errgroup.WithContext(ctx)

			err := db.
				Model(&models.User{}).
				Where("id = ?", user.ID).
				First(nil).Error
			if errors.Is(err, gorm.ErrRecordNotFound) {
				db.Error = nil
				db.Create(&user)
			}

			grp.Go(func() error {
				setIsTest(user, db)
				return nil
			})
			grp.Go(func() error {
				setTitle(user, db)
				return nil
			})
			grp.Go(func() error {
				setCoalition(user, db)
				return nil
			})
			grp.Go(func() error {
				setCampus(user, campusId, db)
				return nil
			})
			grp.Go(func() error {
				user.UpdateFields(db)
				return nil
			})

			grp.Wait()
			wg.Done()
			weights.Release(1)
			fmt.Printf("took %dms\n", time.Now().Sub(start).Milliseconds())
		}(user)
	}

	wg.Wait()
	fmt.Printf("fetched page %d...\n", page)
}

func GetUsers(ctx context.Context, db *gorm.DB) {
	start := time.Now()
	campusesWeights := semaphore.NewWeighted(ConcurrentCampusesFetch)

	var campusesToFetch []models.Campus
	db.Find(&campusesToFetch)
	fmt.Printf("fetching %d campuses...\n", len(campusesToFetch))

	var wgForTimeTaken sync.WaitGroup
	for _, campus := range campusesToFetch {
		campusId := strconv.Itoa(campus.ID)
		if campusId != "62" {
			continue
		}

		wgForTimeTaken.Add(1)
		campusesWeights.Acquire(ctx, 1)

		go func(campusId string) {
			pageCount, _ := getPageCount(campusId)

			fmt.Printf("fetching %d user pages...\n", pageCount)

			var wg sync.WaitGroup

			pagesWeights := semaphore.NewWeighted(ConcurrentCampusesFetch)
			for page := 1; page <= pageCount; page++ {
				wg.Add(1)
				pagesWeights.Acquire(ctx, 1)

				go func(page int) {
					fetchOnePage(ctx, page, campusId, db)
					wg.Done()
					pagesWeights.Release(1)
				}(page)
			}

			wg.Wait()
			wgForTimeTaken.Done()
			campusesWeights.Release(1)
		}(campusId)
	}

	wgForTimeTaken.Wait()
	fmt.Printf("took %.2f minutes to fetch all users\n", time.Now().Sub(start).Minutes())
}
