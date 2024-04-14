package users

import (
	"context"
	"fmt"
	"maps"
	"strconv"
	"strings"
	"sync"
	"time"

	"golang.org/x/sync/semaphore"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/campus"
	"github.com/demostanis/42evaluators/internal/database"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

var (
	DefaultParams = map[string]string{
		"filter[cursus_id]": "21",
	}
	ConcurrentCampusesFetch = int64(5)
)

var (
	waitForUsers       = make(chan bool)
	waitForUsersClosed = false
)

func WaitForUsers() {
	if !waitForUsersClosed {
		<-waitForUsers
	}
}

func storeUsersInFTS(db *gorm.DB) error {
	var users []models.User
	err := db.
		Model(&models.User{}).
		Preload("Title").
		Scopes(database.OnlyRealUsers()).
		Find(&users).Error
	if err != nil {
		return err
	}

	for _, user := range users {
		displayName := user.Login
		if user.Title.Name != "" {
			displayName = strings.Replace(user.Title.Name, "%login", user.Login, -1)
		}
		displayName = fmt.Sprintf("%s %s", displayName, user.DisplayName)

		// soo... i wanted to use UPSERT first, but apparently
		// it doesn't support virtual tables on SQLite, so i resorted
		// to just trying simple SQL. and now i've realized i'm using
		// an ORM. but fuck it.
		var count int64
		err = db.Raw(`SELECT COUNT(*)
						FROM user_search
						WHERE user_id = ?`,
			user.ID).
			Scan(&count).Error
		if err != nil {
			return err
		}
		if count == 0 {
			err = db.Exec(`INSERT INTO user_search(
						user_id, display_name)
						VALUES(?, ?)`,
				user.ID, displayName).Error
			if err != nil {
				return err
			}
		} else {
			err = db.Exec(`UPDATE user_search
						SET display_name = ?
						WHERE user_id = ?`,
				displayName, user.ID).Error
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func fetchOneCampus(ctx context.Context, campusId int, db *gorm.DB, errstream chan error) {
	params := maps.Clone(DefaultParams)
	params["filter[campus_id]"] = strconv.Itoa(campusId)

	users, err := api.DoPaginated[[]models.User](
		api.NewRequest("/v2/cursus_users").
			Authenticated().
			WithParams(params))
	if err != nil {
		errstream <- err
		return
	}

	var wg sync.WaitGroup
	for {
		user, err := (<-users)()
		if err != nil {
			errstream <- err
			continue
		}
		if user == nil {
			break
		}
		if strings.HasPrefix(user.Login, "3b3-") {
			continue
		}

		wg.Add(1)
		go func() {
			user.CreateIfNeeded(db)
			user.UpdateFields(db)
			user.SetCampus(campusId, db)
			wg.Done()
		}()
	}
	wg.Wait()
}

func GetUsers(ctx context.Context, db *gorm.DB, errstream chan error) {
	campus.WaitForCampuses()
	var campuses []models.Campus
	db.Find(&campuses)

	var wg sync.WaitGroup
	go GetTests(ctx, db, errstream, wg)
	go GetCoalitions(ctx, db, errstream, wg)
	go GetTitles(ctx, db, errstream, wg)
	go GetLogtimes(ctx, db, errstream, wg)

	start := time.Now()
	weights := semaphore.NewWeighted(ConcurrentCampusesFetch)

	for _, campus := range campuses {
		weights.Acquire(ctx, 1)
		wg.Add(1)

		go func(campusId int) {
			fetchOneCampus(ctx, campusId, db, errstream)
			weights.Release(1)
			wg.Done()
		}(campus.ID)
	}

	wg.Wait()
	fmt.Printf("took %.2f minutes to fetch all users\n",
		time.Since(start).Minutes())

	go func() {
		errstream <- storeUsersInFTS(db)
	}()

	if !waitForUsersClosed {
		close(waitForUsers)
		waitForUsersClosed = true
	}
}
