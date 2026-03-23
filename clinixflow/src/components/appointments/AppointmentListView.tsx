import StatusBadge from "@/components/StatusBadge";
import AppointmentActions from "./AppointmentActions";
import EmptyState from "@/components/EmptyState";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ListViewProps {
  appointments: any[];
  onRefresh: () => void;
  onNewAppointment: () => void;
}

const AppointmentListView = ({ appointments, onRefresh, onNewAppointment }: ListViewProps) => {
  // Group appointments by day then by professional
  const grouped: Record<string, Record<string, any[]>> = {};
  appointments.forEach(apt => {
    const day = format(new Date(apt.scheduled_at), "yyyy-MM-dd");
    const profName = apt.professionals?.full_name || "Sem profissional";
    const specName = apt.specialties?.name || "";
    const key = `${profName} — ${specName}`;
    if (!grouped[day]) grouped[day] = {};
    if (!grouped[day][key]) grouped[day][key] = [];
    grouped[day][key].push(apt);
  });

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Nenhum agendamento neste período"
        description="Crie um novo agendamento para começar."
        actionLabel="+ Novo Agendamento"
        onAction={onNewAppointment}
      />
    );
  }

  return (
    <div className="divide-y divide-border">
      {Object.entries(grouped).sort().map(([day, professionals]) => (
        <div key={day}>
          <div className="bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground sticky top-0 z-10">
            📅 {format(parseISO(day), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </div>
          {Object.entries(professionals).map(([profKey, apts]) => (
            <div key={profKey}>
              <div className="px-4 py-1.5 bg-muted/20 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                👤 {profKey}
              </div>
              <div className="divide-y divide-border/50">
                {apts.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-sm text-muted-foreground w-12 shrink-0">
                        {format(new Date(apt.scheduled_at), "HH:mm")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{apt.patients?.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {apt.code} · {apt.duration_min}min
                          {apt.original_appointment_id && <span className="ml-1 text-primary">(Reposição)</span>}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                    <AppointmentActions appointment={apt} onActionComplete={onRefresh} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AppointmentListView;
