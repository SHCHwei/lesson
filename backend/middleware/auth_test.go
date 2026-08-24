package middleware

import (
    "backend/database"
    "context"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/alicebob/miniredis/v2"
    "github.com/gin-gonic/gin"
    "github.com/go-redis/redis/v8"
)


func TestAuth(t *testing.T) {

    gin.SetMode(gin.TestMode)

    mr := miniredis.RunT(t)

    defer mr.Close()

    testRedisConfig := redis.NewClient(&redis.Options{
        Addr: mr.Addr(),
    })


    t.Run("No Cookie", func(t *testing.T) {
        database.SetRedisClient(testRedisConfig)
        router := gin.New()
        router.Use(Auth())

        router.GET("/test", func(c *gin.Context) {
            c.String(200, "ok")
        })

        // 建立測試請求且無cookie
        w := httptest.NewRecorder()
        req, _ := http.NewRequest("GET", "/test", nil)


        // 執行請求
        router.ServeHTTP(w, req)

        if w.Code != http.StatusUnauthorized {
            t.Errorf("Expected status %d, got %d", http.StatusUnauthorized, w.Code)
        }
    })


    t.Run("Cookie exists but session invalid", func(t *testing.T) {
        database.SetRedisClient(testRedisConfig)
        router := gin.New()
        router.Use(Auth())

        router.GET("/test", func(c *gin.Context) {
            c.String(200, "ok")
        })

        w := httptest.NewRecorder()
        req, _ := http.NewRequest("GET", "/test", nil)

        // 添加 Cookie
        req.AddCookie(&http.Cookie{
            Name:  "lesson_session_id",
            Value: "invalid_session_id",
        })

        router.ServeHTTP(w, req)
        
        if w.Code != http.StatusUnauthorized {
            t.Errorf("Expected status %d, got %d", http.StatusUnauthorized, w.Code)
        }
        
    })

    t.Run("valid session", func(t *testing.T) {
        database.SetRedisClient(testRedisConfig)
        router := gin.New()
        router.Use(Auth())

        router.GET("/test", func(c *gin.Context) {
            c.String(200, "ok")
        })
        
        sessionID := "valid_session_id"
        err := testRedisConfig.Set(context.Background(), "lesson_session:"+sessionID, "some_value", 0).Err()

        if err != nil {
            t.Fatalf("Failed to set session in miniredis: %v", err)
        }

        w := httptest.NewRecorder()
        req, _ := http.NewRequest("GET", "/test", nil)

        // 添加 Cookie
        req.AddCookie(&http.Cookie{
            Name:  "lesson_session_id",
            Value: sessionID,
        })

        router.ServeHTTP(w, req)

        if w.Code != http.StatusOK {
            t.Errorf("Expected status %d, got %d", http.StatusOK, w.Code)
        }
    })
}