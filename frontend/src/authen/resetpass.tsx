import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resetApi, validateApi, resetPassword } from "../services/https";

const ResetPass = () => {
  const [email, setEmail] = useState("");
  const [uuid, setUuid] = useState("");
  const [timer, setTimer] = useState(15 * 60); // ตั้งเวลา 15 นาที (900 วินาที)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: UUID, Step 3: Password

  const navigate = useNavigate();

  // Handle Timer Countdown
  useEffect(() => {
    if (timer > 0 && step === 2) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, step]);

  // Handle Email Submission
  const handleEmailSubmit = async () => {
    if (!email) return alert("Please enter your email");

    const response = await resetApi({ email }); // เรียก resetApi
    if (response.status === 200) {
      alert("Reset token has been sent to your email.");
      setStep(2); // ไปที่ Step 2 (กรอก UUID)
    } else {
      alert(response.data.error || "Failed to send reset token.");
    }
  };

  // Handle UUID Validation
  const handleUuidSubmit = async () => {
    if (!uuid) return alert("Please enter the reset token");

    const response = await validateApi({ token: uuid }); // เรียก validateApi
    if (response.status === 200) {
      localStorage.setItem("authToken", response.data.jwt); // เก็บ JWT ลง localStorage
      localStorage.setItem("employeeId", response.data.id); // เก็บ Employee ID ลง localStorage
      alert("Token is valid. Please set your new password.");
      setStep(3); // ไปที่ Step 3 (ตั้งรหัสผ่านใหม่)
    } else {
      alert(response.data.error || "Invalid or expired token.");
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    const employeeId = localStorage.getItem("employeeId"); // ดึง Employee ID จาก localStorage
    const response = await resetPassword(Number(employeeId), newPassword); // เรียก resetPassword
    if (response.status === 200) {
      alert("Password has been reset successfully.");
      navigate("/login"); // ไปที่หน้า Login
    } else {
      alert(response.data.error || "Failed to reset password.");
    }
  };

  // Format Timer (mm:ss)
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Reset Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={handleEmailSubmit} style={{ width: "100%", padding: "10px" }}>
            Send Reset Token
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p>Time remaining: {formatTimer()}</p>
          <input
            type="text"
            placeholder="Enter the reset token"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={handleUuidSubmit} style={{ width: "100%", padding: "10px" }}>
            Validate Token
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={handlePasswordReset} style={{ width: "100%", padding: "10px" }}>
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ResetPass;
