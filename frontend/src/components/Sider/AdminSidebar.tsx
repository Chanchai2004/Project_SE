import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DollarCircleOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับ Logout
  const handleLogout = () => {
    localStorage.clear(); // เคลียร์ข้อมูลใน localStorage
    navigate("/login"); // นำทางไปที่หน้า login
  };

  const items = [
    {
      key: "admin1",
      icon: <DollarCircleOutlined />,
      label: <Link to="/admin">Admin 1</Link>,
    },
    {
      key: "admin2",
      icon: <BarChartOutlined />,
      label: <Link to="/admin2">Admin 2</Link>,
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
      <Menu mode="inline" defaultSelectedKeys={['admin1']} items={items} />
    </Sider>
  );
};

export default AdminSidebar;
