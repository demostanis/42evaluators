package database

import (
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/driver/postgres"
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
		DisableForeignKeyConstraintWhenMigrating: true,
		// TODO: remove
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, err
	}

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
	if err = db.AutoMigrate(models.Campus{}); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(models.Subject{}); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(models.TeamUser{}); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(models.Team{}); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(models.Project{}); err != nil {
		return nil, err
	}
	if err = db.Exec("CREATE EXTENSION IF NOT EXISTS pg_trgm").Error; err != nil {
		return nil, err
	}
	return db, nil
}

func OpenDb() (*gorm.DB, error) {
	return newDb(postgres.Open("host=localhost"))
}
