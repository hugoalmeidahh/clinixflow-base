"use server";

import { and, eq, gte, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";

export const deleteAppointment = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
      deleteAllFuture: z.boolean().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, parsedInput.id),
    });
    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }
    if (appointment.clinicId !== session.user.clinic?.id) {
      throw new Error("Agendamento não encontrado");
    }

    // Verificar se o agendamento selecionado tem evolução
    const hasEvolution = await db.query.patientRecordsTable.findFirst({
      where: eq(patientRecordsTable.appointmentId, parsedInput.id),
    });
    if (hasEvolution) {
      throw new Error("Agendamento com evolução não pode ser excluído");
    }

    if (parsedInput.deleteAllFuture) {
      // Buscar todos os agendamentos futuros (incluindo o selecionado) do mesmo paciente/profissional/especialidade
      const conditions = [
        eq(appointmentsTable.clinicId, appointment.clinicId!),
        gte(appointmentsTable.date, new Date()),
      ];
      if (appointment.patientId) {
        conditions.push(eq(appointmentsTable.patientId, appointment.patientId));
      }
      if (appointment.doctorId) {
        conditions.push(eq(appointmentsTable.doctorId, appointment.doctorId));
      }
      if (appointment.doctorSpecialtyId) {
        conditions.push(eq(appointmentsTable.doctorSpecialtyId, appointment.doctorSpecialtyId));
      }

      const appointmentsToDelete = await db.query.appointmentsTable.findMany({
        where: and(...conditions),
        columns: { id: true, date: true },
      });

      const idsToDelete = appointmentsToDelete.map((a) => a.id);

      // Garantir que o appointment original está incluído
      if (!idsToDelete.includes(parsedInput.id)) {
        idsToDelete.push(parsedInput.id);
      }

      // Verificar em batch quais têm evolução
      const recordsWithEvolution = await db.query.patientRecordsTable.findMany({
        where: inArray(patientRecordsTable.appointmentId, idsToDelete),
        columns: { appointmentId: true },
      });

      if (recordsWithEvolution.length > 0) {
        // Filtrar os que não têm evolução
        const idsWithEvolution = new Set(recordsWithEvolution.map((r) => r.appointmentId));
        const safeToDelete = idsToDelete.filter((id) => !idsWithEvolution.has(id));

        if (safeToDelete.length === 0) {
          throw new Error("Todos os agendamentos possuem evolução e não podem ser excluídos");
        }

        // Deletar em batch apenas os que não têm evolução
        await db
          .delete(appointmentsTable)
          .where(inArray(appointmentsTable.id, safeToDelete));
      } else {
        // Nenhum tem evolução, deletar todos em batch
        await db
          .delete(appointmentsTable)
          .where(inArray(appointmentsTable.id, idsToDelete));
      }
    } else {
      // Deletar apenas o agendamento selecionado
      await db
        .delete(appointmentsTable)
        .where(eq(appointmentsTable.id, parsedInput.id));
    }

    revalidatePath("/appointments");
    revalidatePath("/inconsistencies");
    revalidatePath("/api/inconsistencies/count");

    return { success: true };
  });