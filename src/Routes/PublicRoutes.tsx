import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../Constants";
import { useAppSelector } from "../Store";

const PublicRoutes = () => {
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) return <Outlet />;

  return (
    <Navigate
      to={role === "admin" ? ROUTES.DASHBOARDADMIN : ROUTES.USER.HOME}
      replace
    />
  );
};

export default PublicRoutes;