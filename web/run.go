package web

import (
	"net/http"
	"github.com/demostanis/42evaluators2.0/internal/database/models"
	"log"
	"gorm.io/gorm"
)

const (
	UsersPerPage = 50
)

func Run(db *gorm.DB) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var users []models.User
		db.
			Limit(UsersPerPage).
			Order("level DESC").
			Where("is_staff = false AND is_test = false").
			Find(&users)

		index(users).Render(r.Context(), w)
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
