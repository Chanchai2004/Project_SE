package controller

import (
	"fmt"
	"net/http"
	"time"

	"example/config"
	"example/entity"
	"github.com/gin-gonic/gin"
)

// CreateEmployee handles creating a new employee
func CreateEmployee(c *gin.Context) {
	fmt.Println("Created Employee")

	var employee entity.Employee
	var input struct {
		entity.Employee
		Profile      string `json:"profile"`      // เพิ่มฟิลด์ Profile
		Diseases     []uint `json:"diseases"`    // รับ Disease ID หลายรายการ
		NationalID   string `json:"national_id"` // เพิ่มฟิลด์ NationalID
		InfoConfirm  bool   `json:"info_confirm"` // เพิ่มฟิลด์ InfoConfirm
		BloodGroupID uint   `json:"blood_group_id"` // เพิ่มฟิลด์ BloodGroupID
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

	// ตรวจสอบ Foreign Keys (Gender, Position, Department, Status, Specialist, BloodGroup)
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

	var bloodGroup entity.BloodGroup
	if err := db.First(&bloodGroup, input.BloodGroupID).Error; err != nil {
		fmt.Println("Blood Group not found, ID:", input.BloodGroupID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Blood Group not found"})
		return
	}
	employee.BloodGroup = bloodGroup

	// เข้ารหัสรหัสผ่าน
	hashedPassword, hashErr := config.HashPassword(input.Password)
	if hashErr != nil {
		fmt.Println("Error hashing password:", hashErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}
	employee.Password = hashedPassword

	// กำหนดค่าให้กับฟิลด์อื่น ๆ ของ employee
	employee.FirstName = input.FirstName
	employee.LastName = input.LastName
	employee.DateOfBirth = input.DateOfBirth
	employee.Email = input.Email
	employee.Phone = input.Phone
	employee.Address = input.Address
	employee.Username = input.Username
	employee.ProfessionalLicense = input.ProfessionalLicense
	employee.Graduate = input.Graduate
	employee.GenderID = input.GenderID
	employee.PositionID = input.PositionID
	employee.DepartmentID = input.DepartmentID
	employee.StatusID = input.StatusID
	employee.SpecialistID = input.SpecialistID
	employee.Profile = input.Profile
	employee.NationalID = input.NationalID // เพิ่ม NationalID
	employee.InfoConfirm = input.InfoConfirm // เพิ่ม InfoConfirm
	employee.BloodGroupID = input.BloodGroupID // เพิ่ม BloodGroupID

	// บันทึก Employee ลงฐานข้อมูล
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
		Preload("Diseases").
		Preload("BloodGroup"). // โหลดข้อมูล BloodGroup
		First(&employee, employee.ID).Error; err != nil {
		fmt.Println("Error loading related data:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load related data"})
		return
	}

	// ส่งข้อมูลกลับมาพร้อม status 201
	c.JSON(http.StatusCreated, gin.H{
		"message": "Created success", // ส่งข้อความบ่งบอกว่าการสร้างสำเร็จ
		"data":    employee, // ส่งข้อมูลพนักงานที่ถูกสร้าง
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
		Preload("Diseases").
		Preload("BloodGroup"). // เพิ่ม Preload สำหรับ BloodGroup
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
	result := db.Preload("Gender").
		Preload("Position").
		Preload("Department").
		Preload("Status").
		Preload("Specialist").
		Preload("Diseases").
		Preload("BloodGroup"). // เพิ่ม Preload สำหรับ BloodGroup
		Find(&employees)

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

	// Load existing employee data
	db := config.DB()
	result := db.Preload("Diseases").Preload("BloodGroup").First(&existingEmployee, EmployeeID)
	if result.Error != nil {
		fmt.Println("Employee not found, ID:", EmployeeID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	// โครงสร้าง input สำหรับการรับข้อมูล JSON
	var updatedData struct {
		FirstName           *string `json:"first_name"`
		LastName            *string `json:"last_name"`
		DateOfBirth         *string `json:"date_of_birth"`
		Email               *string `json:"email"`
		Phone               *string `json:"phone"`
		Address             *string `json:"address"`
		Username            *string `json:"username"`
		ProfessionalLicense *string `json:"professional_license"`
		Graduate            *string `json:"graduate"`
		GenderID            *uint   `json:"gender_id"`
		PositionID          *uint   `json:"position_id"`
		DepartmentID        *uint   `json:"department_id"`
		StatusID            *uint   `json:"status_id"`
		SpecialistID        *uint   `json:"specialist_id"`
		Password            *string `json:"password"`
		Diseases            []uint  `json:"diseases"`
		BloodGroupID        *uint   `json:"blood_group_id"`
	}

	if err := c.ShouldBindJSON(&updatedData); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// Update only fields that are provided in the input
	if updatedData.FirstName != nil {
		existingEmployee.FirstName = *updatedData.FirstName
	}
	if updatedData.LastName != nil {
		existingEmployee.LastName = *updatedData.LastName
	}
	if updatedData.DateOfBirth != nil {
		parsedDate, err := time.Parse("2006-01-02T15:04:05Z", *updatedData.DateOfBirth)
		if err != nil {
			fmt.Println("Invalid date format:", *updatedData.DateOfBirth)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format, expected ISO8601"})
			return
		}
		existingEmployee.DateOfBirth = parsedDate
	}
	
	if updatedData.Email != nil {
		existingEmployee.Email = *updatedData.Email
	}
	if updatedData.Phone != nil {
		existingEmployee.Phone = *updatedData.Phone
	}
	if updatedData.Address != nil {
		existingEmployee.Address = *updatedData.Address
	}
	if updatedData.Username != nil {
		// ตรวจสอบว่า Username ซ้ำหรือไม่
		var otherEmployee entity.Employee
		if err := db.Where("username = ? AND id != ?", *updatedData.Username, EmployeeID).First(&otherEmployee).Error; err == nil {
			fmt.Println("Username already exists:", *updatedData.Username)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
			return
		}
		existingEmployee.Username = *updatedData.Username
	}
	if updatedData.ProfessionalLicense != nil {
		existingEmployee.ProfessionalLicense = *updatedData.ProfessionalLicense
	}
	if updatedData.Graduate != nil {
		existingEmployee.Graduate = *updatedData.Graduate
	}
	if updatedData.GenderID != nil {
		db.First(&existingEmployee.Gender, *updatedData.GenderID)
	}
	if updatedData.PositionID != nil {
		db.First(&existingEmployee.Position, *updatedData.PositionID)
	}
	if updatedData.DepartmentID != nil {
		db.First(&existingEmployee.Department, *updatedData.DepartmentID)
	}
	if updatedData.StatusID != nil {
		db.First(&existingEmployee.Status, *updatedData.StatusID)
	}
	if updatedData.SpecialistID != nil {
		db.First(&existingEmployee.Specialist, *updatedData.SpecialistID)
	}
	if updatedData.BloodGroupID != nil {
		var bloodGroup entity.BloodGroup
		if err := db.First(&bloodGroup, *updatedData.BloodGroupID).Error; err != nil {
			fmt.Println("Blood Group not found, ID:", *updatedData.BloodGroupID)
			c.JSON(http.StatusNotFound, gin.H{"error": "Blood Group not found"})
			return
		}
		existingEmployee.BloodGroup = bloodGroup
	}

	// อัปเดตรหัสผ่านหากมีการเปลี่ยนแปลง
	if updatedData.Password != nil && *updatedData.Password != "" {
		hashedPassword, hashErr := config.HashPassword(*updatedData.Password)
		if hashErr != nil {
			fmt.Println("Error hashing password:", hashErr)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
			return
		}
		existingEmployee.Password = hashedPassword
	}

	// อัปเดตความสัมพันธ์กับโรค (Diseases)
	if updatedData.Diseases != nil {
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
	}

	// บันทึกการอัปเดต Employee ลงฐานข้อมูล
	if err := db.Save(&existingEmployee).Error; err != nil {
		fmt.Println("Error updating employee:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Employee updated successfully with diseases and blood group:", existingEmployee)
	c.JSON(http.StatusOK, gin.H{
		"message": "Updated successful",
		"data":    existingEmployee,
	})
}

func ResetPassword(c *gin.Context) {
    // โครงสร้างสำหรับรับข้อมูลจาก JSON
    var resetPayload struct {
        ID          uint   `json:"id"`
        NewPassword string `json:"new_password"`
    }

    // Bind JSON Payload
    if err := c.ShouldBindJSON(&resetPayload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
        return
    }

    // ดึงข้อมูล Employee ตาม ID
    db := config.DB()
    var existingEmployee entity.Employee
    if err := db.First(&existingEmployee, resetPayload.ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
        return
    }

    // ตรวจสอบความถูกต้องของรหัสผ่านใหม่
    if resetPayload.NewPassword == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "New password is required"})
        return
    }

    // แฮชรหัสผ่านใหม่
    hashedPassword, err := config.HashPassword(resetPayload.NewPassword)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // อัปเดตรหัสผ่าน และล้าง ResetToken
    existingEmployee.Password = hashedPassword
    existingEmployee.ResetToken = ""               // Clear ResetToken
    existingEmployee.ResetTokenExpiry = time.Time{} // Clear ResetTokenExpiry

    // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
    if err := db.Save(&existingEmployee).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
        return
    }

    // ตอบกลับสำเร็จ
    c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}



