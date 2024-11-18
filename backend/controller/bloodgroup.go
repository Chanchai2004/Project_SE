package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"example/config"
	"example/entity"
)

// GetBloodGroups handles retrieving all blood groups
func GetBloodGroups(c *gin.Context) {
	var bloodGroups []entity.BloodGroup

	db := config.DB()
	if err := db.Find(&bloodGroups).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch blood groups"})
		return
	}

	c.JSON(http.StatusOK, bloodGroups)
}

// GetBloodGroupByID handles retrieving a blood group by its ID
func GetBloodGroupByID(c *gin.Context) {
	id := c.Param("id")
	var bloodGroup entity.BloodGroup

	db := config.DB()
	if err := db.First(&bloodGroup, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blood group not found"})
		return
	}

	c.JSON(http.StatusOK, bloodGroup)
}

// CreateBloodGroup handles creating a new blood group
func CreateBloodGroup(c *gin.Context) {
	var input struct {
		BloodGroup string `json:"blood_group" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	bloodGroup := entity.BloodGroup{
		BloodGroup: input.BloodGroup,
	}

	db := config.DB()
	if err := db.Create(&bloodGroup).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create blood group"})
		return
	}

	c.JSON(http.StatusCreated, bloodGroup)
}

// UpdateBloodGroup handles updating an existing blood group
func UpdateBloodGroup(c *gin.Context) {
	id := c.Param("id")
	var bloodGroup entity.BloodGroup

	db := config.DB()
	if err := db.First(&bloodGroup, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blood group not found"})
		return
	}

	var input struct {
		BloodGroup string `json:"blood_group" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	bloodGroup.BloodGroup = input.BloodGroup

	if err := db.Save(&bloodGroup).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update blood group"})
		return
	}

	c.JSON(http.StatusOK, bloodGroup)
}

// DeleteBloodGroup handles deleting a blood group
func DeleteBloodGroup(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()
	if err := db.Delete(&entity.BloodGroup{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete blood group"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Blood group deleted successfully"})
}
