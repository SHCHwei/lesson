package services

import (
	"backend/models"
	"backend/config"
	"backend/utils"
	"errors"
	"strconv"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AuthService struct {
	db 	*gorm.DB
	cfg *config.Config
}

func NewAuthService(db *gorm.DB, cfg *config.Config) *AuthService {
	return &AuthService{db: db, cfg: cfg}
}

func (s *AuthService) TeacherLogin(c *gin.Context, email, password string) (map[string]string, error) {
	var teacher models.Teacher

	if err := s.db.Where("email = ?", email).First(&teacher).Error; err != nil {
		return nil, errors.New("電子郵件或密碼錯誤")
	}

	if !utils.CheckPasswordHash(password, teacher.PW) {
		return nil, errors.New("電子郵件或密碼錯誤")
	}


	teacherID := strconv.Itoa(teacher.Id)
	sessionID , err := utils.CreateTeacherSession(teacherID)
 
	if err != nil {
		return nil, errors.New("無法建立登入會話")
	}


	buildSessionCookie(c, sessionID, s.cfg)

	data := map[string]string{
		"id": teacherID,
		"email": teacher.Email,
		"name": teacher.TeacherName,
		"type": "teacher",
	}

	return data, nil
}

func (s *AuthService) StudentLogin(c *gin.Context, email, password string) (map[string]string, error) {
	var student models.Student
	if err := s.db.Where("email = ?", email).First(&student).Error; err != nil {
		return nil, errors.New("電子郵件或密碼錯誤")
	}

	if !utils.CheckPasswordHash(password, student.PW) {
		return  nil, errors.New("電子郵件或密碼錯誤")
	}

	studentID := strconv.Itoa(student.Id)
	sessionID , err := utils.CreateStudentSession(studentID)
 
	if err != nil {
		return nil, errors.New("無法建立登入會話")
	}


	buildSessionCookie(c, sessionID, s.cfg)

	data := map[string]string{
		"id": studentID,
		"email": student.Email,
		"name": student.StudentName,
		"type": "student",
	}


	return data, nil
}

func (s *AuthService) Logout(c *gin.Context) error {
	sessionID, err := c.Cookie("lesson_session_id")
	if err != nil {
		return errors.New("無法取得登入會話")
	}
	

	if err := utils.DeleteSession(sessionID) ; err != nil {
		return errors.New("無法刪除登入會話")
	}
	

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "lesson_session_id",
		Value:    sessionID,
		Path:     "/",
		Domain:   "",
		MaxAge:   -1,  // Session cookie
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,  // 允許跨域發送
	})

	return nil
}


func buildSessionCookie(c *gin.Context, sessionID string, cfg *config.Config) {

	var sameSite http.SameSite
	var secure bool

	if cfg.Env == "dev" {
		sameSite = http.SameSiteLaxMode
		secure = false
	} else {
		sameSite = http.SameSiteNoneMode
		secure = true
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "lesson_session_id",
		Value:    sessionID,
		Path:     "/",
		Domain:   "",
		MaxAge:   0,  // Session cookie
		Secure:   secure,
		HttpOnly: true,
		SameSite: sameSite,  // 允許跨域發送
	})

	

}