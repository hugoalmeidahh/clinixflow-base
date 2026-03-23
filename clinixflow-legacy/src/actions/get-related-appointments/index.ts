"use server";

import { and, eq, gt } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";

export const getRelatedAppointments = actionClient
  .schema(
    z.object({
      appointmentId: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, parsedInput.appointmentId),
    });
    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }
    if (appointment.clinicId !== session.user.clinic?.id) {
      throw new Error("Agendamento não encontrado");
    }

    // Verificar se este agendamento tem evolução
    const hasEvolution = await db.query.patientRecordsTable.findFirst({
      where: eq(patientRecordsTable.appointmentId, parsedInput.appointmentId),
    });

    // Buscar agendamentos futuros do mesmo paciente/profissional/especialidade
    const futureAppointments = await db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.patientId, appointment.patientId!),
        eq(appointmentsTable.doctorId, appointment.doctorId!),
        eq(appointmentsTable.doctorSpecialtyId, appointment.doctorSpecialtyId!),
        eq(appointmentsTable.clinicId, appointment.clinicId!),
        gt(appointmentsTable.date, new Date()),
      ),
      orderBy: (appointments, { asc }) => [asc(appointments.date)],
    });

    return {
      hasEvolution: !!hasEvolution,
      futureAppointmentsCount: futureAppointments.length,
      appointment: {
        id: appointment.id,
        date: appointment.date,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        doctorSpecialtyId: appointment.doctorSpecialtyId,
      },
    };
  });
