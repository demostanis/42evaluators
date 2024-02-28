package main

import (
	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/cable"
	"github.com/demostanis/42evaluators/internal/campus"
	"github.com/demostanis/42evaluators/internal/database/config"
	"github.com/demostanis/42evaluators/internal/database/repositories"
	"github.com/joho/godotenv"

	"log"

	"github.com/demostanis/42evaluators/web"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	db, err := config.OpenDb(config.Development)
	if err != nil {
		log.Fatal(err)
	}

	repo := repositories.NewApiKeysRepository(db)

	keys, err := repo.GetAllApiKeys()
	if err != nil {
		log.Fatal(err)
	}
	err = api.InitClients(keys)
	if err != nil {
		log.Fatal(err)
	}

	campus.GetCampuses(db)
	//go users.GetUsers(context.Background(), db)
	//clusters.GetLocations(db)
	go cable.ConnectToCable()

	web.Run(db)
}
