import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/Loadable/Loadable";
import FullLayout from "../layouts/FullLayout";

const Nurse1 = Loadable(lazy(() => import("../pages/nurse/Nurse1")));
const Nurse2 = Loadable(lazy(() => import("../pages/nurse/Nurse2")));

const NurseRoutes = (): RouteObject[] => {
  return [
    {
      path: "/",
      element: <FullLayout />,
      children: [
        {
          path: "/nurse",
          element: <Nurse1 />,
        },
        {
          path: "/nurse2",
          element: <Nurse2 />,
        },
      ],
    },
  ];
};

export default NurseRoutes;
