package models

import (
	"encoding/json"
	"errors"
	"math"
	"time"

	"gorm.io/gorm"
)

const (
	DefaultImageLink      = "https://cdn.intra.42.fr/users/ec0e0f87fa56b0b3e872b800e120dc0b/sheldon.jpeg"
	DefaultImageLinkSmall = "https://cdn.intra.42.fr/users/a58fb999e453e72955ab3d926d5cf872/small_sheldon.jpeg"
	DateFormat            = time.RFC3339
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
		CorrectionPoints int `json:"correction_point"`
		Wallets          int `json:"wallet"`
	} `json:"user"`
	Level        float64 `json:"level"`
	BlackholedAt string  `json:"blackholed_at"`
	BeginAt      string  `json:"begin_at"`
}

type User struct {
	ID               int
	Login            string
	DisplayName      string
	IsStaff          bool
	BlackholedAt     time.Time
	BeginAt          time.Time
	CorrectionPoints int
	Wallets          int

	ImageLink      string
	ImageLinkSmall string
	IsTest         bool
	Level          float64
	WeeklyLogtime  time.Duration

	CoalitionID int
	Coalition   Coalition
	TitleID     int
	Title       Title
	CampusID    int
	Campus      Campus
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
	user.BlackholedAt, _ = time.Parse(DateFormat, cursusUser.BlackholedAt)
	user.CorrectionPoints = cursusUser.User.CorrectionPoints
	user.BeginAt, _ = time.Parse(DateFormat, cursusUser.BeginAt)
	user.Wallets = cursusUser.User.Wallets

	user.ImageLinkSmall = cursusUser.User.Image.Versions.Small
	if user.ImageLinkSmall == "" {
		user.ImageLinkSmall = DefaultImageLinkSmall
	}

	user.Level = math.Round(cursusUser.Level*100) / 100
	user.ImageLink = cursusUser.User.Image.Link
	if user.ImageLink == "" {
		user.ImageLink = DefaultImageLink
	}

	return nil
}

func (user *User) CreateIfNeeded(db *gorm.DB) error {
	if user.ID == 0 {
		return errors.New("user may not have ID 0")
	}

	err := db.
		Session(&gorm.Session{}).
		Model(&User{}).
		Where("id = ?", user.ID).
		First(nil).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return db.Create(&user).Error
	}
	return nil
}

func (user *User) UpdateFields(db *gorm.DB) error {
	return db.
		Where("id = ?", user.ID).
		Model(&User{}).Updates(map[string]any{
		"ID":               user.ID,
		"Login":            user.Login,
		"DisplayName":      user.DisplayName,
		"IsStaff":          user.IsStaff,
		"BlackholedAt":     user.BlackholedAt,
		"CorrectionPoints": user.CorrectionPoints,
		"ImageLink":        user.ImageLink,
		"ImageLinkSmall":   user.ImageLinkSmall,
		"Level":            user.Level,
		"BeginAt":          user.BeginAt,
		"Wallets":          user.Wallets,
	}).Error
}

func (user *User) YesItsATestAccount(db *gorm.DB) error {
	user.IsTest = true
	return db.Model(&User{}).
		Where("id = ?", user.ID).
		Updates(map[string]any{
			"IsTest": true,
		}).Error
}

func (user *User) SetCampus(campusID int, db *gorm.DB) error {
	var campus Campus
	err := db.Model(&Campus{}).
		Where("id = ?", campusID).
		First(&campus).Error
	if err != nil {
		return err
	}

	defer func() {
		// If this is done before the query below, GORM
		// will generate invalid SQL...
		user.Campus = campus
	}()
	return db.Model(&user).
		Where("id = ?", user.ID).
		Updates(map[string]any{
			"CampusID": campusID,
		}).Error
}

func (user *User) SetCoalition(coalition Coalition, db *gorm.DB) error {
	user.Coalition = coalition
	return db.Model(&User{}).
		Where("id = ?", user.ID).
		Updates(map[string]any{
			"CoalitionID": coalition.ID,
		}).Error
}

func (user *User) SetTitle(title Title, db *gorm.DB) error {
	user.Title = title
	return db.Model(&User{}).
		Where("id = ?", user.ID).
		Updates(map[string]any{
			"TitleID": title.ID,
		}).Error
}

func (user *User) SetWeeklyLogtime(logtime time.Duration, db *gorm.DB) error {
	user.WeeklyLogtime = logtime
	return db.Model(&User{}).
		Where("id = ?", user.ID).
		Updates(map[string]any{
			"WeeklyLogtime": logtime,
		}).Error
}
