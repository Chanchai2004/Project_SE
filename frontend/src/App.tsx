import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // ตรวจสอบว่ามีการ import ถูกต้อง
import Login from '../src/authen/login'; // แก้ไขเส้นทางตามที่คุณเก็บไฟล์ Login
import CreateUser from '../src/page/createuser/createuser'; // แก้ไขเส้นทางตามที่คุณเก็บไฟล์ CreateUser
import Doctor from '../src/page/docter/docter'; // แก้ไขเส้นทางตามที่คุณเก็บไฟล์ Doctor

function App() {
  // ดึง position จาก cookies ภายใน React component
  const position = Cookies.get("position");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Routes สำหรับตำแหน่ง Doctor */}
        {position === 'Doctor' && (
          <>
            <Route path="/doctor1" element={<Doctor />} />
          </>
        )}

        {/* Routes สำหรับตำแหน่ง Nurse */}
        {position === 'Nurse' && (
          <>
            {/*<Route path="/n1" element={<NursePage1 />} />*/}
            {/*<Route path="/n2" element={<NursePage2 />} />*/}
            {/*<Route path="/n3" element={<NursePage3 />} />*/}
          </>
        )}

        {/* Routes สำหรับตำแหน่ง Finance */}
        {position === 'Finance' && (
          <>
            <Route path="/finance1" element={<CreateUser />} />
          </>
        )}

        {/* ถ้าไม่มีสิทธิ์เข้าถึง Route จะถูกนำไปที่หน้า Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
