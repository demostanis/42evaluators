package projects

import (
	"encoding/json"
	"io"
	"os"
)

type XPByLevel struct {
	Level         int `json:"lvl"`
	XP            int `json:"xp"`
	XPToNextLevel int `json:"xpToNextLevel"`
}

var XPData []XPByLevel

func OpenXPData() error {
	file, err := os.Open("assets/xp.json")
	if err != nil {
		return err
	}
	bytes, err := io.ReadAll(file)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bytes, &XPData)
	if err != nil {
		return err
	}

	for i := range XPData {
		if i == len(XPData)-1 {
			break
		}
		levelXP := XPData[i].XP
		nextLevelXP := XPData[i+1].XP
		XPData[i].XPToNextLevel = nextLevelXP - levelXP
	}
	return nil
}
