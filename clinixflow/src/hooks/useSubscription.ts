import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Plan {
  id: string;
  name: string;
  tier: string;
  price_monthly: number;
  price_yearly: number;
  max_users: number;
  max_patients: number | null;
  allowed_modules: string[];
  features: any;
}

interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  gateway: string | null;
  gateway_subscription_id: string | null;
  gateway_customer_id: string | null;
  price_centavos: number;
  failed_payment_count: number;
  plans: Plan;
}

interface SubscriptionInvoice {
  id: string;
  amount_centavos: number;
  status: string;
  billing_cycle: string;
  period_start: string;
  period_end: string;
  payment_method: string | null;
  payment_gateway: string | null;
  paid_at: string | null;
  due_date: string | null;
  created_at: string;
}

interface SubscriptionData {
  subscription: Subscription | null;
  tenant: { name: string; email: string | null; active_modules: string[]; gateway_customer_id: string | null } | null;
  usage: { currentUsers: number; currentPatients: number };
}

export function useSubscription() {
  const { tenantId } = useAuth();

  return useQuery<SubscriptionData>({
    queryKey: ["subscription", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("billing-checkout", {
        method: "GET",
      });
      if (error) throw error;
      return data as SubscriptionData;
    },
    enabled: !!tenantId,
    staleTime: 60_000,
  });
}

export function useInvoices() {
  const { tenantId } = useAuth();

  return useQuery<SubscriptionInvoice[]>({
    queryKey: ["subscription-invoices", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("billing-manage", {
        method: "GET",
        headers: { "x-action": "invoices" },
        body: null,
      });
      if (error) throw error;
      return data as SubscriptionInvoice[];
    },
    enabled: !!tenantId,
    staleTime: 60_000,
  });
}

export function useAvailablePlans() {
  return useQuery<Plan[]>({
    queryKey: ["available-plans"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("billing-manage", {
        method: "GET",
        headers: { "x-action": "plans" },
        body: null,
      });
      if (error) throw error;
      return data as Plan[];
    },
    staleTime: 5 * 60_000,
  });
}
