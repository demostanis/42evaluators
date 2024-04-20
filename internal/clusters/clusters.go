package clusters

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

const (
	ConcurrentLocationsFetch = 40
)

var (
	LocationChannel = make(chan models.Location)
	FirstFetchDone  = false
)

type Location struct {
	ID       int    `json:"id"`
	Host     string `json:"host"`
	CampusID int    `json:"campus_id"`
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
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Image  string `json:"cdn_link"`
	Campus struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"campus"`
	Svg         string
	DisplayName string
}

func getParams(lastFetch time.Time, field string) map[string]string {
	params := make(map[string]string)
	if !lastFetch.IsZero() {
		r := lastFetch.Format(time.RFC3339) + "," +
			time.Now().UTC().Format(time.RFC3339)
		params[fmt.Sprintf("range[%s]", field)] = r
	} else {
		params["filter[active]"] = "true"
	}
	return params
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
		// Sometimes the location gets created at the same
		// time by another goroutine, so ignore the error
		db.Create(&location)
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
			"UserID":   location.UserID,
			"Login":    location.Login,
			"Host":     location.Host,
			"CampusID": location.CampusID,
			"EndAt":    location.EndAt,
			"Image":    location.Image,
		}).Error
}

func getLocationsForField(
	lastFetch time.Time,
	field string,
	ctx context.Context,
	db *gorm.DB,
	errstream chan error,
) {
	locations, err := api.DoPaginated[[]Location](
		api.NewRequest("/v2/locations").
			Authenticated().
			WithParams(getParams(lastFetch, field)))
	if err != nil {
		errstream <- err
		return
	}

	for {
		location, err := (<-locations)()
		if err != nil {
			errstream <- err
			continue
		}
		if location == nil {
			break
		}
		dbLocation := models.Location{
			ID:       location.ID,
			UserID:   location.User.ID,
			Login:    location.User.Login,
			Host:     location.Host,
			CampusID: location.CampusID,
			Image:    location.User.Image.Versions.Small,
			EndAt:    location.EndAt,
		}
		err = UpdateLocationInDB(dbLocation, db)
		if err != nil {
			errstream <- err
			continue
		}
		if !lastFetch.IsZero() {
			LocationChannel <- dbLocation
		}
	}
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
	FirstFetchDone = true
}
