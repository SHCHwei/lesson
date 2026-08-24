package database

import (
	"backend/config"
	"log"

	"github.com/go-redis/redis/v8"
)

var rdb *redis.Client

func initRedis(redisCfg *config.RedisConfig) {
	log.Println("init redis")

	rdb = redis.NewClient(&redis.Options{
		Addr:     redisCfg.Addr + ":" + redisCfg.Port,
		Password: redisCfg.Password,
		DB:       redisCfg.DB,
	})
}

func GetRedisClient() *redis.Client {
	return rdb
}


// SetRedisClient 設置 Redis 客戶端
// 這個函數主要用於測試，允許注入測試用的 Redis 客戶端
func SetRedisClient(client *redis.Client) {
    rdb = client
}