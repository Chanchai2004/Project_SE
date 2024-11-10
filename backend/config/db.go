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
	// AutoMigrate ตารางทั้งหมด โดยไม่ต้องใส่ EmployeeDisease เพราะ GORM จะสร้างให้อัตโนมัติ
	db.AutoMigrate(
		&entity.Employee{},
		&entity.Gender{},
		&entity.Position{},
		&entity.Department{},
		&entity.Status{},
		&entity.Specialist{},
		&entity.Disease{}, // เพิ่ม Disease
	)

	// สร้างข้อมูลเริ่มต้นในแต่ละตาราง
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

	// สร้าง Disease ตัวอย่าง
	Disease1 := entity.Disease{DiseaseName: "Hypertension"}
	Disease2 := entity.Disease{DiseaseName: "Diabetes"}
	db.FirstOrCreate(&Disease1, &entity.Disease{DiseaseName: "Hypertension"})
	db.FirstOrCreate(&Disease2, &entity.Disease{DiseaseName: "Diabetes"})

	// เข้ารหัสรหัสผ่าน
	hashedPassword, _ := HashPassword("123456")

	// สร้าง Employee พร้อมข้อมูลเริ่มต้น โดยเว้น profile ไว้เป็น null
	employee := entity.Employee{
		FirstName:           "John",
		LastName:            "Doe",
		Age:                 30,
		Email:               "john.doe@example.com",
		DateOfBirth:         time.Date(1993, time.January, 1, 0, 0, 0, 0, time.UTC),
		Phone:               "123-456-7890",
		Address:             "123 Main St",
		Username:            "johndoe",
		ProfessionalLicense: "12345-AB",
		Graduate:            "Bachelor of Medicine",
		Password:            hashedPassword,
		GenderID:            GenderMale.ID,
		PositionID:          PositionDoctor.ID,
		DepartmentID:        DepartmentEmergency.ID,
		StatusID:            StatusActive.ID,
		SpecialistID:        SpecialistCardiologist.ID,
		Profile:             "", // ตั้งค่า Profile ให้เป็นค่า null
	}

	db.FirstOrCreate(&employee, &entity.Employee{Email: "john.doe@example.com"})

	// เพิ่มความสัมพันธ์ Many-to-Many กับ Disease
	db.Model(&employee).Association("Diseases").Append([]entity.Disease{Disease1, Disease2})
}
