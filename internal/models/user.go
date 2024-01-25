package models

import (
	"encoding/json"
	"gorm.io/gorm"
	"math"
	"time"
)

const (
	DefaultImageLink = "https://cdn.intra.42.fr/users/ec0e0f87fa56b0b3e872b800e120dc0b/sheldon.jpeg"
)

type CursusUser struct {
	// We cannot use our User struct since that would
	// recurse indefinitely (CursusUser->User->CursusUser->User->...)
	// because of our custom UnmarshalJSON below
	User struct {
		ID           int       `json:"id"`
		Login        string    `json:"login"`
		DisplayName  string    `json:"displayname"`
		IsStaff      bool      `json:"staff?"`
		BlackholedAt time.Time `json:"blackholed_at"`
		Image        struct {
			Link string `json:"link"`
		} `json:"image"`
	} `json:"user"`
	Level        float64   `json:"level"`
	BlackholedAt time.Time `json:"blackholed_at"`
}

type User struct {
	gorm.Model
	ID           int       `json:"id"`
	Login        string    `json:"login"`
	DisplayName  string    `json:"displayname"`
	IsStaff      bool      `json:"staff?"`
	BlackholedAt time.Time `json:"blackholed_at"`
	Image        struct {
		// TODO: use small image
		Link string `json:"link"`
	} `json:"image" gorm:"-"`

	ImageLink string
	IsTest    bool
	Level     float64
	Coalition Coalition `gorm:"foreignKey:ID"`
	Title     Title     `gorm:"foreignKey:ID"`
}

func (user *User) UnmarshalJSON(data []byte) error {
	var cursusUser CursusUser

	if err := json.Unmarshal(data, &cursusUser); err != nil {
		return err
	}

	user.ID = cursusUser.User.ID
	user.Login = cursusUser.User.Login
	user.DisplayName = cursusUser.User.DisplayName
	user.IsStaff = cursusUser.User.IsStaff
	user.BlackholedAt = cursusUser.User.BlackholedAt

	user.Level = math.Round(cursusUser.Level*100) / 100
	user.ImageLink = cursusUser.User.Image.Link
	if user.ImageLink == "" {
		user.ImageLink = DefaultImageLink
	}
	if user.Title.Name == "" {
		user.Title = DefaultTitle
	}

	return nil
}