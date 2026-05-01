import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../Store";
import { ROUTES } from "../Constants";

const PrivateRoutes = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH.LOGIN} replace />;
// if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />;

// return <Outlet />;
};

export default PrivateRoutes; 
