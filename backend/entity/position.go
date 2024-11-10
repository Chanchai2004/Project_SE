package entity

import (
	"gorm.io/gorm"
)

type Position struct {
	gorm.Model
	PositionName string     `json:"position_name"`
	Employees    []Employee `gorm:"foreignKey:PositionID"` // เชื่อมกับ Employee โดยใช้ PositionID เป็น foreign key
}
