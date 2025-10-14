import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "../shared/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import LoadingSpinner from "../shared/components/LoadingSpinner";

// Lazy loading components for performance
const SignInPage = lazy(() => import("../features/auth/pages/SignInPage"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));

// Inventory Feature Pages
const StoreDefinition = lazy(
  () => import("../features/inventory/pages/StoreDefinition")
);

// Helper function to reduce code repetition
const createLazyRoute = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <PublicRoute>{createLazyRoute(SignInPage)}</PublicRoute>,
  },
  {
    // AppLayout wrapper - tüm authenticated sayfalar bu layout'u kullanır
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard route
      {
        path: "dashboard",
        element: createLazyRoute(Dashboard),
      },

      // Inventory feature routes (/inventory/*)
      {
        path: "inventory",
        children: [
          {
            path: "store-definition",
            element: createLazyRoute(StoreDefinition),
          },
          // Diğer inventory sayfaları buraya eklenecek
        ],
      },

      // Sales feature routes (/sales/*)
      {
        path: "sales",
        children: [
          // Gelecekte eklenecek
        ],
      },

      // Reports feature routes (/reports/*)
      {
        path: "reports",
        children: [
          // Gelecekte eklenecek
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
