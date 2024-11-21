package controller

import (
	"fmt"
	"net/smtp"
)

// SendEmail ส่งอีเมลด้วย Gmail SMTP
func SendEmail(to, subject, body string) error {
	// ข้อมูล SMTP Server
	from := "tepsirihopital@gmail.com"     // อีเมลที่คุณใช้
	password := "hchhoehgfpjvvwkl"        // App Password ที่คุณสร้าง
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// เนื้อหาอีเมลพร้อม Header สำหรับ HTML
	msg := []byte("To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\r\n" + // ระบุว่าเป็น HTML
		"\r\n" +
		body + "\r\n")

	// Authentication
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// ส่งอีเมล
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, msg)
	if err != nil {
		fmt.Println("Failed to send email:", err)
		return err
	}

	fmt.Println("Email sent successfully to:", to)
	return nil
}

