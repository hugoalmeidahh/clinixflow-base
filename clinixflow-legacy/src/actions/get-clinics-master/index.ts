"use server";

import { asc } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { clinicsTable } from "@/src/db/schema";

export const getClinicsMaster = actionClient.action(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "master") {
    throw new Error("Forbidden: Apenas usuário master pode acessar");
  }

  const clinics = await db
    .select({
      id: clinicsTable.id,
      name: clinicsTable.name,
    })
    .from(clinicsTable)
    .orderBy(asc(clinicsTable.name));

  return clinics;
});
