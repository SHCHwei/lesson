package utils

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"backend/database"
	"github.com/go-redis/redis/v8"
)

const sessionTTL = 5 * time.Hour

func GenerateSessionID() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

func CreateSession(prefix, value string) (string, error) {
	sessionID, err := GenerateSessionID()
	if err != nil {
		return "", fmt.Errorf("generate session id: %w", err)
	}

	client := database.GetRedisClient()
	if client == nil {
		return "", fmt.Errorf("redis client is not initialized")
	}

	key := fmt.Sprintf("%s:%s", prefix, sessionID)
	if err := client.Set(context.Background(), key, value, sessionTTL).Err(); err != nil {
		return "", fmt.Errorf("save session to redis: %w", err)
	}

	return sessionID, nil
}



func CreateTeacherSession(userID string) (string, error) {
	return CreateSession("lesson_session", "teacher:"+userID)
}



func CreateStudentSession(userID string) (string, error) {
	return CreateSession("lesson_session", "student:"+userID)
}



func DeleteSession(sessionID string) error {

	client := database.GetRedisClient()
	if client == nil {
		return fmt.Errorf("redis client is not initialized")
	}

	key := "lesson_session:" + sessionID

	val, err := client.GetDel(context.Background(), key).Result()

	if errors.Is(err, redis.Nil) {
		return errors.New("session not found")
	} else if err != nil {
		return fmt.Errorf("get and delete session from redis: %w", err)
	} else {
		fmt.Printf("Retrieved and deleted value: %s\n", val)
	}

	return nil
}