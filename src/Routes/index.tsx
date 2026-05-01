import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Layout from "../Layout";
import { AuthRoutes, pageRoutes } from "./PageRoutes";
import RootRedirect from "./RootRedirect";

export const Router = createBrowserRouter([

  {
    path: "/",
    element: <RootRedirect />,
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
    element: <RootRedirect />,
  },
]);