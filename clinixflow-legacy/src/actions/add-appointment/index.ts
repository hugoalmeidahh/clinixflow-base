"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";
import { createLocalDateTime, extractDateOnly } from "@/src/lib/date-utils";

import { getAvailableTimes } from "../get-available-times";
import { addAppointmentSchema } from "./schema";

export const addAppointment = actionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }
    
    // Extrair apenas a data (YYYY-MM-DD) sem considerar timezone
    const dateString = extractDateOnly(parsedInput.date);
    
    const availableTimes = await getAvailableTimes({
      doctorId: parsedInput.doctorId,
      date: dateString,
    });
    if (!availableTimes?.data) {
      throw new Error("No available times");
    }
    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );
    if (!isTimeAvailable) {
      throw new Error("Time not available");
    }
    
    // Criar data/hora no timezone local e converter para UTC
    const appointmentDateTime = createLocalDateTime(dateString, parsedInput.time);

    await db.insert(appointmentsTable).values({
      ...parsedInput,
      clinicId: session?.user.clinic?.id,
      date: appointmentDateTime,
      durationInMinutes: parsedInput.durationInMinutes || 30,
      createdBy: session.user.id,
    });

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
    // Revalidar inconsistências (novo agendamento pode gerar inconsistência quando passar)
    revalidatePath("/inconsistencies");
    revalidatePath("/api/inconsistencies/count");
  });
