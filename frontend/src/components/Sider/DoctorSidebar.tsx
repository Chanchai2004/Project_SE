import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AppstoreAddOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const DoctorSidebar: React.FC = () => {
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับ Logout
  const handleLogout = () => {
    localStorage.clear(); // เคลียร์ข้อมูลใน localStorage
    navigate("/login"); // นำทางไปที่หน้า login
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
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: (
        <Button type="link" onClick={handleLogout} style={{ padding: 0 }}>
          Logout
        </Button>
      ),
    },
  ];

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu mode="inline" defaultSelectedKeys={['doctor1']} items={items} />
    </Sider>
  );
};

export default DoctorSidebar;
