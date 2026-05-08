import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../Constants";
import { useAppSelector } from "../Store";

const PublicRoutes = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) return <Outlet />;

  return (
    <Navigate
      to={ROUTES.DASHBOARD}
      replace
    />
  );
};

export default PublicRoutes;