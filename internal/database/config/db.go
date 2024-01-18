package config

import (
	"github.com/demostanis/42evaluators2.0/internal/database/models"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type DBConfig interface {
	GetDB() *gorm.DB
}

type DB struct {
	DB *gorm.DB
}

func New(dsn string) (*DB, error) {
	conn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err = conn.AutoMigrate(models.ApiKeyModel{}); err != nil {
		return nil, err
	}
	//	mitigateErrors(AutoMigrateModel[any](conn, models.ApiKeyModel))

	return &DB{DB: conn}, nil
}

func NewTestEnv(dbPath string) (*DB, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return &DB{DB: db}, nil
}

//laisser les func en bas je vais voir si y'a vraiment une utilité ou non, ça dépendra du nombre de tables

// AutoMigrateModel checks if a table is present in a database and creates it if not.
func AutoMigrateModel[T any](db *gorm.DB, models []T) []error {
	errors := make([]error, len(models))
	for _, model := range models {
		if err := db.AutoMigrate(model); err != nil {
			errors = append(errors, err)
		}
	}
	return errors
}

func mitigateErrors(errors []error) bool {
	for _, err := range errors {
		if err != nil {
			return true
		}
	}
	return false
}
