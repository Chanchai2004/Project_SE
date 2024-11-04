package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"example/config"
	"example/controller"
)

const PORT = "8000"

func main() {

	// เปิดการเชื่อมต่อฐานข้อมูล
	config.ConnectionDB()

	// สร้างตารางฐานข้อมูล
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	router := r.Group("")
	{
		// Gender Routes
		router.GET("/genders", controller.ListGenders)
		router.GET("/gender/:id", controller.GetGender)
		router.POST("/genders", controller.CreateGender)
		router.PATCH("/gender/:id", controller.UpdateGender)
		router.DELETE("/gender/:id", controller.DeleteGender)

		// Department Routes
		router.GET("/departments", controller.ListDepartments)
		router.GET("/department/:id", controller.GetDepartment)
		router.POST("/departments", controller.CreateDepartment)
		router.PATCH("/department/:id", controller.UpdateDepartment)
		router.DELETE("/department/:id", controller.DeleteDepartment)

		// Position Routes
		router.GET("/positions", controller.ListPositions)
		router.GET("/position/:id", controller.GetPosition)
		router.POST("/positions", controller.CreatePosition)
		router.PATCH("/position/:id", controller.UpdatePosition)
		router.DELETE("/position/:id", controller.DeletePosition)

		// Specialist Routes
		router.GET("/specialists", controller.ListSpecialists)
		router.GET("/specialist/:id", controller.GetSpecialist)
		router.POST("/specialists", controller.CreateSpecialist)
		router.PATCH("/specialist/:id", controller.UpdateSpecialist)
		router.DELETE("/specialist/:id", controller.DeleteSpecialist)

		// Status Routes
		router.GET("/statuses", controller.ListStatuses)
		router.GET("/status/:id", controller.GetStatus)
		router.POST("/statuses", controller.CreateStatus)
		router.PATCH("/status/:id", controller.UpdateStatus)
		router.DELETE("/status/:id", controller.DeleteStatus)

		// Employee Routes
		router.GET("/employees", controller.ListEmployees)
		router.GET("/employee/:id", controller.GetEmployee)
		router.POST("/employees", controller.CreateEmployee)
		router.PATCH("/employee/:id", controller.UpdateEmployee)
		router.DELETE("/employee/:id", controller.DeleteEmployee)

		// Authentication Route
		router.POST("/auth/signin", controller.EmployeeSignin) // เพิ่มเส้นทางสำหรับการตรวจสอบสิทธิ์
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// เริ่มต้นเซิร์ฟเวอร์
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
