"use server";

import { inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";

export const masterBulkDeleteAppointments = actionClient
  .schema(z.object({ ids: z.array(z.string().uuid()).min(1) }))
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) throw new Error("Unauthorized");
    if (session.user.role !== "master")
      throw new Error("Forbidden: apenas o usuário master pode executar esta ação");

    await db
      .delete(appointmentsTable)
      .where(inArray(appointmentsTable.id, parsedInput.ids));

    return { deleted: parsedInput.ids.length };
  });
