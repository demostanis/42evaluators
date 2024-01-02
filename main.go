package main

import (
	"fmt"
	"github.com/demostanis/42evaluators2.0/internal/api"
	"github.com/demostanis/42evaluators2.0/internal/oauth"
	"github.com/demostanis/42evaluators2.0/internal/secrets"
	"os"
	"strconv"
	"strings"
)

type Group struct {
	Group struct {
		Name string `json:"name"`
	} `json:"group"`
}

type User struct {
	Id          int    `json:"id"`
	Login       string `json:"login"`
	DisplayName string `json:"displayname"`
	IsStaff     bool   `json:"staff?"`
	Image       struct {
		Link string `json:"link"`
	} `json:"image"`
}

type CursusUser struct {
	User User `json:"user"`
}

type TitleId struct {
	Id       int  `json:"title_id"`
	Selected bool `json:"selected"`

	UserId int `json:"user_id"`
}

type Title struct {
	Name string `json:"name"`
}

func isTest(user User, accessToken string) bool {
	whether := false

	groups, err := api.AuthenticatedRequest[[]Group]("GET",
		fmt.Sprintf("/v2/users/%d/groups_users", user.Id),
		accessToken, nil)
	if err == nil {
		for _, group := range *groups {
			if group.Group.Name == "Test account" {
				whether = true
				break
			}
		}
	}

	return whether
}

func getTitle(user User, accessToken string) string {
	titles, err := api.AuthenticatedRequest[[]TitleId]("GET",
		fmt.Sprintf("/v2/users/%d/titles_users", user.Id), accessToken, nil)
	if err == nil {
		for _, title := range *titles {
			if title.Selected {
				actualTitle, err := api.AuthenticatedRequest[Title](
					"GET", fmt.Sprintf("/v2/titles/%d", title.Id), accessToken, nil)
				if err == nil {
					return (*actualTitle).Name
				} else {
					break
				}
			}
		}
	}
	return "%login"
}

type App struct {
	Name      string `json:"name"`
	RateLimit string `json:"rate_limit"`
}

func main() {
	secrets, err := secrets.GetSecrets()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	accessToken, err := oauth.OauthToken(*secrets)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Printf("using token %s\n", accessToken)

	page := 1
	position := 1

	options := make(map[string]string)
	options["sort"] = "-level"
	options["filter[cursus_id]"] = "21"
	options["filter[campus_id]"] = "62"

	for {
		options["page"] = strconv.Itoa(page)
		users, err := api.AuthenticatedRequest[[]CursusUser]("GET",
			"/v2/cursus_users", accessToken, &options)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		if len(*users) == 0 {
			break
		}

		for _, user := range *users {
			user := user.User
			if !isTest(user, accessToken) &&
				!user.IsStaff && !strings.HasPrefix(user.Login, "3b3") {
				title := getTitle(user, accessToken)
				fmt.Printf("%d. \033[1m%s\033[0m   %s\n", position, user.DisplayName,
					strings.Replace(title, "%login", user.Login, -1))
				position += 1
			}
		}
		page += 1
	}
}
