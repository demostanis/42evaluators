package users

import (
	"encoding/json"
	"fmt"
	"slices"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type LogtimeRaw struct {
	EndAt   string `json:"end_at"`
	BeginAt string `json:"begin_at"`
}

type Logtime struct {
	EndAt   time.Time
	BeginAt time.Time
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
	logtime.BeginAt = beginAt
	logtime.EndAt = endAt
	return nil
}

func getWeeklyLogtime(user models.User) (*time.Duration, error) {
	day := time.Hour * 24
	currentDay := int(time.Now().UTC().Weekday() - 1)
	daysSinceMonday := time.Duration(currentDay) * day
	monday := time.Now().UTC().Add(-daysSinceMonday).Truncate(day)
	sunday := monday.Add(day * 7)

	params := make(map[string]string)
	params["range[begin_at]"] = fmt.Sprintf("%s,%s",
		monday.Format(time.RFC3339),
		sunday.Format(time.RFC3339))
	// TODO: fetch all pages?
	params["page[size]"] = "100"

	logtime, err := api.Do[[]Logtime](api.NewRequest(fmt.Sprintf(
		"/v2/users/%d/locations", user.ID)).
		Authenticated().
		WithParams(params))
	if err != nil {
		return nil, err
	}

	// Some people in some campuses sometimes are
	// in multiples locations at once, so don't count
	// their logtimes twice...
	slices.SortFunc(*logtime, func(a, b Logtime) int {
		return int(a.BeginAt.Unix()+a.EndAt.Unix()) -
			int(b.BeginAt.Unix()+b.EndAt.Unix())
	})
	var previousLocation *Logtime
	for i := range *logtime {
		location := &(*logtime)[i]
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
	for _, location := range *logtime {
		total += location.EndAt.Sub(location.BeginAt)
	}
	total = total.Truncate(time.Minute)
	return &total, nil
}

func setWeeklyLogtime(user models.User, db *gorm.DB) error {
	logtime, err := getWeeklyLogtime(user)
	if err != nil {
		return err
	}

	user.WeeklyLogtime = *logtime
	return db.Model(&user).Updates(models.User{
		WeeklyLogtime: user.WeeklyLogtime,
	}).Error
}
