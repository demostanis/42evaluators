package models

import (
	"gorm.io/gorm"
)

type Coalition struct {
	gorm.Model
	ID       int    `json:"id"`
	Name     string `json:"name"`
	CoverUrl string `json:"cover_url"`
}
