package models

type APIKey struct {
	ID          int
	Name        string
	AppID       int
	UID         string
	Secret      string
	RedirectURI string
}
