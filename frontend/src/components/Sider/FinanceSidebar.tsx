import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DollarCircleOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const FinanceSidebar: React.FC = () => {
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับ Logout
  const handleLogout = () => {
    localStorage.clear(); // เคลียร์ข้อมูลใน localStorage
    navigate("/login"); // นำทางไปที่หน้า login
  };

  const items = [
    {
      key: "finance1",
      icon: <DollarCircleOutlined />,
      label: <Link to="/finance">Finance 1</Link>,
    },
    {
      key: "finance2",
      icon: <BarChartOutlined />,
      label: <Link to="/finance2">Finance 2</Link>,
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
      <Menu mode="inline" defaultSelectedKeys={['finance1']} items={items} />
    </Sider>
  );
};

export default FinanceSidebar;
