import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Store";
import { ROUTES } from "../Constants";

const RootRedirect = () => {
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return (
    <Navigate
      to={role === "admin" ? ROUTES.DASHBOARDADMIN : ROUTES.USER.HOME}
      replace
    />
  );
};

export default RootRedirect;