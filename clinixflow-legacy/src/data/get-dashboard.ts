import dayjs from "dayjs";
import { and, count, desc, eq, gte, isNotNull, lte, sql, sum } from "drizzle-orm";

import { db } from "../db";
import { appointmentsTable, doctorsTable, insurancesTable, patientRecordsTable, patientsTable } from "../db/schema";



interface Params {
  from: string;
  to: string;
  session: {
    user: {
      clinic: {
        id: string;
      };
    };
  };
}

export const getDashboard = async ({ from, to, session }: Params) => {
  const chartStartDate = dayjs(from).startOf("day").toDate();
  const chartEndDate = dayjs(to).endOf("day").toDate();
  
  // Buscar IDs de agendamentos que têm evolução (para calcular faturamento atendido)
  const appointmentsWithRecords = await db
    .select({ appointmentId: patientRecordsTable.appointmentId })
    .from(patientRecordsTable)
    .where(
      and(
        eq(patientRecordsTable.clinicId, session.user.clinic.id),
        isNotNull(patientRecordsTable.appointmentId),
      ),
    );
  
  const appointmentIdsWithRecords = new Set(
    appointmentsWithRecords.map((r) => r.appointmentId).filter(Boolean)
  );

  const [
    [totalRevenueScheduled],
    [totalAppointments],
    [totalAttended],
    [totalNoShow],
    [totalPatients],
    [totalDoctors],
    topDoctors,
    topSpecialties,
    allAppointmentsForRevenue,
    dailyAppointmentsData,
    [appointmentsToday],
    [confirmedAppointments],
    [pendingAppointments],
    appointmentsByInsurance,
  ] = await Promise.all([
    // Faturamento agendado (total de todos os agendamentos)
    db
      .select({
        total: sum(appointmentsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    // Total de agendamentos
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    // Atendimentos realizados (attended = true)
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
          eq(appointmentsTable.attended, true),
        ),
      ),
    // Faltas (attended = false)
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
          eq(appointmentsTable.attended, false),
        ),
      ),
    // Total de pacientes
    db
      .select({
        total: count(),
      })
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, session.user.clinic.id)),
    // Total de profissionais
    db
      .select({
        total: count(),
      })
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
    // Top profissionais
    db
      .select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        avatarImageUrl: doctorsTable.avatarImageUrl,
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(appointmentsTable.doctorId, doctorsTable.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .where(eq(doctorsTable.clinicId, session.user.clinic.id))
      .groupBy(doctorsTable.id)
      .orderBy(desc(count(appointmentsTable.id)))
      .limit(10),
    // Top especialidades
    db
      .select({
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
          isNotNull(doctorsTable.specialty),
        ),
      )
      .groupBy(doctorsTable.specialty)
      .orderBy(desc(count(appointmentsTable.id))),
    // Buscar agendamentos para calcular faturamento atendido
    db
      .select({
        id: appointmentsTable.id,
        appointmentPriceInCents: appointmentsTable.appointmentPriceInCents,
        attended: appointmentsTable.attended,
        attendanceJustification: appointmentsTable.attendanceJustification,
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    // Dados diários para o gráfico (agendados, atendidos, faltas)
    db
      .select({
        date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
        scheduled: count(appointmentsTable.id),
        scheduledRevenue:
          sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
            "scheduledRevenue",
          ),
        attended:
          sql<number>`COUNT(CASE WHEN ${appointmentsTable.attended} = true THEN 1 END)`.as(
            "attended",
          ),
        attendedRevenue:
          sql<number>`COALESCE(SUM(CASE WHEN ${appointmentsTable.attended} = true THEN ${appointmentsTable.appointmentPriceInCents} ELSE 0 END), 0)`.as(
            "attendedRevenue",
          ),
        noShow:
          sql<number>`COUNT(CASE WHEN ${appointmentsTable.attended} = false THEN 1 END)`.as(
            "noShow",
          ),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, chartStartDate),
          lte(appointmentsTable.date, chartEndDate),
        ),
      )
      .groupBy(sql`DATE(${appointmentsTable.date})`)
      .orderBy(sql`DATE(${appointmentsTable.date})`),
    // Consultas Hoje
    db
      .select({ total: count() })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, dayjs().startOf("day").toDate()),
          lte(appointmentsTable.date, dayjs().endOf("day").toDate()),
        ),
      ),
    // Confirmadas (confirmed = true, data >= hoje)
    db
      .select({ total: count() })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          eq(appointmentsTable.confirmed, true),
          gte(appointmentsTable.date, dayjs().startOf("day").toDate()),
        ),
      ),
    // Pendentes (confirmed = false, data >= hoje)
    db
      .select({ total: count() })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          eq(appointmentsTable.confirmed, false),
          gte(appointmentsTable.date, dayjs().startOf("day").toDate()),
        ),
      ),
    // Agendamentos por convênio (mês atual)
    db
      .select({
        insuranceName: insurancesTable.displayName,
        total: count(appointmentsTable.id),
      })
      .from(appointmentsTable)
      .innerJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .leftJoin(insurancesTable, eq(patientsTable.insuranceId, insurancesTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, dayjs().startOf("month").toDate()),
          lte(appointmentsTable.date, dayjs().endOf("month").toDate()),
        ),
      )
      .groupBy(insurancesTable.displayName)
      .orderBy(desc(count(appointmentsTable.id))),
  ]);

  // Calcular faturamento atendido:
  // - Presença (attended = true) COM evolução
  // - Falta justificada (attended = false COM attendanceJustification)
  let totalRevenueAttendedValue = 0;
  for (const apt of allAppointmentsForRevenue) {
    const hasRecord = appointmentIdsWithRecords.has(apt.id);
    const isAttendedWithRecord = apt.attended === true && hasRecord;
    const isJustifiedNoShow = apt.attended === false && apt.attendanceJustification;
    
    if (isAttendedWithRecord || isJustifiedNoShow) {
      totalRevenueAttendedValue += apt.appointmentPriceInCents || 0;
    }
  }

  return {
    totalRevenueScheduled,
    totalRevenueAttended: { total: totalRevenueAttendedValue },
    totalAppointments,
    totalAttended,
    totalNoShow,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    dailyAppointmentsData,
    appointmentsToday,
    confirmedAppointments,
    pendingAppointments,
    appointmentsByInsurance,
  };
};