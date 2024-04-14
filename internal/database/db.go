package database

import (
	"errors"
	"os"

	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/driver/mysql"
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
	if err = db.Exec(`CREATE VIRTUAL TABLE IF NOT EXISTS user_search
						USING fts5(user_id, display_name,
							tokenize="trigram remove_diacritics 1");
						`).Error; err != nil {
		return nil, err
	}
	return db, nil
}

func openDbWithType(databaseType DatabaseType) (*gorm.DB, error) {
	if databaseType == Production {
		tidbDsn, ok := os.LookupEnv("TIDB_DSN")
		if !ok {
			return nil, errors.New("no TIDB_DSN found in .env")
		}
		db, err := newDb(mysql.Open(tidbDsn + "?parseTime=True"))
		if err != nil {
			return nil, err
		}
		db.Exec("SET SESSION sql_mode=''")
		return db, err
	} else {
		return newDb(sqlite.Open("db/42evaluators-dev.sqlite3"))
	}
}

func OpenDb() (*gorm.DB, error) {
	dbType := Development
	isProd := os.Getenv("PRODUCTION")
	if isProd != "" {
		dbType = Production
	}
	return openDbWithType(dbType)
}
