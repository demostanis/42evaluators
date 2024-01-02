package users

import (
	"context"
	"encoding/json"
	"fmt"
	"slices"
	"sync"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type LogtimeRaw struct {
	EndAt   string `json:"end_at"`
	BeginAt string `json:"begin_at"`
	User    struct {
		ID int `json:"id"`
	} `json:"user"`
}

type Logtime struct {
	EndAt   time.Time
	BeginAt time.Time
	UserID  int
}

func (logtime *Logtime) UnmarshalJSON(data []byte) error {
	var logtimeRaw LogtimeRaw

	err := json.Unmarshal(data, &logtimeRaw)
	if err != nil {
		return err
	}

	endAt, err := time.Parse(time.RFC3339, logtimeRaw.EndAt)
	if err != nil {
		endAt = time.Now()
	}
	beginAt, _ := time.Parse(time.RFC3339, logtimeRaw.BeginAt)

	logtime.EndAt = endAt
	logtime.BeginAt = beginAt
	logtime.UserID = logtimeRaw.User.ID
	return nil
}

func calcWeeklyLogtime(logtime []Logtime) time.Duration {
	// Some people in some campuses sometimes are
	// in multiples locations at once, so don't count
	// their logtimes twice...
	slices.SortFunc(logtime, func(a, b Logtime) int {
		return int(a.BeginAt.Unix()+a.EndAt.Unix()) -
			int(b.BeginAt.Unix()+b.EndAt.Unix())
	})
	var previousLocation *Logtime
	for i := range logtime {
		location := &(logtime)[i]
		if previousLocation == nil {
			previousLocation = location
			continue
		}
		if location.BeginAt.Unix() < previousLocation.EndAt.Unix() {
			location.BeginAt = previousLocation.EndAt
		}
		previousLocation = location
	}

	var total time.Duration
	for _, location := range logtime {
		total += location.EndAt.Sub(location.BeginAt)
	}
	total = total.Truncate(time.Minute)
	return total
}

func GetLogtimes(
	ctx context.Context,
	db *gorm.DB,
	errstream chan error,
	wg *sync.WaitGroup,
) {
	wg.Add(1)

	day := time.Hour * 24
	currentDay := int(time.Now().UTC().Weekday() - 1)
	daysSinceMonday := time.Duration(currentDay) * day
	monday := time.Now().UTC().Add(-daysSinceMonday).Truncate(day)
	sunday := monday.Add(day * 7)

	params := make(map[string]string)
	params["range[begin_at]"] = fmt.Sprintf("%s,%s",
		monday.Format(time.RFC3339),
		sunday.Format(time.RFC3339))

	logtimes, err := api.DoPaginated[[]Logtime](
		api.NewRequest("/v2/locations").
			Authenticated().
			WithParams(params))
	if err != nil {
		errstream <- err
		return
	}

	totalWeeklyLogtimes := make(map[int][]Logtime)

	for {
		logtime, err := (<-logtimes)()
		if err != nil {
			errstream <- fmt.Errorf("error while fetching locations: %w", err)
			continue
		}
		if logtime == nil {
			break
		}

		totalWeeklyLogtimes[logtime.UserID] = append(
			totalWeeklyLogtimes[logtime.UserID], *logtime)
	}

	for userID, logtime := range totalWeeklyLogtimes {
		weeklyLogtime := calcWeeklyLogtime(logtime)

		user := models.User{ID: userID}
		err = user.CreateIfNeeded(db)
		if err != nil {
			errstream <- err
			continue
		}
		err = user.SetWeeklyLogtime(weeklyLogtime, db)
		if err != nil {
			errstream <- err
		}
	}

	wg.Done()
}
