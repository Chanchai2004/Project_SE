package controller

import (
	"net/http"

	"example/config"
	"example/entity"

	"github.com/gin-gonic/gin"
)

// POST /positions
func CreatePosition(c *gin.Context) {
	var position entity.Position

	// Bind JSON เข้าตัวแปร position
	if err := c.ShouldBindJSON(&position); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// บันทึก Position
	if err := db.Create(&position).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": position})
}

// GET /position/:id
func GetPosition(c *gin.Context) {
	ID := c.Param("id")
	var position entity.Position

	db := config.DB()
	result := db.First(&position, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	if position.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, position)
}

// GET /positions
func ListPositions(c *gin.Context) {
	var positions []entity.Position

	db := config.DB()
	result := db.Find(&positions)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, positions)
}

// DELETE /position/:id
func DeletePosition(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM positions WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /position/:id
func UpdatePosition(c *gin.Context) {
	var position entity.Position

	PositionID := c.Param("id")

	db := config.DB()
	result := db.First(&position, PositionID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&position); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&position)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
