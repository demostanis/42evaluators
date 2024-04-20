package main

import (
	"context"
	"fmt"
	"os"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/database"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/internal/projects"
	"github.com/joho/godotenv"

	"github.com/demostanis/42evaluators/web"
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

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error loading .env:", err)
		return
	}

	err = web.OpenClustersData()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error opening clusters data:", err)
		return
	}

	err = projects.OpenProjectData()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error opening projects data:", err)
		return
	}

	// TODO: go:embed maybe?
	err = projects.OpenXPData()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error opening xp data:", err)
		return
	}

	db, err := database.OpenDB()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error opening database:", err)
		return
	}
	phyDB, _ := db.DB()
	defer phyDB.Close()

	go web.Run(db)

	var keys []models.APIKey
	err = db.Model(&models.APIKey{}).Find(&keys).Error
	if err != nil {
		fmt.Fprintln(os.Stderr, "error querying API keys:", err)
		return
	}
	if len(keys) == 0 {
		fmt.Fprintln(os.Stderr, "no api keys available, please generate some with cmd/keygen.go")
		return
	}
	err = api.InitClients(keys)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error initializing clients:", err)
		return
	}

	ctx := context.Background()
	errstream := make(chan error)

	err = setupCron(ctx, db, errstream)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error setting up cron jobs:", err)
		return
	}

	reportErrors(errstream)
}
