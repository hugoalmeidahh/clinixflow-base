import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePatientAppointments } from "@/hooks/usePatientPortal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, PlusCircle, Clock, User } from "lucide-react";
import { format, isAfter, isBefore, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  SCHEDULED: { label: "Agendada", variant: "secondary" },
  CONFIRMED: { label: "Confirmada", variant: "default" },
  ATTENDED: { label: "Realizada", variant: "outline" },
  ABSENCE: { label: "Falta", variant: "destructive" },
  CANCELLED: { label: "Cancelada", variant: "destructive" },
};

const PatientPortalDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: appointments = [], isLoading } = usePatientAppointments();

  const now = new Date();
  const upcoming = appointments
    .filter((a) => isAfter(new Date(a.scheduled_at), now) && !["CANCELLED", "ABSENCE"].includes(a.status))
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  const nextAppointment = upcoming[0];
  const firstName = profile?.full_name?.split(" ")[0] || "Paciente";

  const canConfirm = (scheduledAt: string, status: string) => {
    const apptDate = new Date(scheduledAt);
    const in48h = addHours(now, 48);
    return status === "SCHEDULED" && isAfter(apptDate, now) && isBefore(apptDate, in48h);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Olá, {firstName}!</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo(a) ao seu portal.</p>
      </div>

      {/* Next appointment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Próxima Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : nextAppointment ? (
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold">
                  {format(new Date(nextAppointment.scheduled_at), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(nextAppointment.scheduled_at), "HH:mm")}
                </p>
                {nextAppointment.professionals && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {(nextAppointment.professionals as any).full_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={statusLabels[nextAppointment.status]?.variant || "secondary"}>
                  {statusLabels[nextAppointment.status]?.label || nextAppointment.status}
                </Badge>
                {canConfirm(nextAppointment.scheduled_at, nextAppointment.status) && (
                  <Button size="sm" onClick={() => navigate("/portal/appointments")}>
                    Confirmar presença
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma consulta agendada.</p>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          onClick={() => navigate("/portal/appointments")}
        >
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm">Ver Consultas</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          onClick={() => navigate("/portal/booking")}
        >
          <PlusCircle className="h-5 w-5 text-primary" />
          <span className="text-sm">Solicitar Agendamento</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          onClick={() => navigate("/portal/documents")}
        >
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm">Meus Documentos</span>
        </Button>
      </div>

      {/* Upcoming list */}
      {upcoming.length > 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Próximas Consultas</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {upcoming.slice(1, 5).map((appt) => (
              <div key={appt.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">
                    {format(new Date(appt.scheduled_at), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                  {appt.professionals && (
                    <p className="text-xs text-muted-foreground">
                      {(appt.professionals as any).full_name}
                    </p>
                  )}
                </div>
                <Badge variant={statusLabels[appt.status]?.variant || "secondary"} className="text-xs">
                  {statusLabels[appt.status]?.label || appt.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientPortalDashboard;
