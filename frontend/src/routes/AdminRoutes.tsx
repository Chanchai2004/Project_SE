import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/Loadable/Loadable";
import FullLayout from "../layouts/FullLayout";

const Admin1 = Loadable(lazy(() => import("../pages/admin/Admin1")));
const Admin2 = Loadable(lazy(() => import("../pages/admin/Admin2")));

const AdminRoutes = (): RouteObject[] => {
  return [
    {
      path: "/", // ใช้ /* เพื่อรองรับเส้นทางย่อย
      element: <FullLayout />,
      children: [
        {
          index: true, // Default route
          element: <Admin1 />, // แสดง Admin1 เมื่อเข้า "/"
        },
        {
          path: "/admin",
          element: <Admin1 />,
        },
        {
          path: "/admin2",
          element: <Admin2 />,
        },
      ],
    },
  ];
};

export default AdminRoutes;
