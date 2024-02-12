package users

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

var (
	DefaultParams = map[string]string{
		"sort":              "-level",
		"filter[cursus_id]": "21",
		"filter[campus_id]": "62",
	}
)

func getPageCount() (int, error) {
	var headers *http.Header
	_, _ = api.Do[any](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithMethod("HEAD").
			WithParams(DefaultParams).
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

func fetchOnePage(page int, db *gorm.DB) {
	params := maps.Clone(DefaultParams)
	params["page"] = strconv.Itoa(page)

	users, err := api.Do[[]models.User](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithParams(params))
	if err != nil {
		return
	}

	for _, user := range *users {
		go setIsTest(user, db)
		go setTitle(user, db.Omit("is_test"))
		go setCoalition(user, db.Omit("is_test"))
		go func(user models.User) {
			db.Omit("is_test").Save(&user)
		}(user)
	}

	fmt.Printf("fetched page %d...\n", page)
}

func GetUsers(db *gorm.DB) {
	pageCount, _ := getPageCount()

	fmt.Printf("fetching %d user pages...\n", pageCount)

	for page := 1; page <= pageCount; page++ {
		go fetchOnePage(page, db)
	}
}
