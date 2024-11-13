import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { IEmployee } from "../../interfaces/IEmployee";
import { getEmployeeById } from "../../services/https";
import demo from "../../assets/demo.png";

const { Sider } = Layout;

const NurseSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profile, setProfile] = useState(demo); // กำหนด default image เป็น demo
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับดึงข้อมูลพนักงาน
  const fetchEmployeeData = async () => {
    const employeeId = localStorage.getItem("id");
    if (employeeId) {
      const employee: IEmployee | false = await getEmployeeById(employeeId);
      if (employee) {
        setFirstName(employee.first_name || "");
        setLastName(employee.last_name || "");
        setProfile(employee.profile || demo); // ใช้ demo เป็นค่า default หากไม่มีรูป
      }
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

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
      <div style={{ textAlign: "center", padding: "16px", color: "#fff" }}>
      <img
  src={profile} // ใช้รูปภาพโปรไฟล์
  alt="Profile"
  style={{
    width: collapsed ? "40px" : "80px",
    height: collapsed ? "40px" : "80px",
    borderRadius: "50%",
    border: "2px solid #fff",
    marginBottom: "8px",
    transition: "all 0.3s ease-in-out", // เพิ่ม transition เพื่อทำให้ smooth
  }}
/>
        {!collapsed && (
          <div>
            <div style={{ fontSize: "18px" }}>
              {firstName} {lastName}
            </div>
          </div>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        style={{ backgroundColor: "transparent" }} // ทำให้ Menu ใช้พื้นหลังเดียวกับ Sider
      >
        <Menu.Item
          key="nurse1"
          icon={<AppstoreOutlined />}
          style={{ color: "#ffffff" }}
        >
          <Link to="/nurse" style={{ color: "#ffffff" }}>
            Nurse1
          </Link>
        </Menu.Item>

        <Menu.Item
          key="nurse2"
          icon={<FileTextOutlined />}
          style={{ color: "#ffffff" }}
        >
          <Link to="/nurse2" style={{ color: "#ffffff" }}>
            Nurse2
          </Link>
        </Menu.Item>

        <Menu.Item
          key="option1"
          icon={<PieChartOutlined />}
          style={{ color: "#ffffff" }}
        >
          <Link to="/option1" style={{ color: "#ffffff" }}>
            Option 1
          </Link>
        </Menu.Item>

        <Menu.Item
          key="option2"
          icon={<DesktopOutlined />}
          style={{ color: "#ffffff" }}
        >
          <Link to="/option2" style={{ color: "#ffffff" }}>
            Option 2
          </Link>
        </Menu.Item>

        <Menu.SubMenu
          key="sub1"
          icon={<MailOutlined />}
          title="Navigation One"
          style={{ color: "#ffffff" }}
        >
          <Menu.Item key="sub1_option5" style={{ color: "#ffffff" }}>
            Option 5
          </Menu.Item>
          <Menu.Item key="sub1_option6" style={{ color: "#ffffff" }}>
            Option 6
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="sub2"
          icon={<AppstoreOutlined />}
          title="Navigation Two"
          style={{ color: "#ffffff" }}
        >
          <Menu.Item key="sub2_option9" style={{ color: "#ffffff" }}>
            Option 9
          </Menu.Item>
          <Menu.Item key="sub2_option10" style={{ color: "#ffffff" }}>
            Option 10
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            color: "#d9534f", // สีแดงสำหรับ Logout
            
          }}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default NurseSidebar;
