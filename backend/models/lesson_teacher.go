package models



type LessonTeacher struct {
	ID         int       `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	LessonID   int       `gorm:"column:lesson_id;not null;index:idx_lesson_teacher,unique" json:"lessonId"`
	TeacherID  int       `gorm:"column:teacher_id;not null;index:idx_lesson_teacher,unique" json:"teacherId"`
	Status     string    `gorm:"column:status;default:'active'" json:"status"`

	Lesson  Lesson  `gorm:"foreignKey:LessonID;references:Id"`
	Teacher Teacher `gorm:"foreignKey:TeacherID;references:Id"`
}



type LessonTeacherService interface {
	CreateLessonTeacher(lessonTeacher *LessonTeacher) error
	UpdateLessonTeacher() error
	SearchLessonByTeacherID(teacherID int)([]LessonTeacher, error)

}