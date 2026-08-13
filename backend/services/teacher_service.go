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

	if err := s.db.Preload("Lesson").First(&teacher, id).Error; err != nil {
		return teacher, err
	}

	return teacher, nil
}
