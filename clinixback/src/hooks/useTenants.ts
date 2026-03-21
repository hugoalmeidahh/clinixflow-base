import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.access_token;
}

export interface TenantListItem {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  cnpj: string | null;
  logo_url: string | null;
  subscription_status: string | null;
  subscription_ends_at: string | null;
  active_modules: string[] | null;
  created_at: string;
  plans: { name: string; tier: string } | null;
}

export function useTenants(search: string, statusFilter: string) {
  return useQuery({
    queryKey: ["admin-tenants", search, statusFilter],
    queryFn: async (): Promise<TenantListItem[]> => {
      const token = await getAccessToken();
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);

      const response = await supabase.functions.invoke("admin-tenants?" + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });

      if (response.error) throw new Error(response.error.message);
      return response.data as TenantListItem[];
    },
    staleTime: 30_000,
  });
}

export interface TenantDetails {
  tenant: TenantListItem & {
    website: string | null;
    address: any;
    business_hours: any;
    settings: any;
    plans: {
      name: string;
      tier: string;
      price_monthly: number;
      price_yearly: number;
      allowed_modules: string[];
      max_users: number;
      max_patients: number | null;
    } | null;
  };
  stats: {
    users: number;
    patients: number;
    appointments: number;
  };
}

export function useTenantDetails(id: string) {
  return useQuery({
    queryKey: ["admin-tenant-details", id],
    queryFn: async (): Promise<TenantDetails> => {
      const token = await getAccessToken();
      const response = await supabase.functions.invoke(
        `admin-tenants?action=details&id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );

      if (response.error) throw new Error(response.error.message);
      return response.data as TenantDetails;
    },
    enabled: !!id,
  });
}

export function useTenantAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenantId, action }: { tenantId: string; action: "suspend" | "reactivate" }) => {
      const token = await getAccessToken();
      const response = await supabase.functions.invoke("admin-tenants", {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: { tenantId, action },
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-tenant-details"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
