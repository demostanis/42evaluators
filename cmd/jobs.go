package main

import (
	"context"
	"os"
	"strings"
	"time"

	"github.com/demostanis/42evaluators/internal/campus"
	"github.com/demostanis/42evaluators/internal/clusters"
	"github.com/demostanis/42evaluators/internal/projects"
	"github.com/demostanis/42evaluators/internal/users"
	"github.com/go-co-op/gocron/v2"
	"gorm.io/gorm"
)

func getDisabledJobs() (bool, bool, bool, bool) {
	if os.Getenv("disabledjobs") == "*" {
		return true, true, true, true
	}

	disabledJobs := strings.Split(os.Getenv("disabledjobs"), ",")
	disableCampusesJob := false
	disableUsersJob := false
	disableLocationsJob := false
	disableProjectsJob := false

	for _, job := range disabledJobs {
		if job == "campuses" {
			disableCampusesJob = true
		}
		if job == "users" {
			disableUsersJob = true
		}
		if job == "locations" {
			disableLocationsJob = true
		}
		if job == "projects" {
			disableProjectsJob = true
		}
	}

	return disableCampusesJob,
		disableUsersJob,
		disableLocationsJob,
		disableProjectsJob
}

func setupCron(ctx context.Context, db *gorm.DB, errstream chan error) error {
	var job1, job2, job3, job4 gocron.Job
	disableCampusesJob,
		disableUsersJob,
		disableLocationsJob,
		disableProjectsJob := getDisabledJobs()

	s, err := gocron.NewScheduler()
	if err != nil {
		return err
	}
	if !disableCampusesJob {
		job1, err = s.NewJob(
			gocron.DailyJob(1, gocron.NewAtTimes(
				gocron.NewAtTime(0, 0, 0))),
			gocron.NewTask(
				campus.GetCampuses,
				db, errstream,
			),
		)
		if err != nil {
			return err
		}
	}
	if !disableUsersJob {
		job2, err = s.NewJob(
			gocron.DurationJob(time.Hour*2),
			gocron.NewTask(
				users.GetUsers,
				ctx, db, errstream,
			),
		)
		if err != nil {
			return err
		}
	}
	if !disableLocationsJob {
		lastFetch := time.Time{}
		job3, err = s.NewJob(
			gocron.DurationJob(time.Minute*1),
			gocron.NewTask(
				func(ctx context.Context, db *gorm.DB, errstream chan error) {
					if !lastFetch.IsZero() && !clusters.FirstFetchDone {
						return
					}

					previousLastFetch := lastFetch
					lastFetch = time.Now().UTC()
					clusters.GetLocations(previousLastFetch, ctx, db, errstream)
				},
				ctx, db, errstream,
			),
		)
		if err != nil {
			return err
		}
	}
	if !disableProjectsJob {
		job4, err = s.NewJob(
			gocron.DurationJob(time.Hour*4),
			gocron.NewTask(
				projects.GetProjects,
				ctx, db, errstream,
			),
		)
		if err != nil {
			return err
		}
	}
	s.Start()
	if !disableCampusesJob {
		_ = job1.RunNow()
	}
	if !disableUsersJob {
		_ = job2.RunNow()
	}
	if !disableLocationsJob {
		_ = job3.RunNow()
	}
	if !disableProjectsJob {
		_ = job4.RunNow()
	}
	return nil
}
