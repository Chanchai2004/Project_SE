import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, message, Row, Col, Typography } from "antd";
import { authenticateUser } from "../services/https/index";
import Loader from "../components/Loadable/Loader"; // Loader Component
import logo from "../assets/logo.png"; // Logo

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
        // Save data to localStorage
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("position", response.position);
        localStorage.setItem("id", response.id.toString());
        localStorage.setItem("department", response.department);
        localStorage.setItem("isLogin", "true");

        messageApi.success("Sign-in successful");

        // Redirect based on user role
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
          default:
            redirectPath = "/login";
        }

        setTimeout(() => {
          setLoading(false);
          navigate(redirectPath);
        }, 1000); // Add delay for user experience
      } else {
        setLoading(false);
        messageApi.error("Authentication failed. Please check your username and password.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during authentication:", error);
      messageApi.error("An error occurred during login. Please try again later.");
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
            background: "#f0f2f5",
          }}
        >
          <Card
            className="card-login"
            style={{
              width: 400,
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Row align="middle" justify="center" style={{ marginBottom: 20, textAlign: "center" }}>
  <Col>
    <img src={logo} alt="logo" style={{ width: "60%", display: "block", margin: "0 auto" }} />
  </Col>
</Row>

            <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
              Login
            </Title>
            <Form name="login-form" onFinish={handleLogin} layout="vertical">
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ width: "100%", height: "40px" }}
                >
                  Log In
                </Button>
              </Form.Item>
              <div style={{ textAlign: "center" }}>
                <Text>
                  Don't have an account?{" "}
                  <a onClick={() => navigate("/resetpassword")} style={{ color: "#1890ff" }}>
                    Reset Password
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
