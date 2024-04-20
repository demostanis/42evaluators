package models

type Location struct {
	ID       int    `json:"id"`
	UserID   int    `json:"user_id"`
	Login    string `json:"login"`
	Host     string `json:"host"`
	CampusID int    `json:"campus_id"`
	EndAt    string `json:"end_at"`
	Image    string
}
