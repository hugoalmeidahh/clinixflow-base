import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppointmentActions from "./AppointmentActions";

interface WeeklyViewProps {
  appointments: any[];
  currentDate: Date;
  onRefresh: () => void;
  onSlotClick?: (date: string, time: string) => void;
}

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 60;
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

  for (const r of result) {
    const bottom = r.item.top + r.item.height;
    const cluster = result.filter(o => o.item.top < bottom && o.item.top + o.item.height > r.item.top);
    const maxCol = Math.max(...cluster.map(c => c.col)) + 1;
    cluster.forEach(c => { c.totalCols = Math.max(c.totalCols, maxCol); });
  }

  return result;
}

const AppointmentWeeklyView = ({ appointments, currentDate, onRefresh, onSlotClick }: WeeklyViewProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const positionedByDay = useMemo(() => {
    const map: Record<string, ReturnType<typeof resolveOverlapColumns>> = {};
    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      const dayApts = appointments.filter(apt => isSameDay(new Date(apt.scheduled_at), day));
      const items = dayApts.map(apt => {
        const d = new Date(apt.scheduled_at);
        const startMin = getMinutesFromMidnight(d);
        const top = ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
        const height = (apt.duration_min / 60) * HOUR_HEIGHT;
        return { top: Math.max(top, 0), height: Math.max(height, 12), apt };
      });
      map[key] = resolveOverlapColumns(items);
    }
    return map;
  }, [appointments, days]);

  const handleSlotClick = (day: Date, hour: number) => {
    if (onSlotClick) {
      onSlotClick(format(day, "yyyy-MM-dd"), `${String(hour).padStart(2, "0")}:00`);
    }
  };

  const totalHeight = HOURS.length * HOUR_HEIGHT;

  return (
    <div className="overflow-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid border-b border-border sticky top-0 bg-card z-10"
          style={{ gridTemplateColumns: `64px repeat(7, 1fr)` }}
        >
          <div className="p-2 text-xs font-medium text-muted-foreground border-r border-border" />
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={cn(
                "p-2 text-center border-r last:border-r-0 border-border",
                isSameDay(day, today) && "bg-primary/5"
              )}
            >
              <p className="text-xs text-muted-foreground">{format(day, "EEE", { locale: ptBR })}</p>
              <p className={cn(
                "text-sm font-semibold",
                isSameDay(day, today) && "text-primary"
              )}>
                {format(day, "dd")}
              </p>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid" style={{ gridTemplateColumns: `64px repeat(7, 1fr)` }}>
          {/* Hour labels */}
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

          {/* Day columns */}
          {days.map(day => {
            const key = format(day, "yyyy-MM-dd");
            const positioned = positionedByDay[key] || [];
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative border-r last:border-r-0 border-border/50",
                  isSameDay(day, today) && "bg-primary/5"
                )}
                style={{ height: totalHeight }}
              >
                {/* Hour grid lines + click targets */}
                {HOURS.map((hour, i) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-b border-border/50 cursor-pointer hover:bg-primary/10 transition-colors"
                    style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                    onClick={() => handleSlotClick(day, hour)}
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
                          "absolute rounded-md border-l-[3px] px-1 py-0.5 text-[10px] cursor-pointer z-10",
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
                        <p className="font-semibold truncate leading-tight">{apt.patients?.full_name?.split(" ")[0]}</p>
                        {item.height > 22 && (
                          <p className="opacity-80 leading-tight">
                            {startTime} – {endTime}
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

export default AppointmentWeeklyView;
