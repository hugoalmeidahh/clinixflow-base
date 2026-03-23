import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type StatusVariant =
  | "scheduled" | "confirmed" | "attended" | "absent" | "justified"
  | "cancelled" | "rescheduled" | "draft" | "active" | "inactive"
  | "warning" | "info" | "danger";

const variantClasses: Record<StatusVariant, string> = {
  scheduled: "bg-badge-scheduled/10 text-badge-scheduled border-badge-scheduled/20",
  confirmed: "bg-badge-confirmed/10 text-badge-confirmed border-badge-confirmed/20",
  attended: "bg-badge-attended/10 text-badge-attended border-badge-attended/20",
  absent: "bg-badge-absent/10 text-badge-absent border-badge-absent/20",
  justified: "bg-badge-justified/10 text-badge-justified border-badge-justified/20",
  cancelled: "bg-badge-cancelled/10 text-badge-cancelled border-badge-cancelled/20",
  rescheduled: "bg-badge-rescheduled/10 text-badge-rescheduled border-badge-rescheduled/20",
  draft: "bg-muted text-muted-foreground border-border",
  active: "bg-badge-attended/10 text-badge-attended border-badge-attended/20",
  inactive: "bg-muted text-muted-foreground border-border",
  warning: "bg-badge-justified/10 text-badge-justified border-badge-justified/20",
  danger: "bg-badge-absent/10 text-badge-absent border-badge-absent/20",
  info: "bg-badge-scheduled/10 text-badge-scheduled border-badge-scheduled/20",
};

const statusVariantMap: Record<string, StatusVariant> = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  ATTENDED: "attended",
  ABSENCE: "absent",
  JUSTIFIED_ABSENCE: "justified",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
};

interface StatusBadgeProps {
  status?: string;
  variant?: StatusVariant;
  label?: string;
  className?: string;
}

const StatusBadge = ({ status, variant, label, className }: StatusBadgeProps) => {
  const { t } = useTranslation();

  const finalVariant = variant || (status ? statusVariantMap[status] : undefined) || "info";
  const finalLabel = label || (status ? t(`appointments.status.${status}`, status) : "");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[finalVariant],
        className
      )}
    >
      {finalLabel}
    </span>
  );
};

export default StatusBadge;
