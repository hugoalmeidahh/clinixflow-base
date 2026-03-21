import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePlans, useUpdatePlan, type Plan } from "@/hooks/usePlans";
import { PlanCard } from "@/components/plans/PlanCard";
import { PlanEditDialog } from "@/components/plans/PlanEditDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Plans() {
  const { t } = useTranslation();
  const { data: plans, isLoading } = usePlans();
  const updatePlan = useUpdatePlan();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleSave = (data: Partial<Plan> & { id: string }) => {
    updatePlan.mutate(data, {
      onSuccess: () => setEditingPlan(null),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t("plans.title")}</h1>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(plans || []).map((plan) => (
            <PlanCard key={plan.id} plan={plan} onEdit={setEditingPlan} />
          ))}
        </div>
      )}

      <PlanEditDialog
        plan={editingPlan}
        open={!!editingPlan}
        onOpenChange={(open) => !open && setEditingPlan(null)}
        onSave={handleSave}
        saving={updatePlan.isPending}
      />
    </div>
  );
}
