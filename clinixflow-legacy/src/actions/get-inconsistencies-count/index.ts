"use server";

import { and, eq, lt } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";

export async function getInconsistenciesCount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return 0;
  }

  if (!session.user.clinic?.id) {
    return 0;
  }

  // Verificar se o usuário tem permissão para ver inconsistências
  const allowedRoles = [
    "clinic_owner",
    "clinic_admin",
    "clinic_gestor",
    "clinic_recepcionist",
    "doctor",
  ];

  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    return 0;
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
    columns: {
      id: true,
      attended: true,
    },
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

  // Contar inconsistências
  let count = 0;
  for (const appointment of pastAppointments) {
    const hasRecord = recordsMap.has(appointment.id);
    const hasAction =
      appointment.attended === true || appointment.attended === false;

    if (!hasAction) {
      // Agendamento passou e não tem nenhuma ação
      count++;
    } else if (appointment.attended === true && !hasRecord) {
      // Presença confirmada mas sem evolução
      count++;
    }
  }

  return count;
}
