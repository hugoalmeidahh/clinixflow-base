import { and, eq, inArray } from "drizzle-orm";

import { DataTable } from "@/components/ui/data-table";
import { db } from "@/src/db";
import { patientRecordsTable } from "@/src/db/schema";
import { maskPatientRecordsContent } from "@/src/lib/patient-record-utils";

import { PatientRecordsTableColumns } from "../../../patient-records/_components/table-columns";

export async function ProfessionalPatientRecordsTable({
  doctorId,
  patientIds,
}: {
  doctorId: string;
  patientIds: string[];
}) {
  if (patientIds.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          Nenhum prontuário encontrado para os pacientes atendidos.
        </p>
      </div>
    );
  }

  const recordsRaw = await db.query.patientRecordsTable.findMany({
    where: and(
      inArray(patientRecordsTable.patientId, patientIds),
      eq(patientRecordsTable.doctorId, doctorId),
    ),
    with: {
      patient: true,
      doctor: true,
      appointment: true,
    },
    orderBy: (records, { desc }) => [desc(records.createdAt)],
  });

  if (recordsRaw.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          Nenhum prontuário encontrado. Crie prontuários para os pacientes que
          você atendeu.
        </p>
      </div>
    );
  }

  // Aplicar máscara nas evoluções (caso haja alguma que não seja do profissional)
  const records = maskPatientRecordsContent(recordsRaw, doctorId);

  // Transformar os dados para o formato esperado pela tabela
  const formattedRecords = records.map((record) => ({
    id: record.id,
    patientId: record.patientId,
    doctorId: record.doctorId,
    appointmentId: record.appointmentId,
    firstConsultation: record.firstConsultation,
    avaliationContent: record.avaliationContent,
    content: record.content,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    patient: record.patient
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (record.patient as any).id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: (record.patient as any).name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          email: (record.patient as any).email,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          patientRecordNumber: (record.patient as any).patientRecordNumber,
        }
      : null,
    doctor: record.doctor
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (record.doctor as any).id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: (record.doctor as any).name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          specialty: (record.doctor as any).specialty,
        }
      : null,
    appointment: record.appointment
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (record.appointment as any).id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          date: (record.appointment as any).date,
        }
      : null,
  }));

  return (
    <div className="space-y-4">
      <DataTable columns={PatientRecordsTableColumns} data={formattedRecords} />
    </div>
  );
}
