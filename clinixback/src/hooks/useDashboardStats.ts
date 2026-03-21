import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  activeTenants: number;
  newThisMonth: number;
  mrr: number;
  totalTenants: number;
  tenantsOverTime: { month: string; count: number }[];
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const response = await supabase.functions.invoke("admin-stats", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (response.error) throw new Error(response.error.message);
  return response.data as DashboardStats;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 60_000, // 1 minute
  });
}
