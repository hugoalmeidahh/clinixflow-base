"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { patientRecordsTable } from "@/src/db/schema";

import { upsertPatientRecordSchema } from "./schema";

export const upsertPatientRecord = actionClient
  .schema(upsertPatientRecordSchema)
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

    const userId = session.user.id;
    const isUpdate = !!parsedInput.id;

    // Se não for primeira consulta, não precisa de avaliação
    const valuesToInsert = {
      ...parsedInput,
      clinicId: session?.user.clinic?.id,
      avaliationContent: parsedInput.firstConsultation
        ? parsedInput.avaliationContent || ""
        : "",
      // Adicionar createdBy apenas se for criação (não update)
      ...(isUpdate ? {} : { createdBy: userId }),
      // Sempre adicionar updatedBy em updates
      ...(isUpdate ? { updatedBy: userId } : {}),
    };

    if (parsedInput.id) {
      // Update existing record
      await db
        .update(patientRecordsTable)
        .set({
          ...valuesToInsert,
          updatedBy: userId,
          updatedAt: new Date(),
        })
        .where(eq(patientRecordsTable.id, parsedInput.id));
    } else {
      // Insert new record
      await db.insert(patientRecordsTable).values(valuesToInsert);
    }
    revalidatePath("/patient-records");
    // Revalidar inconsistências (criar evolução resolve inconsistência do tipo "no_evolution")
    revalidatePath("/inconsistencies");
    revalidatePath("/api/inconsistencies/count");
  });
