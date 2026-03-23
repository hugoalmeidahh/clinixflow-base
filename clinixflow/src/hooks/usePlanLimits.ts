import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LimitCheckResult {
  allowed: boolean;
  current: number;
  max: number;
  percentage: number;
}

export function usePlanLimits() {
  const { tenantId } = useAuth();

  const checkPatientLimit = useCallback(async (): Promise<LimitCheckResult> => {
    if (!tenantId) return { allowed: true, current: 0, max: 0, percentage: 0 };

    // Get current patient count + plan limit
    const [{ count: patientCount }, subRes] = await Promise.all([
      supabase.from("patients").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId).eq("is_active", true),
      supabase.from("subscriptions").select("plans(max_patients)").eq("tenant_id", tenantId).single(),
    ]);

    const max = (subRes.data?.plans as any)?.max_patients || 0;
    const current = patientCount || 0;
    if (max === 0) return { allowed: true, current, max, percentage: 0 }; // unlimited
    const percentage = Math.round((current / max) * 100);

    if (percentage >= 80 && percentage < 100) {
      toast.warning(`Você está usando ${percentage}% do limite de pacientes do seu plano.`);
    }

    if (current >= max) {
      toast.error(`Você atingiu o limite de ${max} pacientes. Faça upgrade para continuar.`);
      return { allowed: false, current, max, percentage: 100 };
    }

    return { allowed: true, current, max, percentage };
  }, [tenantId]);

  const checkTeamMemberLimit = useCallback(async (): Promise<LimitCheckResult> => {
    if (!tenantId) return { allowed: true, current: 0, max: 0, percentage: 0 };

    const [{ count: memberCount }, subRes] = await Promise.all([
      supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId).eq("is_active", true),
      supabase.from("subscriptions").select("plans(max_team_members)").eq("tenant_id", tenantId).single(),
    ]);

    const max = (subRes.data?.plans as any)?.max_team_members || 0;
    const current = memberCount || 0;
    if (max === 0) return { allowed: true, current, max, percentage: 0 }; // unlimited
    const percentage = Math.round((current / max) * 100);

    if (percentage >= 80 && percentage < 100) {
      toast.warning(`Você está usando ${percentage}% do limite de membros da equipe.`);
    }

    if (current >= max) {
      toast.error(`Você atingiu o limite de ${max} membros. Faça upgrade para continuar.`);
      return { allowed: false, current, max, percentage: 100 };
    }

    return { allowed: true, current, max, percentage };
  }, [tenantId]);

  return { checkPatientLimit, checkTeamMemberLimit };
}
