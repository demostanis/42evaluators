package models

import (
	"encoding/json"
	"math"
	"time"

	"gorm.io/gorm"
)

const (
	DefaultImageLink      = "https://cdn.intra.42.fr/users/ec0e0f87fa56b0b3e872b800e120dc0b/sheldon.jpeg"
	DefaultImageLinkSmall = "https://cdn.intra.42.fr/users/a58fb999e453e72955ab3d926d5cf872/small_sheldon.jpeg"
	BlackholeFormat       = time.RFC3339
)

type CursusUser struct {
	// We cannot use our User struct since that would
	// recurse indefinitely (CursusUser->User->CursusUser->User->...)
	// because of our custom UnmarshalJSON below
	User struct {
		ID          int    `json:"id"`
		Login       string `json:"login"`
		DisplayName string `json:"displayname"`
		IsStaff     bool   `json:"staff?"`
		Image       struct {
			Link     string `json:"link"`
			Versions struct {
				Small string `json:"small"`
			} `json:"versions"`
		} `json:"image"`
	} `json:"user"`
	Level        float64 `json:"level"`
	BlackholedAt string  `json:"blackholed_at"`
}

type User struct {
	gorm.Model
	ID           int
	Login        string
	DisplayName  string
	IsStaff      bool
	BlackholedAt time.Time

	ImageLink      string
	ImageLinkSmall string
	IsTest         bool
	Level          float64
	Coalition      Coalition `gorm:"foreignKey:ID"`
	Title          Title     `gorm:"foreignKey:ID"`
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
	user.BlackholedAt, _ = time.Parse(BlackholeFormat, cursusUser.BlackholedAt)

	user.ImageLinkSmall = cursusUser.User.Image.Versions.Small
	if user.ImageLinkSmall == "" {
		user.ImageLinkSmall = DefaultImageLinkSmall
	}

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
