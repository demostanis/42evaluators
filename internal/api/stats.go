package api

import (
	"fmt"
	"sync"
)

type Stats struct {
	sync.Mutex
	RequestsSoFar int `json:"requestsSoFar"`
	TotalRequests int `json:"totalRequests"`
}

func (stats *Stats) requestDone() {
	stats.Lock()
	defer stats.Unlock()
	stats.RequestsSoFar++
}

func (stats *Stats) growTotalRequests(n int) {
	stats.Lock()
	defer stats.Unlock()
	stats.TotalRequests += n
}

func (stats *Stats) String() string {
	return fmt.Sprintf("%d/%d requests",
		stats.RequestsSoFar, stats.TotalRequests)
}

func (stats *Stats) Percent() int {
	if stats.TotalRequests == 0 {
		return 0
	}
	return int(
		float32(stats.RequestsSoFar) / float32(stats.TotalRequests) * 100.,
	)
}

var APIStats = Stats{}
