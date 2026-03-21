import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface TenantStatusBadgeProps {
  status: string | null;
}

export function TenantStatusBadge({ status }: TenantStatusBadgeProps) {
  const { t } = useTranslation();

  const config: Record<string, { label: string; className: string }> = {
    active: {
      label: t("tenants.active"),
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    suspended: {
      label: t("tenants.suspended"),
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    trial: {
      label: t("tenants.trial"),
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    expired: {
      label: t("tenants.expired"),
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    },
  };

  const c = config[status || ""] || config.expired;

  return (
    <Badge variant="outline" className={cn("font-medium", c.className)}>
      {c.label}
    </Badge>
  );
}
