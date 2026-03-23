"use client";

import { addDays, format, isToday, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";
import { utcToLocal } from "@/src/lib/date-utils";

import AppointmentActionsMenu from "./appointment-actions-menu";
import AppointmentStatusIndicator, {
  getAppointmentStatusColor,
} from "./appointment-status-indicator";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    sex?: "male" | "female";
  } | null;
  doctor: {
    id: string;
    name: string;
    specialty?: string | null;
  } | null;
};

interface DailyCalendarViewProps {
  appointments: AppointmentWithRelations[];
  recordsMap?: Map<string, typeof patientRecordsTable.$inferSelect>;
  onAppointmentClick?: (appointment: AppointmentWithRelations) => void;
  onAttendClick?: (appointment: AppointmentWithRelations) => void;
  onPresenceClick?: (appointment: AppointmentWithRelations) => void;
  onEvolutionClick?: (appointment: AppointmentWithRelations) => void;
  onConfirmationClick?: (appointment: AppointmentWithRelations) => void;
  onEditClick?: (appointment: AppointmentWithRelations) => void;
  onCellClick?: (date: Date, time: string) => void;
}

type ProcessedAppointment = AppointmentWithRelations & {
  localDate: Date;
  localDayjs: ReturnType<typeof utcToLocal>;
  hour: number;
  minute: number;
};

