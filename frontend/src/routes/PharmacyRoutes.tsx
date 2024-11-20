import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/Loadable/Loadable";
import FullLayout from "../layouts/FullLayout";

const Phamacy1 = Loadable(lazy(() => import("../pages/pharmacy/Pharmacy1")));
const Phamacy2 = Loadable(lazy(() => import("../pages/pharmacy/Pharmacy2")));

const PharmacyRoutes = (): RouteObject[] => {
  return [
    {
      path: "/", // ใช้ /* เพื่อรองรับเส้นทางย่อย
      element: <FullLayout />,
      children: [
        {
          path: "/pharmacy",
          element: <Phamacy1 />,
        },
        {
          path: "/pharmacy2",
          element: <Phamacy2 />,
        },
      ],
    },
  ];
};

export default PharmacyRoutes;
