"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";
import { createLocalDateTime, extractDateOnly } from "@/src/lib/date-utils";

import { getAvailableTimes } from "../get-available-times";
import { rescheduleAppointmentSchema } from "./schema";

export const rescheduleAppointment = actionClient
  .schema(rescheduleAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    const clinicId = session.user.clinic.id;

    // Verificar se o agendamento original existe e pertence à clínica
    const originalAppointment = await db.query.appointmentsTable.findFirst({
      where: (appointments, { eq: eqFn, and }) =>
        and(
          eqFn(appointments.id, parsedInput.originalAppointmentId),
          eqFn(appointments.clinicId, clinicId),
        ),
    });

    if (!originalAppointment) {
      throw new Error("Original appointment not found");
    }

    // Extrair apenas a data (YYYY-MM-DD) sem considerar timezone
    const dateString = extractDateOnly(parsedInput.date);

    // Verificar disponibilidade do novo horário
    const availableTimes = await getAvailableTimes({
      doctorId: parsedInput.doctorId,
      date: dateString,
    });
    if (!availableTimes?.data) {
      throw new Error("No available times");
    }
    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );
    if (!isTimeAvailable) {
      throw new Error("Time not available");
    }

    // Criar data/hora no timezone local e converter para UTC
    const appointmentDateTime = createLocalDateTime(
      dateString,
      parsedInput.time,
    );

    // Criar novo agendamento marcado como reagendamento
    const newAppointments = await db
      .insert(appointmentsTable)
      .values({
        patientId: originalAppointment.patientId,
        doctorId: parsedInput.doctorId,
        doctorSpecialtyId: parsedInput.doctorSpecialtyId,
        clinicId: clinicId,
        date: appointmentDateTime,
        appointmentPriceInCents: parsedInput.appointmentPriceInCents,
        durationInMinutes: parsedInput.durationInMinutes || 30,
        reposicao: parsedInput.reposicao ?? false,
        atendimentoAvaliacao: parsedInput.atendimentoAvaliacao ?? false,
        isRescheduled: true,
        rescheduledFromId: originalAppointment.id,
        createdBy: session.user.id,
      })
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newAppointment = (newAppointments as any)[0];

    // Marcar agendamento original como reagendado (isRescheduled = true)
    await db
      .update(appointmentsTable)
      .set({
        isRescheduled: true,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(appointmentsTable.id, originalAppointment.id));

    revalidatePath("/appointments");
    revalidatePath("/professional/appointments");
    revalidatePath("/dashboard");
    revalidatePath("/inconsistencies");
    revalidatePath("/api/inconsistencies/count");

    return { newAppointmentId: newAppointment.id };
  });
