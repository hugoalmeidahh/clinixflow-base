import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type Tenant = Tables<"tenants">;

export const useTenant = () => {
  const { tenantId } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTenant = async () => {
    if (!tenantId) {
      setTenant(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single();
    setTenant(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTenant();
  }, [tenantId]);

  return { tenant, loading, refetch: fetchTenant };
};
