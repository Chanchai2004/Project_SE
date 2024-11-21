import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, message, Row, Col, Typography } from "antd";
import { authenticateUser } from "../services/https/index";
import Loader from "../components/Loadable/Loader"; // Loader Component
import logo from "../assets/logo1.png"; // Logo
import bg from "../assets/bg3.png"; // Background image

const { Text, Title } = Typography;

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false); // Loader State
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await authenticateUser(username, password);

      if (response) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("position", response.position);
        localStorage.setItem("id", response.id.toString());
        localStorage.setItem("department", response.department);
        localStorage.setItem("isLogin", "true");

        messageApi.success("Sign-in successful");

        let redirectPath = "/login";
        switch (response.position) {
          case "Doctor":
            redirectPath = "/doctor";
            break;
          case "Nurse":
            redirectPath = "/nurse";
            break;
          case "Finance Staff":
            redirectPath = "/finance";
            break;
          case "Nurse counter":
            redirectPath = "/counter";
            break;
          case "Admin":
            redirectPath = "/admin";
            break;
          case "Pharmacy":
            redirectPath = "/pharmacy";
            break;
          default:
            redirectPath = "/login";
        }

        setTimeout(() => {
          setLoading(false);
          navigate(redirectPath);
        }, 1000);
      } else {
        setLoading(false);
        messageApi.error("การตรวจเข้าสู่ระบบล้มเหลว โปรดตรวจสอบชื่อผู้ใช้และรหัสผ่านของคุณ");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during authentication:", error);
      messageApi.error("การเข้าถึงนี้ถูกจำกัด โปรดตรวจสอบสิทธิ์การใช้งานของคุณหรือสอบถามข้อมูลเพิ่มเติมจากผู้ดูแลระบบ");
    }
  };

  return (
    <>
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <div
          className="login-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundImage: `url(${bg})`, // Use background image
            backgroundSize: "cover", // Ensure the image covers the entire background
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backdropFilter: "blur(10px)", // Add blur effect
          }}
        >
          <Card
            className="card-login"
            style={{
              width: 400,
              borderRadius: 15,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent background
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <Row align="middle" justify="center" style={{ marginBottom: 20, textAlign: "center" }}>
              <Col>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: "#e0f7fa",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      width: "240%",
                      height: "240%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </Col>
            </Row>

            <Title level={3} style={{ textAlign: "center", marginBottom: 20, color: "black" }}>
              เข้าสู่ระบบ
            </Title>
            <Form name="login-form" onFinish={handleLogin} layout="vertical">
              <Form.Item
                label="ชื่อผู้ใช้"
                name="username"
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้!" }]}
              >
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้ของคุณ"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
              <Form.Item
                label="รหัสผ่าน"
                name="password"
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน!" }]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านของคุณ"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: 10,
                    backgroundColor: "#0288d1",
                    border: "none",
                  }}
                >
                  เข้าสู่ระบบ
                </Button>
              </Form.Item>
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <Text style={{ color: "black" }}>
                  ลืมรหัสผ่าน?{" "}
                  <a
                    onClick={() => navigate("/resetpassword")}
                    style={{ color: "#0288d1" }}
                  >
                    รีเซ็ตรหัสผ่าน
                  </a>
                </Text>
              </div>
            </Form>
          </Card>
        </div>
      )}
    </>
  );
};

export default Login;
