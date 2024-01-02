package web

import (
	"cmp"
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
	var source io.Reader

	if strings.HasPrefix(cluster.Image, "http") {
		resp, err := http.Get(cluster.Image)
		if err != nil {
			return err
		}
		if resp.StatusCode != http.StatusOK {
			cluster.Svg = "<p class=\"h-[90%] flex justify-center m-5 text-center items-center\">Cannot find this cluster map. It's likely that " +
				"its campus' staff has modified it, and thus the link has changed. " +
				"If you are part of this campus, please send the cluster SVG to " +
				"@cgodard on Slack.</p>"
			return nil
		}
		source = resp.Body
		defer resp.Body.Close()
	} else {
		file, err := os.Open(cluster.Image)
		if err != nil {
			return err
		}
		defer file.Close()
		source = file
	}

	body, err := io.ReadAll(source)
	if err != nil {
		return err
	}
	cluster.Svg = strings.Replace(string(body), "<svg", "<svg width=\"100%\" height=\"90%\" class=\"p-5 absolute\"", 1)
	return nil
}

func handleClusters() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defaultClusterID := 199
		campusID := getLoggedInUser(r).them.CampusID
		for _, cluster := range allClusters {
			if cluster.Campus.ID == campusID {
				defaultClusterID = cluster.ID
				break
			}
		}

		var selectedCluster clusters.Cluster
		cluster := r.URL.Query().Get("cluster")
		clusterID, err := strconv.Atoi(cluster)
		if cluster == "" || err != nil {
			http.Redirect(w, r,
				fmt.Sprintf("/clusters?cluster=%d", defaultClusterID),
				http.StatusMovedPermanently)
			return
		}
		found := false
		for _, cluster := range allClusters {
			if cluster.ID == clusterID {
				selectedCluster = cluster
				found = true
			}
		}
		if !found {
			selectedCluster = allClusters[defaultClusterID]
		}
		if selectedCluster.Svg == "" {
			_ = fetchSvg(&selectedCluster)
		}

		_ = templates.ClustersMap(allClusters, selectedCluster).
			Render(r.Context(), w)
	})
}

var upgrader = websocket.Upgrader{}

type Message struct {
	ClusterID int `json:"cluster"`
}

type Response struct {
	Host  string `json:"host"`
	Login string `json:"login"`
	Image string `json:"image"`
	Left  bool   `json:"left"`
}

func findCampusIDForCluster(clusterID int) int {
	campusID := -1
	for _, cluster := range allClusters {
		if cluster.ID == clusterID {
			campusID = cluster.Campus.ID
		}
	}
	return campusID
}

var locationChans []chan models.Location

func broadcastLocations() {
	for {
		location := <-clusters.LocationChannel
		for _, locationChan := range locationChans {
			locationChan <- location
		}
	}
}

func sendResponse(c *websocket.Conn, location models.Location, db *gorm.DB) {
	image := location.Image
	if image == "" {
		db.
			Where("id = ?", location.UserID).
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
	go broadcastLocations()

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

		locationChan := make(chan models.Location)
		locationChans = append(locationChans, locationChan)
		defer func() {
			locationChans = slices.DeleteFunc(locationChans,
				func(item chan models.Location) bool {
					return item == locationChan
				})
			close(locationChan)
		}()

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

				clusterChan <- message.ClusterID
			}
		}()

		var stopSendingLocationsForPreviousCluster func()
		var wantedClusterID int

		for {
			select {
			// When the user wants to see a new cluster...
			case wantedClusterID = <-clusterChan:
				if wantedClusterID == 0 {
					break
				}
				if stopSendingLocationsForPreviousCluster != nil {
					stopSendingLocationsForPreviousCluster()
				}

				var locations []models.Location
				db.
					Model(&models.Location{}).
					Where("campus_id = ?", findCampusIDForCluster(wantedClusterID)).
					Find(&locations)

				if len(locations) > 0 {
					for _, location := range locations {
						sendResponse(c, location, db)
					}
				}

			case location := <-locationChan:
				campusID := findCampusIDForCluster(wantedClusterID)
				if location.CampusID == campusID {
					// Respond with user information if the location's campus
					// is the same as the wanted cluster's campus (it would be
					// more performant to only send locations in the specifially
					// requested cluster, but the cable unfortunately does not
					// tell this)
					sendResponse(c, location, db)
				}
			}
		}
	})
}
