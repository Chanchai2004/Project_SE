package controller

import (
	"net/http"

	"example/config"
	"example/entity"

	"github.com/gin-gonic/gin"
)

// POST /specialists
func CreateSpecialist(c *gin.Context) {
	var specialist entity.Specialist

	// Bind JSON เข้าตัวแปร specialist
	if err := c.ShouldBindJSON(&specialist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// บันทึก Specialist
	if err := db.Create(&specialist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": specialist})
}

// GET /specialist/:id
func GetSpecialist(c *gin.Context) {
	ID := c.Param("id")
	var specialist entity.Specialist

	db := config.DB()
	result := db.First(&specialist, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	if specialist.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, specialist)
}

// GET /specialists
func ListSpecialists(c *gin.Context) {
	var specialists []entity.Specialist

	db := config.DB()
	result := db.Find(&specialists)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, specialists)
}

// DELETE /specialist/:id
func DeleteSpecialist(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM specialists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /specialist/:id
func UpdateSpecialist(c *gin.Context) {
	var specialist entity.Specialist

	SpecialistID := c.Param("id")

	db := config.DB()
	result := db.First(&specialist, SpecialistID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&specialist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&specialist)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
