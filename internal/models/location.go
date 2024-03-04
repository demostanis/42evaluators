package models

import "gorm.io/gorm"

type Location struct {
	gorm.Model
	ID       int     `json:"id"`
	UserId   int     `json:"user_id"`
	Login    string  `json:"login"`
	Host     string  `json:"host"`
	CampusId int     `json:"campus_id"`
	EndAt    *string `json:"end_at"`
	Image    string
}
