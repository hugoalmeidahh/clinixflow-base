import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const useAppointments = (dateRange?: { start: string; end: string }) => {
  const { tenantId } = useAuth();

  return useQuery({
    queryKey: ["appointments", tenantId, dateRange],
    queryFn: async () => {
      if (!tenantId) return [];
      let query = supabase
        .from("appointments")
        .select("*, patients!inner(full_name, record_number), professionals!inner(full_name), specialties!inner(name)")
        .eq("tenant_id", tenantId)
        .order("scheduled_at", { ascending: true });

      if (dateRange) {
        query = query.gte("scheduled_at", dateRange.start).lte("scheduled_at", dateRange.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!tenantId,
    staleTime: 30 * 1000,
  });
};

export const useAppointmentsRealtime = () => {
  const { tenantId } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tenantId) return;

    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments", filter: `tenant_id=eq.${tenantId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["appointments"] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tenantId, queryClient]);
};
