"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";
import { createLocalDateTime, extractDateOnly } from "@/src/lib/date-utils";

import { getAvailableTimes } from "../get-available-times";
import { addMultipleAppointmentsSchema } from "./schema";

export const addMultipleAppointments = actionClient
  .schema(addMultipleAppointmentsSchema)
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

    const createdAppointments = [];
    const errors = [];

    for (const appointment of parsedInput.appointments) {
      try {
        // Extrair apenas a data (YYYY-MM-DD) sem considerar timezone
        const dateString = extractDateOnly(appointment.date);
        
        const availableTimes = await getAvailableTimes({
          doctorId: appointment.doctorId,
          date: dateString,
        });
        
        if (!availableTimes?.data) {
          errors.push({
            date: dateString,
            error: "No available times",
          });
          continue;
        }
        
        const isTimeAvailable = availableTimes.data?.some(
          (time) => time.value === appointment.time && time.available,
        );
        
        if (!isTimeAvailable) {
          errors.push({
            date: dateString,
            error: "Time not available",
          });
          continue;
        }
        
        // Criar data/hora no timezone local e converter para UTC
        const appointmentDateTime = createLocalDateTime(dateString, appointment.time);

        const result = await db.insert(appointmentsTable).values({
          ...appointment,
          clinicId: session?.user.clinic?.id,
          date: appointmentDateTime,
          durationInMinutes: appointment.durationInMinutes || 30,
          createdBy: session.user.id,
        }).returning({ id: appointmentsTable.id });

        createdAppointments.push(result[0]?.id);
      } catch (error) {
        errors.push({
          date: extractDateOnly(appointment.date),
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
    revalidatePath("/inconsistencies");
    revalidatePath("/api/inconsistencies/count");

    return {
      success: createdAppointments.length > 0,
      createdCount: createdAppointments.length,
      totalCount: parsedInput.appointments.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  });
