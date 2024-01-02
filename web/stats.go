package web

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

func statsWs(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}
		defer c.Close()

		stop := make(chan bool)
		ticker := time.NewTicker(1 * time.Second)

		for {
			select {
			case <-stop:
				return
			case <-ticker.C:
				bytes, err := json.Marshal(&api.APIStats)
				if err != nil {
					return
				}
				err = c.WriteMessage(websocket.TextMessage, bytes)
				if err != nil {
					stop <- true
				}
			}
		}
	})
}
