package clusters

import (
	"context"
	"errors"
	"fmt"
	"maps"
	"net/http"
	"strconv"
	"sync"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"golang.org/x/sync/semaphore"
	"gorm.io/gorm"
)

const (
	ConcurrentLocationsFetch = 20
)

var DefaultParams = map[string]string{
	"filter[active]": "true",
}

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

func getPageCount() (int, error) {
	var headers *http.Header
	_, err := api.Do[any](
		api.NewRequest("/v2/locations").
			Authenticated().
			WithParams(DefaultParams).
			WithMethod("HEAD").
			OutputHeadersIn(&headers))
	return api.GetPageCount(headers, ">", err)
}

func UpdateLocationInDB(location models.Location, db *gorm.DB) error {
	var newLocation models.Location
	err := db.Where("id = ?", location.ID).Find(&newLocation).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return db.Create(&location).Error
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

func fetchOnePage(page int, db *gorm.DB) error {
	params := maps.Clone(DefaultParams)
	params["page"] = strconv.Itoa(page)

	locations, err := api.Do[[]Location](
		api.NewRequest("/v2/locations").
			WithParams(params).
			Authenticated())
	if err != nil {
		return err
	}

	for _, location := range *locations {
		err := UpdateLocationInDB(models.Location{
			UserId:   location.User.ID,
			Login:    location.User.Login,
			Host:     location.Host,
			CampusId: location.CampusId,
			Image:    location.User.Image.Versions.Small,
		}, db)
		if err != nil {
			return err
		}
	}
	return nil
}

func GetLocations(ctx context.Context, db *gorm.DB, errstream chan error) {
	pageCount, err := getPageCount()
	if err != nil {
		errstream <- fmt.Errorf("failed to get page count for locations: %v", err)
		return
	}

	fmt.Printf("fetching %d location pages...\n", pageCount)

	var wg sync.WaitGroup
	weights := semaphore.NewWeighted(ConcurrentLocationsFetch)
	for page := 1; page <= pageCount; page++ {
		weights.Acquire(ctx, 1)
		wg.Add(1)

		go func(page int) {
			if err := fetchOnePage(page, db); err != nil {
				errstream <- fmt.Errorf("failed to get one location page: %v", err)
			}
			weights.Release(1)
			wg.Done()
		}(page)
	}
	wg.Wait()
}
