package api

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"

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
	host               = "profile.intra.42.fr"
	concurrentFetches  = int64(42)
	defaultRedirectURI = "http://localhost:8080"
	defaultUserAgent   = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
	defaultAppName     = "42evaluators"
	keysToGenerate     = 400
)

type KeysManager struct {
	ctx               context.Context
	authToken         string
	intraSessionToken string
	userIDToken       string
	redirectURI       string
	client            tls_client.HttpClient
	db                *gorm.DB
}

type APIResult struct {
	Name   string
	AppID  string
	UID    string
	Secret string
}

var DefaultKeysManager *KeysManager = nil

func NewKeysManager(db *gorm.DB) (*KeysManager, error) {
	intraSessionToken, ok := os.LookupEnv("INTRA_SESSION_TOKEN")
	if !ok {
		return nil, errors.New("no INTRA_SESSION_TOKEN found in .env file")
	}

	userIDToken, ok := os.LookupEnv("USER_ID_TOKEN")
	if !ok {
		return nil, errors.New("no USER_ID_TOKEN found in .env file")
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

	redirectURI, ok := os.LookupEnv("REDIRECT_URI")
	if !ok {
		redirectURI = defaultRedirectURI
	}
	session := KeysManager{
		ctx:               context.Background(),
		redirectURI:       redirectURI,
		intraSessionToken: intraSessionToken,
		userIDToken:       userIDToken,
		client:            client,
		db:                db,
	}
	err = session.pullAuthenticityToken()
	if err != nil {
		return nil, err
	}

	return &session, nil
}

func (manager *KeysManager) GetKeys() ([]models.APIKey, error) {
	var keys []models.APIKey

	err := manager.db.Model(&models.APIKey{}).Find(&keys).Error
	if err != nil {
		return keys, fmt.Errorf("error querying API keys: %w", err)
	}
	if len(keys) == 0 {
		keys, err = manager.createMany(keysToGenerate)
		if err != nil {
			return keys, err
		}
	}
	return keys, nil
}

func (manager *KeysManager) CreateOne() (*models.APIKey, error) {
	if err := godotenv.Load(); err != nil {
		return nil, err
	}

	buf, writer, err := manager.buildForm(defaultAppName)
	if err != nil {
		return nil, err
	}

	req, _ := http.NewRequest("POST",
		fmt.Sprintf("https://%s/oauth/applications", host),
		io.NopCloser(buf))
	req.Header = http.Header{
		"Cookie": {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s",
			manager.userIDToken, manager.intraSessionToken)},
		"Origin":       {"https://profile.intra.42.fr"},
		"Referer":      {"https://profile.intra.42.fr/oauth/applications/new"},
		"User-Agent":   {defaultUserAgent},
		"Content-Type": {writer.FormDataContentType()},
	}

	resp, err := manager.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	apiKey := &models.APIKey{Name: defaultAppName}
	elems := strings.Split(doc.Find("a[href^='/oauth/applications/']").AttrOr("href", ""), "/")
	if len(elems) < 4 {
		return nil, errors.New("invalid response, the authenticity token is wrong?")
	}
	appIDraw := elems[3]
	if appIDraw == "" {
		return nil, errors.New("error could not find the application ID in html body")
	}
	appID, err := strconv.Atoi(appIDraw)
	if err != nil {
		return nil, err
	}
	apiKey.AppID = appID

	if err = manager.fetchAPIData(apiKey); err != nil {
		return nil, err
	}
	return apiKey, manager.db.Create(apiKey).Error
}

func (manager *KeysManager) createMany(n int) ([]models.APIKey, error) {
	var mu sync.Mutex
	var errs []error
	keys := make([]models.APIKey, 0, n)

	fmt.Printf("creating %d API keys...\n", n)

	var wg sync.WaitGroup
	sem := semaphore.NewWeighted(concurrentFetches)

	for i := 0; i < n; i++ {
		wg.Add(1)
		err := sem.Acquire(manager.ctx, 1)
		if err != nil {
			return keys, err
		}

		go func(i int) {
			defer sem.Release(1)
			defer wg.Done()

			key, err := manager.CreateOne()
			mu.Lock()
			defer mu.Unlock()

			if err != nil {
				errs = append(errs, err)
			} else {
				keys = append(keys, *key)
			}
		}(i)
	}

	wg.Wait()
	return keys, errors.Join(errs...)
}

