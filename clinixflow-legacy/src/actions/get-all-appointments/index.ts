"use server";

import { and, desc, eq, gte, lt, SQL } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
} from "@/src/db/schema";

export const getAllAppointments = actionClient
  .schema(
    z.object({
      clinicId: z.string().uuid(),
      month: z.number().min(1).max(12),
      year: z.number().min(2020).max(2100),
      patientId: z.string().uuid().optional(),
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

    const start = new Date(parsedInput.year, parsedInput.month - 1, 1);
    const end = new Date(parsedInput.year, parsedInput.month, 1);

    const conditions: SQL[] = [
      eq(appointmentsTable.clinicId, parsedInput.clinicId),
      gte(appointmentsTable.date, start),
      lt(appointmentsTable.date, end),
    ];

    if (parsedInput.patientId) {
      conditions.push(eq(appointmentsTable.patientId, parsedInput.patientId));
    }

    const appointments = await db
      .select({
        id: appointmentsTable.id,
        date: appointmentsTable.date,
        durationInMinutes: appointmentsTable.durationInMinutes,
        confirmed: appointmentsTable.confirmed,
        attended: appointmentsTable.attended,
        appointmentPriceInCents: appointmentsTable.appointmentPriceInCents,
        reposicao: appointmentsTable.reposicao,
        atendimentoAvaliacao: appointmentsTable.atendimentoAvaliacao,
        guideNumber: appointmentsTable.guideNumber,
        createdAt: appointmentsTable.createdAt,
        patientName: patientsTable.name,
        doctorName: doctorsTable.name,
        clinicName: clinicsTable.name,
      })
      .from(appointmentsTable)
      .leftJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .leftJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .leftJoin(clinicsTable, eq(appointmentsTable.clinicId, clinicsTable.id))
      .where(and(...conditions))
      .orderBy(desc(appointmentsTable.date));

    return appointments;
  });
