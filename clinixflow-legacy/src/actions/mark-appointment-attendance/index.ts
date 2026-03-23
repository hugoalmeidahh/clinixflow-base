"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";

export const markAppointmentAttendance = actionClient
  .schema(
    z.object({
      appointmentId: z.string().uuid(),
      attended: z.boolean(),
      attendanceJustification: z.string().nullable().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Não autorizado");
    }

    await db
      .update(appointmentsTable)
      .set({
        attended: parsedInput.attended,
        attendanceJustification: parsedInput.attendanceJustification || null,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(appointmentsTable.id, parsedInput.appointmentId));

    // Revalidar páginas que mostram agendamentos
    revalidatePath("/appointments");
    revalidatePath("/professional/appointments");
    revalidatePath("/dashboard");
    // Revalidar inconsistências (marcar presença/falta resolve inconsistência do tipo "no_action")
    revalidatePath("/inconsistencies");
    revalidatePath("/api/inconsistencies/count");

    return { success: true };
  });
