package handler

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
)

type TeacherHandler struct {
	teacherService *services.TeacherService
}



func NewTeacherHandler(teacherService *services.TeacherService) *TeacherHandler {
	return &TeacherHandler{teacherService: teacherService}
}

func (h *TeacherHandler) List(c *gin.Context) {
	teachers, err := h.teacherService.GetAllTeachers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, teachers)
}

func (h *TeacherHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	teacher, err := h.teacherService.GetTeacherByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, teacher)
}

func (h *TeacherHandler) Create(c *gin.Context) {
	var teacher models.Teacher

	if err := c.ShouldBindJSON(&teacher); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	created, err := h.teacherService.CreateTeacher(teacher)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (h *TeacherHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	var teacher models.Teacher
	if err := c.ShouldBindJSON(&teacher); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	updated, err := h.teacherService.UpdateTeacher(id, teacher)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (h *TeacherHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	if err := h.teacherService.DeleteTeacher(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "刪除成功"})
}


func (h *TeacherHandler) SearchLessonByTeacherID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id 格式不正確"})
		return
	}

	lesson, err := h.teacherService.SearchLessonByTeacherID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, lesson)
}