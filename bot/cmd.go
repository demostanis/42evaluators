package bot

import (
	"bytes"
	"errors"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/demostanis/42evaluators2.0/internal/database/config"
	"github.com/demostanis/42evaluators2.0/internal/database/models"
	"github.com/demostanis/42evaluators2.0/internal/database/repositories"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

const (
	host = "profile.intra.42.fr"
)

var (
	DefaultSleepDelay  = 2 * time.Second
	DefaultRedirectURI = "http://localhost:8000"

	ErrNoAuthenticityToken = errors.New("error: no AUTHENTICITY_TOKEN found in .env file")
	ErrNoIntraSession      = errors.New("error: no INTRA_SESSION_TOKEN found in .env file")
	ErrNoUserIdToken       = errors.New("error: no USER_ID_TOKEN found in .env file")
)

type Session struct {
	authToken    string
	intraSession string
	userIdToken  string
	redirectURI  string
	client       *http.Client
	logger       zerolog.Logger
	repo         *repositories.ApiKeysRepository
}

type APIResult struct {
	Name   string
	Key    string
	AppID  string
	UID    string
	Secret string
}

// Beware that you must set your auth tokens in your local .env file.
// They can be found in your cookies storage in your intra.
// AUTHENTICITY_TOKEN
// INTRA_SESSION_TOKEN
// USER_ID_TOKEN

// Run creates a new session and generates API keys, then saves them to out/api_keys.csv.
// The x parameter is the amount of API keys you wish to create & redirectURI is the
// URL you wish to have as redirection after an user authenticates through 42.
func Run(x int, db *config.DB) error {
	if err := godotenv.Load(); err != nil {
		return err
	}

	s, err := newSession(db)
	if err != nil {
		return err
	}

	return s.createApiKeys(x)
}

// newSession creates an instance of Session & looks up for
// authentication tokens in your .env file.
func newSession(db *config.DB) (*Session, error) {
	authToken, ok := os.LookupEnv("AUTHENTICITY_TOKEN")
	if !ok {
		return nil, ErrNoAuthenticityToken
	}

	intraSession, ok := os.LookupEnv("INTRA_SESSION_TOKEN")
	if !ok {
		return nil, ErrNoIntraSession
	}

	userIdToken, ok := os.LookupEnv("USER_ID_TOKEN")
	if !ok {
		return nil, ErrNoUserIdToken
	}

	return &Session{
		repo:         repositories.NewApiKeysRepository(db.DB),
		redirectURI:  DefaultRedirectURI,
		authToken:    authToken,
		intraSession: intraSession,
		userIdToken:  userIdToken,
		client:       &http.Client{Timeout: 30 * time.Second},
		logger:       zerolog.New(os.Stdout).With().Timestamp().Str("service", "42api-gen").Logger(),
	}, nil
}

// createApiKeys creates x amount of 42 API keys.
func (s *Session) createApiKeys(x int) error {
	for i := 0; i < x; i++ {
		appName := "42evaluators_" + uuid.NewString()
		buf, writer, err := s.buildForm(appName)
		if err != nil {
			return err
		}

		req := &http.Request{
			Method: http.MethodPost,
			URL:    &url.URL{Scheme: "https", Host: host, Path: "/oauth/applications"},
			Body:   io.NopCloser(buf),
			Host:   host,
			Header: http.Header{
				"authority":    {"profile.intra.42.fr"},
				"cookie":       {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s", s.userIdToken, s.intraSession)},
				"origin":       {"https://profile.intra.42.fr"},
				"referer":      {"https://profile.intra.42.fr/oauth/applications/new"},
				"user-agent":   {"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
				"content-type": {writer.FormDataContentType()},
			},
		}

		resp, err := s.client.Do(req)
		if err != nil {
			return fmt.Errorf("CreateApiKey client error: %w", err)
		}

		if resp.StatusCode != 302 && resp.StatusCode != 200 {
			return fmt.Errorf("unexpected response status, got %s", resp.Status)
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return err
		}

		doc, err := goquery.NewDocumentFromReader(strings.NewReader(string(body)))
		if err != nil {
			return err
		}

		api := &models.ApiKeyModel{Name: appName}
		api.AppID = strings.Split(doc.Find("a[href^='/oauth/applications/']").AttrOr("href", ""), "/")[3]
		if api.AppID == "" {
			return errors.New("error could not find the application ID in html body")
		}

		if err = s.fetchApiData(api); err != nil {
			return err
		}

		if err = s.repo.CreateApiKey(api); err != nil {
			return fmt.Errorf("error inserting %s in db: %w", appName, err)
		}

		s.logger.Info().Msgf("successfully created api key: %s", api.Name)

		//time.Sleep(DefaultSleepDelay)
	}

	return nil
}

// fetchApiData fetches the API Key from the html page.
func (s *Session) fetchApiData(api *models.ApiKeyModel) error {
	req := &http.Request{
		Method: http.MethodGet,
		URL:    &url.URL{Scheme: "https", Host: host, Path: "/oauth/applications/" + api.AppID},
		Header: http.Header{
			"authority":  {"profile.intra.42.fr"},
			"cookie":     {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s", s.userIdToken, s.intraSession)},
			"origin":     {"https://profile.intra.42.fr"},
			"referer":    {"https://profile.intra.42.fr/oauth/applications/new"},
			"user-agent": {"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
		},
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected response status fetching API key data, got %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(string(body)))
	if err != nil {
		return err
	}

	doc.Find(".credential").Each(func(i int, s *goquery.Selection) {
		switch i {
		case 0:
			api.UID = s.Text()
		case 1:
			api.Secret = s.Text()
		}
	})

	return nil
}

func (s *Session) buildForm(appName string) (*bytes.Buffer, *multipart.Writer, error) {
	buf := &bytes.Buffer{}

	writer := multipart.NewWriter(buf)
	_ = writer.WriteField("utf8", "✓")
	_ = writer.WriteField("authenticity_token", s.authToken)
	_ = writer.WriteField("doorkeeper_application[name]", appName)
	_ = writer.WriteField("doorkeeper_application[image_cache]", "")

	// creates an empty file and add it to the form.
	part, err := writer.CreateFormFile("doorkeeper_application[image]", "")
	if err != nil {
		return buf, nil, err
	}
	// copy empty bytes to the file.
	if _, err = io.Copy(part, bytes.NewReader([]byte{})); err != nil {
		return buf, nil, err
	}

	_ = writer.WriteField("doorkeeper_application[description]", "")
	_ = writer.WriteField("doorkeeper_application[website]", "")
	_ = writer.WriteField("doorkeeper_application[public]", "0")
	_ = writer.WriteField("doorkeeper_application[scopes]", "")
	_ = writer.WriteField("doorkeeper_application[redirect_uri]", s.redirectURI)
	_ = writer.WriteField("commit", "Submit")

	err = writer.Close()
	return buf, writer, err
}
