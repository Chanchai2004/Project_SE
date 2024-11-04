package entity

import (
	"gorm.io/gorm"
)

type Specialist struct {
	gorm.Model
	SpecialistName string
}
