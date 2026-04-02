"use server";

import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { clinicsTable, patientsTable } from "@/src/db/schema";

export const getAllPatients = actionClient
  .schema(
    z.object({
      clinicId: z.string().uuid(),
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
      throw new Error("Forbidden: Apenas usuário master pode acessar");
    }

    const patients = await db
      .select({
        id: patientsTable.id,
        patientCode: patientsTable.patientCode,
        name: patientsTable.name,
        email: patientsTable.email,
        phoneNumber: patientsTable.phoneNumber,
        cpf: patientsTable.cpf,
        birthDate: patientsTable.birthDate,
        sex: patientsTable.sex,
        isActive: patientsTable.isActive,
        createdAt: patientsTable.createdAt,
        clinicId: patientsTable.clinicId,
        clinicName: clinicsTable.name,
      })
      .from(patientsTable)
      .leftJoin(clinicsTable, eq(patientsTable.clinicId, clinicsTable.id))
      .where(eq(patientsTable.clinicId, parsedInput.clinicId))
      .orderBy(asc(patientsTable.name));

    return patients;
  });
