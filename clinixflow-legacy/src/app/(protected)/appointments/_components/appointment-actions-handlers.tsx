"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { getPatientRecordByAppointment } from "@/src/actions/get-patient-record-by-appointment";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";

import ConfirmationDialog from "./confirmation-dialog";
import EditAppointmentForm from "./edit-appointment-form";
import EvolutionDialog from "./evolution-dialog";
import PresenceDialog from "./presence-dialog";

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

// Hook para gerenciar os handlers e dialogs
export const useAppointmentActions = () => {
  const t = useTranslations("appointments");
  const router = useRouter();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [presenceDialogOpen, setPresenceDialogOpen] = useState(false);
  const [evolutionDialogOpen, setEvolutionDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithRelations | null>(null);
  const [existingRecord, setExistingRecord] = useState<PatientRecord | null>(null);

  const getRecordAction = useAction(getPatientRecordByAppointment, {
    onSuccess: ({ data }) => {
      setExistingRecord(data ?? null);
    },
    onError: () => {
      setExistingRecord(null);
    },
  });

  const handleAttendClick = (appointment: AppointmentWithRelations) => {
    // Navegar para a tela de prontuário do paciente
    // Para owners, usar a rota geral; para doctors, usar a rota profissional
    if (appointment.patientId) {
      // Por enquanto, sempre usar a rota profissional (será ajustada pela página se necessário)
      router.push(`/professional/patient-records/${appointment.patientId}?appointmentId=${appointment.id}`);
    }
  };

  const handlePresenceClick = (appointment: AppointmentWithRelations) => {
    setSelectedAppointment(appointment);
    setPresenceDialogOpen(true);
  };

  const handleEvolutionClick = (appointment: AppointmentWithRelations) => {
    // Validar se o paciente compareceu - evolução só pode ser feita se attended === true
    if (appointment.attended !== true) {
      toast.error(t("errorNoEvolutionForNoShow"));
      return;
    }

    setSelectedAppointment(appointment);
    setExistingRecord(null); // Reset antes de buscar
    // Buscar registro existente para este agendamento
    if (appointment.id) {
      getRecordAction.execute({ appointmentId: appointment.id });
    }
    setEvolutionDialogOpen(true);
  };

  const handleConfirmationClick = (appointment: AppointmentWithRelations) => {
    setSelectedAppointment(appointment);
    setConfirmationDialogOpen(true);
  };

  const handleEditClick = (appointment: AppointmentWithRelations) => {
    setSelectedAppointment(appointment);
    setEditDialogOpen(true);
  };

  const handleSuccess = () => {
    router.refresh();
  };

  return {
    handleAttendClick,
    handlePresenceClick,
    handleEvolutionClick,
    handleConfirmationClick,
    handleEditClick,
    confirmationDialogOpen,
    setConfirmationDialogOpen,
    presenceDialogOpen,
    setPresenceDialogOpen,
    evolutionDialogOpen,
    setEvolutionDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedAppointment,
    existingRecord,
    handleSuccess,
  };
};

// Componente wrapper para os dialogs
export const AppointmentActionsDialogs = ({
  confirmationDialogOpen,
  setConfirmationDialogOpen,
  presenceDialogOpen,
  setPresenceDialogOpen,
  evolutionDialogOpen,
  setEvolutionDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  selectedAppointment,
  existingRecord,
  clinicId,
  doctors,
  onSuccess,
}: {
  confirmationDialogOpen: boolean;
  setConfirmationDialogOpen: (open: boolean) => void;
  presenceDialogOpen: boolean;
  setPresenceDialogOpen: (open: boolean) => void;
  evolutionDialogOpen: boolean;
  setEvolutionDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  selectedAppointment: AppointmentWithRelations | null;
  existingRecord: PatientRecord | null;
  clinicId: string;
  doctors: (typeof import("@/src/db/schema").doctorsTable.$inferSelect)[];
  onSuccess: () => void;
}) => {
  return (
    <>
      <ConfirmationDialog
        appointment={selectedAppointment}
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
        onSuccess={onSuccess}
      />
      <PresenceDialog
        appointment={selectedAppointment}
        open={presenceDialogOpen}
        onOpenChange={setPresenceDialogOpen}
        onSuccess={onSuccess}
      />
      <EvolutionDialog
        appointment={selectedAppointment}
        existingRecord={
          existingRecord
            ? { id: String(existingRecord.id) }
            : null
        }
        clinicId={clinicId}
        open={evolutionDialogOpen}
        onOpenChange={setEvolutionDialogOpen}
        onSuccess={onSuccess}
      />
      <EditAppointmentForm
        appointment={selectedAppointment}
        doctors={doctors}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={onSuccess}
      />
    </>
  );
};

