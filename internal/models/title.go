package models

type Title struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

var DefaultTitle = Title{
	ID:   -1,
	Name: "%login",
}
