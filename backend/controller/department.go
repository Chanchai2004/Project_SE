package controller

import (
	"net/http"

	"example/config"
	"example/entity"

	"github.com/gin-gonic/gin"
)

// POST /departments
func CreateDepartment(c *gin.Context) {
	var department entity.Department

	// Bind JSON เข้าตัวแปร department
	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// บันทึก Department
	if err := db.Create(&department).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": department})
}

// GET /department/:id
func GetDepartment(c *gin.Context) {
	ID := c.Param("id")
	var department entity.Department

	db := config.DB()
	result := db.First(&department, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	if department.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, department)
}

// GET /departments
func ListDepartments(c *gin.Context) {
	var departments []entity.Department

	db := config.DB()
	result := db.Find(&departments)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, departments)
}

// DELETE /department/:id
func DeleteDepartment(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM departments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /department/:id
func UpdateDepartment(c *gin.Context) {
	var department entity.Department

	DepartmentID := c.Param("id")

	db := config.DB()
	result := db.First(&department, DepartmentID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&department)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
