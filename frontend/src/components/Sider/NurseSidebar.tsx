import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AppstoreOutlined, AppstoreAddOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const NurseSidebar: React.FC = () => {
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับ Logout
  const handleLogout = () => {
    localStorage.clear(); // เคลียร์ข้อมูลใน localStorage
    navigate("/login"); // นำทางไปที่หน้า login
  };

  const items = [
    {
      key: "nurse1",
      icon: <AppstoreOutlined />,
      label: <Link to="/nurse">Nurse 1</Link>,
    },
    {
      key: "nurse2",
      icon: <AppstoreAddOutlined />,
      label: <Link to="/nurse2">Nurse 2</Link>,
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
      <Menu mode="inline" defaultSelectedKeys={['nurse1']} items={items} />
    </Sider>
  );
};

export default NurseSidebar;
