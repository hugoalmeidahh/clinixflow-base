"use server";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable, doctorsTable } from "@/src/db/schema";
import { utcTimeToLocal } from "@/src/lib/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAvailableTimes = actionClient
  .schema(
    z.object({
      doctorId: z.string(),
      date: z.string().date(), // YYYY-MM-DD,
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinic) {
      throw new Error("Clínica não encontrada");
    }
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.doctorId),
      with: {
        availability: true,
      },
    });
    if (!doctor) {
      throw new Error("Médico não encontrado");
    }

    // Obter o dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
    // Converter para formato do banco (1=Segunda, 2=Terça, ..., 7=Domingo)
    const jsDayOfWeek = dayjs(parsedInput.date).day(); // 0-6 (0=Domingo)
    const dbDayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek; // Converter para 1-7

    // Buscar disponibilidade do dia específico
    const dayAvailability = doctor.availability?.find(
      (avail) => avail.dayOfWeek === dbDayOfWeek,
    );

    // Determinar horários de disponibilidade
    let doctorAvailableFrom: dayjs.Dayjs;
    let doctorAvailableTo: dayjs.Dayjs;

    if (
      dayAvailability &&
      dayAvailability.isAvailable &&
      dayAvailability.startTime &&
      dayAvailability.endTime
    ) {
      // Usar nova estrutura de disponibilidade
      const startTimeLocal = utcTimeToLocal(dayAvailability.startTime);
      const endTimeLocal = utcTimeToLocal(dayAvailability.endTime);
      const [startHour, startMinute] = startTimeLocal.split(":").map(Number);
      const [endHour, endMinute] = endTimeLocal.split(":").map(Number);

      doctorAvailableFrom = dayjs(parsedInput.date)
        .set("hour", startHour)
        .set("minute", startMinute)
        .set("second", 0);
      doctorAvailableTo = dayjs(parsedInput.date)
        .set("hour", endHour)
        .set("minute", endMinute)
        .set("second", 0);
    } else if (
      doctor.availableFromWeekDay &&
      doctor.availableToWeekDay &&
      doctor.availableFromTime &&
      doctor.availableToTime
    ) {
      // Fallback para campos antigos se disponibilidade não estiver configurada
      const fromDay = doctor.availableFromWeekDay;
      const toDay = doctor.availableToWeekDay;
      const isInRange = dbDayOfWeek >= fromDay && dbDayOfWeek <= toDay;

      if (!isInRange) {
        return [];
      }

      // Usar horários antigos como fallback
      const startTimeLocal = utcTimeToLocal(doctor.availableFromTime);
      const endTimeLocal = utcTimeToLocal(doctor.availableToTime);
      const [startHour, startMinute] = startTimeLocal.split(":").map(Number);
      const [endHour, endMinute] = endTimeLocal.split(":").map(Number);

      doctorAvailableFrom = dayjs(parsedInput.date)
        .set("hour", startHour)
        .set("minute", startMinute)
        .set("second", 0);
      doctorAvailableTo = dayjs(parsedInput.date)
        .set("hour", endHour)
        .set("minute", endMinute)
        .set("second", 0);
    } else {
      // Sem disponibilidade configurada
      return [];
    }

    // Buscar agendamentos do dia com suas durações
    const appointments = await db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.doctorId, parsedInput.doctorId),
    });

    // Filtrar agendamentos do dia selecionado usando timezone explícito
    // IMPORTANTE: Usar .tz("America/Sao_Paulo") em vez de .local() para garantir
    // consistência entre ambiente local e Vercel (que roda em UTC)
    // IMPORTANTE: Excluir agendamentos com falta (attended === false) para liberar o slot
    const appointmentsOnSelectedDate = appointments
      .filter((appointment) => {
        // Excluir faltas - slots de faltas devem ficar disponíveis
        if (appointment.attended === false) {
          return false;
        }

        const appointmentDateBRT = dayjs(appointment.date).tz(
          "America/Sao_Paulo",
        );
        return appointmentDateBRT.format("YYYY-MM-DD") === parsedInput.date;
      })
      .map((appointment) => {
        // Converter para timezone brasileiro explicitamente
        const localDate = dayjs(appointment.date).tz("America/Sao_Paulo");
        const duration =
          (appointment as { durationInMinutes?: number }).durationInMinutes ||
          30;
        const startTime = localDate.format("HH:mm");
        const endTime = localDate.add(duration, "minute").format("HH:mm");

        return {
          start: localDate,
          startTime,
          endTime,
          duration,
          end: localDate.add(duration, "minute"),
        };
      })
      .sort((a, b) => a.start.diff(b.start)); // Ordenar por horário de início

    // Calcular horários disponíveis dinamicamente
    // Intervalo mínimo entre agendamentos (em minutos) - pode ser ajustado
    const MIN_INTERVAL_MINUTES = 0;

    const availableTimes: Array<{
      value: string;
      available: boolean;
      label: string;
    }> = [];
    let currentTime = doctorAvailableFrom;

    // Se não há agendamentos, gerar slots de 10 em 10 minutos
    if (appointmentsOnSelectedDate.length === 0) {
      while (
        currentTime.isBefore(doctorAvailableTo) ||
        currentTime.isSame(doctorAvailableTo)
      ) {
        const timeString = currentTime.format("HH:mm:ss");
        availableTimes.push({
          value: timeString,
          available: true,
          label: currentTime.format("HH:mm"),
        });
        currentTime = currentTime.add(10, "minute");
      }
    } else {
      // Processar intervalos entre agendamentos
      for (const appointment of appointmentsOnSelectedDate) {
        // Adicionar horários disponíveis antes deste agendamento
        // Gerar slots de 10 em 10 minutos até o início do agendamento
        while (
          currentTime.isBefore(appointment.start) &&
          currentTime.isBefore(doctorAvailableTo)
        ) {
          const timeString = currentTime.format("HH:mm:ss");
          availableTimes.push({
            value: timeString,
            available: true,
            label: currentTime.format("HH:mm"),
          });
          currentTime = currentTime.add(10, "minute");
        }

        // Marcar o horário de início do agendamento como indisponível
        const appointmentStartTime = appointment.start.format("HH:mm:ss");
        if (!availableTimes.some((t) => t.value === appointmentStartTime)) {
          availableTimes.push({
            value: appointmentStartTime,
            available: false,
            label: appointment.start.format("HH:mm"),
          });
        }

        // Avançar para o término do agendamento + intervalo mínimo
        // Este será o próximo horário disponível
        currentTime = appointment.end.add(MIN_INTERVAL_MINUTES, "minute");
      }

      // Adicionar horários disponíveis após o último agendamento
      while (
        currentTime.isBefore(doctorAvailableTo) ||
        currentTime.isSame(doctorAvailableTo)
      ) {
        const timeString = currentTime.format("HH:mm:ss");
        availableTimes.push({
          value: timeString,
          available: true,
          label: currentTime.format("HH:mm"),
        });
        currentTime = currentTime.add(10, "minute");
      }
    }

    // Remover duplicatas e ordenar
    const uniqueTimes = Array.from(
      new Map(availableTimes.map((time) => [time.value, time])).values(),
    ).sort((a, b) => a.value.localeCompare(b.value));

    return uniqueTimes;
  });
