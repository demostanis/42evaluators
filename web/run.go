package web

import (
	"context"
	"log"
	"net/http"

	"github.com/demostanis/42evaluators/web/templates"

	"gorm.io/gorm"
)

const UsersPerPage = 50

func loggedInUsersOnly(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if getLoggedInUser(r) == nil {
			http.Redirect(w, r, "/?needslogin=1", http.StatusSeeOther)
			return
		}
		handler.ServeHTTP(w, r)
	})
}

func withURL(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), templates.UrlCtxKey, r.URL.Path)
		handler.ServeHTTP(w, r.WithContext(ctx))
	})
}

func Run(db *gorm.DB) {
	http.Handle("/", withURL(handleIndex(db)))
	http.Handle("/leaderboard", withURL(loggedInUsersOnly(handleLeaderboard(db))))
	http.Handle("/peerfinder", withURL(loggedInUsersOnly(handlePeerFinder(db))))
	http.Handle("/calculator", withURL(loggedInUsersOnly(handleCalculator(db))))
	http.Handle("/blackhole", withURL(loggedInUsersOnly(handleBlackhole(db))))
	http.Handle("/blackhole.json", withURL(loggedInUsersOnly(blackholeMap(db))))
	http.Handle("/clusters", withURL(loggedInUsersOnly(handleClusters())))
	http.Handle("/clusters.live", withURL(loggedInUsersOnly(clustersWs(db))))

	http.Handle("/static/", handleStatic())

	log.Fatal(http.ListenAndServe(":8080", nil))
}
