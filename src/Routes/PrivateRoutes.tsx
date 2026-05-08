import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../Store";
import { ROUTES } from "../Constants";

const PrivateRoutes = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH.LOGIN} replace />;
};

export default PrivateRoutes; 
