import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageContainer, PageContent } from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import {
  appointmentsTable,
  patientRecordsTable,
  patientsTable,
} from "@/src/db/schema";
import { maskPatientRecordsContent } from "@/src/lib/patient-record-utils";

import { PatientRecordPageClient } from "./_components/patient-record-page-client";

export const metadata: Metadata = {
  title: "Prontuário do Paciente",
  description: "Dados e evoluções do paciente",
};

interface PatientRecordPageProps {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ appointmentId?: string; recordId?: string }>;
}

const PatientRecordPage = async ({
  params,
  searchParams,
}: PatientRecordPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Permitir acesso para doctors e owners
  const isDoctor = session.user.role === "doctor";
  const isOwner = session.user.role === "clinic_owner";

  if (!isDoctor && !isOwner) {
    redirect("/dashboard");
  }

  if (!session.user.clinic?.id) {
    redirect("/authentication");
  }

  // Doctor precisa ter doctorId, owner não
  if (isDoctor && !session.user.doctorId) {
    redirect("/professional/dashboard");
  }

  const { patientId } = await params;
  const { appointmentId, recordId } = await searchParams;

  const clinicId = session.user.clinic.id;
  const doctorId = session.user.doctorId; // Pode ser undefined para owner

  // Buscar dados do paciente
  const patient = await db.query.patientsTable.findFirst({
    where: and(
      eq(patientsTable.id, patientId),
      eq(patientsTable.clinicId, clinicId),
    ),
  });

  if (!patient) {
    redirect("/professional/patient-records");
  }

  // Buscar TODAS as evoluções do paciente
  // O conteúdo será mascarado no backend se não for do profissional responsável
  const recordsRaw = await db.query.patientRecordsTable.findMany({
    where: and(
      eq(patientRecordsTable.patientId, patientId),
      eq(patientRecordsTable.clinicId, clinicId),
    ),
    with: {
      appointment: {
        columns: {
          id: true,
          date: true,
        },
      },
      doctor: {
        columns: {
          id: true,
          name: true,
          specialty: true,
        },
      },
    },
    orderBy: (records, { desc }) => [desc(records.createdAt)],
  });

  // Aplicar máscara nas evoluções apenas para doctors
  // Owners podem ver todas as evoluções sem máscara
  const records =
    isDoctor && doctorId
      ? maskPatientRecordsContent(recordsRaw, doctorId)
      : recordsRaw;

  // Buscar agendamentos do paciente com presença confirmada (para seleção no modal)
  const patientAppointmentsWhere =
    isDoctor && doctorId
      ? and(
          eq(appointmentsTable.patientId, patientId),
          eq(appointmentsTable.doctorId, doctorId),
          eq(appointmentsTable.clinicId, clinicId),
          eq(appointmentsTable.attended, true), // Apenas com presença confirmada
        )
      : and(
          eq(appointmentsTable.patientId, patientId),
          eq(appointmentsTable.clinicId, clinicId),
          eq(appointmentsTable.attended, true), // Apenas com presença confirmada
        );

  const patientAppointments = await db.query.appointmentsTable.findMany({
    where: patientAppointmentsWhere,
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
    },
    orderBy: (appointments, { desc }) => [desc(appointments.date)],
  });

  return (
    <PageContainer>
      <PageContent>
        <PatientRecordPageClient
          patient={{
            ...patient,
            birthDate: new Date(patient.birthDate),
            patientRecordNumber: patient.patientRecordNumber
              ? String(patient.patientRecordNumber)
              : null,
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          records={records as any}
          appointments={patientAppointments}
          doctorId={doctorId}
          clinicId={clinicId}
          selectedAppointmentId={appointmentId || null}
          selectedRecordId={recordId || null}
        />
      </PageContent>
    </PageContainer>
  );
};

export default PatientRecordPage;
