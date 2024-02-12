package config

import (
	"errors"
	"fmt"
	"os"

	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DatabaseType int

const (
	Production DatabaseType = iota
	Development
)

func newDb(dialector gorm.Dialector) (*gorm.DB, error) {
	db, err := gorm.Open(dialector, &gorm.Config{
		// TODO: remove
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, err
	}

	// Used to mitigate "database is locked" errors
	phyDb, _ := db.DB()
	phyDb.SetMaxOpenConns(1)

	if err = db.AutoMigrate(models.ApiKey{}); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(models.User{}); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(models.Coalition{}); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(models.Title{}); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(models.Location{}); err != nil {
		return nil, err
	}

	return db, nil
}

func OpenDb(databaseType DatabaseType) (*gorm.DB, error) {
	if databaseType == Production {
		psqlUsername, ok := os.LookupEnv("PSQL_USERNAME")
		if !ok {
			return nil, errors.New("no PSQL_USERNAME found in .env")
		}

		psqlPassword, ok := os.LookupEnv("PSQL_PASSWORD")
		if !ok {
			return nil, errors.New("no PSQL_PASSWORD found in .env")
		}

		psqlPort, ok := os.LookupEnv("PSQL_PORT")
		if !ok {
			return nil, errors.New("no PSQL_PORT found in .env")
		}

		psqlDbName, ok := os.LookupEnv("PSQL_DB_NAME")
		if !ok {
			return nil, errors.New("no PSQL_DB_NAME found in .env")
		}

		return newDb(postgres.Open(fmt.Sprintf("postgres://%s:%s@localhost:%s/%s",
			psqlUsername,
			psqlPassword,
			psqlPort,
			psqlDbName,
		)))
	} else {
		return newDb(sqlite.Open("db/42evaluators-dev.sqlite3"))
	}
}
