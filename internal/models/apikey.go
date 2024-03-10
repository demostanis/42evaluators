package models

import (
	"gorm.io/gorm"
)

type ApiKey struct {
	gorm.Model
	Name        string
	AppID       int
	UID         string
	Secret      string
	RedirectUri string
}
