package services

import (
	"backend/models"
	"backend/utils"
	"errors"

	"gorm.io/gorm"
)

type TeacherService struct {
	db *gorm.DB
}

func NewTeacherService(db *gorm.DB) *TeacherService {
	return &TeacherService{db: db}
}

func (s *TeacherService) CreateTeacher(teacher models.Teacher) (models.Teacher, error) {
	if s.db == nil {
		return teacher, errors.New("database is not initialized")
	}

	if hashPw, err := utils.HashPassword(teacher.PW); err != nil {
		return teacher, errors.New("failed to hash password")
	} else {
		teacher.PW = hashPw
	}

	if err := s.db.Create(&teacher).Error; err != nil {
		return teacher, err
	}

	// 清空密碼不返回
	teacher.PW = ""
	return teacher, nil
}

func (s *TeacherService) GetAllTeachers() ([]models.Teacher, error) {
	var teachers []models.Teacher
	if err := s.db.Find(&teachers).Error; err != nil {
		return nil, err
	}
	return teachers, nil
}

func (s *TeacherService) GetTeacherByID(id int) (models.Teacher, error) {
	var teacher models.Teacher
	if err := s.db.First(&teacher, id).Error; err != nil {
		return teacher, err
	}
	return teacher, nil
}

func (s *TeacherService) UpdateTeacher(id int, teacher models.Teacher) (models.Teacher, error) {
	var existing models.Teacher
	if err := s.db.First(&existing, id).Error; err != nil {
		return existing, err
	}

	teacher.Id = id
	if err := s.db.Save(&teacher).Error; err != nil {
		return teacher, err
	}
	return teacher, nil
}

func (s *TeacherService) DeleteTeacher(id int) error {
	return s.db.Delete(&models.Teacher{}, id).Error
}

func (s *TeacherService) SearchLessonByTeacherID(id int) (models.Teacher, error) {
	var teacher models.Teacher

	// 預加載課程和每個課程的學生列表
	if err := s.db.Preload("Lesson.Students").First(&teacher, id).Error; err != nil {
		return teacher, err
	}

	// 清除老師密碼
	teacher.PW = ""

	// 清空每個課程中學生的密碼
	for i := range teacher.Lesson {
		for j := range teacher.Lesson[i].Students {
			teacher.Lesson[i].Students[j].PW = ""
		}
	}

	return teacher, nil
}

func (s *TeacherService) UpdatePassword(id int, newPassword string, currentPassword string) error {
	var teacher models.Teacher

	if err := s.db.First(&teacher, id).Error; err != nil {
		return err
	}

	if !utils.CheckPasswordHash(currentPassword, teacher.PW) {
		return errors.New("current password is incorrect")
	}

	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	teacher.PW = hashedPassword

	if err := s.db.Save(&teacher).Error; err != nil {
		return err
	}

	return nil
}
