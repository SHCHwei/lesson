package main

import (
	"backend/config"
	"backend/database"
	"backend/handler"
	"backend/router"
	"backend/services"
	"log"
)

func main() {

	cfg, DBcfg, Rediscfg := config.Load()

	log.Println(cfg, DBcfg, Rediscfg)

	database.InitDB(DBcfg, Rediscfg)

	authService := services.NewAuthService(database.GormDB, cfg)
	studentService := services.NewStudentService(database.GormDB)
	teacherService := services.NewTeacherService(database.GormDB)
	lessonService := services.NewLessonService(database.GormDB)



	authHandler := handler.NewAuthHandler(authService)
	studentHandler := handler.NewStudentHandler(studentService, lessonService)
	lessonHandler := handler.NewLessonHandler(lessonService)
	teacherHandler := handler.NewTeacherHandler(teacherService)

	r := router.SetupRouter(authHandler, studentHandler, lessonHandler, teacherHandler)

	listenAddr := ":" + cfg.Port
	if cfg.Port == "" {
		listenAddr = ":8080"
	}

	r.Run(listenAddr)
}
