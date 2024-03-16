package clusters

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"golang.org/x/sync/semaphore"
	"gorm.io/gorm"
)

const (
	ConcurrentLocationsFetch = 40
)

var (
	LocationChannel = make(chan models.Location)
)

type Location struct {
	ID       int    `json:"id"`
	Host     string `json:"host"`
	CampusId int    `json:"campus_id"`
	User     struct {
		ID    int    `json:"id"`
		Login string `json:"login"`
		Image struct {
			Versions struct {
				Small string `json:"small"`
			} `json:"versions"`
		} `json:"image"`
	} `json:"user"`
	EndAt string `json:"end_at"`
}

type Cluster struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Image  string `json:"cdn_link"`
	Campus struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	} `json:"campus"`
	Svg         string
	DisplayName string
}

func getParams(lastFetch time.Time, field string) map[string]string {
	params := make(map[string]string)
	if !lastFetch.IsZero() {
		r := lastFetch.Format(time.RFC3339) + "," + time.Now().UTC().Format(time.RFC3339)
		params[fmt.Sprintf("range[%s]", field)] = r
	} else {
		params["filter[active]"] = "true"
	}
	params["page[size]"] = "100"
	lastFetch = time.Now().UTC()
	return params
}

func getPageCount(lastFetch time.Time, field string) (int, error) {
	var headers *http.Header
	_, err := api.Do[any](
		api.NewRequest("/v2/locations").
			Authenticated().
			WithParams(getParams(lastFetch, field)).
			WithMethod("HEAD").
			OutputHeadersIn(&headers))
	return api.GetPageCount(headers, err)
}

var mu sync.Mutex

func UpdateLocationInDB(location models.Location, db *gorm.DB) error {
	mu.Lock()
	defer mu.Unlock()

	var newLocation models.Location
	err := db.
		Session(&gorm.Session{}).
		Where("id = ?", location.ID).
		First(&newLocation).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return db.Create(&location).Error
	}
	if location.EndAt != "" {
		return db.Delete(&location).Error
	}
	return db.
		Model(&newLocation).
		// I wonder why I need to specify this...
		Where("id = ?", location.ID).
		Updates(map[string]any{
			"ID":       location.ID,
			"UserId":   location.UserId,
			"Login":    location.Login,
			"Host":     location.Host,
			"CampusId": location.CampusId,
			"EndAt":    location.EndAt,
			"Image":    location.Image,
		}).Error
}

func fetchOnePage(lastFetch time.Time, field string, page int, db *gorm.DB) error {
	isUpdate := !lastFetch.IsZero()

	params := getParams(lastFetch, field)
	params["page[number]"] = strconv.Itoa(page)

	locations, err := api.Do[[]Location](
		api.NewRequest("/v2/locations").
			WithParams(params).
			Authenticated())
	if err != nil {
		return err
	}

	for _, location := range *locations {
		dbLocation := models.Location{
			ID:       location.ID,
			UserId:   location.User.ID,
			Login:    location.User.Login,
			Host:     location.Host,
			CampusId: location.CampusId,
			Image:    location.User.Image.Versions.Small,
			EndAt:    location.EndAt,
		}
		err := UpdateLocationInDB(dbLocation, db)
		if err != nil {
			return err
		}
		if isUpdate {
			LocationChannel <- dbLocation
		}
	}
	return nil
}

func getLocationsForField(
	lastFetch time.Time,
	field string,
	ctx context.Context,
	db *gorm.DB,
	errstream chan error,
) {
	pageCount, err := getPageCount(lastFetch, field)
	if err != nil {
		errstream <- fmt.Errorf("failed to get page count for locations: %v", err)
		return
	}

	if pageCount == 0 {
		return
	}
	if lastFetch.IsZero() {
		fmt.Printf("fetching %d location pages...\n", pageCount)
	}

	var wg sync.WaitGroup
	weights := semaphore.NewWeighted(ConcurrentLocationsFetch)
	for page := 1; page <= pageCount; page++ {
		weights.Acquire(ctx, 1)
		wg.Add(1)

		go func(page int) {
			if err := fetchOnePage(lastFetch, field, page, db); err != nil {
				errstream <- fmt.Errorf("failed to get one location page: %v", err)
			}
			weights.Release(1)
			wg.Done()
		}(page)
	}
	wg.Wait()
}

func GetLocations(
	lastFetch time.Time,
	ctx context.Context,
	db *gorm.DB,
	errstream chan error,
) {
	if lastFetch.IsZero() {
		// Makes everything easier
		db.Exec("DELETE FROM locations")
	}
	// Don't do them in parallel, we need end_at to have
	// more importance than begin_at
	getLocationsForField(lastFetch, "begin_at", ctx, db, errstream)
	if !lastFetch.IsZero() {
		getLocationsForField(lastFetch, "end_at", ctx, db, errstream)
	}
}
