"use server";

import { and, eq, lt } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";

export async function getInconsistencies() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  if (!session.user.clinic?.id) {
    throw new Error("Clínica não encontrada");
  }

  const clinicId = session.user.clinic.id;
  const now = new Date();
  const userRole = session.user.role;
  const doctorId = session.user.doctorId;

  // Calcular 1 hora atrás para dar tempo de registrar após o atendimento
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);

  // Base query - agendamentos que passaram há mais de 1 hora
  const baseWhere = and(
    eq(appointmentsTable.clinicId, clinicId),
    lt(appointmentsTable.date, oneHourAgo),
  );

  // Se for profissional, filtrar apenas seus agendamentos
  const whereClause =
    userRole === "doctor" && doctorId
      ? and(baseWhere, eq(appointmentsTable.doctorId, doctorId))
      : baseWhere;

  // Buscar agendamentos que já passaram
  const pastAppointments = await db.query.appointmentsTable.findMany({
    where: whereClause,
    with: {
      patient: {
        columns: {
          id: true,
          name: true,
        },
      },
      doctor: {
        columns: {
          id: true,
          name: true,
        },
      },
      doctorSpecialty: {
        with: {
          specialty: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: (appointments, { desc }) => [desc(appointments.date)],
  });

  // Buscar todos os records para verificar quais agendamentos têm evolução
  // Se for profissional, filtrar apenas seus records
  const recordsWhere = userRole === "doctor" && doctorId
    ? and(
        eq(patientRecordsTable.clinicId, clinicId),
        eq(patientRecordsTable.doctorId, doctorId),
      )
    : eq(patientRecordsTable.clinicId, clinicId);

  const allRecords = await db.query.patientRecordsTable.findMany({
    where: recordsWhere,
    columns: {
      appointmentId: true,
    },
  });

  const recordsMap = new Set(allRecords.map((r) => r.appointmentId).filter(Boolean));

  // Filtrar inconsistências
  const inconsistencies = pastAppointments
    .map((appointment) => {
      const hasRecord = recordsMap.has(appointment.id);
      const hasAction =
        appointment.attended === true || appointment.attended === false;

      // Tipo de inconsistência
      let type: "no_action" | "no_evolution" | null = null;
      let description = "";

      if (!hasAction) {
        // Agendamento passou e não tem nenhuma ação (falta, presença)
        type = "no_action";
        description = "Agendamento passou sem nenhuma ação registrada";
      } else if (appointment.attended === true && !hasRecord) {
        // Presença confirmada mas sem evolução
        type = "no_evolution";
        description = "Paciente compareceu mas não há evolução preenchida";
      }

      if (!type) {
        return null;
      }

      return {
        appointment,
        type,
        description,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return inconsistencies;
}
