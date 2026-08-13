package models


type Student struct{
    Id          int     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
    Email       string  `gorm:"column:email;index;unique" json:"email"`
    PW          string  `gorm:"column:password" json:"password"`
    StudentName string  `gorm:"column:studentName" json:"studentName"`
    Phone       string  `gorm:"column:phone" json:"phone"`

    Lesson      []Lesson `gorm:"many2many:lesson_students;"`    
}



type StudentService interface {
    CreateStudent(student Student) (Student, error)
    GetAllStudents() ([]Student, error)
    GetStudentByID(id int) (Student, error)
    UpdateStudent(id int, student Student) (Student, error)
    DeleteStudent(id int) error

    SearchLessonByStudentID(id int) (Student, error)
}
