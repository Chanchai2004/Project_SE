package entity

import (
	"gorm.io/gorm"
)

type Gender struct {
	gorm.Model
	GenderName string
}
