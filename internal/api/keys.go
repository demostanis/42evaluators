package api

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"golang.org/x/sync/semaphore"

	"github.com/PuerkitoBio/goquery"
	http "github.com/bogdanfinn/fhttp"
	tls_client "github.com/bogdanfinn/tls-client"
	"github.com/bogdanfinn/tls-client/profiles"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

const (
	host            = "profile.intra.42.fr"
	ConcurrentFetch = int64(42)
)

var (
	DefaultSleepDelay  = 2 * time.Second
	DefaultRedirectURI = "http://localhost:8080"

	ErrNoIntraSession = errors.New("no INTRA_SESSION_TOKEN found in .env file")
	ErrNoUserIdToken  = errors.New("no USER_ID_TOKEN found in .env file")
)

type Session struct {
	authToken    string
	intraSession string
	userIdToken  string
	redirectURI  string
	client       tls_client.HttpClient
	db           *gorm.DB
}

type APIResult struct {
	Name   string
	AppID  string
	UID    string
	Secret string
}

// Beware that you must set your auth tokens in your local .env file.
// They can be found in your cookies storage in your intra.
// AUTHENTICITY_TOKEN
// INTRA_SESSION_TOKEN
// USER_ID_TOKEN

// The x parameter is the amount of API keys you wish to create & redirectURI is the
// URL you wish to have as redirection after an user authenticates through 42.
func GetKeys(x int, db *gorm.DB) error {
	if err := godotenv.Load(); err != nil {
		return err
	}

	s, err := NewSession(db)
	if err != nil {
		return err
	}

	sem := semaphore.NewWeighted(ConcurrentFetch)
	var wg sync.WaitGroup
	for i := 0; i < x; i++ {
		wg.Add(1)
		if err = sem.Acquire(context.TODO(), 1); err != nil {

		}
		go func(i int) {
			defer sem.Release(1)
			defer wg.Done()
			err = s.createApiKey()
			if err != nil {
				log.Println(err)
				return
			}
			fmt.Printf("Created API key %d/%d\n", i+1, x)
		}(i)
	}

	wg.Wait()
	return nil
}

