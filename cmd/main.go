package main

import (
	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/database/config"
	"github.com/demostanis/42evaluators/internal/database/repositories"

	//"github.com/demostanis/42evaluators/internal/users"
	"log"

	"github.com/demostanis/42evaluators/web"
)

func main() {
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

	//users.GetUsers(db)

	web.Run(db)
}
