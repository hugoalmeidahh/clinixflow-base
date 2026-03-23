"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";

export async function getPatientUser(patientId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic?.id) {
    throw new Error("Clinic not found");
  }

  const clinicId = session.user.clinic.id;

  // Buscar relação entre patient e user nesta clínica
  const patientToUser = await db.query.patientsToUsersTable.findFirst({
    where: (ptu, { eq, and }) =>
      and(
        eq(ptu.patientId, patientId),
        eq(ptu.clinicId, clinicId)
      ),
    with: {
      user: {
        columns: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!patientToUser?.user) {
    return null;
  }

  return patientToUser.user;
}
