import { Navigate } from "react-router-dom";
import { getStoredUser, isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children, role }) => {
  if (!isAuthenticated()) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  }

  const user = getStoredUser();
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
