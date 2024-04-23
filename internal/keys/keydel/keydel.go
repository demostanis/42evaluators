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

	db, err := database.OpenDB()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error opening database:", err)
		return
	}
	phyDB, _ := db.DB()
	defer phyDB.Close()

	api.DefaultKeysManager, err = api.NewKeysManager(db)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error creating a key manager:", err)
		return
	}
	err = api.DefaultKeysManager.DeleteAllKeys()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error deleting API keys:", err)
	}
}
