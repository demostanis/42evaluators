package web

import (
	"cmp"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"slices"
	"strconv"
	"strings"

	"github.com/demostanis/42evaluators/internal/clusters"
	"github.com/demostanis/42evaluators/internal/models"
	"github.com/demostanis/42evaluators/web/templates"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

var allClusters []clusters.Cluster

func OpenClustersData() error {
	file, err := os.Open("assets/clusters.json")
	if err != nil {
		return err
	}
	bytes, err := io.ReadAll(file)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bytes, &allClusters)
	if err != nil {
		return err
	}
	for i, c := range allClusters {
		allClusters[i].DisplayName = fmt.Sprintf(
			"%s - %s", c.Campus.Name, c.Name)
	}
	slices.SortFunc(allClusters, func(a, b clusters.Cluster) int {
		return cmp.Compare(a.DisplayName, b.DisplayName)
	})
	return nil
}

func fetchSvg(cluster *clusters.Cluster) error {
	resp, err := http.Get(cluster.Image)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	(*cluster).Svg = strings.Replace(string(body), "<svg", "<svg width=\"100%\" height=\"90%\" class=\"p-5 absolute\"", 1)
	return nil
}

func handleClusters() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defaultClusterId := 199
		campusId := getLoggedInUser(r).them.Campus[0].ID
		for _, cluster := range allClusters {
			if cluster.Campus.Id == campusId {
				defaultClusterId = cluster.Id
				break
			}
		}

		var selectedCluster clusters.Cluster
		cluster := r.URL.Query().Get("cluster")
		clusterId, err := strconv.Atoi(cluster)
		if cluster == "" || err != nil {
			http.Redirect(w, r,
				fmt.Sprintf("/clusters?cluster=%d", defaultClusterId),
				http.StatusMovedPermanently)
			return
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

		templates.ClustersMap(allClusters, selectedCluster).
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

func sendResponse(c *websocket.Conn, location models.Location, db *gorm.DB) {
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
		Left:  location.EndAt != "",
	}
	bytes, err := json.Marshal(&response)
	if err != nil {
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
		}()

		var stopSendingLocationsForPreviousCluster func()
		var wantedClusterId int
		ctx := context.TODO()

		for {
			select {
			// When the user wants to see a new cluster...
			case wantedClusterId = <-clusterChan:
				if wantedClusterId == 0 {
					break
				}
				if stopSendingLocationsForPreviousCluster != nil {
					stopSendingLocationsForPreviousCluster()
				}

				var locations []models.Location
				db.
					Model(&models.Location{}).
					Where("campus_id = ?", findCampusIdForCluster(wantedClusterId)).
					Find(&locations)

				if len(locations) > 0 {
					for _, location := range locations {
						sendResponse(c, location, db)
					}
				} else {
					break
				}

				ctx, stopSendingLocationsForPreviousCluster = context.WithCancel(context.Background())

			case location := <-clusters.LocationChannel:
				campusId := findCampusIdForCluster(wantedClusterId)
				if location.CampusId == campusId {
					// Respond with user information if the location's campus
					// is the same as the wanted cluster's campus (it would be
					// more performant to only send locations in the specifially
					// requested cluster, but the cable unfortunately does not
					// tell this)
					sendResponse(c, location, db)
				}

			case <-ctx.Done():
				break
			}
		}
	})
}
