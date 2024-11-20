package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"example/config"
	"example/entity"
	"example/services"
)

func ResetPasswordController(c *gin.Context) {
	type RequestPayload struct {
		Email string `json:"email" binding:"required"`
	}

	var payload RequestPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า Email มีในระบบหรือไม่
	var employee entity.Employee
	if err := db.Where("email = ?", payload.Email).First(&employee).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Email not found"})
		return
	}

	// สร้าง UUID และตั้งค่าเวลาหมดอายุ 15 นาที
	resetToken := uuid.New().String()
	resetExpiry := time.Now().Add(15 * time.Minute)

	// บันทึก ResetToken และ ResetTokenExpiry ลงในฐานข้อมูล
	employee.ResetToken = resetToken
	employee.ResetTokenExpiry = resetExpiry
	if err := db.Save(&employee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save reset token"})
		return
	}

	// ส่งอีเมล
	subject := "โทเค็นสำหรับการรีเซ็ตรหัสผ่านของคุณ"
	body := fmt.Sprintf(
		"สวัสดีค่ะ/ครับ,\n\nนี่คือโทเค็นสำหรับการรีเซ็ตรหัสผ่านของคุณ:\n\n%s\n\nกรุณาใช้โทเค็นนี้ในการรีเซ็ตรหัสผ่านของคุณภายใน 15 นาที หากคุณไม่ได้ร้องขอการรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลนี้\n\nขอบคุณค่ะ/ครับ",
		resetToken,
	)

	if err := SendEmail(payload.Email, subject, body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}

	// ส่ง Response
	c.JSON(http.StatusOK, gin.H{
		"message": "Reset token has been sent to your email.",
	})
}


// ValidateResetTokenController ตรวจสอบว่า UUID ถูกต้องและยังไม่หมดอายุ
func ValidateResetTokenController(c *gin.Context) {
	type RequestPayload struct {
		Token string `json:"token" binding:"required"`
	}

	var payload RequestPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า Token มีในระบบและยังไม่หมดอายุ
	var employee entity.Employee
	if err := db.Where("reset_token = ?", payload.Token).First(&employee).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invalid or expired token"})
		return
	}

	// ตรวจสอบเวลาหมดอายุ
	if time.Now().After(employee.ResetTokenExpiry) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has expired"})
		return
	}

	// สร้าง JWT Token
	jwtWrapper := services.JwtWrapper{
		SecretKey:       config.GetSecretKey(), // ใช้คีย์จาก config
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	// ใช้ Username ของ Employee เพื่อสร้าง Token
	tokenString, err := jwtWrapper.GenerateToken(employee.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	// ส่ง Response กลับ พร้อม JWT Token และ Employee ID
	c.JSON(http.StatusOK, gin.H{
		"message": "Token is valid",
		"jwt":     tokenString,   // JWT Token ที่ส่งกลับ
		"id":      employee.ID,   // ส่ง ID ของ Employee กลับไป
	})
}




func CleanExpiredTokens() {
	db := config.DB()

	// ล้าง Token ที่หมดอายุ
	if err := db.Model(&entity.Employee{}). // เพิ่ม "{}" หลัง "Employee" เพื่อบอกว่าเป็นอินสแตนซ์เปล่า
		Where("reset_token_expiry < ?", time.Now()).
		Updates(map[string]interface{}{
			"reset_token":       "",
			"reset_token_expiry": nil,
		}).Error; err != nil {
		fmt.Println("Error cleaning expired tokens:", err)
	} else {
		fmt.Println("Expired tokens cleaned successfully")
	}
}



// StartCleanupJob ตั้ง Cron Job เพื่อล้าง UUID ที่หมดอายุ
func StartCleanupJob() {
	go func() {
		for {
			CleanExpiredTokens()
			time.Sleep(1 * time.Hour) // รันทุกๆ 1 ชั่วโมง
		}
	}()
}