func (s *Session) PullAuthenticityToken() error {
	intraSess, ok := os.LookupEnv("INTRA_SESSION_TOKEN")
	if !ok {
		return ErrNoIntraSession
	}

	userID, ok := os.LookupEnv("USER_ID_TOKEN")
	if !ok {
		return ErrNoUserIdToken
	}

	req := &http.Request{
		Method: http.MethodGet,
		URL:    &url.URL{Scheme: "https", Host: host, Path: "/oauth/applications"},
		Header: http.Header{
			"authority":  {"profile.intra.42.fr"},
			"cookie":     {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s", userID, intraSess)},
			"referer":    {"https://profile.intra.42.fr/languages"},
			"User-Agent": {"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"},
			"accept":     {"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"},
		},
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("PullAuthenticityToken: unexpected status result, got %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(string(body)))
	if err != nil {
		return err
	}

	s.authToken, ok = doc.Find("meta[name=csrf-token]").Attr("content")
	if !ok {
		return fmt.Errorf("PullAuthenticityToken: unable to get csrf")
	}

	return nil
}

// newSession creates an instance of Session & looks up for
// authentication tokens in your .env file.
func NewSession(db *gorm.DB) (*Session, error) {
	intraSession, ok := os.LookupEnv("INTRA_SESSION_TOKEN")
	if !ok {
		return nil, ErrNoIntraSession
	}

	userIdToken, ok := os.LookupEnv("USER_ID_TOKEN")
	if !ok {
		return nil, ErrNoUserIdToken
	}

	client, err := tls_client.NewHttpClient(
		tls_client.NewNoopLogger(),
		[]tls_client.HttpClientOption{
			tls_client.WithClientProfile(profiles.Chrome_105),
		}...,
	)
	if err != nil {
		return nil, err
	}

	redirectUri, ok := os.LookupEnv("REDIRECT_URI")
	if !ok {
		redirectUri = DefaultRedirectURI
	}
	session := Session{
		redirectURI:  redirectUri,
		intraSession: intraSession,
		userIdToken:  userIdToken,
		client:       client,
		db:           db,
	}
	err = session.PullAuthenticityToken()
	if err != nil {
		return nil, err
	}

	return &session, nil
}

func (s *Session) fetchApiKeysFromIntra() ([]string, error) {
	req := &http.Request{
		Method: http.MethodGet,
		URL:    &url.URL{Scheme: "https", Host: host, Path: "/oauth/applications/"},
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
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected response status fetching API key data, got %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(string(body)))
	if err != nil {
		return nil, err
	}

	result := make([]string, 0)

	data, ok := doc.Find(".apps-root").First().Attr("data")
	if !ok {
		return nil, errors.New("no .apps_root")
	}

	var apps []struct{ Id int }
	err = json.Unmarshal([]byte(data), &apps)
	if err != nil {
		return nil, err
	}

	for _, app := range apps {
		result = append(result, strconv.Itoa(app.Id))
	}

	return result, nil
}

func (s *Session) DeleteAllApplications() error {
	keys, err := s.fetchApiKeysFromIntra()
	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	for i, key := range keys {
		wg.Add(1)
		go func(i int, key string) {
			defer wg.Done()
			err = s.DeleteApplication(key)
			if err != nil {
				return
			}
			fmt.Printf("Delete API key %d/%d\n", i+1, len(keys))
		}(i, key)
	}
	wg.Wait()

	s.db.Exec("DELETE FROM api_keys")
	return nil
}

func (s *Session) DeleteApplication(id string) error {
	req := &http.Request{
		Method: http.MethodPost,
		URL: &url.URL{
			Scheme: "https", Host: host,
			Path: fmt.Sprintf("/oauth/applications/%s", id),
		},
		Host: host,
		Body: io.NopCloser(
			bytes.NewReader(
				[]byte("_method=delete&authenticity_token=" +
					url.QueryEscape(s.authToken)))),
		Header: http.Header{
			"authority":    {"profile.intra.42.fr"},
			"cookie":       {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s", s.userIdToken, s.intraSession)},
			"origin":       {"https://profile.intra.42.fr"},
			"referer":      {fmt.Sprintf("https://profile.intra.42.fr/oauth/applications/%s", id)},
			"User-Agent":   {"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
			"accept":       {"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"},
			"content-type": {"application/x-www-form-urlencoded"},
		},
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("DeleteApplication client error: %w", err)
	}

	if resp.StatusCode != 302 && resp.StatusCode != 200 {
		return fmt.Errorf("unexpected response status, got %s", resp.Status)
	}

	return s.db.
		Where("id = ?", id).
		Delete(&models.ApiKey{}).Error
}

func (s *Session) createApiKey() error {
	appName := "42evaluators"
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
			"Cookie":       {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s", s.userIdToken, s.intraSession)},
			"Origin":       {"https://profile.intra.42.fr"},
			"Referer":      {"https://profile.intra.42.fr/oauth/applications/new"},
			"User-Agent":   {"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
			"Content-Type": {writer.FormDataContentType()},
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

	apiKey := &models.ApiKey{Name: appName}
	elems := strings.Split(doc.Find("a[href^='/oauth/applications/']").AttrOr("href", ""), "/")
	if len(elems) < 4 {
		return errors.New("invalid response, did you pass the right authenticity token?")
	}
	appIDraw := elems[3]
	if appIDraw == "" {
		return errors.New("error could not find the application ID in html body")
	}
	appID, err := strconv.Atoi(appIDraw)
	if err != nil {
		return err
	}
	apiKey.AppID = appID

	if err = s.fetchApiData(apiKey); err != nil {
		return err
	}
	return s.db.Create(apiKey).Error
}

// fetchApiData fetches the API Key from the html page.
func (s *Session) fetchApiData(api *models.ApiKey) error {
	req := &http.Request{
		Method: http.MethodGet,
		URL:    &url.URL{Scheme: "https", Host: host, Path: fmt.Sprintf("/oauth/applications/%d", api.AppID)},
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

	api.RedirectUri = doc.Find(".redirect-uri-block code").First().Text()

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
