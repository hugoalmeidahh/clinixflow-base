"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { specialtiesTable } from "@/src/db/schema";

export async function getSpecialties(activeOnly = true) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const specialties = await db.query.specialtiesTable.findMany({
    where: activeOnly ? eq(specialtiesTable.isActive, true) : undefined,
    orderBy: (specialties, { asc }) => [asc(specialties.name)],
  });

  return specialties;
}
