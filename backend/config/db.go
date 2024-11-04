package config

import (
	"fmt"
	"time"

	"example/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("hospital.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.Employee{},
		&entity.Gender{},
		&entity.Position{},
		&entity.Department{},
		&entity.Status{},
		&entity.Specialist{},
	)

	// Initial data creation
	GenderMale := entity.Gender{GenderName: "Male"}
	GenderFemale := entity.Gender{GenderName: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Gender{GenderName: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{GenderName: "Female"})

	PositionDoctor := entity.Position{PositionName: "Doctor"}
	db.FirstOrCreate(&PositionDoctor, &entity.Position{PositionName: "Doctor"})

	DepartmentEmergency := entity.Department{DepartmentName: "Emergency"}
	db.FirstOrCreate(&DepartmentEmergency, &entity.Department{DepartmentName: "Emergency"})

	StatusActive := entity.Status{StatusName: "Active"}
	db.FirstOrCreate(&StatusActive, &entity.Status{StatusName: "Active"})

	SpecialistCardiologist := entity.Specialist{SpecialistName: "Cardiologist"}
	db.FirstOrCreate(&SpecialistCardiologist, &entity.Specialist{SpecialistName: "Cardiologist"})

	// Hash password
	hashedPassword, _ := HashPassword("123456")

	// Create an Employee
	employee := entity.Employee{
		FirstName:          "John",
		LastName:           "Doe",
		Age:                30,
		Email:              "john.doe@example.com",
		DateOfBirth:        time.Date(1993, time.January, 1, 0, 0, 0, 0, time.UTC),
		Phone:              "123-456-7890",
		Address:            "123 Main St",
		Username:           "johndoe",
		ProfessionalLicense: "12345-AB",
		CongenitalDisease:  "None",
		Graduate:           "Bachelor of Medicine",
		Password:           hashedPassword,
		GenderID:           GenderMale.ID,
		PositionID:         PositionDoctor.ID,
		DepartmentID:       DepartmentEmergency.ID,
		StatusID:           StatusActive.ID,
		SpecialistID:       SpecialistCardiologist.ID,
	}

	db.FirstOrCreate(&employee, &entity.Employee{Email: "john.doe@example.com"})
}
