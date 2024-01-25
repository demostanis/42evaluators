package models

import (
	"gorm.io/gorm"
)

type Title struct {
	gorm.Model
	ID   int    `json:"id"`
	Name string `json:"name"`
}

var DefaultTitle = Title{
	ID:   -1,
	Name: "%login",
}
