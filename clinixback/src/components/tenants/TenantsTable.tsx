import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TenantStatusBadge } from "./TenantStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Pause, Play } from "lucide-react";
import type { TenantListItem } from "@/hooks/useTenants";

interface TenantsTableProps {
  tenants: TenantListItem[];
  loading: boolean;
  onAction: (tenantId: string, action: "suspend" | "reactivate") => void;
  actionLoading: boolean;
}

export function TenantsTable({ tenants, loading, onAction, actionLoading }: TenantsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">{t("common.noData")}</p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("tenants.name")}</TableHead>
            <TableHead>{t("tenants.slug")}</TableHead>
            <TableHead>{t("tenants.plan")}</TableHead>
            <TableHead>{t("tenants.status")}</TableHead>
            <TableHead>{t("tenants.createdAt")}</TableHead>
            <TableHead className="text-right">{t("tenants.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell className="text-muted-foreground">{tenant.slug}</TableCell>
              <TableCell>{tenant.plans?.name || "-"}</TableCell>
              <TableCell>
                <TenantStatusBadge status={tenant.subscription_status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(tenant.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/tenants/${tenant.id}`)}
                    title={t("tenants.viewDetails")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {tenant.subscription_status === "active" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onAction(tenant.id, "suspend")}
                      disabled={actionLoading}
                      title={t("tenants.suspend")}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : tenant.subscription_status === "suspended" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600"
                      onClick={() => onAction(tenant.id, "reactivate")}
                      disabled={actionLoading}
                      title={t("tenants.reactivate")}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
