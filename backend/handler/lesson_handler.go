package handler

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type LessonHandler struct {
	lessonService *services.LessonService
}


type lessonInfoDTO struct {
    LessonName 		string  `json:"lessonName" binding:"required"`
    LessonDescribe 	string  `json:"lessonDescribe" binding:"required"`
    LessonTime 		string  `json:"lessonTime" binding:"required"`
    LessonAddress 	string  `json:"lessonAddress" binding:"required"`
    TuitionFee 		string  `json:"tuitionFee" binding:"required,numeric"`
    Email 			string  `json:"email" binding:"required,email"`
    SignupStartDate string  `json:"signupStartDate" binding:"required,datetime=2006-01-02"`
    SignupEndDate 	string  `json:"signupEndDate" binding:"required,datetime=2006-01-02"`
    Status 			string  `json:"status" binding:"required,oneof=1 2 3 4"`	
	TeacherID       string	`json:"teacherID" binding:"required"`	
}


func NewLessonHandler(lessonService *services.LessonService) *LessonHandler {
	return &LessonHandler{lessonService: lessonService}
}



func (h *LessonHandler) List(c *gin.Context) {
	lessons, err := h.lessonService.GetAllLessons()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lessons)
}


// func (h *LessonHandler) GetByStudentID(c *gin.Context) {
// 	id, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
// 		return
// 	}

// 	lesson, err := h.lessonService.GetLessonByID(id)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, lesson)
// }

func (h *LessonHandler) GetByID(c *gin.Context) {
	
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}
	
	lesson, students, err := h.lessonService.GetLessonByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"lesson": lesson, "students": students})
}

func (h *LessonHandler) Create(c *gin.Context) {

	var inputData lessonInfoDTO

	if err := c.ShouldBindJSON(&inputData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	var lesson models.Lesson
	lesson.LessonName = inputData.LessonName
	lesson.LessonDescribe = inputData.LessonDescribe
	lesson.LessonTime = inputData.LessonTime
	lesson.LessonAddress = inputData.LessonAddress
	lesson.TuitionFee = inputData.TuitionFee
	lesson.Email = inputData.Email
	lesson.SignupStartDate = inputData.SignupStartDate
	lesson.SignupEndDate = inputData.SignupEndDate
	lesson.Status = inputData.Status


	created, err := h.lessonService.CreateLesson(lesson, inputData.TeacherID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}


	c.JSON(http.StatusCreated, created)
}

func (h *LessonHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	var lesson models.Lesson
	if err := c.ShouldBindJSON(&lesson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	updated, err := h.lessonService.UpdateLesson(id, lesson)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (h *LessonHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	if err := h.lessonService.DeleteLesson(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "刪除成功"})
}



// 學生加入課程
func (h *LessonHandler) JoinLesson(c *gin.Context) {
	
	var applyTDO struct {
		StudentID 	int `json:"studentId"`
		LessonID  	int `json:"lessonId"`
	}
	if err := c.ShouldBindJSON(&applyTDO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}
	
	lesson, students, err := h.lessonService.GetLessonByID(applyTDO.LessonID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "課程不存在"})
		return
	}


	if err := h.lessonService.JoinLesson(applyTDO.StudentID, applyTDO.LessonID, lesson, students); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "加入課程成功"})
}


// 學生取消報名
func (h *LessonHandler) CancelLesson(c *gin.Context) {
	var applyTDO struct {
		StudentID 	int `json:"studentId"`
		LessonID  	int `json:"lessonId"`
	}
	if err := c.ShouldBindJSON(&applyTDO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}
	
	lesson, students, err := h.lessonService.GetLessonByID(applyTDO.LessonID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "課程不存在"})
		return
	}
	
	if err := h.lessonService.CancelLesson(applyTDO.StudentID, applyTDO.LessonID, lesson, students); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"message": "取消報名成功"})
}	
