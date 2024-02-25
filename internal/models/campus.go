package models

import (
	"gorm.io/gorm"
)

type Campus struct {
	gorm.Model
	ID   int    `json:"id"`
	Name string `json:"name"`
}
