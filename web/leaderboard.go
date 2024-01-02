package web

import (
	"fmt"
	"net/http"
	"slices"
	"strconv"
	"strings"

	"github.com/demostanis/42evaluators/internal/database"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/web/templates"
	"gorm.io/gorm"
)

// Processes the user's ?fields= URL param by splitting it
// on commas and returning a map of valid (according to
// templates.ToggleableFields) templates.Fields.
func getShownFields(wantedFieldsRaw string) map[string]templates.Field {
	shownFields := make(map[string]templates.Field)

	wantedFields := []string{"level", "campus"}
	if wantedFieldsRaw != "" {
		wantedFields = strings.Split(wantedFieldsRaw, ",")
	}

	for _, field := range templates.ToggleableFields {
		found := false
		for _, allowedField := range wantedFields {
			if field.Name == allowedField {
				found = true
			}
		}
		shownFields[field.Name] = templates.Field{
			Name:       field.Name,
			PrettyName: field.PrettyName,
			Sortable:   field.Sortable,
			Checked:    found,
		}
	}

	return shownFields
}

func canSortOn(field string) bool {
	for _, toggleableField := range templates.ToggleableFields {
		if toggleableField.Name == field && toggleableField.Sortable {
			return true
		}
	}
	return false
}

func getPromosForCampus(
	db *gorm.DB,
	campus string,
	promo string,
) ([]templates.Promo, error) {
	var promos []templates.Promo

	var campusUsers []models.User
	err := db.
		Scopes(database.WithCampus(campus)).
		Scopes(database.OnlyRealUsers()).
		Find(&campusUsers).Error
	if err != nil {
		return promos, err
	}

	for _, user := range campusUsers {
		userPromo := fmt.Sprintf("%02d/%d",
			user.BeginAt.Month(),
			user.BeginAt.Year())

		shouldAdd := true
		for _, alreadyAddedPromo := range promos {
			if userPromo == alreadyAddedPromo.Name {
				shouldAdd = false
				break
			}
		}
		if shouldAdd {
			promos = append(promos, templates.Promo{
				Name:   userPromo,
				Active: promo == userPromo,
			})
		}
	}

	slices.SortFunc(promos, func(a, b templates.Promo) int {
		parseDate := func(promo templates.Promo) (int, int) {
			parts := strings.Split(promo.Name, "/")
			month, _ := strconv.Atoi(parts[0])
			year, _ := strconv.Atoi(parts[1])
			return month, year
		}
		monthA, yearA := parseDate(a)
		monthB, yearB := parseDate(b)

		return (monthB | yearB<<5) - (monthA | yearA<<5)
	})

	return promos, nil
}

func getAllCampuses(db *gorm.DB) ([]models.Campus, error) {
	var campuses []models.Campus
	err := db.Find(&campuses).Error
	return campuses, err
}

func internalServerError(w http.ResponseWriter, err error) {
	// TODO: stream this to errstream
	w.WriteHeader(http.StatusInternalServerError)
	_, _ = w.Write([]byte(fmt.Sprintf("an error occured: %v", err)))
}

func handleLeaderboard(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		page, err := strconv.Atoi(r.URL.Query().Get("page"))
		if err != nil || page <= 0 {
			page = 1
		}

		sorting := r.URL.Query().Get("sort")
		if sorting == "" || !canSortOn(sorting) {
			sorting = "level"
		}

		promo := r.URL.Query().Get("promo")
		campus := r.URL.Query().Get("campus")
		showMyself := r.URL.Query().Get("me") != ""
		shownFields := getShownFields(r.URL.Query().Get("fields"))
		search := r.URL.Query().Get("search")

		campuses, err := getAllCampuses(db)
		if err != nil {
			internalServerError(w, fmt.Errorf("could not fetch campuses: %w", err))
			return
		}

		promos, err := getPromosForCampus(db, campus, promo)
		if err != nil {
			internalServerError(w, fmt.Errorf("could not list promos: %w", err))
			return
		}

		withSearch := func(search string) func(db *gorm.DB) *gorm.DB {
			return func(db *gorm.DB) *gorm.DB {
				if search == "" {
					return db
				}
				return db.
					Joins("FULL OUTER JOIN titles ON titles.id = title_id").
					Where(`login % ? OR display_name % ? OR titles.name % ?`,
						search, search, search)
			}
		}

		var users []models.User

		var totalUsers int64
		err = db.
			Model(&models.User{}).
			Scopes(database.OnlyRealUsers()).
			Scopes(database.WithCampus(campus)).
			Scopes(database.WithPromo(promo)).
			Scopes(withSearch(search)).
			Count(&totalUsers).Error
		if err != nil {
			internalServerError(w, fmt.Errorf("could not get user count: %w", err))
			return
		}
		totalPages := 1 + (int(totalUsers)-1)/UsersPerPage
		page = min(page, totalPages)
		offset := (page - 1) * UsersPerPage

		var user models.User
		id := getLoggedInUser(r).them.ID
		err = db.
			Preload("Campus").
			Where("id = ?", id).
			First(&user).Error
		if err != nil {
			internalServerError(w, fmt.Errorf("user is not in db: %d: %w", id, err))
			return
		}

		if showMyself && search == "" {
			var myPosition int64

			// We create a SQL query abusing .Select, specifying
			// a ROW_NUMBER() statement instead of fields,
			// to then insert it as a table in the next query,
			// while hiding erroneous GORM-generated stuff with
			// a self-SQL-injection using Where()
			sql := db.ToSQL(func(db *gorm.DB) *gorm.DB {
				return db.
					Model(&models.User{}).
					Select(fmt.Sprintf(
						`*, ROW_NUMBER() OVER (ORDER BY %s DESC) pos`,
						sorting)).
					Scopes(database.OnlyRealUsers()).
					Scopes(database.WithCampus(campus)).
					Scopes(database.WithPromo(promo)).
					Find(nil)
			})
			err = db.
				Model(&models.User{}).
				Table(fmt.Sprintf(`(%s) boobs`, sql)).
				Where("id = ?", user.ID).
				Where("1=1 --"). // That's hideous lmfao
				Select("pos").
				Scan(&myPosition).Error
			if err != nil {
				internalServerError(w, fmt.Errorf("failed to find user in db: %w", err))
				return
			}

			offset = int(myPosition-1) - (int(myPosition-1) % UsersPerPage)
			page = 1 + offset/UsersPerPage
		}

		err = db.
			Preload("Coalition").
			Preload("Title").
			Preload("Campus").
			Offset(offset).
			Limit(UsersPerPage).
			Order(sorting + " DESC").
			Scopes(database.OnlyRealUsers()).
			Scopes(database.WithCampus(campus)).
			Scopes(database.WithPromo(promo)).
			Scopes(withSearch(search)).
			Find(&users).Error
		if err != nil {
			internalServerError(w, fmt.Errorf("failed to list users: %w", err))
			return
		}

		activeCampusID, _ := strconv.Atoi(campus)
		userPromo := fmt.Sprintf("%02d/%d",
			user.BeginAt.Month(),
			user.BeginAt.Year())
		gotoMyPositionShown := search == "" &&
			((campus == "" && promo == "") ||
				(promo == "" && user.Campus.ID == activeCampusID) ||
				(promo != "" && campus == "" && userPromo == promo) ||
				(user.Campus.ID == activeCampusID && userPromo == promo))

		_ = templates.Leaderboard(users,
			promos, campuses, activeCampusID,
			r.URL, page, totalPages, shownFields,
			getLoggedInUser(r).them.ID,
			offset, gotoMyPositionShown,
			search,
		).Render(r.Context(), w)
	})
}
