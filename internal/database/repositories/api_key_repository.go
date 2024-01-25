package repositories

import (
	"github.com/demostanis/42evaluators/internal/models"
	"gorm.io/gorm"
)

type ApiKeysRepository struct {
	db *gorm.DB
}

func NewApiKeysRepository(db *gorm.DB) *ApiKeysRepository {
	return &ApiKeysRepository{db}
}

// CreateApiKey inserts an API key in the database.
func (r *ApiKeysRepository) CreateApiKey(apiKey *models.ApiKey) error {
	return r.db.Create(apiKey).Error
}

// GetApiKeyByID retrieves an API key by its ID from the database.
func (r *ApiKeysRepository) GetApiKeyByID(id uint) (*models.ApiKey, error) {
	var apiKey models.ApiKey
	err := r.db.First(&apiKey, id).Error
	if err != nil {
		return nil, err
	}
	return &apiKey, nil
}

// UpdateApiKey updates an existing API key in the database.
func (r *ApiKeysRepository) UpdateApiKey(apiKey *models.ApiKey) error {
	return r.db.Save(apiKey).Error
}

// DeleteApiKeyByID deletes an API key by its ID from the database.
func (r *ApiKeysRepository) DeleteApiKeyByID(id uint) error {
	return r.db.Delete(&models.ApiKey{}, id).Error
}

// DeleteAllApiKeys deletes all API keys from the database.
func (r *ApiKeysRepository) DeleteAllApiKeys() error {
	return r.db.Exec("DELETE FROM api_key_models").Error
}

// GetAllApiKeys retrieves all API keys from the database.
func (r *ApiKeysRepository) GetAllApiKeys() ([]models.ApiKey, error) {
	var apiKeys []models.ApiKey
	err := r.db.Find(&apiKeys).Error
	if err != nil {
		return nil, err
	}
	return apiKeys, nil
}
