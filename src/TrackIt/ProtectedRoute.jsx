import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

function ProtectedRoute({ children, allowedRoles = null }) {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role permissions if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render children if authenticated and authorized
  return children;
}

export default ProtectedRoute;
