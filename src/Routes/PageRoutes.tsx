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
  { path: ROUTES.DASHBOARD, element: <Dashboard />, roles: ["admin", "user"], showInSidebar: true, sidebarKey: "dashboard", name: PAGE_TITLE.DASHBOARD },
  { path: ROUTES.PROFILE.BASE, element: <Profile />, roles: ["admin", "user"], showInSidebar: false, sidebarKey: "profile",  name: PAGE_TITLE.PROFILE.BASE },
  { path: ROUTES.SETTINGS.CHANGE_PASSWORD, element: <ChangePassword />, roles: ["admin", "user"], showInSidebar: false, sidebarKey: "settings", name: PAGE_TITLE.SETTING.CHANGE_PASSWORD },
  { path: ROUTES.USERS.ALL, element: <User/>, roles: ["admin"], showInSidebar: true, sidebarKey: "users", name: PAGE_TITLE.USERS.BASE },
  { path: ROUTES.USERS.ADD_EDIT, name: PAGE_TITLE.USERS.BASE, element: <UserForm />, roles: ["admin"], showInSidebar: false, sidebarKey: "users", },
]

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },
  { path: ROUTES.AUTH.LOGIN, element: <Login /> },
];