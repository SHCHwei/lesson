package middleware

import (
	"backend/config"
	"net/http"
	"net/http/httptest"
	"testing"
	"os"



	"github.com/gin-gonic/gin"
)



func TestCors(t *testing.T) {

	gin.SetMode(gin.TestMode)

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


	cfg, _, _ := config.Load()



    tests := []struct {
        name           string
        method         string
        expectedStatus int
        expectedBody   string
    }{
        {
            name:           "GET request",
            method:         http.MethodGet,
            expectedStatus: http.StatusOK,
            expectedBody:   "ok",
        },
        {
            name:           "OPTIONS request",
            method:         http.MethodOptions,
            expectedStatus: http.StatusNoContent,
            expectedBody:   "",
        },
		{
            name:           "PUT request",
            method:         http.MethodPut,
            expectedStatus: http.StatusOK,
            expectedBody:   "ok",
        },
        {
            name:           "DELETE request",
            method:         http.MethodDelete,
            expectedStatus: http.StatusOK,
            expectedBody:   "ok",
        },
    }


	for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            router := gin.New()
            router.Use(Cors(cfg))

            // 為所有方法註冊路由
            router.Any("/test", func(c *gin.Context) {
                c.String(200, "ok")
            })


            // 發送請求
            req := httptest.NewRequest(tt.method, "/test", nil)
            w := httptest.NewRecorder()
            router.ServeHTTP(w, req)


			// 檢查狀態碼
            if w.Code != tt.expectedStatus {
                t.Errorf("expected status %d, got %d", tt.expectedStatus, w.Code)
            }


			// 檢查body
            if w.Body.String() != tt.expectedBody {
                t.Errorf("expected body %q, got %q", tt.expectedBody, w.Body.String())
            }


			// 所有請求都應該設置 CORS headers
			if w.Header().Get("Access-Control-Allow-Origin") != cfg.FrontendURL {
				t.Errorf("CORS headers not set correctly for %s", tt.method)
			}
        })
    }


	

}