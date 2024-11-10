package controller

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "example/config"
    "example/entity"
    "example/services"
)

// EmployeeSignin handles user sign-in requests
func EmployeeSignin(c *gin.Context) {
    var loginData struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    // Bind JSON input to loginData
    if err := c.ShouldBindJSON(&loginData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Get database connection
    db := config.DB()
    var employee entity.Employee

    // Check if the username exists in the database and preload Position and Department
    if err := db.Preload("Position").Preload("Department").Where("username = ?", loginData.Username).First(&employee).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect username or password"})
        return
    }

    // Verify the password
    if !config.CheckPasswordHash([]byte(loginData.Password), []byte(employee.Password)) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect username or password"})
        return
    }

    // Set up JwtWrapper with key details for token generation
    jwtWrapper := services.JwtWrapper{
        SecretKey:       config.GetSecretKey(), // ใช้คีย์จาก config
        Issuer:          "AuthService",
        ExpirationHours: 24,
    }

    // Generate the token using JwtWrapper's GenerateToken method
    tokenString, err := jwtWrapper.GenerateToken(employee.Username) // ใช้ Username แทน Email
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
        return
    }

    // Return the employee's position, department, and JWT token
    c.JSON(http.StatusOK, gin.H{
        "id":         employee.ID,
        "username":   employee.Username,
        "position":   employee.Position.PositionName,
        "department": employee.Department.DepartmentName, // เพิ่มข้อมูลของ Department
        "token":      tokenString,
    })
}
