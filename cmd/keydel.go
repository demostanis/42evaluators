package main

import (
	"github.com/demostanis/42evaluators/bot"
	"github.com/demostanis/42evaluators/internal/database/config"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	db, err := config.OpenDb(config.Development)
	if err != nil {
		log.Fatal(err)
	}

	session, err := bot.NewSession(db)
	if err != nil {
		log.Fatal(err)
	}

	_ = session.DeleteAllApplications()
}
