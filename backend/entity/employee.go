package entity

import (
	"time"
	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	FirstName           string            `json:"first_name"`
	LastName            string            `json:"last_name"`
	Age                 uint              `json:"age"`
	DateOfBirth         time.Time         `json:"date_of_birth"`
	Email               string            `json:"email"`
	Phone               string            `json:"phone"`
	Address             string            `json:"address"`
	Username            string            `json:"username"`
	ProfessionalLicense string            `json:"professional_license"`
	Graduate            string            `json:"graduate"`

	GenderID   uint   `json:"gender_id"`
	Gender     Gender `gorm:"foreignKey:GenderID"`

	PositionID uint     `json:"position_id"`
	Position   Position `gorm:"foreignKey:PositionID"`

	DepartmentID uint       `json:"department_id"`
	Department   Department `gorm:"foreignKey:DepartmentID"`

	StatusID uint   `json:"status_id"`
	Status   Status `gorm:"foreignKey:StatusID"`

	SpecialistID uint       `json:"specialist_id"`
	Specialist   Specialist `gorm:"foreignKey:SpecialistID"`

	// Many-to-Many relationship with Disease
	Diseases []Disease `gorm:"many2many:employee_diseases;" json:"diseases"`

	Profile  string `json:"profile" gorm:"type:longtext"`
	Password string `json:"password"`
}
