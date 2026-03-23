"use client";

import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSaturday,
  isSunday,
  isToday,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  UserCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";
import { utcToLocal } from "@/src/lib/date-utils";

import AppointmentActionsMenu from "./appointment-actions-menu";
import AppointmentStatusIndicator from "./appointment-status-indicator";

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

interface CardsViewProps {
  appointments: AppointmentWithRelations[];
  recordsMap?: Map<string, typeof patientRecordsTable.$inferSelect>;
  onAttendClick?: (appointment: AppointmentWithRelations) => void;
  onPresenceClick?: (appointment: AppointmentWithRelations) => void;
  onEvolutionClick?: (appointment: AppointmentWithRelations) => void;
  onConfirmationClick?: (appointment: AppointmentWithRelations) => void;
  onEditClick?: (appointment: AppointmentWithRelations) => void;
}

const CardsView = ({
  appointments,
  recordsMap,
  onAttendClick,
  onPresenceClick,
  onEvolutionClick,
  onConfirmationClick,
  onEditClick,
}: CardsViewProps) => {
  const t = useTranslations("common");
  const tApp = useTranslations("appointments");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const allWeekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // Pré-processar agendamentos
  type ProcessedAppointment = AppointmentWithRelations & {
    localDate: Date;
    localDayjs: ReturnType<typeof utcToLocal>;
  };

  const processedAppointments = useMemo<ProcessedAppointment[]>(() => {
    return appointments.map((appointment) => {
      const localDate = utcToLocal(appointment.date);
      return {
        ...appointment,
        localDate: localDate.toDate(),
        localDayjs: localDate,
      };
    });
  }, [appointments]);

  // Criar mapa de agendamentos por dia
  const appointmentsByDay = useMemo(() => {
    const map = new Map<number, ProcessedAppointment[]>();
    processedAppointments.forEach((appointment) => {
      const dayKey = new Date(appointment.localDate).setHours(0, 0, 0, 0);
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey)!.push(appointment);
    });
    return map;
  }, [processedAppointments]);

  // Verificar se há agendamentos no sábado ou domingo
  const hasWeekendAppointments = useMemo(() => {
    return processedAppointments.some((appointment) => {
      const day = appointment.localDate;
      return isSaturday(day) || isSunday(day);
    });
  }, [processedAppointments]);

  // Filtrar dias da semana - mostrar só segunda a sexta, a menos que tenha agendamento no fim de semana
  const weekDays = useMemo(() => {
    if (hasWeekendAppointments) {
      return allWeekDays;
    }
    return allWeekDays.filter((day) => !isSaturday(day) && !isSunday(day));
  }, [allWeekDays, hasWeekendAppointments]);

  const getAppointmentsForDay = useMemo(() => {
    return (date: Date) => {
      const dayKey = new Date(date).setHours(0, 0, 0, 0);
      return appointmentsByDay.get(dayKey) || [];
    };
  }, [appointmentsByDay]);

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            {t("today")}
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-lg font-semibold">
          {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} -{" "}
          {format(weekEnd, "dd 'de' MMMM, yyyy", { locale: ptBR })}
        </div>
      </div>

      {/* Lista de agendamentos da semana */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            {tApp("weekAppointments")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              if (dayAppointments.length === 0) return null;

              return (
                <div key={day.toISOString()} className="space-y-2">
                  <div
                    className={`text-sm font-medium ${isToday(day) ? "text-blue-600" : "text-muted-foreground"}`}
                  >
                    {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    {isToday(day) && ` (${t("today")})`}
                  </div>
                  <div className="space-y-2">
                    {dayAppointments
                      .sort(
                        (a, b) => a.localDate.getTime() - b.localDate.getTime(),
                      )
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="bg-card hover:bg-muted/50 relative flex items-center justify-between rounded-lg border p-3 transition-colors"
                        >
                          {appointment.isRescheduled && (
                            <div
                              className="absolute top-2 left-2 h-2 w-2 rounded-full border border-gray-300 bg-yellow-400 shadow-sm"
                              title="Reagendamento"
                            />
                          )}
                          <AppointmentStatusIndicator
                            appointment={appointment}
                            existingRecord={recordsMap?.get(appointment.id)}
                          />
                          {onAttendClick ||
                          onPresenceClick ||
                          onEvolutionClick ||
                          onConfirmationClick ||
                          onEditClick ? (
                            <AppointmentActionsMenu
                              appointment={appointment}
                              onAttendClick={onAttendClick || (() => {})}
                              onPresenceClick={onPresenceClick || (() => {})}
                              onEvolutionClick={onEvolutionClick || (() => {})}
                              onConfirmationClick={
                                onConfirmationClick || (() => {})
                              }
                              onEditClick={onEditClick}
                              triggerAsChild
                              triggerClassName="absolute inset-0 cursor-pointer"
                            />
                          ) : null}
                          <div className="pointer-events-none relative z-10 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="text-muted-foreground h-4 w-4" />
                              <span className="font-medium">
                                {appointment.patient?.name}
                              </span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                              <UserCheck className="h-4 w-4" />
                              <span>
                                {appointment.doctor?.name} -{" "}
                                {appointment.doctor?.specialty}
                              </span>
                            </div>
                          </div>
                          <div className="pointer-events-none relative z-10 flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                              <Clock className="h-4 w-4" />
                              {appointment.localDayjs.format("HH:mm")}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
            {weekDays.every(
              (day) => getAppointmentsForDay(day).length === 0,
            ) && (
              <div className="text-muted-foreground py-8 text-center">
                {tApp("noWeekAppointments")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardsView;
