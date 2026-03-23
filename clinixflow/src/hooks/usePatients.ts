import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const usePatients = () => {
  const { tenantId } = useAuth();

  return useQuery({
    queryKey: ["patients", tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("full_name");
      if (error) throw error;
      return data || [];
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePatient = (id: string | undefined) => {
  const { tenantId } = useAuth();

  return useQuery({
    queryKey: ["patient", id, tenantId],
    queryFn: async () => {
      if (!id || !tenantId) return null;
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .eq("tenant_id", tenantId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!tenantId,
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  const { tenantId } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Record<string, any>) => {
      const { error } = await supabase
        .from("patients")
        .update(updates)
        .eq("id", id)
        .eq("tenant_id", tenantId!);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", vars.id] });
    },
  });
};
