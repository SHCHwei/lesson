package router

import (
	"backend/config"
	"backend/handler"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *config.Config, authHandler *handler.AuthHandler, studentHandler *handler.StudentHandler, lessonHandler *handler.LessonHandler, teacherHandler *handler.TeacherHandler) *gin.Engine {
	r := gin.New()

	r.Use(middleware.Cors(cfg))

	// Health Check API
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Service is running",
		})
	})

	r.POST("/api/v1/teacher/login", authHandler.TeacherLogin)
	r.POST("/api/v1/student/login", authHandler.StudentLogin)

	r.POST("/api/v1/Logout", authHandler.Logout)

	r.POST("/api/v1/teacher/create", teacherHandler.Create)
	r.POST("/api/v1/student/create", studentHandler.Create)

	studentRoutes := r.Group("/api/v1/students")
	studentRoutes.Use(middleware.Auth())
	{
		studentRoutes.GET("/", studentHandler.List)
		studentRoutes.GET("/:id", studentHandler.GetByID)
		studentRoutes.PUT("/:id", studentHandler.Update)
		studentRoutes.DELETE("/:id", studentHandler.Delete)
		studentRoutes.GET("/:id/lessonList", studentHandler.GetLessonList)
	}

	lessonRoutes := r.Group("/api/v1/lessons")
	lessonRoutes.Use(middleware.Auth())
	{
		lessonRoutes.POST("/", lessonHandler.Create)
		lessonRoutes.GET("/", lessonHandler.List)
		lessonRoutes.GET("/:id", lessonHandler.GetByID)
		lessonRoutes.PUT("/:id", lessonHandler.Update)
		lessonRoutes.DELETE("/:id", lessonHandler.Delete)

		lessonRoutes.POST("/joinLesson", lessonHandler.JoinLesson)
		lessonRoutes.POST("/cancelLesson", lessonHandler.CancelLesson)
	}

	teacherRoutes := r.Group("/api/v1/teachers")
	teacherRoutes.Use(middleware.Auth())
	{
		teacherRoutes.GET("/", teacherHandler.List)
		teacherRoutes.GET("/:id", teacherHandler.GetByID)
		teacherRoutes.PUT("/:id", teacherHandler.Update)
		teacherRoutes.DELETE("/:id", teacherHandler.Delete)
		teacherRoutes.GET("/:id/lessonList", teacherHandler.SearchLessonByTeacherID)
	}

	return r
}
