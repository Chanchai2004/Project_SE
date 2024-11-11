import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/Loadable/Loadable";
import FullLayout from "../layouts/FullLayout";

const Finance1 = Loadable(lazy(() => import("../pages/finance/Finance1")));
const Finance2 = Loadable(lazy(() => import("../pages/finance/Finance2")));

const FinanceRoutes = (): RouteObject[] => {
  return [
    {
      path: "/", // ใช้ FullLayout เป็น layout หลัก
      element: <FullLayout />,
      children: [
        {
          path: "/finance", // เส้นทางสำหรับ Finance1
          element: <Finance1 />,
        },
        {
          path: "/finance2", // เส้นทางสำหรับ Finance2
          element: <Finance2 />,
        },
      ],
    },
  ];
};

export default FinanceRoutes;
