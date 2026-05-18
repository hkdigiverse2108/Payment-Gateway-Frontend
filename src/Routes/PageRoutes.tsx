import { Navigate } from "react-router-dom";
import { ROUTES } from "../Constants/Routes";
import { PAGE_TITLE } from "../Constants/PageTitle";
import User from "../Pages/User";
import Profile from "../Pages/Profile";
import UserForm from "../Pages/User/UserForm";
import Login from "../Pages/Auth/Login";
import ChangePassword from "../Pages/ChangePassword";
import Dashboard from "../Pages/Dashboard";
import Transaction from "../Pages/Transaction";
import CreateDeposit from "../Pages/Transaction/CreateDeposit";
import TransactionDetails from "../Components/Transaction/TransactionDetails";
import WalletBalance from "../Pages/WalletBalance";

export const pageRoutes = [
  { path: ROUTES.DASHBOARD, element: <Dashboard />, roles: ["admin", "user"], showInSidebar: true, sidebarKey: "dashboard", name: PAGE_TITLE.DASHBOARD },
  { path: ROUTES.PROFILE.BASE, element: <Profile />, roles: ["admin", "user"], showInSidebar: false, sidebarKey: "profile",  name: PAGE_TITLE.PROFILE.BASE },
  { path: ROUTES.SETTINGS.CHANGE_PASSWORD, element: <ChangePassword />, roles: ["admin", "user"], showInSidebar: false, sidebarKey: "settings", name: PAGE_TITLE.SETTING.CHANGE_PASSWORD },
  { path: ROUTES.USERS.ALL, element: <User/>, roles: ["admin"], showInSidebar: true, sidebarKey: "users", name: PAGE_TITLE.USERS.BASE },
  { path: ROUTES.USERS.ADD_EDIT, name: PAGE_TITLE.USERS.BASE, element: <UserForm />, roles: ["admin"], showInSidebar: false, sidebarKey: "users", },
  { path: ROUTES.TRANSACTIONS.BASE, element: <Transaction />, roles: ["admin", "user"], showInSidebar: true, sidebarKey: "transactions", name: PAGE_TITLE.TRANSACTIONS.BASE },
  { path: ROUTES.TRANSACTIONS.DEPOSIT, element: <CreateDeposit />, roles: ["admin", "user"], showInSidebar: false, sidebarKey: "create-deposit", name: PAGE_TITLE.TRANSACTIONS.PAYIN },
  { path: `${ROUTES.TRANSACTIONS.DETAILS}/:id`, element: <TransactionDetails />, roles: ["admin", "user"], showInSidebar: false, sidebarKey: "create-deposit", name: PAGE_TITLE.TRANSACTIONS.DETAILS },
  { path: ROUTES.WALLET.BALANCE, element: <WalletBalance />, roles: ["user", "admin"], showInSidebar: true, sidebarKey: "wallet", name: PAGE_TITLE.WALLET.BALANCE } 
]

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },
  { path: ROUTES.AUTH.LOGIN, element: <Login /> },
];