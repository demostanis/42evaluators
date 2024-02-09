package main

import (
	"log"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/database/config"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	db, err := config.OpenDb(config.Development)
	if err != nil {
		log.Fatal(err)
	}

	session, err := api.NewSession(db)
	if err != nil {
		log.Fatal(err)
	}

	_ = session.DeleteAllApplications()
}
