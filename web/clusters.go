package web

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/demostanis/42evaluators/internal/api"
	"github.com/demostanis/42evaluators/internal/cable"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type Cluster struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Image  string `json:"cdn_link"`
	Campus struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	} `json:"campus"`
	Svg string
}

var allClusters []Cluster

func fetchSvg(cluster *Cluster) error {
	resp, err := http.Get(cluster.Image)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	(*cluster).Svg = strings.Replace(string(body), "<svg", "<svg width=\"100%\" height=\"100%\"", 1)
	return nil
}

func handleClusters() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if allClusters == nil {
			file, _ := os.Open("assets/clusters.json")
			bytes, _ := io.ReadAll(file)
			_ = json.Unmarshal(bytes, &allClusters)
		}

		// TODO: find user's campus
		defaultClusterId := 99

		var selectedCluster Cluster
		cluster := r.URL.Query().Get("cluster")
		clusterId, err := strconv.Atoi(cluster)
		if cluster == "" || err != nil {
			clusterId = defaultClusterId
		}
		found := false
		for _, cluster := range allClusters {
			if cluster.Id == clusterId {
				selectedCluster = cluster
				found = true
			}
		}
		if !found {
			selectedCluster = allClusters[defaultClusterId]
		}
		if selectedCluster.Svg == "" {
			_ = fetchSvg(&selectedCluster)
		}

		clusters(allClusters, selectedCluster).
			Render(r.Context(), w)
	})
}

var upgrader = websocket.Upgrader{}

type Message struct {
	ClusterId int `json:"cluster"`
}

type Response struct {
	Host  string `json:"host"`
	Login string `json:"login"`
	Image string `json:"image"`
	Left  bool   `json:"left"`
}

func findCampusIdForCluster(clusterId int) int {
	campusId := -1
	for _, cluster := range allClusters {
		if cluster.Id == clusterId {
			campusId = cluster.Campus.Id
		}
	}
	return campusId
}

type Location struct {
	Host     string `json:"host"`
	CampusId int    `json:"campus_id"`
	User     struct {
		ID    int    `json:"id"`
		Login string `json:"login"`
		Image struct {
			Versions struct {
				Small string `json:"small"`
			} `json:"versions"`
		} `json:"image"`
	} `json:"user"`
}

func getLocations(campusId int, page int) []cable.Location {
	result := make([]cable.Location, 0)
	locations, err := api.Do[[]Location](
		api.NewRequest(fmt.Sprintf("/v2/campus/%d/locations", campusId)).
			WithParams(map[string]string{
				"page":           strconv.Itoa(page),
				"filter[active]": "true",
			}).
			Authenticated())
	if err != nil {
		return result
	}
	for _, location := range *locations {
		result = append(result, cable.Location{
			UserId:   location.User.ID,
			Login:    location.User.Login,
			Host:     location.Host,
			CampusId: location.CampusId,
			Image:    location.User.Image.Versions.Small,
		})
	}
	return result
}

func sendResponse(c *websocket.Conn, location cable.Location, db *gorm.DB) {
	image := location.Image
	if image == "" {
		db.
			Where("id = ?", location.UserId).
			Select("image_link_small").
			Table("users").
			Find(&image)
	}

	response := Response{
		Host:  location.Host,
		Login: location.Login,
		Image: image,
		Left:  location.EndAt != nil,
	}
	bytes, err := json.Marshal(&response)
	if err != nil {
		fmt.Println(err)
		return
	}
	_ = c.WriteMessage(websocket.TextMessage, bytes)
}

// Damn, this function is huge.
func clustersWs(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}
		defer c.Close()

		// Channel in which the cluster IDs are sent
		// as they are received from the WebSocket (
		// when e.g. the user switches to another
		// cluster view)
		clusterChan := make(chan int)
		defer close(clusterChan)

		go func() {
			var cancelPreviousGoroutine context.CancelFunc
			for {
				// When the user wants to see a new cluster...
				wantedClusterId := <-clusterChan
				if wantedClusterId == 0 {
					break
				}
				// We stop sending them information from the
				// previous cluster
				if cancelPreviousGoroutine != nil {
					cancelPreviousGoroutine()
				}

				page := 1
				for {
					locations := getLocations(findCampusIdForCluster(wantedClusterId), page)
					if len(locations) > 0 {
						for _, location := range locations {
							sendResponse(c, location, db)
						}
						page += 1
					} else {
						break
					}
				}

				ctx, cancel := context.WithCancel(context.Background())
				cancelPreviousGoroutine = cancel

				go func(ctx context.Context) {
					for {
						select {
						case <-ctx.Done():
							break
						// When we receive a new location from the cable...
						case location := <-cable.LocationChannel:
							campusId := findCampusIdForCluster(wantedClusterId)
							if location.CampusId == campusId {
								// Respond with user information if the location's campus
								// is the same as the wanted cluster's campus (it would be
								// more performant to only send locations in the specifially
								// requested cluster, but the cable unfortunately does not
								// tell this)
								sendResponse(c, location, db)
							}
						}
					}
				}(ctx)
			}
		}()
		for {
			_, rawMessage, err := c.ReadMessage()
			if err != nil {
				break
			}

			var message Message
			err = json.Unmarshal(rawMessage, &message)
			if err != nil {
				break
			}

			clusterChan <- message.ClusterId
		}
	})
}
