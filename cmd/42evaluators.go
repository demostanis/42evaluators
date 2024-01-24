package main

import (
	"fmt"
	"github.com/demostanis/42evaluators2.0/bot"
	"github.com/demostanis/42evaluators2.0/internal/api"
	"github.com/demostanis/42evaluators2.0/internal/database/config"
	"github.com/demostanis/42evaluators2.0/internal/database/repositories"
	"github.com/demostanis/42evaluators2.0/internal/users"
	"github.com/demostanis/42evaluators2.0/web"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"log"
	"os"
)

type App struct {
	Name      string `json:"name"`
	RateLimit string `json:"rate_limit"`
}

var rootCmd = &cobra.Command{Use: "42evaluators"}

type DatabaseType int

const (
	Production DatabaseType = iota
	Development
)

func openDb(databaseType DatabaseType) (*config.DB, error) {
	if databaseType == Production {
		psqlUsername, ok := os.LookupEnv("PSQL_USERNAME")
		if !ok {
			log.Fatal("no PSQL_USERNAME found in .env")
		}

		psqlPassword, ok := os.LookupEnv("PSQL_PASSWORD")
		if !ok {
			log.Fatal("no PSQL_PASSWORD found in .env")
		}

		psqlPort, ok := os.LookupEnv("PSQL_PORT")
		if !ok {
			log.Fatal("no PSQL_PORT found in .env")
		}

		psqlDbName, ok := os.LookupEnv("PSQL_DB_NAME")
		if !ok {
			log.Fatal("no PSQL_DB_NAME found in .env")
		}

		return config.New(postgres.Open(fmt.Sprintf("postgres://%s:%s@localhost:%s/%s",
			psqlUsername,
			psqlPassword,
			psqlPort,
			psqlDbName,
		)))
	} else {
		return config.New(sqlite.Open("42evaluators-dev.sqlite3"))
	}
}

// tmp func by chayanne
// refactor le code ds une autre func ds un autre dir pr réduire la longueur du main
func tmp() {

	db, err := openDb(Development)
	if err != nil {
		log.Fatal(err)
	}

	repo := repositories.NewApiKeysRepository(db.DB)

	keys, err := repo.GetAllApiKeys()
	if err != nil {
		log.Fatal(err)
	}
	err = api.InitClients(keys)
	if err != nil {
		log.Fatal(err)
	}

	users.GetUsers(db.DB)

	web.Run(db.DB)
}

var keyCount int
var keygenCmd = &cobra.Command{
	Use:   "keygen",
	Short: "Launches a software to generate API keys",
	Run: func(cmd *cobra.Command, args []string) {
		if err := godotenv.Load(); err != nil {
			log.Fatal(err)
		}

		dbConn, err := openDb(Development)
		if err != nil {
			log.Fatal(err)
		}

		if err = bot.Run(keyCount, dbConn); err != nil {
			log.Fatal(err)
		}
	},
}

var keydelCmd = &cobra.Command{
	Use:   "keydel",
	Short: "Launches a software to delete all API keys",
	Run: func(cmd *cobra.Command, args []string) {
		if err := godotenv.Load(); err != nil {
			log.Fatal(err)
		}

		dbConn, err := openDb(Development)
		if err != nil {
			log.Fatal(err)
		}

		session, err := bot.NewSession(dbConn)
		if err != nil {
			log.Fatal(err)
		}

		_ = session.DeleteAllApplications()
	},
}

var prodCmd = &cobra.Command{
	Use:   "prod",
	Short: "Run in production mode",
	Run: func(cmd *cobra.Command, args []string) {
		tmp()
	},
}

// todo à remplir
var testCmd = &cobra.Command{}

func main() {
	rootCmd.AddCommand(keygenCmd)
	rootCmd.AddCommand(keydelCmd)
	rootCmd.AddCommand(prodCmd)
	rootCmd.AddCommand(testCmd)

	keygenCmd.Flags().IntVarP(&keyCount, "count", "c", 1, "Number of API keys to generate")

	if err := rootCmd.Execute(); err != nil {
		log.Fatalf("error running command: %v", err)
	}
}
