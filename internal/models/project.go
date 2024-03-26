package models

import (
	"gorm.io/gorm"
)

type TeamUser struct {
	TeamID int  `gorm:"primaryKey"`
	UserID int  `gorm:"primaryKey" json:"id"`
	Leader bool `json:"leader"`
	User   User
}

type Team struct {
	// this musn't be a gorm.Model, because GORM is so
	// fucking drunk and will put two ids in INSERT statements,
	// making the DB complain that there are two fucking ids.
	ID        int        `json:"id"`
	Name      string     `json:"name"`
	Users     []TeamUser `json:"users"`
	ProjectID int
}

type Subject struct {
	gorm.Model
	ID   int    `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Project struct {
	gorm.Model
	ID        int    `json:"id"`
	CursusIds []int  `gorm:"-" json:"cursus_ids"`
	FinalMark int    `json:"final_mark"`
	Status    string `json:"status"`
	Teams     []Team `gorm:"foreignKey:ProjectID" json:"teams"`
	Page      int

	SubjectID int     `gorm:"default:null"`
	Subject   Subject `json:"project"`
}
