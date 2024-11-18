package entity

import (
	"gorm.io/gorm"
)

type BloodGroup struct {
	gorm.Model
	BloodGroup  string     `json:"blood_group"`           // เช่น A, B, AB, O
	Employees  []Employee `gorm:"foreignKey:BloodGroupID"` // เชื่อมกับ Employee โดยใช้ BloodGroupID เป็น foreign key
}