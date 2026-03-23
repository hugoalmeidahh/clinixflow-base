import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface TransactionFilters {
  start: string;
  end: string;
  type?: "ALL" | "INCOME" | "EXPENSE";
  status?: "ALL" | "PROJECTED" | "REALIZED" | "RECEIVED";
}

export const useTransactions = (filters: TransactionFilters) => {
  const { tenantId } = useAuth();

  return useQuery({
    queryKey: ["transactions", tenantId, filters],
    queryFn: async () => {
      if (!tenantId) return [];
      let query = supabase
        .from("transactions")
        .select("*, patients(full_name), professionals(full_name), conventions(name)")
        .eq("tenant_id", tenantId)
        .gte("reference_date", filters.start)
        .lte("reference_date", filters.end)
        .order("reference_date", { ascending: false });

      if (filters.type && filters.type !== "ALL") {
        query = query.eq("type", filters.type);
      }
      if (filters.status && filters.status !== "ALL") {
        query = query.eq("financial_status", filters.status as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!tenantId,
    staleTime: 30 * 1000,
  });
};

export const useTransactionsRealtime = () => {
  const { tenantId } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tenantId) return;

    const channel = supabase
      .channel("transactions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions", filter: `tenant_id=eq.${tenantId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tenantId, queryClient]);
};
