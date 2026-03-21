import { useTranslation } from "react-i18next";
import { Building2, UserPlus, DollarSign } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TenantsChart } from "@/components/dashboard/TenantsChart";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t("dashboard.title")}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title={t("dashboard.activeTenants")}
          value={stats?.activeTenants ?? 0}
          icon={Building2}
          loading={isLoading}
        />
        <KpiCard
          title={t("dashboard.newThisMonth")}
          value={stats?.newThisMonth ?? 0}
          icon={UserPlus}
          loading={isLoading}
        />
        <KpiCard
          title={t("dashboard.globalMrr")}
          value={formatCurrency(stats?.mrr ?? 0)}
          icon={DollarSign}
          loading={isLoading}
        />
      </div>

      <TenantsChart
        data={stats?.tenantsOverTime ?? []}
        loading={isLoading}
      />
    </div>
  );
}
