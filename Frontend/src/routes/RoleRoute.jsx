import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRoute = ({ role }) => {
  const { profile } = useAuth();
  if (profile?.role !== role) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default RoleRoute;
