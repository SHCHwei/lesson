package services

import (
	"backend/models"
	"backend/utils"
	"errors"
	"time"

	"gorm.io/gorm"
)

type StudentService struct {
	db *gorm.DB
}

func NewStudentService(db *gorm.DB) *StudentService {
	return &StudentService{db: db}
}

func (s *StudentService) CreateStudent(student models.Student) (models.Student, error) {
	if s.db == nil {
		return student, errors.New("database is not initialized")
	}

	if hashPw, err := utils.HashPassword(student.PW); err != nil {
		return student, errors.New("failed to hash password")
	} else {
		student.PW = hashPw
	}

	if err := s.db.Create(&student).Error; err != nil {
		return student, err
	}

	return student, nil
}

func (s *StudentService) GetAllStudents() ([]models.Student, error) {
	var students []models.Student
	if err := s.db.Find(&students).Error; err != nil {
		return nil, err
	}
	return students, nil
}

func (s *StudentService) GetStudentByID(id int) (models.Student, error) {
	var student models.Student
	if err := s.db.First(&student, id).Error; err != nil {
		return student, err
	}
	return student, nil
}

func (s *StudentService) UpdateStudent(id int, student models.Student) (models.Student, error) {
	var existing models.Student
	if err := s.db.First(&existing, id).Error; err != nil {
		return existing, err
	}

	student.Id = id
	if err := s.db.Save(&student).Error; err != nil {
		return student, err
	}
	return student, nil
}

func (s *StudentService) DeleteStudent(id int) error {
	return s.db.Delete(&models.Student{}, id).Error
}

func (s *StudentService) UpdatePassword(id int, newPassword string, currentPassword string) error {
	var student models.Student

	if err := s.db.First(&student, id).Error; err != nil {
		return err
	}

	if !utils.CheckPasswordHash(currentPassword, student.PW) {
		return errors.New("current password is incorrect")
	}

	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	student.PW = hashedPassword

	if err := s.db.Save(&student).Error; err != nil {
		return err
	}

	return nil
}

func (s *StudentService) GetOverview() map[string]any {

	var signupStartLessons []models.Lesson

	// 即將開課的課程
	s.db.Preload("Teachers").Where("signupStartDate > ? and status = ?", time.Now(), "1").Order("signupStartDate").Limit(5).Find(&signupStartLessons)

	// 即將報名結束的課程
	var endingOpenLessons []models.Lesson
	s.db.Preload("Teachers").Where("signupEndDate > ? and status = ? ", time.Now(), "2").Order("signupEndDate").Limit(5).Find(&endingOpenLessons)

	return map[string]any{
		"beginningOpenLessons": signupStartLessons,
		"endingOpenLessons":    endingOpenLessons,
	}
}
