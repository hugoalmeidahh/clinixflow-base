import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.access_token;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  slug: string;
  subscription_status: string | null;
  subscription_ends_at: string | null;
  plan_id: string | null;
  plans: { name: string; tier: string; price_monthly: number } | null;
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ["admin-financial"],
    queryFn: async (): Promise<SubscriptionItem[]> => {
      const token = await getAccessToken();
      const response = await supabase.functions.invoke("admin-financial", {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });

      if (response.error) throw new Error(response.error.message);
      return response.data as SubscriptionItem[];
    },
    staleTime: 30_000,
  });
}

export interface ManualPaymentData {
  tenantId: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

export function useRegisterPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ManualPaymentData) => {
      const token = await getAccessToken();
      const response = await supabase.functions.invoke("admin-financial", {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: data,
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-financial"] });
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      toast.success("Pagamento registrado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
