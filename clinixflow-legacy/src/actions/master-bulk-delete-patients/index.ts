"use server";

import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable, patientsTable } from "@/src/db/schema";

export const masterBulkDeletePatients = actionClient
  .schema(z.object({ ids: z.array(z.string().uuid()).min(1) }))
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) throw new Error("Unauthorized");
    if (session.user.role !== "master")
      throw new Error("Forbidden: apenas o usuário master pode executar esta ação");

    // Check which patients have linked appointments
    const linked = await db
      .select({ patientId: appointmentsTable.patientId })
      .from(appointmentsTable)
      .where(inArray(appointmentsTable.patientId, parsedInput.ids));

    const blockedIds = new Set(linked.map((r) => r.patientId).filter(Boolean) as string[]);
    const deleteIds = parsedInput.ids.filter((id) => !blockedIds.has(id));

    if (deleteIds.length > 0) {
      await db.delete(patientsTable).where(inArray(patientsTable.id, deleteIds));
    }

    return {
      deleted: deleteIds.length,
      skipped: blockedIds.size,
      skippedIds: [...blockedIds],
    };
  });
