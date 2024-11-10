import React from "react";
import { Routes, Route } from "react-router-dom";
import "../../App.css";
import { Breadcrumb, Layout, theme, message } from "antd";

import Doctor1 from "../../pages/doctor/Doctor1";
import Doctor2 from "../../pages/doctor/Doctor2";
import Nurse1 from "../../pages/nurse/Nurse1";
import Nurse2 from "../../pages/nurse/Nurse2";

import DoctorSidebar from "../../components/Sider/DoctorSidebar";
import NurseSidebar from "../../components/Sider/NurseSidebar";

const { Content } = Layout;

const FullLayout: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const position = localStorage.getItem("position");

  const renderSider = () => {
    if (position === "Doctor") {
      return <DoctorSidebar />;
    } else if (position === "Nurse") {
      return <NurseSidebar />;
    } else {
      return null; // กรณีที่ไม่พบตำแหน่ง
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: "100vh", backgroundColor: "#F5F5F5" }}>
        {renderSider()}

        <Layout style={{ backgroundColor: colorBgContainer, minHeight: "100vh" }}>
          <Content style={{ margin: "0 30px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              {/* กำหนด Breadcrumb items ที่เหมาะสมตามเส้นทาง */}
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: "93%",
                background: colorBgContainer,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
              }}
            >
              <Routes>
                {/* ตรวจสอบว่าเส้นทางตรงกับเส้นทางใน ConfigRoutes หรือไม่ */}
                <Route path="/doctor" element={<Doctor1 />} />
                <Route path="/doctor2" element={<Doctor2 />} />
                <Route path="/nurse" element={<Nurse1 />} />
                <Route path="/nurse2" element={<Nurse2 />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default FullLayout;
