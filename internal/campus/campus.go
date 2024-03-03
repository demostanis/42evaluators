package campus

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

func getPageCount() (int, error) {
	var headers *http.Header
	_, err := api.Do[any](
		api.NewRequest("/v2/campus").
			Authenticated().
			WithMethod("HEAD").
			OutputHeadersIn(&headers))
	return api.GetPageCount(headers, err)
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
		errstream <- fmt.Errorf("failed to get page count for campuses: %v", err)
		return
	}

	fmt.Printf("fetching %d campus pages...\n", pageCount)

	for page := 1; page <= pageCount; page++ {
		errstream <- fetchOnePage(page, db)
	}
}
