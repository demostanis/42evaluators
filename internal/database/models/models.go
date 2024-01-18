package models

import (
	"gorm.io/gorm"
)

type ApiKeyModel struct {
	gorm.Model
	Name   string `gorm:"column:Name"`
	AppID  string `gorm:"column:AppID"`
	UID    string `gorm:"column:UID"`
	Secret string `gorm:"column:Secret"`
}
