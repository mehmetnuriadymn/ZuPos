import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = protected route, false = public route
  redirectTo?: string; // custom redirect path
}

/**
 * Unified Route Guard Component
 *
 * @param requireAuth - true için authenticated olması gerekir, false için authenticated olmaması gerekir
 * @param redirectTo - Custom redirect path (optional)
 */
export function RouteGuard({
  children,
  requireAuth = true,
  redirectTo,
}: RouteGuardProps) {
  const { isAuthenticated, loading } = useAuth();

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Protected route logic
  if (requireAuth) {
    return isAuthenticated ? (
      <>{children}</>
    ) : (
      <Navigate to={redirectTo || "/login"} replace />
    );
  }

  // Public route logic
  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo || "/dashboard"} replace />
  );
}

// Convenience wrappers for backward compatibility and clarity
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <RouteGuard requireAuth={true}>{children}</RouteGuard>
);

export const PublicRoute = ({ children }: { children: React.ReactNode }) => (
  <RouteGuard requireAuth={false}>{children}</RouteGuard>
);

export default RouteGuard;
