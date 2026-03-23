import { Navigate } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";
import type { Database } from "@/integrations/supabase/types";

type ModuleType = Database["public"]["Enums"]["module_type"];

interface ModuleGuardProps {
  module: ModuleType;
  children: React.ReactNode;
}

const ModuleGuard = ({ module, children }: ModuleGuardProps) => {
  const { tenant, loading } = useTenant();

  if (loading) return null;

  const activeModules: ModuleType[] = (tenant?.active_modules as ModuleType[]) || ["BASE"];

  if (!activeModules.includes(module)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ModuleGuard;
