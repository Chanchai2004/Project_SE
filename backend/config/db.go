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
		&entity.Disease{},
		&entity.BloodGroup{}, // เพิ่ม BloodGroup
	)

	// สร้างข้อมูลเริ่มต้นในแต่ละตาราง
	GenderMale := entity.Gender{GenderName: "Male"}
	GenderFemale := entity.Gender{GenderName: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Gender{GenderName: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{GenderName: "Female"})

	PositionDoctor := entity.Position{PositionName: "Doctor"}
PositionNurse := entity.Position{PositionName: "Nurse"}
PositionFinance := entity.Position{PositionName: "Finance Staff"}
PositionNurseCounter := entity.Position{PositionName: "Nurse counter"}
PositionAdmin := entity.Position{PositionName: "Admin"}
PositionPharmacy := entity.Position{PositionName: "Pharmacy"}

// ใช้ db.FirstOrCreate เพื่อป้องกันข้อมูลซ้ำ
db.FirstOrCreate(&PositionDoctor, &entity.Position{PositionName: "Doctor"})
db.FirstOrCreate(&PositionNurse, &entity.Position{PositionName: "Nurse"})
db.FirstOrCreate(&PositionFinance, &entity.Position{PositionName: "Finance Staff"})
db.FirstOrCreate(&PositionNurseCounter, &entity.Position{PositionName: "Nurse counter"})
db.FirstOrCreate(&PositionAdmin, &entity.Position{PositionName: "Admin"})
db.FirstOrCreate(&PositionPharmacy, &entity.Position{PositionName: "Pharmacy"})

	// สร้าง Department ตัวอย่าง
Department0 := entity.Department{DepartmentName: "None"}
Department1 := entity.Department{DepartmentName: "Emergency"}
Department2 := entity.Department{DepartmentName: "Pediatrics"}
Department3 := entity.Department{DepartmentName: "Cardiology"}
Department4 := entity.Department{DepartmentName: "Neurology"}
Department5 := entity.Department{DepartmentName: "Orthopedics"}
Department6 := entity.Department{DepartmentName: "Radiology"}
Department7 := entity.Department{DepartmentName: "Pharmacy"}

db.FirstOrCreate(&Department0, &entity.Department{DepartmentName: "None"})
db.FirstOrCreate(&Department1, &entity.Department{DepartmentName: "Emergency"})
db.FirstOrCreate(&Department2, &entity.Department{DepartmentName: "Pediatrics"})
db.FirstOrCreate(&Department3, &entity.Department{DepartmentName: "Cardiology"})
db.FirstOrCreate(&Department4, &entity.Department{DepartmentName: "Neurology"})
db.FirstOrCreate(&Department5, &entity.Department{DepartmentName: "Orthopedics"})
db.FirstOrCreate(&Department6, &entity.Department{DepartmentName: "Radiology"})
db.FirstOrCreate(&Department7, &entity.Department{DepartmentName: "Pharmacy"})


	// สร้าง Status ตัวอย่าง
StatusActive := entity.Status{StatusName: "Active"} // กำลังทำงานอยู่
StatusOnLeave := entity.Status{StatusName: "On Leave"} // กำลังลาพัก (เช่น ลาคลอด, ลาป่วย)
StatusSuspended := entity.Status{StatusName: "Suspended"} // ถูกพักงานชั่วคราว
StatusResigned := entity.Status{StatusName: "Resigned"} // ลาออก
StatusRetired := entity.Status{StatusName: "Retired"} // เกษียณอายุ
StatusTerminated := entity.Status{StatusName: "Terminated"} // ถูกยกเลิกสัญญาจ้าง

db.FirstOrCreate(&StatusActive, &entity.Status{StatusName: "Active"})
db.FirstOrCreate(&StatusOnLeave, &entity.Status{StatusName: "On Leave"})
db.FirstOrCreate(&StatusSuspended, &entity.Status{StatusName: "Suspended"})
db.FirstOrCreate(&StatusResigned, &entity.Status{StatusName: "Resigned"})
db.FirstOrCreate(&StatusRetired, &entity.Status{StatusName: "Retired"})
db.FirstOrCreate(&StatusTerminated, &entity.Status{StatusName: "Terminated"})

	// สร้าง Specialist ตัวอย่าง
SpecialistNone := entity.Specialist{SpecialistName: "None"} // หัวใจ
SpecialistCardiology := entity.Specialist{SpecialistName: "Cardiology"} // หัวใจ
SpecialistNeurology := entity.Specialist{SpecialistName: "Neurology"} // ประสาทวิทยา
SpecialistPediatrics := entity.Specialist{SpecialistName: "Pediatrics"} // กุมารเวชศาสตร์
SpecialistOrthopedics := entity.Specialist{SpecialistName: "Orthopedics"} // กระดูกและข้อ
SpecialistRadiology := entity.Specialist{SpecialistName: "Radiology"} // รังสีวิทยา
SpecialistDermatology := entity.Specialist{SpecialistName: "Dermatology"} // ผิวหนัง
SpecialistOncology := entity.Specialist{SpecialistName: "Oncology"} // มะเร็งวิทยา
SpecialistGynecology := entity.Specialist{SpecialistName: "Gynecology"} // นรีเวชศาสตร์
SpecialistOphthalmology := entity.Specialist{SpecialistName: "Ophthalmology"} // จักษุวิทยา
SpecialistPsychiatry := entity.Specialist{SpecialistName: "Psychiatry"} // จิตเวชศาสตร์

db.FirstOrCreate(&SpecialistNone, &entity.Specialist{SpecialistName: "None"})
db.FirstOrCreate(&SpecialistCardiology, &entity.Specialist{SpecialistName: "Cardiology"})
db.FirstOrCreate(&SpecialistNeurology, &entity.Specialist{SpecialistName: "Neurology"})
db.FirstOrCreate(&SpecialistPediatrics, &entity.Specialist{SpecialistName: "Pediatrics"})
db.FirstOrCreate(&SpecialistOrthopedics, &entity.Specialist{SpecialistName: "Orthopedics"})
db.FirstOrCreate(&SpecialistRadiology, &entity.Specialist{SpecialistName: "Radiology"})
db.FirstOrCreate(&SpecialistDermatology, &entity.Specialist{SpecialistName: "Dermatology"})
db.FirstOrCreate(&SpecialistOncology, &entity.Specialist{SpecialistName: "Oncology"})
db.FirstOrCreate(&SpecialistGynecology, &entity.Specialist{SpecialistName: "Gynecology"})
db.FirstOrCreate(&SpecialistOphthalmology, &entity.Specialist{SpecialistName: "Ophthalmology"})
db.FirstOrCreate(&SpecialistPsychiatry, &entity.Specialist{SpecialistName: "Psychiatry"})

	// สร้าง Disease ตัวอย่าง
Disease0 := entity.Disease{DiseaseName: "None"}
Disease1 := entity.Disease{DiseaseName: "Hypertension"}
Disease2 := entity.Disease{DiseaseName: "Diabetes"}
Disease3 := entity.Disease{DiseaseName: "Asthma"}
Disease4 := entity.Disease{DiseaseName: "Tuberculosis"}
Disease5 := entity.Disease{DiseaseName: "HIV/AIDS"}
Disease6 := entity.Disease{DiseaseName: "Cancer"}
Disease7 := entity.Disease{DiseaseName: "Chronic Kidney Disease"}
Disease8 := entity.Disease{DiseaseName: "Heart Disease"}
Disease9 := entity.Disease{DiseaseName: "Stroke"}
Disease10 := entity.Disease{DiseaseName: "Alzheimer's Disease"}
Disease11 := entity.Disease{DiseaseName: "Parkinson's Disease"}
Disease12 := entity.Disease{DiseaseName: "Pneumonia"}
Disease13 := entity.Disease{DiseaseName: "Dengue Fever"}
Disease14 := entity.Disease{DiseaseName: "Malaria"}
Disease15 := entity.Disease{DiseaseName: "COVID-19"}
Disease16 := entity.Disease{DiseaseName: "Hepatitis B"}
Disease17 := entity.Disease{DiseaseName: "Hepatitis C"}
Disease18 := entity.Disease{DiseaseName: "Arthritis"}
Disease19 := entity.Disease{DiseaseName: "Migraine"}
Disease20 := entity.Disease{DiseaseName: "Obesity"}

db.FirstOrCreate(&Disease0, &entity.Disease{DiseaseName: "None"})
db.FirstOrCreate(&Disease1, &entity.Disease{DiseaseName: "Hypertension"})
db.FirstOrCreate(&Disease2, &entity.Disease{DiseaseName: "Diabetes"})
db.FirstOrCreate(&Disease3, &entity.Disease{DiseaseName: "Asthma"})
db.FirstOrCreate(&Disease4, &entity.Disease{DiseaseName: "Tuberculosis"})
db.FirstOrCreate(&Disease5, &entity.Disease{DiseaseName: "HIV/AIDS"})
db.FirstOrCreate(&Disease6, &entity.Disease{DiseaseName: "Cancer"})
db.FirstOrCreate(&Disease7, &entity.Disease{DiseaseName: "Chronic Kidney Disease"})
db.FirstOrCreate(&Disease8, &entity.Disease{DiseaseName: "Heart Disease"})
db.FirstOrCreate(&Disease9, &entity.Disease{DiseaseName: "Stroke"})
db.FirstOrCreate(&Disease10, &entity.Disease{DiseaseName: "Alzheimer's Disease"})
db.FirstOrCreate(&Disease11, &entity.Disease{DiseaseName: "Parkinson's Disease"})
db.FirstOrCreate(&Disease12, &entity.Disease{DiseaseName: "Pneumonia"})
db.FirstOrCreate(&Disease13, &entity.Disease{DiseaseName: "Dengue Fever"})
db.FirstOrCreate(&Disease14, &entity.Disease{DiseaseName: "Malaria"})
db.FirstOrCreate(&Disease15, &entity.Disease{DiseaseName: "COVID-19"})
db.FirstOrCreate(&Disease16, &entity.Disease{DiseaseName: "Hepatitis B"})
db.FirstOrCreate(&Disease17, &entity.Disease{DiseaseName: "Hepatitis C"})
db.FirstOrCreate(&Disease18, &entity.Disease{DiseaseName: "Arthritis"})
db.FirstOrCreate(&Disease19, &entity.Disease{DiseaseName: "Migraine"})
db.FirstOrCreate(&Disease20, &entity.Disease{DiseaseName: "Obesity"})

	// สร้าง BloodGroup ตัวอย่าง
	BloodGroupA := entity.BloodGroup{BloodGroup: "A"}
	BloodGroupB := entity.BloodGroup{BloodGroup: "B"}
	BloodGroupAB := entity.BloodGroup{BloodGroup: "AB"}
	BloodGroupO := entity.BloodGroup{BloodGroup: "O"}
	db.FirstOrCreate(&BloodGroupA, &entity.BloodGroup{BloodGroup: "A"})
	db.FirstOrCreate(&BloodGroupB, &entity.BloodGroup{BloodGroup: "B"})
	db.FirstOrCreate(&BloodGroupAB, &entity.BloodGroup{BloodGroup: "AB"})
	db.FirstOrCreate(&BloodGroupO, &entity.BloodGroup{BloodGroup: "O"})
	// เข้ารหัสรหัสผ่าน
	hashedPassword, _ := HashPassword("123456")

	// สร้าง Employee พร้อมข้อมูลเริ่มต้น โดยเว้น profile ไว้เป็น null
EmployeeDoctor := entity.Employee{
	FirstName:           "John",
	LastName:            "Doe",
	Email:               "john.doe@hospital.com",
	DateOfBirth:         time.Date(1980, time.March, 15, 0, 0, 0, 0, time.UTC),
	Phone:               "111-111-1111",
	Address:             "123 Doctor Street",
	NationalID:          "1234567890123",
	Username:            "johndoe",
	ProfessionalLicense: "DOC12345",
	Graduate:            "MD from XYZ University",
	Password:            hashedPassword,
	GenderID:            GenderMale.ID,
	PositionID:          PositionDoctor.ID,
	DepartmentID:        Department1.ID,
	StatusID:            StatusActive.ID,
	SpecialistID:        SpecialistCardiology.ID,
	BloodGroupID:        BloodGroupA.ID, // ตั้งค่า BloodGroup เป็น A
	Profile:             "", // ตั้งค่า Profile ให้เป็นค่า null
}
db.FirstOrCreate(&EmployeeDoctor, &entity.Employee{Email: "john.doe@hospital.com"})

// เพิ่มความสัมพันธ์ Many-to-Many กับ Disease
DiseasesDoctor := []entity.Disease{Disease1, Disease2}
db.Model(&EmployeeDoctor).Association("Diseases").Append(DiseasesDoctor)

EmployeeNurse := entity.Employee{
	FirstName:           "Jane",
	LastName:            "Smith",
	Email:               "jane.smith@hospital.com",
	DateOfBirth:         time.Date(1990, time.July, 20, 0, 0, 0, 0, time.UTC),
	Phone:               "222-222-2222",
	Address:             "456 Nurse Lane",
	NationalID:          "2234567890123",
	Username:            "janesmith",
	ProfessionalLicense: "NUR56789",
	Graduate:            "BSc Nursing from ABC University",
	Password:            hashedPassword,
	GenderID:            GenderFemale.ID,
	PositionID:          PositionNurse.ID,
	DepartmentID:        Department2.ID,
	StatusID:            StatusActive.ID,
	SpecialistID:        SpecialistPediatrics.ID,
	BloodGroupID:        BloodGroupB.ID, // ตั้งค่า BloodGroup เป็น B
	Profile:             "", // ตั้งค่า Profile ให้เป็นค่า null
}
db.FirstOrCreate(&EmployeeNurse, &entity.Employee{Email: "jane.smith@hospital.com"})

DiseasesNurse := []entity.Disease{Disease3, Disease4}
db.Model(&EmployeeNurse).Association("Diseases").Append(DiseasesNurse)

EmployeeFinance := entity.Employee{
	FirstName:           "Alice",
	LastName:            "Johnson",
	Email:               "alice.johnson@hospital.com",
	DateOfBirth:         time.Date(1985, time.January, 10, 0, 0, 0, 0, time.UTC),
	Phone:               "333-333-3333",
	Address:             "789 Finance Blvd",
	NationalID:          "3234567890123",
	Username:            "alicejohnson",
	ProfessionalLicense: "",
	Graduate:            "MBA from DEF University",
	Password:            hashedPassword,
	GenderID:            GenderFemale.ID,
	PositionID:          PositionFinance.ID,
	DepartmentID:        Department3.ID,
	StatusID:            StatusActive.ID,
	SpecialistID:        SpecialistRadiology.ID,
	BloodGroupID:        BloodGroupAB.ID, // ตั้งค่า BloodGroup เป็น AB
	Profile:             "", // ตั้งค่า Profile ให้เป็นค่า null
}
db.FirstOrCreate(&EmployeeFinance, &entity.Employee{Email: "alice.johnson@hospital.com"})

DiseasesFinance := []entity.Disease{Disease5}
db.Model(&EmployeeFinance).Association("Diseases").Append(DiseasesFinance)

EmployeeNurseCounter := entity.Employee{
	FirstName:           "Michael",
	LastName:            "Brown",
	Email:               "michael.brown@hospital.com",
	DateOfBirth:         time.Date(1992, time.April, 5, 0, 0, 0, 0, time.UTC),
	Phone:               "444-444-4444",
	Address:             "101 Nurse Counter Ave",
	NationalID:          "4234567890123",
	Username:            "michaelbrown",
	ProfessionalLicense: "",
	Graduate:            "Diploma in Healthcare",
	Password:            hashedPassword,
	GenderID:            GenderMale.ID,
	PositionID:          PositionNurseCounter.ID,
	DepartmentID:        Department4.ID,
	StatusID:            StatusActive.ID,
	SpecialistID:        SpecialistNeurology.ID,
	BloodGroupID:        BloodGroupO.ID, // ตั้งค่า BloodGroup เป็น O
	Profile:             "", // ตั้งค่า Profile ให้เป็นค่า null
}
db.FirstOrCreate(&EmployeeNurseCounter, &entity.Employee{Email: "michael.brown@hospital.com"})

DiseasesNurseCounter := []entity.Disease{Disease6}
db.Model(&EmployeeNurseCounter).Association("Diseases").Append(DiseasesNurseCounter)

EmployeeAdmin := entity.Employee{
	FirstName:           "Emma",
	LastName:            "Davis",
	Email:               "emma.davis@hospital.com",
	DateOfBirth:         time.Date(1988, time.November, 12, 0, 0, 0, 0, time.UTC),
	Phone:               "555-555-5555",
	Address:             "202 Admin Plaza",
	NationalID:          "5234567890123",
	Username:            "emmadavis",
	ProfessionalLicense: "",
	Graduate:            "BA in Administration",
	Password:            hashedPassword,
	GenderID:            GenderFemale.ID,
	PositionID:          PositionAdmin.ID,
	DepartmentID:        Department5.ID,
	StatusID:            StatusActive.ID,
	SpecialistID:        SpecialistDermatology.ID,
	BloodGroupID:        BloodGroupA.ID, // ตั้งค่า BloodGroup เป็น A
	Profile:             "", // ตั้งค่า Profile ให้เป็นค่า null
}
db.FirstOrCreate(&EmployeeAdmin, &entity.Employee{Email: "emma.davis@hospital.com"})

DiseasesAdmin := []entity.Disease{Disease7}
db.Model(&EmployeeAdmin).Association("Diseases").Append(DiseasesAdmin)

EmployeePharmacy := entity.Employee{
	FirstName:           "Oliver",
	LastName:            "Wilson",
	Email:               "oliver.wilson@hospital.com",
	DateOfBirth:         time.Date(1987, time.December, 25, 0, 0, 0, 0, time.UTC),
	Phone:               "666-666-6666",
	Address:             "303 Pharmacy Court",
	NationalID:          "6234567890123",
	Username:            "oliverwilson",
	ProfessionalLicense: "PHA67890",
	Graduate:            "Pharmacy Degree from GHI University",
	Password:            hashedPassword,
	GenderID:            GenderMale.ID,
	PositionID:          PositionPharmacy.ID,
	DepartmentID:        Department6.ID,
	StatusID:            StatusActive.ID,
	SpecialistID:        SpecialistOncology.ID,
	BloodGroupID:        BloodGroupB.ID, // ตั้งค่า BloodGroup เป็น B
	Profile:             "", // ตั้งค่า Profile ให้เป็นค่า null
}
db.FirstOrCreate(&EmployeePharmacy, &entity.Employee{Email: "oliver.wilson@hospital.com"})

DiseasesPharmacy := []entity.Disease{Disease8}
db.Model(&EmployeePharmacy).Association("Diseases").Append(DiseasesPharmacy)

}
