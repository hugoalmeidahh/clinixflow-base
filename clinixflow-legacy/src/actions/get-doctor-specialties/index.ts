"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { doctorSpecialtiesTable } from "@/src/db/schema";

export async function getDoctorSpecialties(doctorId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const specialties = await db.query.doctorSpecialtiesTable.findMany({
    where: eq(doctorSpecialtiesTable.doctorId, doctorId),
    with: {
      specialty: true,
    },
    orderBy: (specialties, { asc }) => [asc(specialties.createdAt)],
  });

  // Retornar com o nome da especialidade (usar specialty.name se disponível, senão specialty.specialty para compatibilidade)
  return specialties.map((s) => ({
    id: s.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    specialty: (s.specialty as any)?.name || s.specialty || "", // Usar nome da tabela specialties se disponível
    classNumberType: s.classNumberType,
    classNumberRegister: s.classNumberRegister,
  }));
}
