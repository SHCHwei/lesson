package models



type Lesson struct{
    Id 				int 	`gorm:"column:id;primaryKey;autoIncrement" json:"id"`
    LessonName 		string  `gorm:"column:lessonName" json:"lessonName"`
    LessonDescribe 	string  `gorm:"column:lessonDescribe" json:"lessonDescribe"`
    LessonTime 		string  `gorm:"column:lessonTime" json:"lessonTime"`
    LessonAddress 	string  `gorm:"column:lessonAddress" json:"lessonAddress"`
    TuitionFee 		string  `gorm:"column:tuitionFee" json:"tuitionFee"`
    Email 			string  `gorm:"column:email" json:"email"`
    SignupDates 	string  `gorm:"column:signupDates" json:"signupDates"`
    Status 			string  `gorm:"column:status" json:"status"`

    Students        []Student `gorm:"many2many:lesson_students;"`
    Teachers        []Teacher `gorm:"many2many:lesson_teachers;"`
}


type LessonService interface {
    GetAllLessons() ([]Lesson, error)
    GetLessonByID(id int) (Lesson, error)
    CreateLesson(lesson Lesson) (Lesson, error)
    UpdateLesson(id int, lesson Lesson) (Lesson, error)
    DeleteLesson(id int) error
}