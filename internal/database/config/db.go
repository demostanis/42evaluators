package config

import (
	"github.com/demostanis/42evaluators/internal/database/models"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DBConfig interface {
	GetDB() *gorm.DB
}

type DB struct {
	DB *gorm.DB
}

func New(dialector gorm.Dialector) (*DB, error) {
	conn, err := gorm.Open(dialector, &gorm.Config{
		// TODO: remove
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, err
	}
	phyDb, _ := conn.DB()
	phyDb.SetMaxOpenConns(1)

	if err = conn.AutoMigrate(models.ApiKeyModel{}); err != nil {
		return nil, err
	}
	if err = conn.AutoMigrate(models.User{}); err != nil {
		return nil, err
	}
	if err = conn.AutoMigrate(models.Coalition{}); err != nil {
		return nil, err
	}
	if err = conn.AutoMigrate(models.Title{}); err != nil {
		return nil, err
	}
	//	mitigateErrors(AutoMigrateModel[any](conn, models.ApiKeyModel))

	return &DB{DB: conn}, nil
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
