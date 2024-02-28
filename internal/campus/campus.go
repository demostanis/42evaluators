package campus

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

func getPageCount() (int, error) {
	var headers *http.Header
	_, _ = api.Do[any](
		api.NewRequest("/v2/campus").
			Authenticated().
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

func fetchOnePage(page int, db *gorm.DB) error {
	campuses, err := api.Do[[]models.Campus](
		api.NewRequest("/v2/campus").
			Authenticated().
			WithParams(map[string]string{
				"page": strconv.Itoa(page),
			}))
	if err != nil {
		return err
	}

	for _, campus := range *campuses {
		err := db.Save(&campus).Error
		if err != nil {
			return err
		}
	}

	fmt.Printf("fetched page %d...\n", page)
	return nil
}

func GetCampuses(db *gorm.DB, errstream chan error) {
	pageCount, err := getPageCount()
	if err != nil {
		errstream <- err
		return
	}

	fmt.Printf("fetching %d campus pages...\n", pageCount)

	for page := 1; page <= pageCount; page++ {
		errstream <- fetchOnePage(page, db)
	}
}
