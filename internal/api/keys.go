package api

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strconv"
	"sync"

	"golang.org/x/sync/semaphore"

	tls_client "github.com/bogdanfinn/tls-client"
	"github.com/bogdanfinn/tls-client/profiles"
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

const (
	host              = "profile.intra.42.fr"
	concurrentFetches = int64(42)
	defaultUserAgent  = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
	defaultAppName    = "42evaluators"
	keysToGenerate    = 400
)

var defaultRedirectURI = "http://localhost:8080"

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
	panic("deleted, sorry ;(")
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
	panic("deleted, sorry ;(")
}

func (manager *KeysManager) fetchAPIKeysFromIntra() ([]string, error) {
	panic("deleted, sorry ;(")
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
	panic("deleted, sorry ;(")
}
