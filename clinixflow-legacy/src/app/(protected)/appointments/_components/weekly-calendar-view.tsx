
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

interface WeeklyCalendarViewProps {
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

const WeeklyCalendarView = ({
  appointments,
  recordsMap,
  onAttendClick,
  onPresenceClick,
  onEvolutionClick,
  onConfirmationClick,
  onEditClick,
  onCellClick,
}: WeeklyCalendarViewProps) => {
  const t = useTranslations("common");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Segunda-feira
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Domingo
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

  // Pré-processar agendamentos: converter datas uma única vez e criar estruturas otimizadas
  type ProcessedAppointment = AppointmentWithRelations & {
    localDate: Date;
    localDayjs: ReturnType<typeof utcToLocal>;
    hour: number;
    minute: number;
  };

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

  // Obter lista de profissionais únicos que têm agendamentos na semana
  const doctorsInWeek = useMemo(() => {
    const doctorSet = new Map<string, { id: string; name: string }>();
    processedAppointments.forEach((appointment) => {
      if (appointment.doctorId && appointment.doctor) {
        doctorSet.set(appointment.doctorId, {
          id: appointment.doctorId,
          name: appointment.doctor.name,
        });
      }
    });
    return Array.from(doctorSet.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [processedAppointments]);

  // Criar mapa de agendamentos por dia (chave: timestamp do dia)
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
    // Filtrar apenas segunda a sexta (índices 0-4 quando weekStartsOn: 1)
    return allWeekDays.filter((day) => !isSaturday(day) && !isSunday(day));
  }, [allWeekDays, hasWeekendAppointments]);

  // Criar mapa de agendamentos por dia e profissional (chave: "dayKey-doctorId")
  const appointmentsByDayAndDoctor = useMemo(() => {
    const map = new Map<string, ProcessedAppointment[]>();
    processedAppointments.forEach((appointment) => {
      const dayKey = new Date(appointment.localDate).setHours(0, 0, 0, 0);
      const doctorId = appointment.doctorId || "unknown";
      const key = `${dayKey}-${doctorId}`;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(appointment);
    });
    return map;
  }, [processedAppointments]);

  // Criar mapa de agendamentos por slot e profissional (chave: "dayKey-hour-minute-doctorId")
  const appointmentsBySlotAndDoctor = useMemo(() => {
    const map = new Map<string, ProcessedAppointment>();
    processedAppointments.forEach((appointment) => {
      const dayKey = new Date(appointment.localDate).setHours(0, 0, 0, 0);
      const doctorId = appointment.doctorId || "unknown";

      // Determinar em qual slot o agendamento deve aparecer
      const appointmentHour = appointment.hour;
      const appointmentMinute = appointment.minute;

      // Encontrar o slot correto (00, 20 ou 40)
      let slotMinute = 0;
      if (appointmentMinute >= 40) {
        slotMinute = 40;
      } else if (appointmentMinute >= 20) {
        slotMinute = 20;
      } else {
        slotMinute = 0;
      }

      const slotKey = `${dayKey}-${appointmentHour}-${slotMinute}-${doctorId}`;
      map.set(slotKey, appointment);
    });
    return map;
  }, [processedAppointments]);


  // Calcular o total real de colunas (soma das colunas por dia, conforme médicos com agendamentos)
  const totalBodyColumns = useMemo(() => {
    return weekDays.reduce((sum, day) => {
      const dayKey = new Date(day).setHours(0, 0, 0, 0);
      const doctorsInDay = doctorsInWeek.filter((doctor) => {
        const key = `${dayKey}-${doctor.id}`;
        return appointmentsByDayAndDoctor.has(key);
      });
      return sum + Math.max(1, doctorsInDay.length);
    }, 0);
  }, [weekDays, doctorsInWeek, appointmentsByDayAndDoctor]);

  // Gerar slots de 20 em 20 minutos (08:00, 08:20, 08:40... até 20:40)
  const timeSlots = useMemo(() => {
    const slots = [];
    // De 8h até 20h
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 20) {
        slots.push({ hour, minute });
      }
    }
    return slots;
  }, []);

  // Handler para clique em célula vazia - encontra o próximo horário disponível
  const handleCellClick = (
    day: Date,
    slot: { hour: number; minute: number },
  ) => {
    if (!onCellClick) return;

    const dayKey = new Date(day).setHours(0, 0, 0, 0);
    const clickedTime = slot.hour * 60 + slot.minute; // Tempo em minutos desde meia-noite

    // Buscar agendamentos do dia
    const dayAppointments = appointmentsByDay.get(dayKey) || [];

    // Encontrar o próximo horário disponível após o clique
    let nextAvailableTime = clickedTime;

    // Ordenar agendamentos por hora
    const sortedAppointments = [...dayAppointments].sort(
      (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute),
    );

    // Verificar se o horário clicado está dentro de algum agendamento existente
    for (const appointment of sortedAppointments) {
      const appointmentStart = appointment.hour * 60 + appointment.minute;
      const appointmentEnd =
        appointmentStart + (appointment.durationInMinutes || 40);

      // Se o horário clicado está dentro de um agendamento, usar o fim do agendamento
      if (clickedTime >= appointmentStart && clickedTime < appointmentEnd) {
        nextAvailableTime = appointmentEnd;
      }
      // Se há um agendamento que começa depois do horário atual mas o fim do anterior é depois do clique
      else if (
        appointmentStart > clickedTime &&
        appointmentStart < nextAvailableTime + 40
      ) {
        // Verificar se caberia um agendamento antes deste
        break;
      }
    }

    // Formatar o horário
    const hours = Math.floor(nextAvailableTime / 60);
    const minutes = nextAvailableTime % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    // Criar a data com o horário correto
    const dateWithTime = new Date(day);
    dateWithTime.setHours(hours, minutes, 0, 0);

    onCellClick(dateWithTime, timeString);
  };

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

      {/* Calendário semanal */}
      <div className="bg-card overflow-x-auto rounded-lg border">
        <div
          className="bg-muted/50 grid min-w-full border-b"
          style={{
            gridTemplateColumns: `80px repeat(${totalBodyColumns}, minmax(120px, 1fr))`,
          }}
        >
          {/* Cabeçalho vazio para alinhar com as horas */}
          <div className="text-muted-foreground bg-muted/50 sticky left-0 z-20 border-r py-2 text-center text-sm font-medium">
            {t("time")}
          </div>

          {/* Cabeçalhos dos dias com subcolumnas de profissionais */}
          {weekDays.map((day) => {
            const dayKey = new Date(day).setHours(0, 0, 0, 0);
            // Filtrar profissionais que têm agendamentos nesse dia
            const doctorsInDay = doctorsInWeek.filter((doctor) => {
              const key = `${dayKey}-${doctor.id}`;
              return appointmentsByDayAndDoctor.has(key);
            });

            const colSpan = Math.max(1, doctorsInDay.length);

            return (
              <div
                key={day.toISOString()}
                className="border-r"
                style={{ gridColumn: `span ${colSpan}` }}
              >
                {/* Cabeçalho do dia */}
                <div className="border-b py-1 text-center">
                  <div
                    className={`text-sm font-medium ${isToday(day) ? "text-blue-600" : ""}`}
                  >
                    {format(day, "EEE", { locale: ptBR })}
                  </div>
                  <div
                    className={`text-xs ${isToday(day) ? "text-blue-500" : "text-muted-foreground"}`}
                  >
                    {format(day, "dd/MM")}
                  </div>
                </div>

                {/* Subcolumnas de profissionais */}
                {doctorsInDay.length > 0 && (
                  <div
                    className="bg-muted/30 grid border-b"
                    style={{
                      gridTemplateColumns: `repeat(${doctorsInDay.length}, 1fr)`,
                    }}
                  >
                    {doctorsInDay.map((doctor, idx) => (
                      <div
                        key={doctor.id}
                        className={`px-1 py-1 text-center ${idx < doctorsInDay.length - 1 ? "border-r" : ""}`}
                      >
                        <div
                          className="text-muted-foreground truncate text-[10px] font-medium"
                          title={doctor.name}
                        >
                          {doctor.name.split(" ").slice(0, 2).join(" ")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Linhas de tempo */}
        <div
          className="grid min-w-full"
          style={{
            gridTemplateColumns: `80px repeat(${totalBodyColumns}, minmax(120px, 1fr))`,
          }}
        >
          {/* Coluna de horas */}
          <div className="bg-card sticky left-0 z-10 border-r">
            {timeSlots.map((slot) => (
              <div
                key={`${slot.hour}-${slot.minute}`}
                className="text-muted-foreground bg-card flex h-8 items-center justify-center border-b text-xs"
              >
                {`${slot.hour.toString().padStart(2, "0")}:${slot.minute.toString().padStart(2, "0")}`}
              </div>
            ))}
          </div>

          {/* Colunas dos dias com subcolumnas de profissionais */}
          {weekDays.map((day) => {
            const dayKey = new Date(day).setHours(0, 0, 0, 0);

            // Filtrar profissionais que têm agendamentos nesse dia
            const doctorsInDay = doctorsInWeek.filter((doctor) => {
              const key = `${dayKey}-${doctor.id}`;
              return appointmentsByDayAndDoctor.has(key);
            });

            // Se não há profissionais neste dia, mostrar uma coluna vazia
            const columnsToRender =
              doctorsInDay.length > 0
                ? doctorsInDay
                : [{ id: "empty", name: "" }];

            return columnsToRender.map((doctor) => (
              <div
                key={`${day.toISOString()}-${doctor.id}`}
                className={`border-r ${isToday(day) ? "bg-blue-50/50" : ""}`}
              >
                {timeSlots.map((slot) => {
                  // Buscar agendamento deste profissional neste slot
                  const slotKey = `${dayKey}-${slot.hour}-${slot.minute}-${doctor.id}`;
                  const appointment = appointmentsBySlotAndDoctor.get(slotKey);

                  return (
                    <div
                      key={`${slot.hour}-${slot.minute}`}
                      className={`relative h-8 border-b ${!appointment && onCellClick ? "cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20" : ""}`}
                      onClick={() => !appointment && handleCellClick(day, slot)}
                    >
                      {appointment &&
                        (() => {
                          const appointmentMinute = appointment.minute;

                          // Calcular posição vertical dentro do slot (0-20min)
                          const offsetPercent =
                            slot.minute === 0
                              ? (appointmentMinute / 20) * 100
                              : slot.minute === 20
                                ? ((appointmentMinute - 20) / 20) * 100
                                : ((appointmentMinute - 40) / 20) * 100;

                          // Calcular altura baseada na duração real do agendamento
                          const duration = appointment.durationInMinutes || 20;
                          const heightPercent = (duration / 20) * 100;

                          const existingRecord = recordsMap?.get(
                            appointment.id,
                          );
                          const statusColor = getAppointmentStatusColor(
                            appointment,
                            existingRecord,
                          );
                          const gradientColors: Record<string, string> = {
                            "bg-blue-500":
                              "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                            "bg-green-500":
                              "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
                            "bg-red-500":
                              "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
                            "bg-orange-500":
                              "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                            "bg-yellow-500":
                              "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
                          };
                          const gradient =
                            gradientColors[statusColor] ||
                            gradientColors["bg-blue-500"];

                          return (
                            <div
                              className={`group absolute flex items-center justify-between bg-gradient-to-r ${gradient} relative z-10 w-full p-1.5 text-xs text-white shadow-sm transition-all duration-200`}
                              style={{
                                top: `${Math.max(0, offsetPercent)}%`,
                                height: `${heightPercent}%`,
                                minHeight: "24px",
                              }}
                              title={`${appointment.patient?.name} - ${appointment.doctor?.name} - ${appointment.localDayjs.format("HH:mm")}`}
                            >
                              {appointment.isRescheduled && (
                                <div
                                  className="absolute top-1 left-1 h-2 w-2 rounded-full border border-white bg-yellow-400 shadow-sm"
                                  title="Reagendamento"
                                />
                              )}
                              <AppointmentStatusIndicator
                                appointment={appointment}
                                existingRecord={existingRecord}
                                className="absolute top-0 right-0 bottom-0 w-1 rounded-r"
                              />
                              {onAttendClick ||
                              onPresenceClick ||
                              onEvolutionClick ||
                              onConfirmationClick ||
                              onEditClick ? (
                                <AppointmentActionsMenu
                                  appointment={appointment}
                                  onAttendClick={onAttendClick || (() => {})}
                                  onPresenceClick={
                                    onPresenceClick || (() => {})
                                  }
                                  onEvolutionClick={
                                    onEvolutionClick || (() => {})
                                  }
                                  onConfirmationClick={
                                    onConfirmationClick || (() => {})
                                  }
                                  onEditClick={onEditClick}
                                  triggerAsChild
                                  triggerClassName="absolute inset-0 cursor-pointer"
                                />
                              ) : null}
                              <div className="pointer-events-none relative z-10 min-w-0 flex-1">
                                <div className="truncate text-[10px] font-medium">
                                  {appointment.patient?.name}
                                </div>
                                <div className="text-[9px] text-blue-200">
                                  {appointment.localDayjs.format("HH:mm")}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  );
                })}
              </div>
            ));
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendarView;
