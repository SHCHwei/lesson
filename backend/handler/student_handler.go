package handler

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type StudentHandler struct {
	studentService *services.StudentService
	lessonService *services.LessonService
}

func NewStudentHandler(studentService *services.StudentService, lessonService *services.LessonService) *StudentHandler {
	return &StudentHandler{studentService: studentService, lessonService: lessonService}
}

func (h *StudentHandler) List(c *gin.Context) {
	students, err := h.studentService.GetAllStudents()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, students)
}

func (h *StudentHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	student, err := h.studentService.GetStudentByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, student)
}

func (h *StudentHandler) Create(c *gin.Context) {
	var student models.Student
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	created, err := h.studentService.CreateStudent(student)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

func (h *StudentHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	var student models.Student
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	updated, err := h.studentService.UpdateStudent(id, student)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (h *StudentHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	if err := h.studentService.DeleteStudent(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "刪除成功"})
}




// 開放給學生的課程列表
func (h *StudentHandler) GetLessonList(c *gin.Context) {

	studentID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	lessonList, err := h.lessonService.GetOpenLessons(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, lessonList)
}



func (h *StudentHandler) UpdatePassword(c *gin.Context) {

	var updateDTO struct {
		StudentID   	string `json:"studentID" binding:"required"`
		CurrentPassword string `json:"currentPassword" binding:"required,nefield=NewPassword"`
		NewPassword     string `json:"newPassword" binding:"required,gte=6"`
	}
	
	if err := c.ShouldBindJSON(&updateDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	studentID, err := strconv.Atoi(updateDTO.StudentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id 格式不正確"})
		return
	}

	if err := h.studentService.UpdatePassword(studentID, updateDTO.NewPassword, updateDTO.CurrentPassword); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "密碼更新成功"})
}