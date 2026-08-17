package models

type Teacher struct{
    Id 			int 	`gorm:"column:id;primaryKey;autoIncrement" json:"id"`
    PW 			string  `gorm:"column:password" json:"password"`
    TeacherName string  `gorm:"column:teacherName" json:"teacherName"`
    Email 		string  `gorm:"column:email;index;unique" json:"email"`
    Phone 		string  `gorm:"column:phone" json:"phone"`
    Profile 	string  `gorm:"column:profile" json:"profile"`
    Major 		string  `gorm:"column:major" json:"major"`

    Lesson      []Lesson `gorm:"many2many:lesson_teachers;"`
}


type TeacherService interface {
    CreateTeacher(teacher Teacher) (Teacher, error)
    GetAllTeachers() ([]Teacher, error)
    GetTeacherByID(id int) (Teacher, error)
    UpdateTeacher(id int, teacher Teacher) (Teacher, error)
    DeleteTeacher(id int) error
    SearchLessonByTeacherID(id int)(Teacher, error)
    UpdatePassword(id int, newPassword string, currentPassword string) error
    GetOverview()(map[string]interface{})
}