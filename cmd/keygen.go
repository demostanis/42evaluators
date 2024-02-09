package main

import (
	"log"
	"os"
	"strconv"

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

	if len(os.Args) != 2 {
		log.Fatalf("usage: %s key_count\n", os.Args[0])
	}
	i, err := strconv.Atoi(os.Args[1])
	if err != nil {
		log.Fatal("invalid key_count")
	}

	if err = api.GetKeys(i, db); err != nil {
		log.Fatal(err)
	}
}
