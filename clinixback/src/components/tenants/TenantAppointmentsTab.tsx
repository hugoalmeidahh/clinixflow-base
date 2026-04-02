import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { useTenantAppointments } from "@/hooks/useTenantSupport";
import type { TenantAppointment } from "@/types/tenantSupport";

const APPOINTMENT_STATUSES = [
  "ALL",
  "SCHEDULED",
  "CONFIRMED",
  "ATTENDED",
  "ABSENCE",
  "JUSTIFIED_ABSENCE",
  "CANCELLED",
  "RESCHEDULED",
] as const;

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-blue-500 text-white hover:bg-blue-600",
  CONFIRMED: "bg-indigo-500 text-white hover:bg-indigo-600",
  ATTENDED: "bg-green-500 text-white hover:bg-green-600",
  ABSENCE: "bg-red-500 text-white hover:bg-red-600",
  JUSTIFIED_ABSENCE: "bg-orange-500 text-white hover:bg-orange-600",
  CANCELLED: "bg-gray-500 text-white hover:bg-gray-600",
  RESCHEDULED: "bg-yellow-500 text-white hover:bg-yellow-600",
};

const fmtDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtCurrency = (fee: number | null) => {
  if (fee === null) return "-";
  return Number(fee).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

interface TenantAppointmentsTabProps {
  tenantId: string;
}

export function TenantAppointmentsTab({ tenantId }: TenantAppointmentsTabProps) {
  const { t } = useTranslation();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [status, setStatus] = useState<string>("ALL");

  const { data: appointments = [], isLoading } = useTenantAppointments(
    tenantId,
    month,
    year,
    status === "ALL" ? undefined : status
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = now.getFullYear();
  const years = [currentYear, currentYear - 1];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={String(month)}
          onValueChange={(v) => setMonth(Number(v))}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t("tenantSupport.appointments.month")} />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={String(m)}>
                {new Date(2000, m - 1).toLocaleString("pt-BR", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(year)}
          onValueChange={(v) => setYear(Number(v))}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder={t("tenantSupport.appointments.year")} />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("tenantSupport.appointments.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            {APPOINTMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "ALL"
                  ? t("tenantSupport.appointments.allStatuses")
                  : t(`tenantSupport.appointments.statuses.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Header with count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>
          {t("tenantSupport.appointments.totalAppointments", {
            count: appointments.length,
          })}
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t("tenantSupport.appointments.noAppointments")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("tenantSupport.appointments.code")}</TableHead>
                  <TableHead>{t("tenantSupport.appointments.dateTime")}</TableHead>
                  <TableHead>{t("tenantSupport.appointments.patient")}</TableHead>
                  <TableHead>{t("tenantSupport.appointments.professional")}</TableHead>
                  <TableHead>{t("tenantSupport.appointments.specialty")}</TableHead>
                  <TableHead>{t("tenantSupport.appointments.duration")}</TableHead>
                  <TableHead>{t("tenantSupport.appointments.status")}</TableHead>
                  <TableHead>{t("tenantSupport.appointments.type")}</TableHead>
                  <TableHead>{t("tenantSupport.appointments.fee")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt: TenantAppointment) => (
                  <TableRow key={appt.id}>
                    <TableCell className="font-mono text-xs">
                      {appt.code}
                    </TableCell>
                    <TableCell className="text-sm">
                      {fmtDateTime(appt.scheduled_at)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {appt.patient_name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {appt.professional_name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {appt.specialty_name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {appt.duration_min}min
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          STATUS_COLORS[appt.status] ?? "bg-gray-100 text-gray-700"
                        }
                      >
                        {t(`tenantSupport.appointments.statuses.${appt.status}`, appt.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {t(`tenantSupport.appointments.types.${appt.appointment_type}`, appt.appointment_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {fmtCurrency(appt.fee)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
