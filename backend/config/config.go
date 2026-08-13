package config

import "os"

type Config struct {
	Domain  string
	Port    string
	Env		string
}

type DataBaseConfig struct {
	User     string
	Password string
	Port     string
	DBName   string
	Host     string
}

type RedisConfig struct {
	Addr     string
	Port     string
	Password string
	DB       int
}

func Load() (*Config, *DataBaseConfig, *RedisConfig) {

	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
	}


	if env == "dev" {
		return &Config{
			Domain: "localhost",
			Port:   "8080",
			Env:	"dev",
		}, &DataBaseConfig{
			User:     "user",
			Password: "user1",
			Port:     "3306",
			DBName:   "lesson",
			Host:     "db",
		}, &RedisConfig{
			Addr:     "redis",
			Port:     "6379",
			Password: "",
			DB:       0,
		}

	}

	
	domain := os.Getenv("DOMAIN")
	if domain == "" {
		domain = "localhost"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "lesson"
	}
	database_host := os.Getenv("DB_HOST")
	if database_host == "" {
		database_host = "db"
	}

	redis_host := os.Getenv("REDIS_HOST")
	if redis_host == "" {
		redis_host = "redis"
	}
	redis_port := os.Getenv("REDIS_PORT")
	if redis_port == "" {
		redis_port = "6379"
	}
	redis_password := os.Getenv("REDIS_PASSWORD")

	return &Config{
			Domain: domain,
			Port:   port,
			Env:	env,
		}, &DataBaseConfig{
			User:     user,
			Password: password,
			Port:     dbPort,
			DBName:   dbName,
			Host:     database_host,
		}, &RedisConfig{
			Addr:     redis_host,
			Port:     redis_port,
			Password: redis_password,
			DB:       0,
		}

}
