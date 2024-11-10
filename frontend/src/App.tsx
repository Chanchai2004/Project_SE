import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ConfigRoutes from "./routes"; // นำเข้า ConfigRoutes จาก routes/index.tsx
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <ConfigRoutes /> {/* ใช้งานเส้นทางทั้งหมดที่กำหนดใน ConfigRoutes */}
    </Router>
  );
};

export default App;
