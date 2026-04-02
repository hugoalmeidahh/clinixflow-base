"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";
import { createLocalDateTime } from "@/src/lib/date-utils";

const masterSplitAppointmentSchema = z.object({
  appointmentId: z.string().uuid(),
  slot1Date: z.string().min(1),
  slot1Time: z.string().min(1),
  slot1Duration: z.number().int().min(1),
  slot2Date: z.string().min(1),
  slot2Time: z.string().min(1),
  slot2Duration: z.number().int().min(1),
});

export const masterSplitAppointment = actionClient
  .schema(masterSplitAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (session.user.role !== "master") {
      throw new Error("Forbidden: apenas o usuário master pode executar esta ação");
    }

    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, parsedInput.appointmentId),
    });
    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }

    const newDate1 = createLocalDateTime(parsedInput.slot1Date, parsedInput.slot1Time);
    const newDate2 = createLocalDateTime(parsedInput.slot2Date, parsedInput.slot2Time);

    // Update original appointment with slot 1 data
    await db
      .update(appointmentsTable)
      .set({
        date: newDate1,
        durationInMinutes: parsedInput.slot1Duration,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(appointmentsTable.id, parsedInput.appointmentId));

    // Create new appointment for slot 2 (clone of original, reset attendance)
    await db.insert(appointmentsTable).values({
      appointmentPriceInCents: appointment.appointmentPriceInCents,
      doctorCompensationInCents: appointment.doctorCompensationInCents,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      doctorSpecialtyId: appointment.doctorSpecialtyId,
      clinicId: appointment.clinicId,
      date: newDate2,
      durationInMinutes: parsedInput.slot2Duration,
      confirmed: false,
      attended: null,
      attendanceJustification: null,
      reposicao: appointment.reposicao,
      atendimentoAvaliacao: appointment.atendimentoAvaliacao,
      guideNumber: appointment.guideNumber,
      isRescheduled: false,
      rescheduledFromId: null,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    revalidatePath("/master/appointments");

    return { success: true };
  });
