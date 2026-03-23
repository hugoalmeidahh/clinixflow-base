"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { doctorAvailabilityTable } from "@/src/db/schema";

export async function getDoctorAvailability(doctorId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const availability = await db.query.doctorAvailabilityTable.findMany({
    where: eq(doctorAvailabilityTable.doctorId, doctorId),
    orderBy: (availability, { asc }) => [asc(availability.dayOfWeek)],
  });

  return availability;
}
