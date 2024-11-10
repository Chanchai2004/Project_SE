package controller

import (
	"fmt"
	"net/http"

	"example/config"
	"example/entity"
	"github.com/gin-gonic/gin"
)

// CreateEmployee handles creating a new employee
func CreateEmployee(c *gin.Context) {
	var employee entity.Employee
	var input struct {
		entity.Employee
		Diseases []uint `json:"diseases"` // รับ Disease ID หลายรายการ
	}

	// Bind JSON เข้าตัวแปร input
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า Username ซ้ำหรือไม่
	var existingEmployee entity.Employee
	if err := db.Where("username = ?", input.Username).First(&existingEmployee).Error; err == nil {
		fmt.Println("Username already exists:", input.Username)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// ตรวจสอบ Foreign Keys (Gender, Position, Department, Status, Specialist)
	var gender entity.Gender
	if err := db.First(&gender, input.GenderID).Error; err != nil {
		fmt.Println("Gender not found, ID:", input.GenderID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Gender not found"})
		return
	}
	employee.Gender = gender

	var position entity.Position
	if err := db.First(&position, input.PositionID).Error; err != nil {
		fmt.Println("Position not found, ID:", input.PositionID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Position not found"})
		return
	}
	employee.Position = position

	var department entity.Department
	if err := db.First(&department, input.DepartmentID).Error; err != nil {
		fmt.Println("Department not found, ID:", input.DepartmentID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	employee.Department = department

	var status entity.Status
	if err := db.First(&status, input.StatusID).Error; err != nil {
		fmt.Println("Status not found, ID:", input.StatusID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Status not found"})
		return
	}
	employee.Status = status

	var specialist entity.Specialist
	if err := db.First(&specialist, input.SpecialistID).Error; err != nil {
		fmt.Println("Specialist not found, ID:", input.SpecialistID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Specialist not found"})
		return
	}
	employee.Specialist = specialist

	// เข้ารหัสรหัสผ่าน
	hashedPassword, hashErr := config.HashPassword(input.Password)
	if hashErr != nil {
		fmt.Println("Error hashing password:", hashErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}
	employee.Password = hashedPassword

	// บันทึก Employee ลงฐานข้อมูล
	employee = input.Employee
	if err := db.Create(&employee).Error; err != nil {
		fmt.Println("Error creating employee:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เพิ่มความสัมพันธ์กับโรค (Diseases)
	var diseases []entity.Disease
	if len(input.Diseases) > 0 {
		if err := db.Where("id IN ?", input.Diseases).Find(&diseases).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Some diseases not found"})
			return
		}
		db.Model(&employee).Association("Diseases").Append(diseases)
	}

	// โหลดข้อมูลที่เกี่ยวข้อง (Preload) เพื่อแสดงใน response
	if err := db.Preload("Gender").
		Preload("Position").
		Preload("Department").
		Preload("Status").
		Preload("Specialist").
		Preload("Diseases"). // โหลดข้อมูล Diseases
		First(&employee, employee.ID).Error; err != nil {
		fmt.Println("Error loading related data:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load related data"})
		return
	}

	fmt.Println("Employee created successfully with diseases:", employee)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Created success",
		"data":    employee,
	})
}


// GET /employee/:id
func GetEmployee(c *gin.Context) {
	ID := c.Param("id")
	var employee entity.Employee

	db := config.DB()
	result := db.Preload("Gender").
		Preload("Position").
		Preload("Department").
		Preload("Status").
		Preload("Specialist").
		Preload("Diseases"). // เพิ่ม Preload สำหรับ Diseases
		First(&employee, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}
	c.JSON(http.StatusOK, employee)
}


// GET /employees
func ListEmployees(c *gin.Context) {
	var employees []entity.Employee

	db := config.DB()
	result := db.Preload("Gender").Preload("Position").Preload("Department").Preload("Status").Preload("Specialist").Find(&employees)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, employees)
}

// DELETE /employee/:id
func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM employees WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// UpdateEmployee handles updating an existing employee
func UpdateEmployee(c *gin.Context) {
	var existingEmployee entity.Employee
	EmployeeID := c.Param("id")

	db := config.DB()
	result := db.Preload("Diseases").First(&existingEmployee, EmployeeID)
	if result.Error != nil {
		fmt.Println("Employee not found, ID:", EmployeeID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	// โครงสร้าง input สำหรับการรับข้อมูล JSON
	var updatedData struct {
		entity.Employee
		Diseases []uint `json:"diseases"` // รับ Disease ID หลายรายการ
	}

	if err := c.ShouldBindJSON(&updatedData); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// ตรวจสอบว่า Username ซ้ำหรือไม่
	var otherEmployee entity.Employee
	if err := db.Where("username = ? AND id != ?", updatedData.Username, EmployeeID).First(&otherEmployee).Error; err == nil {
		fmt.Println("Username already exists:", updatedData.Username)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// อัปเดตข้อมูลพื้นฐาน
	existingEmployee.FirstName = updatedData.FirstName
	existingEmployee.LastName = updatedData.LastName
	existingEmployee.Age = updatedData.Age
	existingEmployee.DateOfBirth = updatedData.DateOfBirth
	existingEmployee.Email = updatedData.Email
	existingEmployee.Phone = updatedData.Phone
	existingEmployee.Address = updatedData.Address
	existingEmployee.Username = updatedData.Username
	existingEmployee.ProfessionalLicense = updatedData.ProfessionalLicense
	existingEmployee.Graduate = updatedData.Graduate

	// ตรวจสอบ Foreign Key และอัปเดต
	db.First(&existingEmployee.Gender, updatedData.GenderID)
	db.First(&existingEmployee.Position, updatedData.PositionID)
	db.First(&existingEmployee.Department, updatedData.DepartmentID)
	db.First(&existingEmployee.Status, updatedData.StatusID)
	db.First(&existingEmployee.Specialist, updatedData.SpecialistID)

	// อัปเดตรหัสผ่านหากมีการเปลี่ยนแปลง
	if updatedData.Password != "" {
		hashedPassword, hashErr := config.HashPassword(updatedData.Password)
		if hashErr != nil {
			fmt.Println("Error hashing password:", hashErr)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
			return
		}
		existingEmployee.Password = hashedPassword
	}

	// อัปเดตความสัมพันธ์กับโรค (Diseases)
	var diseases []entity.Disease
	if len(updatedData.Diseases) > 0 {
		if err := db.Where("id IN ?", updatedData.Diseases).Find(&diseases).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Some diseases not found"})
			return
		}
		db.Model(&existingEmployee).Association("Diseases").Replace(diseases) // แทนที่รายการ Diseases ด้วยข้อมูลใหม่
	} else {
		db.Model(&existingEmployee).Association("Diseases").Clear() // ล้างรายการ Diseases หากไม่มี ID ที่ส่งมา
	}

	// บันทึกการอัปเดต Employee ลงฐานข้อมูล
	if err := db.Save(&existingEmployee).Error; err != nil {
		fmt.Println("Error updating employee:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Employee updated successfully with diseases:", existingEmployee)
	c.JSON(http.StatusOK, gin.H{
		"message": "Updated successful",
		"data":    existingEmployee,
	})
}

