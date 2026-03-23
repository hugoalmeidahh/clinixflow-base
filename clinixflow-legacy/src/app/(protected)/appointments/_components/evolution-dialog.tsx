"use client";

import { EvolutionModal } from "@/src/app/(protected)/professional/patient-records/[patientId]/_components/evolution-modal";
import { appointmentsTable } from "@/src/db/schema";

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

interface EvolutionDialogProps {
  appointment: AppointmentWithRelations | null;
  existingRecord?: { id: string } | null;
  clinicId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EvolutionDialog = ({
  appointment,
  existingRecord,
  clinicId,
  open,
  onOpenChange,
  onSuccess,
}: EvolutionDialogProps) => {
  if (!appointment || !appointment.patientId || !appointment.doctorId) {
    return null;
  }

  return (
    <EvolutionModal
      open={open}
      onOpenChange={onOpenChange}
      patientId={appointment.patientId}
      doctorId={appointment.doctorId}
      clinicId={clinicId}
      appointments={[appointment]} // Apenas o agendamento atual quando aberto da tela de agendamento
      selectedAppointment={appointment}
      lockedAppointment={true} // Travado quando aberto da tela de agendamento
      existingRecordId={existingRecord?.id || null}
      onSuccess={onSuccess}
    />
  );
};

export default EvolutionDialog;

