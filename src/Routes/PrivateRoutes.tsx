import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../Store";
import { ROUTES } from "../Constants";

const PrivateRoutes = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }
  return <Outlet />;
};

export default PrivateRoutes;