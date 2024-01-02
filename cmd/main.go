package main

import (
	"context"
	"fmt"
	"os"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/database"
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

	api.DefaultKeysManager, err = api.NewKeysManager(db)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error creating a key manager:", err)
		return
	}
	keys, err := api.DefaultKeysManager.GetKeys()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error getting API keys:", err)
		return
	}

	err = api.InitClients(keys)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error initializing clients:", err)
		return
	}

	ctx := context.Background()
	errstream := make(chan error)

<<<<<<< HEAD
<<<<<<< HEAD
	go campus.GetCampuses(db, errstream)
<<<<<<< HEAD
	//go users.GetUsers(ctx, db, errstream)
	go clusters.GetLocations(ctx, db, errstream)
	go cable.ConnectToCable(errstream)
=======
	go users.GetUsers(ctx, db, errstream)
	go clusters.GetLocations(ctx, db, errstream)
	go cable.ConnectToCable()
>>>>>>> 583b5ba (split paging logic)
=======
	//go campus.GetCampuses(db, errstream)
	//go users.GetUsers(ctx, db, errstream)
	//go clusters.GetLocations(ctx, db, errstream)
<<<<<<< HEAD
	//go cable.ConnectToCable()
>>>>>>> eacf222 (add navbar and filtering options to leaderboard)
=======
	//go cable.ConnectToCable(errstream)
>>>>>>> 792a930 (replace for with select to calm down the boeing in my computer)
=======
	err = setupCron(ctx, db, errstream)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error setting up cron jobs:", err)
		return
	}
>>>>>>> 2cfbbc3 (setup cron jobs)

	reportErrors(errstream)
}
