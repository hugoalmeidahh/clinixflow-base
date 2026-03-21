import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import type { Plan } from "@/hooks/usePlans";

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

const tierColors: Record<string, string> = {
  FREE: "bg-gray-100 text-gray-800",
  STARTER: "bg-blue-100 text-blue-800",
  PROFESSIONAL: "bg-purple-100 text-purple-800",
  ENTERPRISE: "bg-amber-100 text-amber-800",
};

export function PlanCard({ plan, onEdit }: PlanCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="shadow-elegant">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="font-heading text-lg">{plan.name}</CardTitle>
          <div className="flex gap-2">
            <Badge className={tierColors[plan.tier] || ""} variant="outline">
              {plan.tier}
            </Badge>
            <Badge variant={plan.is_active ? "default" : "secondary"}>
              {plan.is_active ? t("plans.active") : t("plans.inactive")}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(plan)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("plans.priceMonthly")}</span>
          <span className="font-semibold">
            {formatCurrency(plan.price_monthly)}{t("plans.perMonth")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("plans.priceYearly")}</span>
          <span className="font-semibold">
            {formatCurrency(plan.price_yearly)}{t("plans.perYear")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("plans.maxUsers")}</span>
          <span className="font-medium">{plan.max_users}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("plans.maxPatients")}</span>
          <span className="font-medium">
            {plan.max_patients ?? t("plans.unlimited")}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-1">{t("plans.modules")}</span>
          <div className="flex flex-wrap gap-1">
            {(plan.allowed_modules || []).map((mod) => (
              <Badge key={mod} variant="secondary" className="text-xs">
                {mod}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
