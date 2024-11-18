import { useRoutes, RouteObject } from "react-router-dom";
import DoctorRoutes from "../routes/DoctorRoutes";
import NurseRoutes from "../routes/NurseRoutes";
import LoginRoutes from "../routes/LoginRoutes";
import FinanceRoutes from "./FinanceRoutes";
import CounterRoutes from "./CounterRoutes";
import AdminRoutes from "./AdminRoutes";

import { useNavigate } from 'react-router-dom';

function ConfigRoutes() {
  const isLoggedIn = localStorage.getItem("isLogin") === "true";
  const position = localStorage.getItem("position");
  const navigate = useNavigate();
  let routes: RouteObject[] = [];

  if (isLoggedIn) {
    // เรียกใช้งานฟังก์ชัน DoctorRoutes() และ NurseRoutes() เพื่อให้ได้ค่าประเภท RouteObject[]
    if (position === "Doctor") {
      
      routes = DoctorRoutes(); // DoctorRoutes ต้องคืนค่า RouteObject[]
  
    } else if (position === "Nurse") {
      
      routes = NurseRoutes(); // NurseRoutes ต้องคืนค่า RouteObject[]

    } else if (position === "Admin") {
      
      routes = AdminRoutes(); // NurseRoutes ต้องคืนค่า RouteObject[]

    } else if (position === "Nurse counter") {
      
      routes = CounterRoutes(); // NurseRoutes ต้องคืนค่า RouteObject[]

    } else if (position === "Finance Staff") {
      
      routes = FinanceRoutes(); // NurseRoutes ต้องคืนค่า RouteObject[]
 
    } else {
      console.log("this in routes login");
      routes = [LoginRoutes()]; // LoginRoutes ต้องคืนค่า RouteObject[]
  
    }


  } else {
    console.log("this is else routes login");
    routes = [LoginRoutes()]; // LoginRoutes ต้องคืนค่า RouteObject[]

  }
  

  return useRoutes(routes);
}

export default ConfigRoutes;