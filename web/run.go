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

func loggedInUsersOnly(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if getLoggedInUser(r) == nil {
			http.Redirect(w, r, "/?needslogin=1", http.StatusSeeOther)
			return
		}
		handler.ServeHTTP(w, r)
	})
}

func Run(db *gorm.DB) {
	http.Handle("/", handleIndex(db))
	http.Handle("/leaderboard", loggedInUsersOnly(handleLeaderboard(db)))
	http.Handle("/peerfinder", loggedInUsersOnly(handlePeerFinder(db)))
	http.Handle("/calculator", loggedInUsersOnly(handleCalculator(db)))
	http.Handle("/blackhole", loggedInUsersOnly(templ.Handler(templates.Blackhole())))
	http.Handle("/blackhole.json", loggedInUsersOnly(blackholeMap(db)))
	http.Handle("/clusters", loggedInUsersOnly(handleClusters()))
	http.Handle("/clusters.live", loggedInUsersOnly(clustersWs(db)))

	http.Handle("/static/", handleStatic())

	log.Fatal(http.ListenAndServe(":8080", nil))
}
