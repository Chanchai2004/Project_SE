package controller

import (
	"net/http"

	"example/config"
	"example/entity"

	"github.com/gin-gonic/gin"
)

// POST /statuses
func CreateStatus(c *gin.Context) {
	var status entity.Status

	// Bind JSON เข้าตัวแปร status
	if err := c.ShouldBindJSON(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// บันทึก Status
	if err := db.Create(&status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": status})
}

// GET /status/:id
func GetStatus(c *gin.Context) {
	ID := c.Param("id")
	var status entity.Status

	db := config.DB()
	result := db.First(&status, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	if status.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, status)
}

// GET /statuses
func ListStatuses(c *gin.Context) {
	var statuses []entity.Status

	db := config.DB()
	result := db.Find(&statuses)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, statuses)
}

// DELETE /status/:id
func DeleteStatus(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM statuses WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /status/:id
func UpdateStatus(c *gin.Context) {
	var status entity.Status

	StatusID := c.Param("id")

	db := config.DB()
	result := db.First(&status, StatusID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&status)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
