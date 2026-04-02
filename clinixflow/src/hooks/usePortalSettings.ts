import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { defaultPortalSettings, type PatientPortalSettings } from "@/types/portalSettings";

export const usePortalSettings = () => {
  const { tenantId } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings = defaultPortalSettings, isLoading } = useQuery({
    queryKey: ["portal-settings", tenantId],
    queryFn: async (): Promise<PatientPortalSettings> => {
      if (!tenantId) return defaultPortalSettings;
      const { data, error } = await supabase
        .from("tenants")
        .select("settings")
        .eq("id", tenantId)
        .single();
      if (error) throw error;
      const raw = (data?.settings as Record<string, any>)?.patient_portal ?? {};
      return { ...defaultPortalSettings, ...raw };
    },
    enabled: !!tenantId,
    staleTime: 60 * 1000,
  });

  const updateSettings = async (partial: Partial<PatientPortalSettings>) => {
    if (!tenantId) throw new Error("No tenant");

    // Read current full settings JSONB
    const { data: current } = await supabase
      .from("tenants")
      .select("settings")
      .eq("id", tenantId)
      .single();

    const currentSettings = (current?.settings as Record<string, any>) ?? {};
    const currentPortal = currentSettings.patient_portal ?? {};

    const merged = {
      ...currentSettings,
      patient_portal: { ...defaultPortalSettings, ...currentPortal, ...partial },
    };

    const { error } = await supabase
      .from("tenants")
      .update({ settings: merged as any })
      .eq("id", tenantId);

    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["portal-settings", tenantId] });
  };

  return { settings, loading: isLoading, updateSettings };
};
