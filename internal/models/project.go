package models

type TeamUser struct {
	TeamID int  `gorm:"primaryKey"`
	UserID int  `gorm:"primaryKey" json:"id"`
	Leader bool `json:"leader"`
	User   User
}

type Team struct {
	// this musn't be a gorm.Model, because GORM is so
	// fucking drunk and will put two ids in INSERT statements,
	// making the DB complain that there are two fucking ids.
	ID        int        `json:"id"`
	Name      string     `json:"name"`
	Users     []TeamUser `json:"users"`
	ProjectID int
}

type Subject struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
	// Calculated from the distance from the center
	// using Holy Graph coordinates
	Position int
	XP       int
}

type Project struct {
	ID            int    `json:"id"`
	CursusIDs     []int  `gorm:"-" json:"cursus_ids"`
	FinalMark     int    `json:"final_mark"`
	Status        string `json:"status"`
	Teams         []Team `gorm:"foreignKey:ProjectID" json:"teams"`
	CurrentTeamID int    `gorm:"-" json:"current_team_id"`
	ActiveTeam    int

	SubjectID int
	Subject   Subject `json:"project"`
}
