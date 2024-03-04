package cable

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/demostanis/42evaluators/internal/models"
	"github.com/gorilla/websocket"
)

const (
	// TODO: user_id now needs to the logged-in user's id..
	LocationChannelMessage = "{\"command\":\"subscribe\",\"identifier\":\"{\\\"channel\\\":\\\"LocationChannel\\\",\\\"user_id\\\":160447}\"}"
)

type Answer struct {
	Message struct {
		Location models.Location `json:"location"`
	} `json:"message"`
}

var (
	LocationChannel = make(chan models.Location)
)

func ConnectToCable(errstream chan error) {
	headers := http.Header{}
	headers.Add("Cookie", "user.id="+os.Getenv("USER_ID_TOKEN"))
	headers.Add("Origin", "https://meta.intra.42.fr")

	client, _, err := websocket.DefaultDialer.Dial("wss://profile.intra.42.fr/cable", headers)
	if err != nil {
		errstream <- fmt.Errorf("failed to connect to cable: %v", err)
		return
	}
	defer client.Close()
	err = client.WriteMessage(websocket.TextMessage, []byte(LocationChannelMessage))
	for {
		_, message, err := client.ReadMessage()
		if err != nil {
			ConnectToCable(errstream)
			return
		}
		var answer Answer
		err = json.Unmarshal(message, &answer)
		if err != nil {
			errstream <- fmt.Errorf("cable message failed to unmarshal: %v", err)
			continue
		}
		location := answer.Message.Location
		if location.Login == "" {
			continue
		}
		LocationChannel <- location
	}
}
