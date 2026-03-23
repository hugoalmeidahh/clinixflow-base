import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  defaultPermissions,
  mergePermissions,
  type Resource,
  type Action,
  type RolePermissions,
} from "@/lib/permissions";

export function usePermissions() {
  const { tenantId, userRole } = useAuth();
  const [overrides, setOverrides] = useState<Record<string, RolePermissions>>({});
  const [loading, setLoading] = useState(true);

  const fetchOverrides = useCallback(async () => {
    if (!tenantId) return;
    const { data } = await supabase
      .from("role_permissions")
      .select("role, permissions")
      .eq("tenant_id", tenantId);

    const map: Record<string, RolePermissions> = {};
    (data || []).forEach((row: any) => {
      map[row.role] = row.permissions as RolePermissions;
    });
    setOverrides(map);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    fetchOverrides();
  }, [fetchOverrides]);

  const getPermissionsForRole = useCallback(
    (role: string): RolePermissions => {
      const defaults = defaultPermissions[role] || {};
      const roleOverrides = overrides[role] || {};
      return mergePermissions(defaults, roleOverrides);
    },
    [overrides]
  );

  const can = useCallback(
    (resource: Resource, action: Action): boolean => {
      if (!userRole) return false;
      const role = userRole.role;
      // ORG_ADMIN always has full access (safety net)
      if (role === "ORG_ADMIN") return true;
      const perms = getPermissionsForRole(role);
      return perms[resource]?.[action] ?? false;
    },
    [userRole, getPermissionsForRole]
  );

  const canView = useCallback(
    (resource: Resource) => can(resource, "view"),
    [can]
  );

  return {
    can,
    canView,
    getPermissionsForRole,
    overrides,
    loading,
    refetch: fetchOverrides,
  };
}
