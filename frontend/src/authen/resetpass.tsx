import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resetApi, validateApi, resetPassword } from "../services/https";
import { Form, Input, Button, Card, Typography, Row, Col, message } from "antd";
import bg from "../assets/bg3.png"; // รูปพื้นหลัง

const { Title, Text } = Typography;

const ResetPass: React.FC = () => {
  const [email, setEmail] = useState("");
  const [uuid, setUuid] = useState("");
  const [timer, setTimer] = useState(15 * 60); // 15 นาที
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // ขั้นตอน: 1 - อีเมล, 2 - รหัส, 3 - รหัสผ่านใหม่
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // ตั้งเวลาให้นับถอยหลัง
  useEffect(() => {
    if (timer > 0 && step === 2) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, step]);

  // แปลงเวลาเป็นรูปแบบ mm:ss
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // จัดการส่งอีเมล
  const handleEmailSubmit = async () => {
    if (!email) return messageApi.error("กรุณากรอกอีเมลของคุณ");
    const response = await resetApi({ email });
    if (response.status === 200) {
      messageApi.success("ส่งรหัสยืนยันไปที่อีเมลของคุณแล้ว");
      setStep(2);
      setTimer(15 * 60); // รีเซ็ตเวลา 15 นาที
    } else {
      messageApi.error(response.data.error || "ไม่สามารถส่งรหัสยืนยันได้");
    }
  };

  // จัดการส่งรหัสใหม่
  const handleResendToken = async () => {
    if (!email) return messageApi.error("กรุณากรอกอีเมลของคุณเพื่อตั้งค่ารหัสใหม่");
    const response = await resetApi({ email });
    if (response.status === 200) {
      messageApi.success("ส่งรหัสยืนยันใหม่ไปที่อีเมลของคุณแล้ว");
      setTimer(15 * 60);
    } else {
      messageApi.error(response.data.error || "ไม่สามารถส่งรหัสยืนยันได้");
    }
  };

  // ตรวจสอบรหัสยืนยัน
  const handleUuidSubmit = async () => {
    if (!uuid) return messageApi.error("กรุณากรอกรหัสยืนยัน");
    const response = await validateApi({ token: uuid });
    if (response.status === 200) {
      localStorage.setItem("authToken", response.data.jwt);
      localStorage.setItem("employeeId", response.data.id);
      messageApi.success("รหัสถูกต้อง กรุณาตั้งรหัสผ่านใหม่");
      setStep(3);
    } else {
      messageApi.error(response.data.error || "รหัสยืนยันไม่ถูกต้องหรือหมดอายุ");
    }
  };

  // จัดการตั้งค่ารหัสผ่านใหม่
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      return messageApi.error("รหัสผ่านไม่ตรงกัน");
    }
    const employeeId = localStorage.getItem("employeeId");
    const response = await resetPassword(Number(employeeId), newPassword);
    if (response.status === 200) {
      messageApi.success("ตั้งรหัสผ่านใหม่สำเร็จ");
      navigate("/login");
    } else {
      messageApi.error(response.data.error || "ไม่สามารถตั้งรหัสผ่านใหม่ได้");
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
          backgroundImage: `url(${bg})`, // พื้นหลัง
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(10px)", // เอฟเฟกต์เบลอ
        }}
      >
        <Card
          style={{
            maxWidth: 400,
            width: "100%",
            borderRadius: 15,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // พื้นหลังโปร่งแสง
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Row justify="center">
            <Col>
              <Title level={3} style={{ textAlign: "center", marginBottom: 20, color: "black" }}>
                ตั้งค่ารหัสผ่านใหม่
              </Title>
            </Col>
          </Row>

          {step === 1 && (
            <Form layout="vertical" onFinish={handleEmailSubmit}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  { required: true, message: "กรุณากรอกอีเมลของคุณ" },
                  { type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง" }, // ตรวจสอบรูปแบบอีเมล
                ]}
              >
                <Input
                  placeholder="กรอกอีเมลของคุณ"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{
                    borderRadius: 10,
                    height: 40,
                    backgroundColor: "#0288d1",
                    border: "none",
                  }}
                >
                  ส่งรหัสยืนยัน
                </Button>
              </Form.Item>
            </Form>
          )}

          {step === 2 && (
            <Form
            layout="vertical"
            initialValues={{ email: email }} // ใช้ค่า email ที่กรอกไว้
            onFinish={handleUuidSubmit}
          >
            {/* ช่องกรอกอีเมล */}
            <Form.Item
              label="อีเมล"
              name="email"
              rules={[
                { required: true, message: "กรุณากรอกอีเมลของคุณ" },
                { type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง" }, // ตรวจสอบรูปแบบอีเมล
              ]}
            >
              <Input
                placeholder="กรอกอีเมลที่ใช้รับรหัสยืนยัน"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value); // เก็บค่าใน state
                }}
                style={{
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontSize: 16,
                }}
              />
            </Form.Item>
          
            {/* เวลาที่เหลือและปุ่มส่งรหัสใหม่ */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, color: "#555" }}>
                เวลาที่เหลือ: <b>{formatTimer()}</b>
              </Text>
              <Button
                type="link"
                onClick={handleResendToken}
                style={{
                  fontSize: 14,
                  padding: 0,
                  color: "#0288d1",
                  textDecoration: "underline",
                }}
              >
                ส่งรหัสใหม่
              </Button>
            </Row>
          
            {/* ช่องกรอกรหัสยืนยัน */}
            <Form.Item
              label="รหัสยืนยัน"
              name="uuid"
              rules={[{ required: true, message: "กรุณากรอกรหัสยืนยัน" }]}
            >
              <Input
                placeholder="กรอกรหัสยืนยัน"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                style={{
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontSize: 16,
                }}
              />
            </Form.Item>
          
            {/* ปุ่มตรวจสอบรหัส */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  borderRadius: 10,
                  height: 45,
                  fontSize: 16,
                  backgroundColor: "#0288d1",
                  border: "none",
                }}
              >
                ตรวจสอบรหัส
              </Button>
            </Form.Item>
          </Form>
          



          )}

          {step === 3 && (
            <Form layout="vertical" onFinish={handlePasswordReset}>
            <Form.Item
              label="รหัสผ่านใหม่"
              name="newPassword"
              rules={[
                { required: true, message: "กรุณากรอกรหัสผ่านใหม่" },
                {
                  min: 8,
                  message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัว",
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                  message: "รหัสผ่านต้องมีตัวอักษรตัวเล็ก ตัวใหญ่ และตัวเลข",
                },
              ]}
            >
              <Input.Password
                placeholder="กรอกรหัสผ่านใหม่"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
            <Form.Item
              label="ยืนยันรหัสผ่าน"
              name="confirmPassword"
              rules={[
                { required: true, message: "กรุณายืนยันรหัสผ่านใหม่" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="ยืนยันรหัสผ่านใหม่"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  borderRadius: 10,
                  height: 40,
                  backgroundColor: "#0288d1",
                  border: "none",
                }}
              >
                ตั้งรหัสผ่านใหม่
              </Button>
            </Form.Item>
          </Form>
          
          )}

          <Row justify="center" style={{ marginTop: 20 }}>
            <Text style={{ color: "black" }}>
              จำรหัสผ่านได้แล้วใช่ไหม?{" "}
              <a onClick={() => navigate("/login")} style={{ color: "#0288d1" }}>
                กลับสู่หน้าเข้าสู่ระบบ
              </a>
            </Text>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default ResetPass;
