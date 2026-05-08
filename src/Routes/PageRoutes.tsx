import { Navigate } from "react-router-dom";
import { ROUTES } from "../Constants/Routes";
import { PAGE_TITLE } from "../Constants/PageTitle";
import User from "../Pages/User";
import Profile from "../Pages/Profile";
import UserForm from "../Pages/User/UserForm";
import Login from "../Pages/Auth/Login";
import ChangePassword from "../Pages/ChangePassword";
import Dashboard from "../Pages/Dashboard";

export const pageRoutes = [
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.USER.HOME, element: <User /> },
  { path: ROUTES.PROFILE.BASE, element: <Profile /> },
  { path: ROUTES.SETTINGS.CHANGE_PASSWORD, element: <ChangePassword /> },
  { path: ROUTES.USERS.ALL, element: <User/> },
  { path: ROUTES.USERS.ADD_EDIT, name: PAGE_TITLE.USERS.BASE, element: <UserForm /> },
]

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },
  { path: ROUTES.AUTH.LOGIN, element: <Login /> },
];