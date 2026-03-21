import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import type { Plan } from "@/hooks/usePlans";

const ALL_MODULES = ["BASE", "EVALUATIONS", "FINANCIAL", "REPORTS", "VACCINES"];

interface PlanEditDialogProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Plan> & { id: string }) => void;
  saving: boolean;
}

interface FormValues {
  name: string;
  price_monthly: number;
  price_yearly: number;
  max_users: number;
  max_patients: string;
  is_active: boolean;
  allowed_modules: string[];
}

export function PlanEditDialog({ plan, open, onOpenChange, onSave, saving }: PlanEditDialogProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>();

  const watchModules = watch("allowed_modules", []);
  const watchActive = watch("is_active", true);

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
        max_users: plan.max_users,
        max_patients: plan.max_patients?.toString() || "",
        is_active: plan.is_active,
        allowed_modules: plan.allowed_modules || [],
      });
    }
  }, [plan, reset]);

  const onSubmit = (data: FormValues) => {
    if (!plan) return;
    onSave({
      id: plan.id,
      name: data.name,
      price_monthly: Number(data.price_monthly),
      price_yearly: Number(data.price_yearly),
      max_users: Number(data.max_users),
      max_patients: data.max_patients ? Number(data.max_patients) : null,
      is_active: data.is_active,
      allowed_modules: data.allowed_modules,
    });
  };

  const toggleModule = (mod: string) => {
    const current = watchModules || [];
    const updated = current.includes(mod)
      ? current.filter((m) => m !== mod)
      : [...current, mod];
    setValue("allowed_modules", updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{t("plans.edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("plans.name")}</Label>
            <Input {...register("name")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("plans.priceMonthly")} (centavos)</Label>
              <Input type="number" {...register("price_monthly")} />
            </div>
            <div className="space-y-2">
              <Label>{t("plans.priceYearly")} (centavos)</Label>
              <Input type="number" {...register("price_yearly")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("plans.maxUsers")}</Label>
              <Input type="number" {...register("max_users")} />
            </div>
            <div className="space-y-2">
              <Label>{t("plans.maxPatients")}</Label>
              <Input
                type="number"
                placeholder={t("plans.unlimited")}
                {...register("max_patients")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("plans.modules")}</Label>
            <div className="flex flex-wrap gap-3">
              {ALL_MODULES.map((mod) => (
                <label key={mod} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={(watchModules || []).includes(mod)}
                    onCheckedChange={() => toggleModule(mod)}
                  />
                  {mod}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={watchActive}
              onCheckedChange={(val) => setValue("is_active", val)}
            />
            <Label>{watchActive ? t("plans.active") : t("plans.inactive")}</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
