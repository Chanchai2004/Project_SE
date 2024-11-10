import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/Loadable/Loadable";
import FullLayout from "../layouts/FullLayout";

const Doctor1 = Loadable(lazy(() => import("../pages/doctor/Doctor1")));
const Doctor2 = Loadable(lazy(() => import("../pages/doctor/Doctor2")));

const DoctorRoutes = (): RouteObject[] => {
  return [
    {
      path: "/", // ใช้ /* เพื่อรองรับเส้นทางย่อย
      element: <FullLayout />,
      children: [
        {
          path: "/doctor",
          element: <Doctor1 />,
        },
        {
          path: "/doctor2",
          element: <Doctor2 />,
        },
      ],
    },
  ];
};

export default DoctorRoutes;
