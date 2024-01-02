package main

import (
	"fmt"
	"os"
	"strconv"

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

	if len(os.Args) != 2 {
		fmt.Fprintln(os.Stderr, "usage: ./keygen <key count>")
		return
	}
	i, err := strconv.Atoi(os.Args[1])
	if err != nil || i <= 0 {
		fmt.Fprintln(os.Stderr, "invalid key count")
		return
	}

	if err = api.GetKeys(i, db); err != nil {
		fmt.Fprintln(os.Stderr, "failed to generate keys:", err)
		return
	}
}
