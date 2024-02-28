package clusters

import (
	"errors"
	"fmt"
	"maps"
	"net/http"
	"strconv"
	"strings"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

var DefaultParams = map[string]string{
	"filter[active]": "true",
}

type Location struct {
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

// TODO: we should move this function somewhere to reuse it
func getPageCount() (int, error) {
	var headers *http.Header
	_, _ = api.Do[any](
		api.NewRequest("/v2/locations").
			Authenticated().
			WithParams(DefaultParams).
			WithMethod("HEAD").
			OutputHeadersIn(&headers))

	if headers == nil {
		return 0, errors.New("request did not contain any headers")
	}
	_, after, _ := strings.Cut(headers.Get("link"), "page=")
	pageCountRaw, _, _ := strings.Cut(after, ">")
	pageCount, err := strconv.Atoi(pageCountRaw)
	if err != nil {
		return 0, errors.New("failed to find page count")
	}
	return pageCount, nil
}

func UpdateLocationInDB(location models.Location, db *gorm.DB) {
	var newLocation models.Location
	db.Where("host = ?", location.Host).Find(&newLocation)

	f := db.Save
	if newLocation.Host != "" {
		f = db.Model(&newLocation).Updates
	}

	f(&location)
	// We also have to manually update end_at since it might be nil
	db.Model(&newLocation).Select("end_at").Updates(&location)
}

func fetchOnePage(page int, db *gorm.DB) {
	params := maps.Clone(DefaultParams)
	params["page"] = strconv.Itoa(page)

	locations, err := api.Do[[]Location](
		api.NewRequest("/v2/locations").
			WithParams(params).
			Authenticated())
	if err != nil {
		return
	}

	for _, location := range *locations {
		UpdateLocationInDB(models.Location{
			UserId:   location.User.ID,
			Login:    location.User.Login,
			Host:     location.Host,
			CampusId: location.CampusId,
			Image:    location.User.Image.Versions.Small,
		}, db)
	}
}

func GetLocations(db *gorm.DB) {
	pageCount, _ := getPageCount()

	fmt.Printf("fetching %d location pages...\n", pageCount)

	for page := 1; page <= pageCount; page++ {
		go fetchOnePage(page, db)
	}
}
