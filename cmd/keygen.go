package main

import (
	"github.com/demostanis/42evaluators/bot"
	"github.com/demostanis/42evaluators/internal/database/config"
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
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
		log.Fatalf("usage: %s key_count\n", os.Args[0]);
	}
	i, err := strconv.Atoi(os.Args[1]);
	if err != nil {
		log.Fatal("invalid key_count");
	}

	if err = bot.Run(i, db); err != nil {
		log.Fatal(err)
	}
}
