package controller

import (
	"fmt"
	"net/http"

	"example/config"
	"example/entity"

	"github.com/gin-gonic/gin"
)


func CreateEmployee(c *gin.Context) {
	var employee entity.Employee

	// Bind JSON เข้าตัวแปร employee
	if err := c.ShouldBindJSON(&employee); err != nil {
		fmt.Println("Error binding JSON:", err) // แสดงข้อผิดพลาดการจับคู่ JSON
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า Username ซ้ำหรือไม่
	var existingEmployee entity.Employee
	if err := db.Where("username = ?", employee.Username).First(&existingEmployee).Error; err == nil {
		fmt.Println("Username already exists:", employee.Username) // แสดงข้อความเมื่อ Username ซ้ำ
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// ตรวจสอบ Gender
	var gender entity.Gender
	if err := db.First(&gender, employee.GenderID).Error; err != nil {
		fmt.Println("Gender not found, ID:", employee.GenderID) // แสดงข้อผิดพลาดเมื่อไม่พบ Gender
		c.JSON(http.StatusNotFound, gin.H{"error": "Gender not found"})
		return
	}
	employee.Gender = gender

	// ตรวจสอบ Position
	var position entity.Position
	if err := db.First(&position, employee.PositionID).Error; err != nil {
		fmt.Println("Position not found, ID:", employee.PositionID) // แสดงข้อผิดพลาดเมื่อไม่พบ Position
		c.JSON(http.StatusNotFound, gin.H{"error": "Position not found"})
		return
	}
	employee.Position = position

	// ตรวจสอบ Department
	var department entity.Department
	if err := db.First(&department, employee.DepartmentID).Error; err != nil {
		fmt.Println("Department not found, ID:", employee.DepartmentID) // แสดงข้อผิดพลาดเมื่อไม่พบ Department
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	employee.Department = department

	// ตรวจสอบ Status
	var status entity.Status
	if err := db.First(&status, employee.StatusID).Error; err != nil {
		fmt.Println("Status not found, ID:", employee.StatusID) // แสดงข้อผิดพลาดเมื่อไม่พบ Status
		c.JSON(http.StatusNotFound, gin.H{"error": "Status not found"})
		return
	}
	employee.Status = status

	// ตรวจสอบ Specialist
	var specialist entity.Specialist
	if err := db.First(&specialist, employee.SpecialistID).Error; err != nil {
		fmt.Println("Specialist not found, ID:", employee.SpecialistID) // แสดงข้อผิดพลาดเมื่อไม่พบ Specialist
		c.JSON(http.StatusNotFound, gin.H{"error": "Specialist not found"})
		return
	}
	employee.Specialist = specialist

	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	hashedPassword, hashErr := config.HashPassword(employee.Password)
	if hashErr != nil {
		fmt.Println("Error hashing password:", hashErr) // แสดงข้อผิดพลาดการเข้ารหัสรหัสผ่าน
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}
	employee.Password = hashedPassword

	// บันทึก Employee ลงฐานข้อมูล
	if err := db.Create(&employee).Error; err != nil {
		fmt.Println("Error creating employee:", err) // แสดงข้อผิดพลาดเมื่อบันทึกข้อมูลไม่สำเร็จ
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Employee created successfully:", employee) // แสดงข้อความเมื่อบันทึกสำเร็จ
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
	result := db.Preload("Gender").Preload("Position").Preload("Department").Preload("Status").Preload("Specialist").First(&employee, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	if employee.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
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


func UpdateEmployee(c *gin.Context) {
	var existingEmployee entity.Employee
	EmployeeID := c.Param("id")

	db := config.DB()
	result := db.First(&existingEmployee, EmployeeID)
	if result.Error != nil {
		fmt.Println("Employee not found, ID:", EmployeeID) // แสดงข้อความเมื่อไม่พบ Employee
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	var updatedData entity.Employee
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		fmt.Println("Error binding JSON:", err) // แสดงข้อผิดพลาดการจับคู่ JSON
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// ตรวจสอบว่า Username ซ้ำหรือไม่ (ยกเว้นกรณีที่เป็น username เดิมของ employee นี้เอง)
	var otherEmployee entity.Employee
	if err := db.Where("username = ? AND id != ?", updatedData.Username, EmployeeID).First(&otherEmployee).Error; err == nil {
		fmt.Println("Username already exists:", updatedData.Username) // แสดงข้อความเมื่อ Username ซ้ำ
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// อัปเดตฟิลด์ต่าง ๆ ใน existingEmployee
	existingEmployee.FirstName = updatedData.FirstName
	existingEmployee.LastName = updatedData.LastName
	existingEmployee.Age = updatedData.Age
	existingEmployee.DateOfBirth = updatedData.DateOfBirth
	existingEmployee.Email = updatedData.Email
	existingEmployee.Phone = updatedData.Phone
	existingEmployee.Address = updatedData.Address
	existingEmployee.Username = updatedData.Username
	existingEmployee.ProfessionalLicense = updatedData.ProfessionalLicense
	existingEmployee.CongenitalDisease = updatedData.CongenitalDisease
	existingEmployee.Graduate = updatedData.Graduate

	// ตรวจสอบ Foreign Key และอัปเดต
	var gender entity.Gender
	if err := db.First(&gender, updatedData.GenderID).Error; err != nil {
		fmt.Println("Gender not found, ID:", updatedData.GenderID) // แสดงข้อผิดพลาดเมื่อไม่พบ Gender
		c.JSON(http.StatusNotFound, gin.H{"error": "Gender not found"})
		return
	}
	existingEmployee.Gender = gender

	var position entity.Position
	if err := db.First(&position, updatedData.PositionID).Error; err != nil {
		fmt.Println("Position not found, ID:", updatedData.PositionID) // แสดงข้อผิดพลาดเมื่อไม่พบ Position
		c.JSON(http.StatusNotFound, gin.H{"error": "Position not found"})
		return
	}
	existingEmployee.Position = position

	var department entity.Department
	if err := db.First(&department, updatedData.DepartmentID).Error; err != nil {
		fmt.Println("Department not found, ID:", updatedData.DepartmentID) // แสดงข้อผิดพลาดเมื่อไม่พบ Department
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	existingEmployee.Department = department

	var status entity.Status
	if err := db.First(&status, updatedData.StatusID).Error; err != nil {
		fmt.Println("Status not found, ID:", updatedData.StatusID) // แสดงข้อผิดพลาดเมื่อไม่พบ Status
		c.JSON(http.StatusNotFound, gin.H{"error": "Status not found"})
		return
	}
	existingEmployee.Status = status

	var specialist entity.Specialist
	if err := db.First(&specialist, updatedData.SpecialistID).Error; err != nil {
		fmt.Println("Specialist not found, ID:", updatedData.SpecialistID) // แสดงข้อผิดพลาดเมื่อไม่พบ Specialist
		c.JSON(http.StatusNotFound, gin.H{"error": "Specialist not found"})
		return
	}
	existingEmployee.Specialist = specialist

	// เข้ารหัสลับรหัสผ่านใหม่ถ้ามีการอัปเดต
	if updatedData.Password != "" {
		hashedPassword, hashErr := config.HashPassword(updatedData.Password)
		if hashErr != nil {
			fmt.Println("Error hashing password:", hashErr) // แสดงข้อผิดพลาดการเข้ารหัสรหัสผ่าน
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
			return
		}
		existingEmployee.Password = hashedPassword
	}

	// บันทึกการอัปเดต Employee ลงฐานข้อมูล
	if err := db.Save(&existingEmployee).Error; err != nil {
		fmt.Println("Error updating employee:", err) // แสดงข้อผิดพลาดเมื่อบันทึกข้อมูลไม่สำเร็จ
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Employee updated successfully:", existingEmployee) // แสดงข้อความเมื่อบันทึกสำเร็จ
	c.JSON(http.StatusOK, gin.H{
		"message": "Updated successful",
		"data":    existingEmployee,
	})
}

