import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Layout from "../Layout";
import { AuthRoutes, pageRoutes } from "./PageRoutes";
import { ROUTES } from "../Constants";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Navigate to={ROUTES.AUTH.LOGIN} replace />
    ),
  },
  {
    element: <PublicRoutes />,
    children: AuthRoutes,
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <Layout />,
        children: pageRoutes,
      },
    ],
  },
  {
    path: "*",
    element: (
      <Navigate to={ROUTES.AUTH.LOGIN} replace />
    ),
  },
]);
