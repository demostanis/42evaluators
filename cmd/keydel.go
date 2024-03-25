package main

import (
	"fmt"
	"os"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/database"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Fprintln(os.Stderr, "error loading .env:", err)
		return
	}

	db, err := database.OpenDb()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error opening database:", err)
		return
	}

	session, err := api.NewSession(db)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error creating API session:", err)
		return
	}

	err = session.DeleteAllApplications()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error deleting applications:", err)
		return
	}
}
