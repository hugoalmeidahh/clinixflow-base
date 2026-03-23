import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/hooks/useTenant";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();
  const location = useLocation();

  if (loading || tenantLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Force password change on first login
  const mustChangePassword = user.user_metadata?.must_change_password === true;
  if (mustChangePassword && location.pathname !== "/force-password-change") {
    return <Navigate to="/force-password-change" replace />;
  }

  // Redirect to onboarding if tenant hasn't completed setup (only for ORG_ADMIN)
  if (tenant && !tenant.onboarding_completed && userRole?.role === "ORG_ADMIN" && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Check trial/subscription expiration
  const allowedWhenExpired = ["/subscription-expired", "/plans"];
  if (
    tenant &&
    tenant.onboarding_completed &&
    !allowedWhenExpired.includes(location.pathname)
  ) {
    const status = tenant.subscription_status;
    const isExpiredTrial =
      status === "TRIAL" &&
      tenant.subscription_ends_at &&
      new Date(tenant.subscription_ends_at) < new Date();
    const isBlocked = ["SUSPENDED", "CANCELLED"].includes(status || "");

    if (isExpiredTrial || isBlocked) {
      return <Navigate to="/subscription-expired" replace />;
    }
  }

  // Redirect PATIENT role away from clinic routes to the patient portal
  const isPatient = userRole?.role === "PATIENT";
  const isPortalRoute = location.pathname.startsWith("/portal");
  if (isPatient && !isPortalRoute && !["force-password-change", "subscription-expired", "plans"].some(p => location.pathname.includes(p))) {
    return <Navigate to="/portal" replace />;
  }

  if (roles && userRole && !roles.includes(userRole.role)) {
    return <Navigate to={isPatient ? "/portal" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
