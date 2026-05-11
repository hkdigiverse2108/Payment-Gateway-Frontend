import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Store";
import type { PrivateRoutesProps } from "../Types";

const RoleProtectedRoute = ({ allowedRoles, children, }: PrivateRoutesProps) => {
  const { user } = useAppSelector((s) => s.auth);
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    return <Navigate to="/403" replace />;
  }
  return children;
};

export default RoleProtectedRoute;