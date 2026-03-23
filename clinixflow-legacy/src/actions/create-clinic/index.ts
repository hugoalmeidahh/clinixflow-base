"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { clinicsTable, usersToClinicsTable } from "@/src/db/schema";
import { generateClinicCode } from "@/src/lib/codes";

interface ClinicProps {
  name: string;
  address: string;
  phone: string;
  email: string;
  cnpj: string;
}

export const createClinic = async ({
  name,
  address,
  phone,
  email,
  cnpj,
}: ClinicProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }
  // Gerar código único para a clínica
  let clinicCode = generateClinicCode();
  let attempts = 0;
  const maxAttempts = 10;

  // Verificar se o código já existe (tentativa de evitar duplicatas)
  while (attempts < maxAttempts) {
    const existing = await db.query.clinicsTable.findFirst({
      where: (clinics, { eq }) => eq(clinics.clinicCode, clinicCode),
    });

    if (!existing) {
      break; // Código único encontrado
    }

    clinicCode = generateClinicCode();
    attempts++;
  }

  const [clinic] = await db
    .insert(clinicsTable)
    .values({ 
      name, 
      address, 
      phone, 
      email, 
      cnpj, 
      clinicCode,
      createdBy: session.user.id,
    })
    .returning();
  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });
  redirect("/dashboard");
};
