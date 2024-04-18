package models

type ApiKey struct {
	Name        string
	AppID       int
	UID         string
	Secret      string
	RedirectUri string
}
