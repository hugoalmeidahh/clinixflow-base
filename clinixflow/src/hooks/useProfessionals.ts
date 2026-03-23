import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useProfessionals = () => {
  const { tenantId } = useAuth();

  return useQuery({
    queryKey: ["professionals", tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      const { data, error } = await supabase
        .from("professionals")
        .select("*, specialties:professional_specialties(specialty_id, specialties(name))")
        .eq("tenant_id", tenantId)
        .order("full_name");
      if (error) throw error;
      return data || [];
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  });
};
