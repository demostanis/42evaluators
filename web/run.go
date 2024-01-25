package web

import (
	"net/http"
	"github.com/demostanis/42evaluators/internal/models"
	"log"
	"strconv"
	"gorm.io/gorm"
)

const (
	UsersPerPage = 50
)

func Run(db *gorm.DB) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		page, err := strconv.Atoi(r.URL.Query().Get("page"))
		if err != nil || page <= 0 {
			page = 1
		}

		var totalPages int64
		db.
			Model(&models.User{}).
			Where("is_staff = false AND is_test = false").
			Count(&totalPages)

		var users []models.User
		offset := (page - 1) * UsersPerPage
		db.
			Preload("Coalition").
			Preload("Title").
			Offset(offset).
			Limit(UsersPerPage).
			Order("level DESC").
			Where("is_staff = false AND is_test = false").
			Find(&users)

		index(users,
			page, totalPages / UsersPerPage,
			offset).Render(r.Context(), w)
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
