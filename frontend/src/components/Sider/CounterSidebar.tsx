import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const CounterSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onMouseEnter={() => setCollapsed(false)} // Expand on hover
      onMouseLeave={() => setCollapsed(true)} // Collapse on mouse leave
      width={200}
      theme="dark"
      style={{ backgroundColor: "#5752a7" }} // สีพื้นหลังของ Sider
    >
      <div style={{ color: "#fff", textAlign: "center", padding: "16px", fontSize: "24px" }}>
        {collapsed ? "C" : "Counter"}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        style={{
          backgroundColor: "transparent", // ทำให้ Menu ใช้พื้นหลังเดียวกับ Sider
        }}
      >
        <Menu.Item
          key="dashboard"
          icon={<AppstoreOutlined />}
          style={{
            color: "#ffffff",
          }}
        >
          <Link to="/counter" style={{ color: "#ffffff" }}>Counter1</Link>
        </Menu.Item>
        
        <Menu.Item
          key="patientRecords"
          icon={<FileTextOutlined />}
          style={{
            color: "#ffffff",
          }}
        >
          <Link to="/counter2" style={{ color: "#ffffff" }}>Counter2</Link>
        </Menu.Item>
        
        <Menu.Item
          key="option1"
          icon={<PieChartOutlined />}
          style={{
            color: "#ffffff",
          }}
        >
          <Link to="/option1" style={{ color: "#ffffff" }}>Option 1</Link>
        </Menu.Item>
        
        <Menu.Item
          key="option2"
          icon={<DesktopOutlined />}
          style={{
            color: "#ffffff",
          }}
        >
          <Link to="/option2" style={{ color: "#ffffff" }}>Option 2</Link>
        </Menu.Item>
        
        <Menu.SubMenu
          key="sub1"
          icon={<MailOutlined />}
          title="Navigation One"
          style={{
            color: "#ffffff",
          }}
        >
          <Menu.Item key="sub1_option5" style={{ color: "#ffffff" }}>Option 5</Menu.Item>
          <Menu.Item key="sub1_option6" style={{ color: "#ffffff" }}>Option 6</Menu.Item>
        </Menu.SubMenu>
        
        <Menu.SubMenu
          key="sub2"
          icon={<AppstoreOutlined />}
          title="Navigation Two"
          style={{
            color: "#ffffff",
          }}
        >
          <Menu.Item key="sub2_option9" style={{ color: "#ffffff" }}>Option 9</Menu.Item>
          <Menu.Item key="sub2_option10" style={{ color: "#ffffff" }}>Option 10</Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            color: "#d9534f", // สีแดงสำหรับ Logout
            marginTop: "55vh", // ให้ปุ่ม Logout อยู่ด้านล่าง
          }}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default CounterSidebar;
