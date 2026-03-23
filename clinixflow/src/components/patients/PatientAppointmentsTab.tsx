import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientAppointmentsTabProps {
  appointments: any[];
}

const PatientAppointmentsTab = ({ appointments }: PatientAppointmentsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nenhum agendamento"
            description="Este paciente ainda não possui agendamentos."
          />
        ) : (
          <div className="space-y-2">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[52px]">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(apt.scheduled_at), "dd/MM", { locale: ptBR })}
                    </p>
                    <p className="text-sm font-mono font-medium">
                      {format(new Date(apt.scheduled_at), "HH:mm")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{apt.professionals?.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {apt.code} · {apt.specialties?.name}
                    </p>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAppointmentsTab;
