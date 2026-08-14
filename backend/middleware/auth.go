package middleware

import (
	"context"
	"fmt"
	"strings"
	"log"
	"backend/database"
	"github.com/gin-gonic/gin"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		sessionID, err := c.Cookie("lesson_session_id")
		log.Printf("Auth middleware - Cookie error: %v, SessionID: %s", err, sessionID)
		if err != nil || strings.TrimSpace(sessionID) == "" {
			c.JSON(401, gin.H{"error": "未登入"})
			c.Abort()
			return
		}

		client := database.GetRedisClient()
		if client == nil {
			c.JSON(500, gin.H{"error": "redis 未初始化"})
			c.Abort()
			return
		}

		keys := fmt.Sprintf("lesson_session:%s", sessionID)

		var exists bool

		log.Println("Checking session in Redis with key:", keys)

		ok, err := client.Exists(context.Background(), keys).Result()

		if err != nil {
			c.JSON(500, gin.H{"error": "查詢 session 失敗"})
			c.Abort()
			return
		}
		
		if ok == 1 {
			exists = true
		}

		if !exists {
			c.JSON(401, gin.H{"error": "session 無效或已過期"})
			c.Abort()
			return
		}

		c.Next()
	}
}
