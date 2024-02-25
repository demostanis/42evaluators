package users

import (
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

func setCampus(user models.User, campusId int, db *gorm.DB) {
	var campus models.Campus

	db.
		Model(&models.Campus{}).
		Where("id = ?", campusId).
		First(&campus)
	db.Model(&user).Updates(models.User{
		CampusID: campus.ID,
	})
}
