package main

import (
	"context"
	"fmt"
	"os"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/cable"
	"github.com/demostanis/42evaluators/internal/campus"
	"github.com/demostanis/42evaluators/internal/clusters"
	"github.com/demostanis/42evaluators/internal/database/config"
	"github.com/demostanis/42evaluators/internal/database/repositories"
	"github.com/demostanis/42evaluators/internal/users"
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
	if err := godotenv.Load(); err != nil {
		fmt.Fprintln(os.Stderr, "godotenv.Load():", err)
		return
	}

	db, err := config.OpenDb(config.Development)
	if err != nil {
		fmt.Fprintln(os.Stderr, "OpenDb():", err)
		return
	}

	repo := repositories.NewApiKeysRepository(db)

	keys, err := repo.GetAllApiKeys()
	if err != nil {
		fmt.Fprintln(os.Stderr, "GetAllApiKeys():", err)
		return
	}
	err = api.InitClients(keys)
	if err != nil {
		fmt.Fprintln(os.Stderr, "InitClients():", err)
		return
	}

	ctx := context.Background()
	errstream := make(chan error)

	go campus.GetCampuses(db, errstream)
	go users.GetUsers(ctx, db, errstream)
	go clusters.GetLocations(ctx, db, errstream)
	go cable.ConnectToCable()

	go reportErrors(errstream)

	web.Run(db)
}
