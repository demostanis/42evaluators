package cable

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

const (
	// TODO: user_id now needs to the logged-in user's id..
	LocationChannelMessage = "{\"command\":\"subscribe\",\"identifier\":\"{\\\"channel\\\":\\\"LocationChannel\\\",\\\"user_id\\\":160447}\"}"
)

type Location struct {
	UserId   int    `json:"user_id"`
	Login    string `json:"login"`
	Host     string `json:"host"`
	CampusId int    `json:"campus_id"`
}

type Answer struct {
	Message struct {
		Location Location `json:"location"`
	} `json:"message"`
}

var (
	LocationChannel = make(chan Location)
)

func ConnectToCable() {
	headers := http.Header{}
	headers.Add("Cookie", "user.id="+os.Getenv("USER_ID_TOKEN"))
	headers.Add("Origin", "https://meta.intra.42.fr")

	client, _, err := websocket.DefaultDialer.Dial("wss://profile.intra.42.fr/cable", headers)
	if err != nil {
		return
	}
	defer client.Close()
	err = client.WriteMessage(websocket.TextMessage, []byte(LocationChannelMessage))
	for {
		_, message, err := client.ReadMessage()
		if err != nil {
			ConnectToCable()
			return
		}
		var answer Answer
		err = json.Unmarshal(message, &answer)
		if err != nil {
			continue
		}
		location := answer.Message.Location
		if location.Login == "" {
			continue
		}
		LocationChannel <- location
	}
}
