import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import MinimalLayout from "../layouts/MinimalLayout";
import Loadable from "../components/Loadable/Loadable";

const  Login = Loadable(lazy(() => import("../authen/login")));

const LoginRoutes = (): RouteObject => {
  return {
    path: "/",
    element: <MinimalLayout />,
    children: [
      {
        path: "/",
        element: <Login/>,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  };
};

export default LoginRoutes;