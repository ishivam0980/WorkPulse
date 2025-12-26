import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute, protectedRoutePaths } from "./common/routePaths";
import useAuth from "@/hooks/api/use-auth";
import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";

const ProtectedRoute = () => {
  const location = useLocation();
  const { data, isLoading } = useAuth();
  const user = data?.user;

  const _isAuthRoute = isAuthRoute(location.pathname);
  const returnUrl = encodeURIComponent(location.pathname);

  if (isLoading) return <DashboardSkeleton />;

  if (!user) {
    return (
      <Navigate
        to={`/?returnUrl=${returnUrl}`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (_isAuthRoute && user) {
    return (
      <Navigate to={protectedRoutePaths.dashboard} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
