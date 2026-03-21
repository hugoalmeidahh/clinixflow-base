import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TenantStatusBadge } from "@/components/tenants/TenantStatusBadge";
import { DollarSign } from "lucide-react";
import type { SubscriptionItem } from "@/hooks/useSubscriptions";

interface SubscriptionsTableProps {
  subscriptions: SubscriptionItem[];
  loading: boolean;
  onRegisterPayment: (sub: SubscriptionItem) => void;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function SubscriptionsTable({
  subscriptions,
  loading,
  onRegisterPayment,
}: SubscriptionsTableProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">{t("common.noData")}</p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("financial.tenant")}</TableHead>
            <TableHead>{t("financial.plan")}</TableHead>
            <TableHead>{t("financial.amount")}</TableHead>
            <TableHead>{t("financial.status")}</TableHead>
            <TableHead>{t("financial.dueDate")}</TableHead>
            <TableHead className="text-right">{t("tenants.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell className="font-medium">{sub.name}</TableCell>
              <TableCell>{sub.plans?.name || "-"}</TableCell>
              <TableCell>
                {sub.plans ? formatCurrency(sub.plans.price_monthly) : "-"}
              </TableCell>
              <TableCell>
                <TenantStatusBadge status={sub.subscription_status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {sub.subscription_ends_at
                  ? new Date(sub.subscription_ends_at).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRegisterPayment(sub)}
                >
                  <DollarSign className="mr-1 h-4 w-4" />
                  {t("financial.registerPayment")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
