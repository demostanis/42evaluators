package database

import (
	"fmt"
	"time"

	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

const (
	PromoFormat = "01/2006"
)

func WithCampus(campusId string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if campusId != "" {
			return db.Where("campus_id = ?", campusId)
		}
		return db
	}
}

func OnlyRealUsers() func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("is_staff = false AND is_test = false AND login != ''")
	}
}

func WithPromo(promo string) func(db *gorm.DB) *gorm.DB {
	promoBeginAt, err := time.Parse(PromoFormat, promo)

	return func(db *gorm.DB) *gorm.DB {
		if err == nil {
			return db.
				Model(&models.User{}).
				Where("begin_at LIKE ?", fmt.Sprintf("%d-%02d-%%",
					promoBeginAt.Year(), promoBeginAt.Month())).
				Scopes(OnlyRealUsers())
		}
		return db
	}
}
