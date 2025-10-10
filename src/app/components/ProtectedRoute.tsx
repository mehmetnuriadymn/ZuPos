import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // TODO: Add proper loading component
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
