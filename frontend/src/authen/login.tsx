import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, message, Row, Col } from 'antd';
import { authenticateUser } from '../services/https/index';
import Loader from '../components/Loadable/Loader'; // นำเข้า Loader
import logo from "../assets/logo.png"; // นำเข้าโลโก้ของคุณ

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false); // สร้าง state สำหรับควบคุม Loader
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async () => {
    setLoading(true); // เริ่มแสดง Loader
    try {
      const response = await authenticateUser(username, password);

      if (response) {
        // Save token, username, position, id, and department to localStorage
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("position", response.position);
        localStorage.setItem("id", response.id.toString());
        localStorage.setItem("department", response.department);
        localStorage.setItem("isLogin", "true");

        console.log("LocalStorage contents after login:", {
          authToken: localStorage.getItem("authToken"),
          username: localStorage.getItem("username"),
          position: localStorage.getItem("position"),
          id: localStorage.getItem("id"),
          department: localStorage.getItem("department"),
          isLogin: localStorage.getItem("isLogin"),
        });

        messageApi.success("Sign-in successful");

        // กำหนดเส้นทางตามบทบาทของผู้ใช้
        const validPositions = ["Doctor", "Nurse", "Finance" , "Nurse counter", "Admin"];
        let redirectPath = "/login"; // เส้นทางเริ่มต้นหากตำแหน่งไม่ถูกต้อง

        if (response.position === "Doctor") {
          redirectPath = "/doctor"; // เส้นทางสำหรับ Doctor
        } else if (response.position === "Nurse") {
          redirectPath = "/nurse"; // เส้นทางสำหรับ Nurse
        } else if (response.position === "Finance Staff") {
          redirectPath = "/finance"; // เส้นทางสำหรับ Finance
        } else if (response.position === "Nurse counter") {
          redirectPath = "/counter"; // เส้นทางสำหรับ Finance
        } else if (response.position === "Admin") {
          redirectPath = "/admin"; // เส้นทางสำหรับ Finance
        } else {
          redirectPath = "/login";
        }

        // ตั้งค่า delay 1 วินาทีแล้วค่อย navigate ไปตามบทบาทของผู้ใช้
        setTimeout(() => {
          setLoading(false);
          navigate(redirectPath); // นำทางไปที่เส้นทางแรกของบทบาทนั้น
        }, 1000); // หน่วงเวลา 1 วินาที
      } else {
        setLoading(false);
        messageApi.error('Authentication failed. Please check your username and password.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during authentication:', error);
      messageApi.error('An error occurred during login. Please try again later.');
    }
  };

  return (
    <>
      {contextHolder}
      {loading ? (
        <Loader /> // แสดง Loader ระหว่างการโหลด
      ) : (
        <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Card className="card-login" style={{ width: 500 }}>
            <Row align="middle" justify="center" style={{ marginBottom: 20 }}>
              <Col>
                <img src={logo} alt="logo" style={{ width: "80%" }} />
              </Col>
            </Row>
            <Form
              name="login-form"
              onFinish={handleLogin}
              layout="vertical"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                  Log in
                </Button>
                Or <a onClick={() => navigate("/signup")}>signup now!</a>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}
    </>
  );
};

export default Login;
