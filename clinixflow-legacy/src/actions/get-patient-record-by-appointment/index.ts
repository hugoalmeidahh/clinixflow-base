"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { patientRecordsTable } from "@/src/db/schema";
import { maskPatientRecordContent } from "@/src/lib/patient-record-utils";

export const getPatientRecordByAppointment = actionClient
  .schema(z.object({ appointmentId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Não autorizado");
    }

    // APENAS profissionais (doctor) podem acessar prontuários
    if (session.user.role !== "doctor" || !session.user.doctorId) {
      return null;
    }

    // Buscar evolução (pode ser de qualquer profissional, mas vamos mascarar se não for o responsável)
    const record = await db.query.patientRecordsTable.findFirst({
      where: eq(patientRecordsTable.appointmentId, parsedInput.appointmentId),
    });

    if (!record) {
      return null;
    }

    // Aplicar máscara se não for o profissional responsável
    return maskPatientRecordContent(record, session.user.doctorId);
  });

