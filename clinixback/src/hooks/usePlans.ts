import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.access_token;
}

export interface Plan {
  id: string;
  name: string;
  tier: string;
  price_monthly: number;
  price_yearly: number;
  max_users: number;
  max_patients: number | null;
  allowed_modules: string[];
  features: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePlans() {
  return useQuery({
    queryKey: ["admin-plans"],
    queryFn: async (): Promise<Plan[]> => {
      const token = await getAccessToken();
      const response = await supabase.functions.invoke("admin-plans", {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });

      if (response.error) throw new Error(response.error.message);
      return response.data as Plan[];
    },
    staleTime: 60_000,
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: Partial<Plan> & { id: string }) => {
      const token = await getAccessToken();
      const response = await supabase.functions.invoke("admin-plans", {
        headers: { Authorization: `Bearer ${token}` },
        method: "PUT",
        body: plan,
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      toast.success("Plano atualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
