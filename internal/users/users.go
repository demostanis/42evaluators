package users

import (
	"errors"
	"fmt"
	"github.com/demostanis/42evaluators2.0/internal/api"
	"github.com/demostanis/42evaluators2.0/internal/database/models"
	"gorm.io/gorm"
	"maps"
	"net/http"
	"strconv"
	"strings"
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

	_, after, _ := strings.Cut(headers.Get("link"), "page=")
	pageCountRaw, _, _ := strings.Cut(after, "&")
	pageCount, err := strconv.Atoi(pageCountRaw)
	if err != nil {
		return 0, errors.New("failed to find page count")
	}
	return pageCount, nil
}

func fetchOnePage(page int, db *gorm.DB) {
	fmt.Printf("fetching page %d...\n", page)

	params := maps.Clone(DefaultParams)
	params["page"] = strconv.Itoa(page)

	users, _ := api.Do[[]models.User](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithParams(params))

	for _, user := range *users {
		go setIsTest(user, db)
		go setTitle(user, db)
		go setCoalition(user, db)
		go func(user models.User) {
			db.Save(&user)
		}(user)
	}
}

func GetUsers(db *gorm.DB) {
	pageCount, _ := getPageCount()

	fmt.Printf("fetching %d pages...\n", pageCount)

	for page := 1; page <= pageCount; page++ {
		go fetchOnePage(page, db)
	}
}
