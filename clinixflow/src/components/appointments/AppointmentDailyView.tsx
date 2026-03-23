import { useMemo } from "react";
import AppointmentActions from "./AppointmentActions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DailyViewProps {
  appointments: any[];
  professionals: any[];
  currentDate: Date;
  onRefresh: () => void;
  onSlotClick?: (date: string, time: string, professionalId?: string) => void;
}

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 60; // px per hour
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-badge-scheduled border-badge-scheduled/40 text-white",
  CONFIRMED: "bg-primary border-primary/40 text-primary-foreground",
  ATTENDED: "bg-badge-attended border-badge-attended/40 text-white",
  ABSENCE: "bg-badge-absent border-badge-absent/40 text-white",
  JUSTIFIED_ABSENCE: "bg-badge-justified border-badge-justified/40 text-white",
  CANCELLED: "bg-badge-cancelled border-badge-cancelled/40 text-white",
  RESCHEDULED: "bg-badge-rescheduled border-badge-rescheduled/40 text-white",
};

function getMinutesFromMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function resolveOverlapColumns(items: { top: number; height: number; apt: any }[]) {
  const sorted = [...items].sort((a, b) => a.top - b.top || b.height - a.height);
  const placed: { col: number; top: number; bottom: number }[] = [];
  const result: { col: number; totalCols: number; item: (typeof items)[0] }[] = [];

  for (const item of sorted) {
    const bottom = item.top + item.height;
    let col = 0;
    const overlapping = placed.filter(p => p.top < bottom && p.bottom > item.top);
    const usedCols = new Set(overlapping.map(o => o.col));
    while (usedCols.has(col)) col++;
    placed.push({ col, top: item.top, bottom });
    result.push({ col, totalCols: 0, item });
  }

  // compute total cols per cluster
  for (const r of result) {
    const bottom = r.item.top + r.item.height;
    const cluster = result.filter(o => o.item.top < bottom && o.item.top + o.item.height > r.item.top);
    const maxCol = Math.max(...cluster.map(c => c.col)) + 1;
    cluster.forEach(c => { c.totalCols = Math.max(c.totalCols, maxCol); });
  }

  return result;
}

const AppointmentDailyView = ({ appointments, professionals, currentDate, onRefresh, onSlotClick }: DailyViewProps) => {
  const dateStr = format(currentDate, "yyyy-MM-dd");

  const dayAppointments = useMemo(() =>
    appointments.filter(apt => format(new Date(apt.scheduled_at), "yyyy-MM-dd") === dateStr),
    [appointments, dateStr]
  );

  const activeProfessionals = useMemo(() => {
    const profIds = new Set(dayAppointments.map(a => a.professional_id));
    const filtered = professionals.filter(p => profIds.has(p.id));
    return filtered.length > 0 ? filtered : professionals.slice(0, 5);
  }, [dayAppointments, professionals]);

  const positionedByProf = useMemo(() => {
    const map: Record<string, ReturnType<typeof resolveOverlapColumns>> = {};
    for (const prof of activeProfessionals) {
      const profApts = dayAppointments.filter(a => a.professional_id === prof.id);
      const items = profApts.map(apt => {
        const d = new Date(apt.scheduled_at);
        const startMin = getMinutesFromMidnight(d);
        const top = ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
        const height = (apt.duration_min / 60) * HOUR_HEIGHT;
        return { top: Math.max(top, 0), height: Math.max(height, 12), apt };
      });
      map[prof.id] = resolveOverlapColumns(items);
    }
    return map;
  }, [dayAppointments, activeProfessionals]);

  const handleSlotClick = (profId: string, hour: number) => {
    if (onSlotClick) {
      onSlotClick(dateStr, `${String(hour).padStart(2, "0")}:00`, profId);
    }
  };

  if (activeProfessionals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">Nenhum profissional cadastrado para exibir a agenda diária.</p>
      </div>
    );
  }

  const totalHeight = HOURS.length * HOUR_HEIGHT;

  return (
    <div className="overflow-auto">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid border-b border-border sticky top-0 bg-card z-10"
          style={{ gridTemplateColumns: `64px repeat(${activeProfessionals.length}, 1fr)` }}
        >
          <div className="p-2 text-xs font-medium text-muted-foreground border-r border-border">Hora</div>
          {activeProfessionals.map(prof => (
            <div key={prof.id} className="p-2 text-xs font-medium text-center border-r last:border-r-0 border-border truncate">
              {prof.full_name}
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid" style={{ gridTemplateColumns: `64px repeat(${activeProfessionals.length}, 1fr)` }}>
          {/* Hour labels column */}
          <div className="relative border-r border-border" style={{ height: totalHeight }}>
            {HOURS.map((hour, i) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-b border-border/50 px-2 text-xs text-muted-foreground font-mono"
                style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
              >
                <span className="relative -top-0.5">{String(hour).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          {/* Professional columns */}
          {activeProfessionals.map(prof => {
            const positioned = positionedByProf[prof.id] || [];
            return (
              <div key={prof.id} className="relative border-r last:border-r-0 border-border/50" style={{ height: totalHeight }}>
                {/* Hour grid lines + click targets */}
                {HOURS.map((hour, i) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-b border-border/50 cursor-pointer hover:bg-primary/5 transition-colors"
                    style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                    onClick={() => handleSlotClick(prof.id, hour)}
                  />
                ))}

                {/* Appointment cards */}
                {positioned.map(({ col, totalCols, item }) => {
                  const apt = item.apt;
                  const width = `calc(${100 / totalCols}% - 4px)`;
                  const left = `calc(${(col / totalCols) * 100}% + 2px)`;
                  const startTime = format(new Date(apt.scheduled_at), "HH:mm");
                  const endDate = new Date(new Date(apt.scheduled_at).getTime() + apt.duration_min * 60000);
                  const endTime = format(endDate, "HH:mm");

                  return (
                    <AppointmentActions key={apt.id} appointment={apt} onActionComplete={onRefresh} mode="popover">
                      <div
                        className={cn(
                          "absolute rounded-md border-l-[3px] px-1.5 py-0.5 text-xs cursor-pointer z-10",
                          "hover:brightness-90 hover:shadow-md transition-all overflow-hidden",
                          statusColors[apt.status] || statusColors.SCHEDULED
                        )}
                        style={{
                          top: item.top,
                          height: Math.max(item.height - 2, 12),
                          left,
                          width,
                        }}
                      >
                        <p className="font-semibold truncate leading-tight">{apt.patients?.full_name}</p>
                        {item.height > 28 && (
                          <p className="text-[10px] opacity-80 leading-tight">
                            {startTime} – {endTime}
                          </p>
                        )}
                        {item.height > 44 && (
                          <p className="text-[10px] opacity-70 truncate leading-tight">
                            {apt.specialties?.name}
                          </p>
                        )}
                      </div>
                    </AppointmentActions>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDailyView;
