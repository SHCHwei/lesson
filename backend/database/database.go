package database

import (
	"backend/config"
)

func InitDB(DBcfg *config.DataBaseConfig, redisCfg *config.RedisConfig) {
	initRedis(redisCfg)
	initMySQL(DBcfg)
}
