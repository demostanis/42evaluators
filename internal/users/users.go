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
	}
	CampusesToFetch = []string{
		//"62", "50",
		"62",
	}
)

func getPageCount(campusId string) (int, error) {
	params := maps.Clone(DefaultParams)
	params["filter[campus_id]"] = campusId

	var headers *http.Header
	_, _ = api.Do[any](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithMethod("HEAD").
			WithParams(params).
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

func fetchOnePage(page int, campusId string, db *gorm.DB) {
	params := maps.Clone(DefaultParams)
	params["page"] = strconv.Itoa(page)
	params["filter[campus_id]"] = campusId

	users, err := api.Do[[]models.User](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithParams(params))
	if err != nil {
		return
	}

	for _, user := range *users {
		if strings.HasSuffix(user.Login, "3b3-") {
			continue
		}

		user.CampusID, _ = strconv.Atoi(campusId)

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
	for _, campusId := range CampusesToFetch {
		go func(campusId string) {
			pageCount, _ := getPageCount(campusId)

			fmt.Printf("fetching %d user pages...\n", pageCount)

			for page := 1; page <= pageCount; page++ {
				go fetchOnePage(page, campusId, db)
			}
		}(campusId)
	}
}
