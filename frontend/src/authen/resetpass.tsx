import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resetApi, validateApi, resetPassword } from "../services/https";
import { Form, Input, Button, Card, Typography, Row, Col, message } from "antd";

const { Title, Text } = Typography;

const ResetPass: React.FC = () => {
  const [email, setEmail] = useState("");
  const [uuid, setUuid] = useState("");
  const [timer, setTimer] = useState(15 * 60); // 15 minutes
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: UUID, Step 3: Password
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  // Countdown timer
  useEffect(() => {
    if (timer > 0 && step === 2) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, step]);

  // Format timer to mm:ss
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle Email Submission
  const handleEmailSubmit = async () => {
    if (!email) return messageApi.error("Please enter your email");
    const response = await resetApi({ email });
    if (response.status === 200) {
      messageApi.success("Reset token sent to your email.");
      setStep(2);
      setTimer(15 * 60); // Reset timer to 15 minutes
    } else {
      messageApi.error(response.data.error || "Failed to send reset token.");
    }
  };

  // Handle Resend Reset Token
  const handleResendToken = async () => {
    if (!email) return messageApi.error("Please enter your email to resend the token.");
    const response = await resetApi({ email });
    if (response.status === 200) {
      messageApi.success("Reset token resent to your email.");
      setTimer(15 * 60); // Reset timer to 15 minutes
    } else {
      messageApi.error(response.data.error || "Failed to resend reset token.");
    }
  };

  // Handle UUID Validation
  const handleUuidSubmit = async () => {
    if (!uuid) return messageApi.error("Please enter the reset token");
    const response = await validateApi({ token: uuid });
    if (response.status === 200) {
      localStorage.setItem("authToken", response.data.jwt);
      localStorage.setItem("employeeId", response.data.id);
      messageApi.success("Token is valid. Please set your new password.");
      setStep(3);
    } else {
      messageApi.error(response.data.error || "Invalid or expired token.");
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      return messageApi.error("Passwords do not match.");
    }
    const employeeId = localStorage.getItem("employeeId");
    const response = await resetPassword(Number(employeeId), newPassword);
    if (response.status === 200) {
      messageApi.success("Password reset successfully.");
      navigate("/login");
    } else {
      messageApi.error(response.data.error || "Failed to reset password.");
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f0f2f5",
          padding: "20px",
        }}
      >
        <Card
          style={{
            maxWidth: 400,
            width: "100%",
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Row justify="center">
            <Col>
              <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
                Reset Password
              </Title>
            </Col>
          </Row>

          {step === 1 && (
            <Form layout="vertical" onFinish={handleEmailSubmit}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
              >
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Send Reset Token
                </Button>
              </Form.Item>
            </Form>
          )}

          {step === 2 && (
            <Form layout="vertical" onFinish={handleUuidSubmit}>
              <Row justify="space-between" style={{ marginBottom: 10 }}>
                <Text>Time remaining: {formatTimer()}</Text>
                <Button type="link" onClick={handleResendToken} style={{ padding: 0, fontSize: 14 }}>
                  Resend Token
                </Button>
              </Row>
              <Form.Item
                label="Reset Token"
                name="uuid"
                rules={[{ required: true, message: "Please input the reset token!" }]}
              >
                <Input
                  placeholder="Enter the reset token"
                  value={uuid}
                  onChange={(e) => setUuid(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Validate Token
                </Button>
              </Form.Item>
            </Form>
          )}

          {step === 3 && (
            <Form layout="vertical" onFinish={handlePasswordReset}>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[{ required: true, message: "Please input your new password!" }]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your new password!" },
                ]}
              >
                <Input.Password
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          )}

          <Row justify="center" style={{ marginTop: 20 }}>
            <Text>
              Remember your password?{" "}
              <a onClick={() => navigate("/login")} style={{ color: "#1890ff" }}>
                Go to Login
              </a>
            </Text>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default ResetPass;
