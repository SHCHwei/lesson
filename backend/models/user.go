package models

type User struct {
	ID       int    `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Username string `gorm:"column:username;uniqueIndex" json:"username"`
	Password string `gorm:"column:password" json:"password"`
}
