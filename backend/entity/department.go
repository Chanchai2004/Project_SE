package entity

import (
	"gorm.io/gorm"
)

type Department struct {
	gorm.Model
	DepartmentName string     `json:"department_name"`
	Employees      []Employee `gorm:"foreignKey:DepartmentID"` // เชื่อมกับ Employee โดยใช้ DepartmentID เป็น foreign key
}
