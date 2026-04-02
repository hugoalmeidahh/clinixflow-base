import { useState } from "react";
import { usePatientAppointments, useConfirmAppointment } from "@/hooks/usePatientPortal";
import { usePortalSettings } from "@/hooks/usePortalSettings";
import FeatureDisabled from "@/components/portal/FeatureDisabled";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, User, Stethoscope, CheckCircle2, Loader2 } from "lucide-react";
import { format, isAfter, isBefore, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  SCHEDULED: { label: "Agendada", variant: "secondary" },
  CONFIRMED: { label: "Confirmada", variant: "default" },
  ATTENDED: { label: "Realizada", variant: "outline" },
  ABSENCE: { label: "Falta", variant: "destructive" },
  JUSTIFIED_ABSENCE: { label: "Falta Justificada", variant: "secondary" },
  CANCELLED: { label: "Cancelada", variant: "destructive" },
  RESCHEDULED: { label: "Reagendada", variant: "secondary" },
};

const AppointmentCard = ({ appt, allowConfirm }: { appt: any; allowConfirm: boolean }) => {
  const confirm = useConfirmAppointment();
  const now = new Date();
  const apptDate = new Date(appt.scheduled_at);
  const in48h = addHours(now, 48);
  const canConfirm = allowConfirm && appt.status === "SCHEDULED" && isAfter(apptDate, now) && isBefore(apptDate, in48h);

  const handleConfirm = async () => {
    try {
      await confirm.mutateAsync(appt.id);
      toast.success("Presença confirmada com sucesso!");
    } catch {
      toast.error("Erro ao confirmar presença. Tente novamente.");
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="font-semibold text-sm capitalize">
              {format(apptDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {format(apptDate, "HH:mm")} · {appt.duration_min || 50} min
            </p>
            {appt.professionals && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 shrink-0" />
                {(appt.professionals as any).full_name}
              </p>
            )}
            {appt.specialties && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                {(appt.specialties as any).name}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant={statusLabels[appt.status]?.variant || "secondary"} className="text-xs whitespace-nowrap">
              {statusLabels[appt.status]?.label || appt.status}
            </Badge>
            {canConfirm && (
              <Button
                size="sm"
                className="text-xs gap-1"
                onClick={handleConfirm}
                disabled={confirm.isPending}
              >
                {confirm.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3 w-3" />
                )}
                Confirmar presença
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PatientPortalAppointments = () => {
  const { settings, loading: settingsLoading } = usePortalSettings();
  const { data: appointments = [], isLoading } = usePatientAppointments();

  if (settingsLoading) return null;
  if (!settings.allow_track_appointments) return <FeatureDisabled />;
  const now = new Date();

  const upcoming = appointments
    .filter((a) => isAfter(new Date(a.scheduled_at), now) && !["CANCELLED"].includes(a.status))
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  const past = appointments
    .filter((a) => !isAfter(new Date(a.scheduled_at), now) || ["CANCELLED", "ABSENCE"].includes(a.status))
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Minhas Consultas</h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">
            Próximas {upcoming.length > 0 && `(${upcoming.length})`}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1">
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : upcoming.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Nenhuma consulta agendada.
              </CardContent>
            </Card>
          ) : (
            upcoming.map((appt) => <AppointmentCard key={appt.id} appt={appt} allowConfirm={settings.allow_confirm_appointments} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : past.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Nenhum histórico encontrado.
              </CardContent>
            </Card>
          ) : (
            past.map((appt) => <AppointmentCard key={appt.id} appt={appt} allowConfirm={false} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientPortalAppointments;
