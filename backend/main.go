package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"example/config"
	"example/controller"
	"example/middlewares"
)

const PORT = "8000"

func main() {

	// เปิดการเชื่อมต่อฐานข้อมูล
	config.ConnectionDB()

	// สร้างตารางฐานข้อมูล
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	// เส้นทางที่ไม่ต้องตรวจสอบโทเค็น เช่นการลงชื่อเข้าใช้
	r.POST("/auth/signin", controller.EmployeeSignin)

	r.POST("/reset-password", controller.ResetPasswordController)
	r.POST("/validate-reset-token", controller.ValidateResetTokenController)

	// กลุ่มเส้นทางที่ต้องตรวจสอบโทเค็น
	protected := r.Group("/")
	protected.Use(middlewares.Authorizes()) // เรียกใช้ Authorizes middleware เพื่อเช็คโทเค็น
	{
		// Gender Routes
		protected.GET("/genders", controller.ListGenders)
		protected.GET("/gender/:id", controller.GetGender)
		protected.POST("/genders", controller.CreateGender)
		protected.PATCH("/gender/:id", controller.UpdateGender)
		protected.DELETE("/gender/:id", controller.DeleteGender)

		// Department Routes
		protected.GET("/departments", controller.ListDepartments)
		protected.GET("/department/:id", controller.GetDepartment)
		protected.POST("/departments", controller.CreateDepartment)
		protected.PATCH("/department/:id", controller.UpdateDepartment)
		protected.DELETE("/department/:id", controller.DeleteDepartment)

		// Position Routes
		protected.GET("/positions", controller.ListPositions)
		protected.GET("/position/:id", controller.GetPosition)
		protected.POST("/positions", controller.CreatePosition)
		protected.PATCH("/position/:id", controller.UpdatePosition)
		protected.DELETE("/position/:id", controller.DeletePosition)

		// Specialist Routes
		protected.GET("/specialists", controller.ListSpecialists)
		protected.GET("/specialist/:id", controller.GetSpecialist)
		protected.POST("/specialists", controller.CreateSpecialist)
		protected.PATCH("/specialist/:id", controller.UpdateSpecialist)
		protected.DELETE("/specialist/:id", controller.DeleteSpecialist)

		// Status Routes
		protected.GET("/statuses", controller.ListStatuses)
		protected.GET("/status/:id", controller.GetStatus)
		protected.POST("/statuses", controller.CreateStatus)
		protected.PATCH("/status/:id", controller.UpdateStatus)
		protected.DELETE("/status/:id", controller.DeleteStatus)

		// Employee Routes
		protected.GET("/employees", controller.ListEmployees)
		protected.GET("/employee/:id", controller.GetEmployee)
		protected.POST("/employees", controller.CreateEmployee)
		protected.PATCH("/employee/:id", controller.UpdateEmployee)
		protected.PATCH("/employeereset", controller.ResetPassword)
		protected.DELETE("/employee/:id", controller.DeleteEmployee)

		// Disease Routes
		protected.GET("/diseases", controller.ListDiseases)
		protected.GET("/disease/:id", controller.GetDisease)
		protected.POST("/diseases", controller.CreateDisease)
		protected.PATCH("/disease/:id", controller.UpdateDisease)
		protected.DELETE("/disease/:id", controller.DeleteDisease)

		// BloodGroup Routes
		protected.GET("/bloodgroups", controller.GetBloodGroups)
		protected.GET("/bloodgroup/:id", controller.GetBloodGroupByID)
		protected.POST("/bloodgroups", controller.CreateBloodGroup)
		protected.PATCH("/bloodgroup/:id", controller.UpdateBloodGroup)
		protected.DELETE("/bloodgroup/:id", controller.DeleteBloodGroup)

	}

	// เส้นทางสำหรับตรวจสอบสถานะของ API
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// เริ่มต้นเซิร์ฟเวอร์
	r.Run("localhost:" + PORT)
}

// ฟังก์ชัน CORS middleware
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
