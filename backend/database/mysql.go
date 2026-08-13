package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	// "database/sql"

	"fmt"
	"log"
	"time"

	"backend/config"
	"backend/models"
)

var GormDB *gorm.DB

func initMySQL(cfg *config.DataBaseConfig) bool {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DBName)

	var dbErr error
	for i := 0; i < 5; i++ {
		GormDB, dbErr = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if dbErr == nil {
			log.Println("sql Open success")
			break
		}

		log.Printf("sql Open attempt %d/5 failed: %v", i+1, dbErr)
		time.Sleep(2 * time.Second)
	}

	if dbErr != nil {
		log.Printf("sql Open failed after retries: %v", dbErr)
		return false
	}

	// 設定連線池參數
	sqlDB, err := GormDB.DB()
	if err != nil {
		log.Printf("failed to get database instance: %v", err)
		return false
	}

	// 設定最大閒置連線數
	sqlDB.SetMaxIdleConns(5)

	// 設定最大開啟連線數
	sqlDB.SetMaxOpenConns(10)

	// 設定連線可重複使用的最大時間
	sqlDB.SetConnMaxLifetime(time.Hour)

	// 設定連線可閒置的最大時間
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	log.Println("Database connection pool configured successfully")

	if err := GormDB.AutoMigrate(
		&models.Student{},
		&models.Teacher{},
		&models.Lesson{},
	); err != nil {
		log.Printf("auto migrate failed: %v", err)
		// return false
	}

	return true
}
