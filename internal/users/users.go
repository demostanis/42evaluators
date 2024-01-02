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

<<<<<<< HEAD
	var headers *http.Header
	_, err := api.Do[any](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithMethod("HEAD").
			WithParams(params).
			OutputHeadersIn(&headers))

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	if headers == nil {
		return 0, errors.New("response did not contain any headers")
	}
	_, after, _ := strings.Cut(headers.Get("link"), "page=")
	pageCountRaw, _, _ := strings.Cut(after, "&")
	pageCount, err := strconv.Atoi(pageCountRaw)
	if err != nil {
		return 0, fmt.Errorf("page count isn't a number: %v", pageCountRaw)
	}
	return pageCount, nil
=======
	return api.GetPageCount(headers, err)
>>>>>>> 583b5ba (split paging logic)
=======
	return api.GetPageCount(headers, "&", err)
>>>>>>> 592ea08 (add a delimiter to api.GetPageCount since some headers are bizarre)
=======
	return api.GetPageCount(headers, err)
>>>>>>> 3564779 (wip: making clusters map use the api instead of the now cloudflared cable)
}

func fetchOnePage(
	ctx context.Context, page int, campusId string,
	db *gorm.DB, errstream chan error,
) {
	params := maps.Clone(DefaultParams)
	params["page[number]"] = strconv.Itoa(page)
	params["filter[campus_id]"] = campusId

	users, err := api.Do[[]models.User](
=======
	users, err := api.DoPaginated[[]models.User](
>>>>>>> 737710e (big refactoring)
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
