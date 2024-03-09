package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/campus"
	"github.com/demostanis/42evaluators/internal/clusters"
	"github.com/demostanis/42evaluators/internal/database/config"
	"github.com/demostanis/42evaluators/internal/database/repositories"
	"github.com/demostanis/42evaluators/internal/users"
	"github.com/joho/godotenv"
	"gorm.io/gorm"

	"github.com/demostanis/42evaluators/web"
	"github.com/go-co-op/gocron/v2"
)

func reportErrors(errstream chan error) {
	// TODO: perform error reporting on e.g. Sentry
	for {
		err := <-errstream
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
		}
	}
}

func setupCron(ctx context.Context, db *gorm.DB, errstream chan error) error {
	s, err := gocron.NewScheduler()
	if err != nil {
		return err
	}
	job1, err := s.NewJob(
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
	job2, err := s.NewJob(
		gocron.DurationJob(time.Hour*6),
		gocron.NewTask(
			users.GetUsers,
			ctx, db, errstream,
		),
	)
	if err != nil {
		return err
	}
	lastFetch := time.Time{}
	job3, err := s.NewJob(
		gocron.DurationJob(time.Minute*1),
		gocron.NewTask(
			func(ctx context.Context, db *gorm.DB, errstream chan error) {
				clusters.GetLocations(lastFetch, ctx, db, errstream)
				lastFetch = time.Now().UTC()
			},
			ctx, db, errstream,
		),
	)
	if err != nil {
		return err
	}
	s.Start()
	// Get campuses
	_ = job1.RunNow()
	// Get users
	//_ = job2.RunNow()
	_ = job2
	// Get locations
	_ = job3.RunNow()
	return nil
}

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Fprintln(os.Stderr, "error loading .env:", err)
		return
	}

	db, err := config.OpenDb(config.Development)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error opening database:", err)
		return
	}

	go web.Run(db)

	repo := repositories.NewApiKeysRepository(db)

	keys, err := repo.GetAllApiKeys()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error querying API keys:", err)
		return
	}
	err = api.InitClients(keys)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error initializing clients:", err)
		return
	}

	// Makes everything easier
	db.Exec("DELETE FROM locations")

	ctx := context.Background()
	errstream := make(chan error)

	err = setupCron(ctx, db, errstream)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error setting up cron jobs:", err)
		return
	}

	go reportErrors(errstream)

	select {}
}
