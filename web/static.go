package web

import (
	"net/http"
	"strings"
)

func intercept(serv http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			http.NotFound(w, r)
		} else {
			serv.ServeHTTP(w, r)
		}
	})
}

func handleStatic() http.Handler {
	serv := http.FileServer(http.Dir("web/static"))
	return http.StripPrefix("/static/", intercept(serv))
}
