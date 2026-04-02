"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";
import { createLocalDateTime } from "@/src/lib/date-utils";

import { masterUpdateAppointmentDateSchema } from "./schema";

export const masterUpdateAppointmentDate = actionClient
  .schema(masterUpdateAppointmentDateSchema)
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

    const newDate = createLocalDateTime(parsedInput.date, parsedInput.time);

    await db
      .update(appointmentsTable)
      .set({
        date: newDate,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(appointmentsTable.id, parsedInput.appointmentId));

    revalidatePath("/master/appointments");

    return { success: true };
  });
