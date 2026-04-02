"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable, patientsTable } from "@/src/db/schema";

export const masterDeletePatient = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
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

    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    });
    if (!patient) {
      throw new Error("Paciente não encontrado");
    }

    // Check for linked appointments
    const linkedAppointments = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.patientId, parsedInput.id),
    });
    if (linkedAppointments) {
      throw new Error(
        "Paciente possui agendamentos vinculados. Exclua os agendamentos primeiro.",
      );
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));

    revalidatePath("/master/patients");

    return { success: true };
  });
