import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { loading, profile } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-gray-500">Loading...</div>;
  // if (!profile) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
