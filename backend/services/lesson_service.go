package services

import (
	"backend/models"
	"errors"
	"log"
	"strconv"

	"gorm.io/gorm"
)

type LessonService struct {
	db *gorm.DB
}

func NewLessonService(db *gorm.DB) *LessonService {
	return &LessonService{db: db}
}

func (s *LessonService) CreateLesson(lesson models.Lesson, TeacherID string) (models.Lesson, error) {
	if s.db == nil {
		return lesson, errors.New("database is not initialized")
	}

	teacher_id, err := strconv.Atoi(TeacherID)
	if err != nil {
		return lesson, errors.New("teacher id 格式不正確")
	}

	var teacher models.Teacher

	s.db.First(&teacher, teacher_id)

	dbErr := s.db.Transaction(func(tx *gorm.DB) error {

		if err := tx.Create(&lesson).Error; err != nil {
			return err
		}

		log.Println("transcation", teacher)

		if err := tx.Model(&teacher).Association("Lesson").Append(&lesson); err != nil {
			return err
		}

		return nil
	})

	if dbErr != nil {
		return lesson, dbErr
	}

	return lesson, nil
}

func (s *LessonService) GetAllLessons() ([]models.Lesson, error) {
	var lessons []models.Lesson
	if err := s.db.Find(&lessons).Error; err != nil {
		return nil, err
	}
	return lessons, nil
}

// 取得單一課程資訊，若課程狀態為 3 或 4，則同時取得報名學生資訊
func (s *LessonService) GetLessonByID(id int) (models.Lesson, []models.Student, error) {
	var lesson models.Lesson
	var students []models.Student

	if err := s.db.First(&lesson, id).Error; err != nil {
		return lesson, nil, err
	}

	if lesson.Status == "2" || lesson.Status == "3" || lesson.Status == "4" {
		err := s.db.Model(&lesson).Association("Students").Find(&students)
		if err != nil {
			return lesson, nil, err
		}
	}

	return lesson, students, nil
}

func (s *LessonService) UpdateLesson(id int, lesson models.Lesson) (models.Lesson, error) {
	var existing models.Lesson
	if err := s.db.First(&existing, id).Error; err != nil {
		return existing, err
	}

	lesson.Id = id
	if err := s.db.Save(&lesson).Error; err != nil {
		return lesson, err
	}
	return lesson, nil
}

func (s *LessonService) DeleteLesson(id int) error {
	return s.db.Delete(&models.Lesson{}, id).Error
}

// 取得報名中、進行中課程列表給學生看
func (s *LessonService) GetOpenLessons(id int) (map[int]map[string]string, error) {
	var lessons []models.Lesson
	var lessonMap = make(map[int]map[string]string)

	if err := s.db.Where("status IN ?", []string{"2", "3"}).Find(&lessons).Error; err != nil {
		return nil, err
	}

	// 取得該學生已加入的課程
	var student models.Student
	if err := s.db.Preload("Lesson").First(&student, id).Error; err != nil {
		// 如果找不到學生，回傳空的課程列表
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return lessonMap, nil
		}
		return nil, err
	}

	// 建立已加入課程的 map 方便查詢
	joinedLessonMap := make(map[int]bool)
	for _, lesson := range student.Lesson {
		joinedLessonMap[lesson.Id] = true
	}

	for i := range lessons {
		isJoined := "false"
		// 檢查學生是否已加入此課程
		if joinedLessonMap[lessons[i].Id] {
			isJoined = "true"
		}

		lessonMap[lessons[i].Id] = map[string]string{
			"name":       lessons[i].LessonName,
			"lessonTime": lessons[i].LessonTime,
			"status":     lessons[i].Status,
			"isJoined":   isJoined,
		}
	}

	return lessonMap, nil
}

func (s *LessonService) JoinLesson(studentID int, lessonID int, lesson models.Lesson, students []models.Student) error {

	// 檢查課程是否已經結束或取消
	if lesson.Status == "3" || lesson.Status == "4" {
		return errors.New("課程已經結束或取消，無法加入")
	}

	
	var student models.Student
	if err := s.db.First(&student, studentID).Error; err != nil {
		return err
	}

	// 檢查學生是否已經加入課程
	for _, s := range students {
		if s.Id == studentID {
			return errors.New("已經加入課程")
		}
	}

	// 將學生加入課程
	if err := s.db.Model(&lesson).Association("Students").Append(&student); err != nil {
		return err
	}

	return nil
}


func (s *LessonService) CancelLesson(studentID int, lessonID int, lesson models.Lesson, students []models.Student) error {

	// 檢查課程是否已經結束或取消
	if lesson.Status == "3" || lesson.Status == "4" {
		return errors.New("課程已經結束或取消，無法取消報名")
	}

	// 將學生從課程中移除
	var student models.Student
	if err := s.db.First(&student, studentID).Error; err != nil {
		return err
	}

	if err := s.db.Model(&lesson).Association("Students").Delete(&student); err != nil {
		return err
	}

	return nil
}
