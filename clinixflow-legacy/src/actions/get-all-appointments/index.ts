"use server";

import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
} from "@/src/db/schema";

export const getAllAppointments = actionClient.action(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "master") {
    throw new Error("Forbidden: Apenas usuário master pode acessar");
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
    .orderBy(desc(appointmentsTable.date))
    .limit(500);

  return appointments;
});
