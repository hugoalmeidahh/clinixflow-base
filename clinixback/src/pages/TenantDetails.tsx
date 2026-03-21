import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTenantDetails, useTenantAction } from "@/hooks/useTenants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TenantStatusBadge } from "@/components/tenants/TenantStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Users, UserCheck, Calendar, Pause, Play } from "lucide-react";
import { toast } from "sonner";

export default function TenantDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useTenantDetails(id!);
  const tenantAction = useTenantAction();

  const handleAction = (action: "suspend" | "reactivate") => {
    const confirmMsg =
      action === "suspend"
        ? t("tenants.suspendConfirm")
        : t("tenants.reactivateConfirm");

    if (!window.confirm(confirmMsg)) return;

    tenantAction.mutate(
      { tenantId: id!, action },
      { onSuccess: () => toast.success(t("common.success")) }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted-foreground">{t("common.noData")}</p>;
  }

  const { tenant, stats } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tenants")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold">{tenant.name}</h1>
          <p className="text-sm text-muted-foreground">{tenant.slug}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <TenantStatusBadge status={tenant.subscription_status} />
          {tenant.subscription_status === "active" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleAction("suspend")}
              disabled={tenantAction.isPending}
            >
              <Pause className="mr-1 h-4 w-4" />
              {t("tenants.suspend")}
            </Button>
          )}
          {tenant.subscription_status === "suspended" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAction("reactivate")}
              disabled={tenantAction.isPending}
            >
              <Play className="mr-1 h-4 w-4" />
              {t("tenants.reactivate")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* General Info */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              {t("tenants.generalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label={t("tenants.cnpj")} value={tenant.cnpj || "-"} />
            <Row label={t("auth.email")} value={tenant.email || "-"} />
            <Row label={t("tenants.phone")} value={tenant.phone || "-"} />
            <Row
              label={t("tenants.createdAt")}
              value={new Date(tenant.created_at).toLocaleDateString()}
            />
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              {t("tenants.subscription")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row
              label={t("tenants.plan")}
              value={
                tenant.plans
                  ? `${tenant.plans.name} (${tenant.plans.tier})`
                  : "-"
              }
            />
            {tenant.plans && (
              <Row
                label={t("plans.priceMonthly")}
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format((tenant.plans.price_monthly || 0) / 100)}
              />
            )}
            <Row
              label={t("tenants.expiresAt")}
              value={
                tenant.subscription_ends_at
                  ? new Date(tenant.subscription_ends_at).toLocaleDateString()
                  : "-"
              }
            />
          </CardContent>
        </Card>

        {/* Active Modules */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              {t("tenants.modules")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(tenant.active_modules || []).map((mod) => (
                <Badge key={mod} variant="secondary">
                  {mod}
                </Badge>
              ))}
              {(!tenant.active_modules || tenant.active_modules.length === 0) && (
                <p className="text-muted-foreground text-sm">{t("common.noData")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              {t("tenants.stats")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <StatItem
                icon={Users}
                label={t("tenants.users")}
                value={stats.users}
              />
              <StatItem
                icon={UserCheck}
                label={t("tenants.patients")}
                value={stats.patients}
              />
              <StatItem
                icon={Calendar}
                label={t("tenants.appointments")}
                value={stats.appointments}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="text-2xl font-bold font-heading">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