func (manager *KeysManager) pullAuthenticityToken() error {
	req, _ := http.NewRequest("GET",
		fmt.Sprintf("https://%s/oauth/applications", host), nil)
	req.Header = http.Header{
		"Cookie": {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s",
			manager.userIDToken, manager.intraSessionToken)},
		"Referer":    {"https://profile.intra.42.fr/languages"},
		"User-Agent": {defaultUserAgent},
	}

	resp, err := manager.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return err
	}

	var ok bool
	manager.authToken, ok = doc.Find("meta[name=csrf-token]").Attr("content")
	if !ok {
		return fmt.Errorf("invalid response, expired credentials?")
	}

	return nil
}

func (manager *KeysManager) fetchAPIKeysFromIntra() ([]string, error) {
	req, _ := http.NewRequest("GET",
		fmt.Sprintf("https://%s/oauth/applications", host), nil)
	req.Header = http.Header{
		"Cookie": {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s",
			manager.userIDToken, manager.intraSessionToken)},
		"Origin":     {"https://profile.intra.42.fr"},
		"Referer":    {"https://profile.intra.42.fr/oauth/applications/new"},
		"User-Agent": {defaultUserAgent},
	}

	resp, err := manager.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	result := make([]string, 0)

	data, ok := doc.Find(".apps-root").First().Attr("data")
	if !ok {
		return nil, errors.New("no .apps-root")
	}

	var apps []struct{ ID int }
	err = json.Unmarshal([]byte(data), &apps)
	if err != nil {
		return nil, err
	}

	for _, app := range apps {
		result = append(result, strconv.Itoa(app.ID))
	}

	return result, nil
}

func (manager *KeysManager) DeleteAllKeys() error {
	keys, err := manager.fetchAPIKeysFromIntra()
	if err != nil {
		return err
	}

	fmt.Printf("deleting %d keys...\n", len(keys))

	sem := semaphore.NewWeighted(concurrentFetches)
	var wg sync.WaitGroup
	var mu sync.Mutex
	var errs []error

	for i, key := range keys {
		wg.Add(1)
		err = sem.Acquire(manager.ctx, 1)

		go func(i int, idRaw string) {
			defer sem.Release(1)
			defer wg.Done()

			id, _ := strconv.Atoi(idRaw)
			err = manager.DeleteOne(id)
			if err != nil {
				mu.Lock()
				errs = append(errs, err)
				mu.Unlock()
			}
		}(i, key)
	}

	wg.Wait()
	manager.db.Exec("DELETE FROM api_keys")
	return errors.Join(errs...)
}

func (manager *KeysManager) DeleteOne(id int) error {
	req, _ := http.NewRequest("POST",
		fmt.Sprintf("https://%s/oauth/applications/%d", host, id),
		io.NopCloser(
			bytes.NewReader(
				[]byte("_method=delete&authenticity_token="+
					url.QueryEscape(manager.authToken)))))

	req.Header = http.Header{
		"Cookie": {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s",
			manager.userIDToken, manager.intraSessionToken)},
		"Origin":       {"https://profile.intra.42.fr"},
		"Referer":      {fmt.Sprintf("https://profile.intra.42.fr/oauth/applications/%d", id)},
		"User-Agent":   {defaultUserAgent},
		"Accept":       {"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"},
		"Content-Type": {"application/x-www-form-urlencoded"},
	}

	resp, err := manager.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to delete application: %w", err)
	}
	defer resp.Body.Close()

	return manager.db.
		Where("id = ?", id).
		Delete(&models.APIKey{}).Error
}

func (manager *KeysManager) fetchAPIData(api *models.APIKey) error {
	req, _ := http.NewRequest("GET",
		fmt.Sprintf("https://%s/oauth/applications/%d", host, api.AppID), nil)
	req.Header = http.Header{
		"Cookie": {fmt.Sprintf("user.id=%s; _intra_42_session_production=%s",
			manager.userIDToken, manager.intraSessionToken)},
		"Origin":     {"https://profile.intra.42.fr"},
		"Referer":    {"https://profile.intra.42.fr/oauth/applications/new"},
		"User-Agent": {defaultUserAgent},
	}

	resp, err := manager.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
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

	api.RedirectURI = doc.Find(".redirect-uri-block code").First().Text()

	return nil
}

func (manager *KeysManager) buildForm(appName string) (*bytes.Buffer, *multipart.Writer, error) {
	buf := &bytes.Buffer{}

	writer := multipart.NewWriter(buf)
	_ = writer.WriteField("utf8", "✓")
	_ = writer.WriteField("authenticity_token", manager.authToken)
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
	_ = writer.WriteField("doorkeeper_application[redirect_uri]", manager.redirectURI)
	_ = writer.WriteField("commit", "Submit")

	err = writer.Close()
	return buf, writer, err
}
