import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTenants, useTenantAction } from "@/hooks/useTenants";
import { TenantsTable } from "@/components/tenants/TenantsTable";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusFilters = ["all", "active", "suspended", "trial"] as const;

export default function Tenants() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: tenants, isLoading } = useTenants(search, statusFilter);
  const tenantAction = useTenantAction();

  const handleAction = (tenantId: string, action: "suspend" | "reactivate") => {
    const confirmMsg =
      action === "suspend"
        ? t("tenants.suspendConfirm")
        : t("tenants.reactivateConfirm");

    if (!window.confirm(confirmMsg)) return;

    tenantAction.mutate(
      { tenantId, action },
      {
        onSuccess: () => {
          toast.success(t("common.success"));
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t("tenants.title")}</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder={t("tenants.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-1">
          {statusFilters.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={cn(statusFilter === s && "shadow-sm")}
            >
              {t(`tenants.filter${s.charAt(0).toUpperCase() + s.slice(1)}`)}
            </Button>
          ))}
        </div>
      </div>

      <TenantsTable
        tenants={tenants || []}
        loading={isLoading}
        onAction={handleAction}
        actionLoading={tenantAction.isPending}
      />
    </div>
  );
}
