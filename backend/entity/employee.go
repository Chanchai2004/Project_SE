package entity

import (
	"time"
	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	FirstName          string
	LastName           string
	Age                uint
	DateOfBirth        time.Time
	Email              string
	Phone              string
	Address            string
	Username           string  // New field for username
	ProfessionalLicense string // New field for professional license
	CongenitalDisease  string  // New field for congenital disease
	Graduate           string  // New field for graduate information

	// Foreign Keys and Relationships
	GenderID     uint       // ForeignKey to Gender
	Gender       Gender     `gorm:"foreignKey:GenderID"`

	PositionID   uint       // ForeignKey to Position
	Position     Position   `gorm:"foreignKey:PositionID"`

	DepartmentID uint       // ForeignKey to Department
	Department   Department `gorm:"foreignKey:DepartmentID"`

	StatusID     uint       // ForeignKey to Status
	Status       Status     `gorm:"foreignKey:StatusID"`

	SpecialistID uint       // ForeignKey to Specialist
	Specialist   Specialist `gorm:"foreignKey:SpecialistID"`

	Profile      string     `gorm:"type:longtext"`
	Password     string
}
