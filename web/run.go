package web

import (
	"log"
	"net/http"

	"github.com/a-h/templ"
	"gorm.io/gorm"
)

const (
	UsersPerPage = 50
)

func Run(db *gorm.DB) {
	http.Handle("/leaderboard", handleLeaderboard(db))
	http.Handle("/blackhole", templ.Handler(blackhole()))
	http.Handle("/blackhole.json", blackholeMap(db))

	http.Handle("/static/", handleStatic())

	log.Fatal(http.ListenAndServe(":8080", nil))
}
