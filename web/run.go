package web

import (
	"context"
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

func withUrl(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "url", r.URL.Path)
		handler.ServeHTTP(w, r.WithContext(ctx))
	})
}

func Run(db *gorm.DB) {
	http.Handle("/", withUrl(handleIndex(db)))
	http.Handle("/leaderboard", withUrl(loggedInUsersOnly(handleLeaderboard(db))))
	http.Handle("/peerfinder", withUrl(loggedInUsersOnly(handlePeerFinder(db))))
	http.Handle("/calculator", withUrl(loggedInUsersOnly(handleCalculator(db))))
	http.Handle("/blackhole", withUrl(loggedInUsersOnly(templ.Handler(templates.Blackhole()))))
	http.Handle("/blackhole.json", withUrl(loggedInUsersOnly(blackholeMap(db))))
	http.Handle("/clusters", withUrl(loggedInUsersOnly(handleClusters())))
	http.Handle("/clusters.live", withUrl(loggedInUsersOnly(clustersWs(db))))

	http.Handle("/static/", handleStatic())

	log.Fatal(http.ListenAndServe(":8080", nil))
}
