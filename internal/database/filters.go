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

func WithCampus(campusID string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if campusID != "" {
			return db.Where("campus_id = ?", campusID)
		}
		return db
	}
}

const OnlyRealUsersCondition = "is_staff = false AND is_test = false AND login != ''"

func OnlyRealUsers() func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where(OnlyRealUsersCondition)
	}
}

func WithPromo(promo string) func(db *gorm.DB) *gorm.DB {
	promoBeginAt, err := time.Parse(PromoFormat, promo)

	return func(db *gorm.DB) *gorm.DB {
		if err == nil {
			return db.
				Model(&models.User{}).
				Where("begin_at::text LIKE ?", fmt.Sprintf("%d-%02d-%%",
					promoBeginAt.Year(), promoBeginAt.Month())).
				Scopes(OnlyRealUsers())
		}
		return db
	}
}

const UnwantedSubjectsCondition = `name NOT LIKE 'Day %' AND
	name NOT LIKE '%DEPRECATED%' AND
	name NOT LIKE 'Rush %'`
