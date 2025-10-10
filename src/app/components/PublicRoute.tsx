import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // TODO: Add proper loading component
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default PublicRoute;