const DailyCalendarView = ({
  appointments,
  recordsMap,
  onAttendClick,
  onPresenceClick,
  onEvolutionClick,
  onConfirmationClick,
  onEditClick,
  onCellClick,
}: DailyCalendarViewProps) => {
  const t = useTranslations("common");
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const goToNextDay = () => setCurrentDate(addDays(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const processedAppointments = useMemo<ProcessedAppointment[]>(() => {
    return appointments.map((appointment) => {
      const localDate = utcToLocal(appointment.date);
      return {
        ...appointment,
        localDate: localDate.toDate(),
        localDayjs: localDate,
        hour: localDate.hour(),
        minute: localDate.minute(),
      };
    });
  }, [appointments]);

  // Filter only today's appointments
  const dayAppointments = useMemo(() => {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);

    return processedAppointments
      .filter((a) => {
        const d = a.localDate;
        return d >= dayStart && d <= dayEnd;
      })
      .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  }, [processedAppointments, currentDate]);

  // Group by doctor
  const doctorsInDay = useMemo(() => {
    const doctorSet = new Map<string, { id: string; name: string }>();
    dayAppointments.forEach((a) => {
      if (a.doctorId && a.doctor) {
        doctorSet.set(a.doctorId, { id: a.doctorId, name: a.doctor.name });
      }
    });
    return Array.from(doctorSet.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [dayAppointments]);

  // Time slots: 08:00 to 20:40 in 20-minute intervals
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 20) {
        slots.push({ hour, minute });
      }
    }
    return slots;
  }, []);

  // Map by slot+doctor
  const appointmentsBySlotAndDoctor = useMemo(() => {
    const map = new Map<string, ProcessedAppointment>();
    const dayKey = new Date(currentDate).setHours(0, 0, 0, 0);
    dayAppointments.forEach((a) => {
      const doctorId = a.doctorId || "unknown";
      let slotMinute = 0;
      if (a.minute >= 40) slotMinute = 40;
      else if (a.minute >= 20) slotMinute = 20;
      const slotKey = `${dayKey}-${a.hour}-${slotMinute}-${doctorId}`;
      map.set(slotKey, a);
    });
    return map;
  }, [dayAppointments, currentDate]);

  const handleCellClick = (slot: { hour: number; minute: number }) => {
    if (!onCellClick) return;
    const timeString = `${slot.hour.toString().padStart(2, "0")}:${slot.minute.toString().padStart(2, "0")}`;
    const dateWithTime = new Date(currentDate);
    dateWithTime.setHours(slot.hour, slot.minute, 0, 0);
    onCellClick(dateWithTime, timeString);
  };

  const isTodaySelected = isToday(currentDate);
  const dayKey = new Date(currentDate).setHours(0, 0, 0, 0);
  const columnsToRender = doctorsInDay.length > 0 ? doctorsInDay : [{ id: "empty", name: "" }];

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={isTodaySelected ? "default" : "outline"}
            size="sm"
            className="h-8"
            onClick={goToToday}
          >
            {t("today")}
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm font-semibold sm:text-lg">
          {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      {/* Daily calendar grid */}
      <div className="bg-card overflow-x-auto rounded-lg border">
        {/* Header row */}
        <div
          className="bg-muted/50 grid border-b"
          style={{
            gridTemplateColumns: `64px repeat(${columnsToRender.length}, minmax(140px, 1fr))`,
          }}
        >
          <div className="text-muted-foreground bg-muted/50 sticky left-0 z-20 border-r py-2 text-center text-xs font-medium">
            {t("time")}
          </div>
          {columnsToRender.map((doctor) => (
            <div
              key={doctor.id}
              className="border-r px-2 py-2 text-center"
            >
              {doctor.name && (
                <div className="truncate text-xs font-medium" title={doctor.name}>
                  {doctor.name}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Time rows */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `64px repeat(${columnsToRender.length}, minmax(140px, 1fr))`,
          }}
        >
          {/* Time column */}
          <div className="bg-card sticky left-0 z-10 border-r">
            {timeSlots.map((slot) => (
              <div
                key={`${slot.hour}-${slot.minute}`}
                className="text-muted-foreground bg-card flex h-10 items-center justify-center border-b text-xs"
              >
                {`${slot.hour.toString().padStart(2, "0")}:${slot.minute.toString().padStart(2, "0")}`}
              </div>
            ))}
          </div>

          {/* Doctor columns */}
          {columnsToRender.map((doctor) => (
            <div
              key={doctor.id}
              className={`border-r ${isTodaySelected ? "bg-blue-50/30 dark:bg-blue-950/10" : ""}`}
            >
              {timeSlots.map((slot) => {
                const slotKey = `${dayKey}-${slot.hour}-${slot.minute}-${doctor.id}`;
                const appointment = appointmentsBySlotAndDoctor.get(slotKey);

                return (
                  <div
                    key={`${slot.hour}-${slot.minute}`}
                    className={`relative h-10 border-b ${!appointment && onCellClick ? "cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20" : ""}`}
                    onClick={() => !appointment && handleCellClick(slot)}
                  >
                    {appointment && (() => {
                      const offsetPercent =
                        slot.minute === 0
                          ? (appointment.minute / 20) * 100
                          : slot.minute === 20
                            ? ((appointment.minute - 20) / 20) * 100
                            : ((appointment.minute - 40) / 20) * 100;

                      const duration = appointment.durationInMinutes || 20;
                      const heightPercent = (duration / 20) * 100;

                      const existingRecord = recordsMap?.get(appointment.id);
                      const statusColor = getAppointmentStatusColor(appointment, existingRecord);
                      const gradientColors: Record<string, string> = {
                        "bg-blue-500": "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                        "bg-green-500": "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
                        "bg-red-500": "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
                        "bg-orange-500": "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                        "bg-yellow-500": "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
                      };
                      const gradient = gradientColors[statusColor] || gradientColors["bg-blue-500"];

                      return (
                        <div
                          className={`group absolute z-10 flex w-full items-center justify-between bg-gradient-to-r ${gradient} rounded-sm p-1.5 text-xs text-white shadow-sm transition-all duration-200`}
                          style={{
                            top: `${Math.max(0, offsetPercent)}%`,
                            height: `${heightPercent}%`,
                            minHeight: "32px",
                          }}
                          title={`${appointment.patient?.name} - ${appointment.doctor?.name} - ${appointment.localDayjs.format("HH:mm")}`}
                        >
                          {appointment.isRescheduled && (
                            <div
                              className="absolute left-1 top-1 h-2 w-2 rounded-full border border-white bg-yellow-400 shadow-sm"
                              title="Reagendamento"
                            />
                          )}
                          <AppointmentStatusIndicator
                            appointment={appointment}
                            existingRecord={existingRecord}
                            className="absolute bottom-0 right-0 top-0 w-1 rounded-r"
                          />
                          {(onAttendClick || onPresenceClick || onEvolutionClick || onConfirmationClick || onEditClick) && (
                            <AppointmentActionsMenu
                              appointment={appointment}
                              onAttendClick={onAttendClick || (() => {})}
                              onPresenceClick={onPresenceClick || (() => {})}
                              onEvolutionClick={onEvolutionClick || (() => {})}
                              onConfirmationClick={onConfirmationClick || (() => {})}
                              onEditClick={onEditClick}
                              triggerAsChild
                              triggerClassName="absolute inset-0 cursor-pointer"
                            />
                          )}
                          <div className="pointer-events-none relative z-10 min-w-0 flex-1">
                            <div className="truncate text-[11px] font-medium">
                              {appointment.patient?.name}
                            </div>
                            <div className="text-[10px] opacity-80">
                              {appointment.localDayjs.format("HH:mm")} - {appointment.doctor?.name?.split(" ")[0]}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyCalendarView;
