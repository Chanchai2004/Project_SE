package controller

import (
	"fmt"
	"net/http"

	"example/config"
	"example/entity"
	"github.com/gin-gonic/gin"
)

// CreateDisease handles creating a new disease
func CreateDisease(c *gin.Context) {
	var disease entity.Disease

	// Bind JSON เข้าตัวแปร disease
	if err := c.ShouldBindJSON(&disease); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า DiseaseName ซ้ำหรือไม่
	var existingDisease entity.Disease
	if err := db.Where("disease_name = ?", disease.DiseaseName).First(&existingDisease).Error; err == nil {
		fmt.Println("Disease already exists:", disease.DiseaseName)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Disease already exists"})
		return
	}

	// บันทึก Disease ลงฐานข้อมูล
	if err := db.Create(&disease).Error; err != nil {
		fmt.Println("Error creating disease:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Disease created successfully:", disease)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Created success",
		"data":    disease,
	})
}

// GetDisease handles fetching a single disease by ID
func GetDisease(c *gin.Context) {
	ID := c.Param("id")
	var disease entity.Disease

	db := config.DB()
	if err := db.First(&disease, ID).Error; err != nil {
		fmt.Println("Disease not found, ID:", ID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Disease not found"})
		return
	}

	c.JSON(http.StatusOK, disease)
}

// ListDiseases handles fetching all diseases
func ListDiseases(c *gin.Context) {
	var diseases []entity.Disease

	db := config.DB()
	if err := db.Find(&diseases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, diseases)
}

// UpdateDisease handles updating an existing disease
func UpdateDisease(c *gin.Context) {
	ID := c.Param("id")
	var disease entity.Disease

	db := config.DB()
	if err := db.First(&disease, ID).Error; err != nil {
		fmt.Println("Disease not found, ID:", ID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Disease not found"})
		return
	}

	var updatedData entity.Disease
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า DiseaseName ซ้ำหรือไม่ (ยกเว้นกรณีที่เป็นชื่อเดิม)
	var otherDisease entity.Disease
	if err := db.Where("disease_name = ? AND id != ?", updatedData.DiseaseName, ID).First(&otherDisease).Error; err == nil {
		fmt.Println("Disease name already exists:", updatedData.DiseaseName)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Disease name already exists"})
		return
	}

	// อัปเดตข้อมูล
	disease.DiseaseName = updatedData.DiseaseName
	if err := db.Save(&disease).Error; err != nil {
		fmt.Println("Error updating disease:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Disease updated successfully:", disease)
	c.JSON(http.StatusOK, gin.H{
		"message": "Updated success",
		"data":    disease,
	})
}

// DeleteDisease handles deleting a disease by ID
func DeleteDisease(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.Disease{}, ID); tx.RowsAffected == 0 {
		fmt.Println("Disease not found, ID:", ID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Disease not found"})
		return
	}

	fmt.Println("Disease deleted successfully, ID:", ID)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted success"})
}
