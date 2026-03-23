"use client";

import { cn } from "@/lib/utils";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    sex?: "male" | "female";
  } | null;
  doctor: {
    id: string;
    name: string;
    specialty?: string | null;
  } | null;
};

type PatientRecord = typeof patientRecordsTable.$inferSelect;

interface AppointmentStatusIndicatorProps {
  appointment: AppointmentWithRelations;
  existingRecord?: PatientRecord | null;
  className?: string;
}

// Função para determinar a cor do status
export const getAppointmentStatusColor = (
  appointment: AppointmentWithRelations,
  existingRecord?: PatientRecord | null,
): string => {
  // Verde: evolução preenchida (tem record) - só pode ter evolução se compareceu
  if (existingRecord) {
    return "bg-green-500";
  }

  // Amarelo: presença confirmada mas sem evolução (attended === true mas sem record)
  if (appointment.attended === true && !existingRecord) {
    return "bg-yellow-500";
  }

  // Verificar se é falta (attended === false)
  // IMPORTANTE: Só considerar falta se foi explicitamente marcado como false
  if (appointment.attended === false) {
    // Se tem justificativa, é falta justificada (laranja)
    if (appointment.attendanceJustification) {
      return "bg-orange-500";
    }

    // Falta sem justificativa - sempre vermelho (independente de ser passado ou futuro)
    return "bg-red-500";
  }

  // Se attended é null/undefined (agendamento novo), verificar se já passou
  if (appointment.attended === null || appointment.attended === undefined) {
    // Se já passou e não foi marcado, pode ser falta não registrada
    // Mas por padrão, vamos tratar como agendado normal até ser marcado
    return "bg-blue-500";
  }

  // Padrão: azul - agendado
  return "bg-blue-500";
};

const AppointmentStatusIndicator = ({
  appointment,
  existingRecord,
  className,
}: AppointmentStatusIndicatorProps) => {
  const color = getAppointmentStatusColor(appointment, existingRecord);

  return (
    <div
      className={cn(
        "absolute top-0 right-0 bottom-0 w-1 rounded-r",
        color,
        className,
      )}
    />
  );
};

export default AppointmentStatusIndicator;
