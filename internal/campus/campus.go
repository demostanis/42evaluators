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

func fetchOnePage(page int, db *gorm.DB) {
	campuses, err := api.Do[[]models.Campus](
		api.NewRequest("/v2/campus").
			Authenticated().
			WithParams(map[string]string{
				"page": strconv.Itoa(page),
			}))
	if err != nil {
		return
	}

	for _, campus := range *campuses {
		db.Save(&campus)
	}
	fmt.Printf("fetched page %d...\n", page)
}

func GetCampuses(db *gorm.DB) {
	pageCount, _ := getPageCount()

	fmt.Printf("fetching %d campus pages...\n", pageCount)

	for page := 1; page <= pageCount; page++ {
		go fetchOnePage(page, db)
	}
}
