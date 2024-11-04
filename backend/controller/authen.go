package controller

import (
    "net/http"
    "time"

    jwt "github.com/golang-jwt/jwt/v4"
    "github.com/gin-gonic/gin"
    "example/config"
    "example/entity"
)

var jwtKey = []byte("your_secret_key")

type Claims struct {
    Username string `json:"username"`
    jwt.StandardClaims
}

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

    db := config.DB()
    var employee entity.Employee

    // Check if the username exists in the database and preload Position
    if err := db.Preload("Position").Where("username = ?", loginData.Username).First(&employee).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect username or password"})
        return
    }

    // Verify the password
    if !config.CheckPasswordHash([]byte(loginData.Password), []byte(employee.Password)) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect username or password"})
        return
    }

    // Create JWT token with an expiration time of 24 hours
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        Username: loginData.Username,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
        return
    }

    // Return the employee's position and JWT token
    c.JSON(http.StatusOK, gin.H{
        "id":       employee.ID,
        "username": employee.Username,
        "position": employee.Position.PositionName, // Return the position of the employee
        "token":    tokenString,
    })
}
