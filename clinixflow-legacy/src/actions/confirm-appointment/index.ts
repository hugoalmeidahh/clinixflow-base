"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";

export const confirmAppointment = actionClient
  .schema(
    z.object({
      appointmentId: z.string().uuid(),
      confirmed: z.boolean(),
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
        confirmed: parsedInput.confirmed,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(appointmentsTable.id, parsedInput.appointmentId));

    return { success: true };
  });

