package entity

import (
	"gorm.io/gorm"
)

type Disease struct {
	gorm.Model
	DiseaseName string     `json:"disease_name"`
	Employees   []Employee `gorm:"many2many:employee_diseases;" json:"employees"` // Many-to-Many relationship with Employee
}
