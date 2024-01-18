package bot

import (
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"log"
	"net/http"
	"os"
	"testing"
	"time"
)

// Replace the empty file path with your .env file.
func TestCreateApiKey(t *testing.T) {
	if err := godotenv.Load(""); err != nil {
		log.Fatal(err)
	}

	sess := &Session{
		authToken:    os.Getenv("AUTHENTICITY_TOKEN"),
		client:       &http.Client{Timeout: 30 * time.Second},
		intraSession: os.Getenv("INTRA_SESSION_TOKEN"),
		userIdToken:  os.Getenv("USER_ID_TOKEN"),
		logger:       zerolog.New(os.Stdout).With().Timestamp().Logger(),
	}

	err := sess.createApiKeys(1)
	if err != nil {
		t.Fatal(err)
	}
}
