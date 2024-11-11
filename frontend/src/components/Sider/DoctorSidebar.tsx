import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AppstoreAddOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import './sider.css'; // Import CSS file

const { Sider } = Layout;

const DoctorSidebar: React.FC = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage
    navigate("/login"); // Redirect to login page
  };

  const items = [
    {
      key: "doctor1",
      icon: <AppstoreOutlined />,
      label: <Link to="/doctor">Doctor 1</Link>,
    },
    {
      key: "doctor2",
      icon: <AppstoreAddOutlined />,
      label: <Link to="/doctor2">Doctor 2</Link>,
    },
  ];

  return (
    <Sider width={200} className="sider-container">
      <Menu mode="inline" defaultSelectedKeys={['doctor1']} items={items} />

      {/* Logout button positioned at the very bottom of the sidebar */}
      <div className="logout-button-fixed">
        <Button
          type="link"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ color: "#d9534f", fontWeight: "bold" }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default DoctorSidebar;
