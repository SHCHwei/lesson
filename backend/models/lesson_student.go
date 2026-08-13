package models

import "time"

type LessonStudent struct {
	ID         int       `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	LessonID   int       `gorm:"column:lesson_id;not null;index:idx_lesson_student,unique" json:"lessonId"`
	StudentID  int       `gorm:"column:student_id;not null;index:idx_lesson_student,unique" json:"studentId"`
	SignupDate time.Time `gorm:"column:signup_date;autoCreateTime" json:"signupDate"`
	Status     string    `gorm:"column:status;default:'active'" json:"status"`

	Lesson  Lesson  `gorm:"foreignKey:LessonID;references:Id"`
	Student Student `gorm:"foreignKey:StudentID;references:Id"`
}
