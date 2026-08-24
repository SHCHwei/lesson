package config

// 2. 導入 testing 套件
import (
	"os"
	"testing"
)


func TestLoad(t *testing.T) {
    
	t.Run("Default values", func(t *testing.T) {
		os.Clearenv()


		cfg, dbCfg, redisCfg := Load()
		
		if cfg.Domain != "localhost" {
			t.Errorf("Expected Domain to be 'localhost', got '%s'", cfg.Domain)
		}

		if cfg.Port != "8080" {
			t.Errorf("Expected Port to be '8080', got '%s'", cfg.Port)
		}

		if cfg.Env != "dev" {
			t.Errorf("Expected Env to be 'dev', got '%s'", cfg.Env)
		}

		if cfg.FrontendURL != "http://localhost:5173" {
			t.Errorf("Expected FrontendURL to be 'http://localhost:5173', got '%s'", cfg.FrontendURL)
		}
		
		if dbCfg.User != "" {
			t.Errorf("Expected DB User to be '', got '%s'", dbCfg.User)
		}
		
		if dbCfg.Password != "" {
			t.Errorf("Expected DB Password to be '', got '%s'", dbCfg.Password)
		}
		
		if dbCfg.Port != "3306" {
			t.Errorf("Expected DB Port to be '3306', got '%s'", dbCfg.Port)
		}
		
		if dbCfg.DBName != "lesson" {
			t.Errorf("Expected DB Name to be 'lesson', got '%s'", dbCfg.DBName)
		}


		if dbCfg.Host != "db" {
			t.Errorf("Expected DB Host to be 'db', got '%s'", dbCfg.Host)
		}
		
		if redisCfg.Addr != "redis" {
			t.Errorf("Expected Redis Addr to be 'redis', got '%s'", redisCfg.Addr)
		}
		
		if redisCfg.Port != "6379" {
			t.Errorf("Expected Redis Port to be '6379', got '%s'", redisCfg.Port)
		}

	})



    t.Run("Custom environment variables", func(t *testing.T) {
        // 設置測試用的環境變量
        os.Setenv("ENV", "production")
        os.Setenv("DOMAIN", "example.com")
        os.Setenv("Frontend_URL", "https://example.com")
        os.Setenv("PORT", "3000")
        os.Setenv("DB_USER", "testuser")
        os.Setenv("DB_PASSWORD", "testpass")
        os.Setenv("DB_PORT", "5432")
        os.Setenv("DB_NAME", "testdb")
        os.Setenv("DB_HOST", "testhost")
        os.Setenv("REDIS_HOST", "redis-test")
        os.Setenv("REDIS_PORT", "6380")
        os.Setenv("REDIS_PASSWORD", "redispass")
        // 測試後清理（使用 defer 確保執行）
        defer os.Clearenv()
        
        cfg, dbCfg, redisCfg := Load()
        
        // 驗證自定義值
        if cfg.Env != "production" {
            t.Errorf("Expected Env to be 'production', got '%s'", cfg.Env)
        }
        if cfg.Domain != "example.com" {
            t.Errorf("Expected Domain to be 'example.com', got '%s'", cfg.Domain)
        }
        if dbCfg.User != "testuser" {
            t.Errorf("Expected DB User to be 'testuser', got '%s'", dbCfg.User)
        }
        if dbCfg.Password != "testpass" {
            t.Errorf("Expected DB Password to be 'testpass', got '%s'", dbCfg.Password)
        }
        if redisCfg.Password != "redispass" {
            t.Errorf("Expected Redis Password to be 'redispass', got '%s'", redisCfg.Password)
        }
    })
}


