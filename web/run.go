package web

import (
	"log"
	"net/http"

	"github.com/a-h/templ"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

const (
	UsersPerPage = 50
)

func Run(db *gorm.DB) {
	http.Handle("/", handleIndex(db))
	http.Handle("/leaderboard", handleLeaderboard(db))
	http.Handle("/blackhole", templ.Handler(templates.Blackhole()))
	http.Handle("/blackhole.json", blackholeMap(db))
	http.Handle("/clusters", handleClusters())
	http.Handle("/clusters.live", clustersWs(db))

	http.Handle("/static/", handleStatic())

	log.Fatal(http.ListenAndServe(":8080", nil))
}
