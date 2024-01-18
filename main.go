package main

import (
	"fmt"
	"github.com/demostanis/42evaluators2.0/bot"
	"github.com/demostanis/42evaluators2.0/internal/api"
	"github.com/demostanis/42evaluators2.0/internal/database/config"
	"github.com/demostanis/42evaluators2.0/internal/oauth"
	"github.com/demostanis/42evaluators2.0/internal/secrets"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"log"
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

var rootCmd = &cobra.Command{Use: "42evaluators"}

var keyCount int
var keygenCmd = &cobra.Command{
	Use:   "keygen",
	Short: "Launches a software to generate API keys",
	Run: func(cmd *cobra.Command, args []string) {
		if err := godotenv.Load(); err != nil {
			log.Fatal(err)
		}

		psqlUsername, ok := os.LookupEnv("PSQL_USERNAME")
		if !ok {
			log.Fatal("error no PSQL_USERNAME found in .env")
		}

		psqlPassword, ok := os.LookupEnv("PSQL_PASSWORD")
		if !ok {
			log.Fatal("error no PSQL_PASSWORD found in .env")
		}

		psqlPort, ok := os.LookupEnv("PSQL_PORT")
		if !ok {
			log.Fatal("error no PSQL_PORT found in .env")
		}

		psqlDbName, ok := os.LookupEnv("PSQL_DB_NAME")
		if !ok {
			log.Fatal("error no PSQL_DB_NAME found in .env")
		}

		dbConn, err := config.New(fmt.Sprintf("postgres://%s:%s@localhost:%s/%s",
			psqlUsername,
			psqlPassword,
			psqlPort,
			psqlDbName,
		))
		if err != nil {
			log.Fatal(err)
		}

		if err = bot.Run(keyCount, dbConn); err != nil {
			log.Fatal(err)
		}
	},
}

var prodCmd = &cobra.Command{
	Use:   "prod",
	Short: "Run in production mode",
	Run:   func(cmd *cobra.Command, args []string) {},
}

// todo à remplir
var testCmd = &cobra.Command{}

func main() {
	rootCmd.AddCommand(keygenCmd)
	rootCmd.AddCommand(prodCmd)
	rootCmd.AddCommand(testCmd)

	keygenCmd.Flags().IntVarP(&keyCount, "count", "c", 1, "Number of API keys to generate")

	if err := rootCmd.Execute(); err != nil {
		log.Fatalf("error running command: %v", err)
	}
}

// tmp func by chayanne
// refactor le code ds une autre func ds un autre dir pr réduire la longueur du main
func tmp() {

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
