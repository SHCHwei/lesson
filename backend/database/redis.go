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
