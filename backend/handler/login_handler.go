package handler

import (
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

type LoginDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) TeacherLogin(c *gin.Context) {
	var dto LoginDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	loginData, err := h.authService.TeacherLogin(c, dto.Email, dto.Password)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"loginData": loginData})
}

func (h *AuthHandler) StudentLogin(c *gin.Context) {
	var dto LoginDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "請求格式不正確"})
		return
	}

	loginData, err := h.authService.StudentLogin(c, dto.Email, dto.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"loginData": loginData})
}

func (h *AuthHandler) Logout(c *gin.Context)  {


	if err := h.authService.Logout(c); err != nil {
		c.JSON(http.StatusOK, gin.H{"statu": "logout failed", "error": err.Error()})
		return
	} 

	c.JSON(http.StatusOK, gin.H{"status": "logged out"})

}