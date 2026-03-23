"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { patientRecordsTable } from "@/src/db/schema";
import { maskPatientRecordContent } from "@/src/lib/patient-record-utils";

export async function getPatientRecords() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (!session?.user.clinic?.id) {
    throw new Error("Clinic not found");
  }

  const clinicId = session.user.clinic.id;
  const userRole = session.user.role;
  const doctorId = session.user.doctorId;

  // APENAS profissionais (doctor) podem acessar prontuários
  // Admin/Owner NÃO podem acessar (conforme LGPD e código de ética)
  if (userRole !== "doctor" || !doctorId) {
    return [];
  }

  // Buscar apenas pacientes que têm evoluções com este doctor
  const doctorRecords = await db
    .select({ patientId: patientRecordsTable.patientId })
    .from(patientRecordsTable)
    .where(
      and(
        eq(patientRecordsTable.clinicId, clinicId),
        eq(patientRecordsTable.doctorId, doctorId),
      ),
    );

  const patientIdsFilter = [
    ...new Set(
      doctorRecords.map((r) => r.patientId).filter(Boolean) as string[],
    ),
  ];

  // Se não houver pacientes, retornar array vazio
  if (patientIdsFilter.length === 0) {
    return [];
  }

  // Usar os IDs já filtrados (já são únicos)
  const patientIds = patientIdsFilter;

  if (patientIds.length === 0) {
    return [];
  }

  // Buscar informações dos pacientes
  const patients = await db.query.patientsTable.findMany({
    where: (patients, { inArray: inArrayFn, eq: eqFn }) =>
      and(
        eqFn(patients.clinicId, clinicId),
        inArrayFn(patients.id, patientIds),
      ),
    columns: {
      id: true,
      name: true,
      email: true,
      patientRecordNumber: true,
    },
  });

  // Buscar a última evolução de cada paciente para exibir na tabela
  // IMPORTANTE: Apenas evoluções deste profissional
  const records = await Promise.all(
    patients.map(async (patient) => {
      const lastRecord = await db.query.patientRecordsTable.findFirst({
        where: and(
          eq(patientRecordsTable.patientId, patient.id),
          eq(patientRecordsTable.doctorId, doctorId), // Apenas deste profissional
          eq(patientRecordsTable.clinicId, clinicId),
        ),
        with: {
          doctor: {
            columns: {
              id: true,
              name: true,
              specialty: true,
            },
          },
          appointment: {
            columns: {
              id: true,
              date: true,
            },
          },
        },
        orderBy: (records, { desc }) => [desc(records.createdAt)],
      });

      const recordData = {
        id: lastRecord?.id ?? 0,
        patientId: patient.id,
        doctorId: lastRecord?.doctorId ?? null,
        appointmentId: lastRecord?.appointmentId ?? null,
        firstConsultation: lastRecord?.firstConsultation ?? false,
        avaliationContent: lastRecord?.avaliationContent ?? "",
        content: lastRecord?.content ?? "",
        createdAt: lastRecord?.createdAt ?? new Date(),
        updatedAt: lastRecord?.updatedAt ?? null,
        patient: {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          patientRecordNumber: patient.patientRecordNumber,
        },
        doctor: lastRecord?.doctor
          ? {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              id: (lastRecord.doctor as any).id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              name: (lastRecord.doctor as any).name,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              specialty: (lastRecord.doctor as any).specialty,
            }
          : null,
        appointment: lastRecord?.appointment
          ? {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              id: (lastRecord.appointment as any).id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              date: (lastRecord.appointment as any).date,
            }
          : null,
      };

      // Aplicar máscara se não for o profissional responsável
      return maskPatientRecordContent(
        recordData,
        doctorId,
      ) as typeof recordData;
    }),
  );

  // Ordenar por patient_record_number (ascendente)
  const sortedRecords = records.sort((a, b) => {
    const numA = a.patient?.patientRecordNumber ?? 0;
    const numB = b.patient?.patientRecordNumber ?? 0;
    return numA - numB;
  });

  return sortedRecords;
}
