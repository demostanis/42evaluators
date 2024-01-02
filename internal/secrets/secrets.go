package secrets

import (
	"os"
	"fmt"
	"errors"
	"github.com/joho/godotenv"
)

type Secrets struct {
	Uid    string
	Secret string
}

func GetSecrets() (*Secrets, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("failed to load secrets: %s\n", err)
	}
	uid := os.Getenv("UID")
	if uid == "" {
		return nil, errors.New("$UID unset")
	}
	secret := os.Getenv("SECRET")
	if secret == "" {
		return nil, errors.New("$SECRET unset")
	}
	return &Secrets{uid, secret}, nil
}
