package users

import (
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

func setCampus(user models.User, campusId int, db *gorm.DB) error {
	return db.Model(&user).Updates(models.User{
		CampusID: campusId,
	}).Error
}
