"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";

export async function getDoctorUser(doctorId: string) {
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

  // Buscar relação entre doctor e user nesta clínica
  const doctorToUser = await db.query.doctorsToUsersTable.findFirst({
    where: (dtu, { eq, and }) =>
      and(
        eq(dtu.doctorId, doctorId),
        eq(dtu.clinicId, clinicId)
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

  if (!doctorToUser?.user) {
    return null;
  }

  return doctorToUser.user;
}
