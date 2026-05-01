import { Navigate } from "react-router-dom";
import { ROUTES } from "../Constants/Routes";
import { PAGE_TITLE } from "../Constants/PageTitle";
import Dashboard from "../Pages/Admin/Dashboard";
import User from "../Pages/Admin/User";
import Profile from "../Pages/Common/Profile";
import ChangePassword from "../Pages/Common/ChangePassword";
import Login from "../Pages/Auth/Login";
import Order from "../Pages/User/Order";

export const pageRoutes = [
  {
    path: ROUTES.DASHBOARDADMIN,
    name: PAGE_TITLE.DASHBOARDADMIN,
    element: <Dashboard />,
  },  
  {
    path: ROUTES.DASHBOARDUSER,
    name: PAGE_TITLE.DASHBOARDUSER,
    element: <Dashboard />,
  },
  { path: ROUTES.DASHBOARDADMIN, element: <Dashboard /> },
  { path: ROUTES.USER.HOME, element: <User /> },
  { path: ROUTES.PROFILE.BASE, element: <Profile /> },
  { path: ROUTES.SETTINGS.CHANGE_PASSWORD, element: <ChangePassword /> },
  { path: ROUTES.ORDER.BASE, element: <Order /> },
  { path: ROUTES.USERS.ALL, element: <User/> }
]

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },
  { path: ROUTES.AUTH.LOGIN, element: <Login /> },
];
// export const AdminRoutes = [
//   {
//     path: ROUTES.DASHBOARDADMIN,
//     name: PAGE_TITLE.DASHBOARDADMIN,
//     element: <Dashboard />,
//   },  
// ];

// export const UserRoutes = [
//   {
//     path: ROUTES.DASHBOARDUSER,
//     name: PAGE_TITLE.DASHBOARDUSER,
//     element: <Dashboard />,
//   },
// ];