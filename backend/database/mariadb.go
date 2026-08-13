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

func mariaDBConnect(cfg *config.DataBaseConfig) bool {
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

	if err := GormDB.AutoMigrate(
		&models.User{},
		&models.Student{},
		&models.Teacher{},
		&models.Lesson{},
	); err != nil {
		log.Printf("auto migrate failed: %v", err)
		return false
	}

	// if err := seedInitialData(); err != nil {
	// 	log.Printf("seed initial data failed: %v", err)
	// 	return false
	// }

	return true
}



/*
type contextKey struct{}
var txKey = contextKey{}

type TxManager struct {
	db *sql.DB
}



func NewTxManager(db *sql.DB) *TxManager {
	return &TxManager{db: db}
}


// Transaction 在此方法中執行，傳入一個閉包 (closure)
func (m *TxManager) RunInTransaction(ctx context.Context, fn func(ctx context.Context) error) error {
	tx, err := m.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	// 將 tx 塞入 context 中，傳遞給下游
	txCtx := context.WithValue(ctx, txKey, tx)

	// 執行業務邏輯
	err = fn(txCtx)
	if err != nil {
		tx.Rollback() // 出錯就 Rollback
		return err
	}

	return tx.Commit() // 成功就 Commit
}

// 提供一個輔助函式，讓 Repository 取得當前的執行器 (sql.Tx 或 sql.DB)
func GetExecutor(ctx context.Context, defaultDB *sql.DB) Executor {
	if tx, ok := ctx.Value(txKey).(*sql.Tx); ok {
		return tx
	}
	return defaultDB
}

// 定義一個介面，因為 *sql.DB 與 *sql.Tx 都實作了這些方法
type Executor interface {
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
	QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row
}

*/
