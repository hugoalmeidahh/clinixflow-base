"use client";

import { useState } from "react";

import { Sheet } from "@/components/ui/sheet";
import {
  doctorsTable,
  patientRecordsTable,
  patientsTable,
} from "@/src/db/schema";
import { appointmentsTable } from "@/src/db/schema";

import AddAppointmentForm from "./add-appointment-form";
import {
  AppointmentActionsDialogs,
  useAppointmentActions,
} from "./appointment-actions-handlers";
import { AppointmentsViewWrapper } from "./appointments-filters-wrapper";

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

interface AppointmentsActionsProviderProps {
  appointments: AppointmentWithRelations[];
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  patientRecords?: (typeof patientRecordsTable.$inferSelect)[];
  userRole: string;
  clinicId: string;
}

const AppointmentsActionsProvider = ({
  appointments,
  patients,
  doctors,
  patientRecords = [],
  userRole,
  clinicId,
}: AppointmentsActionsProviderProps) => {
  const {
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
  } = useAppointmentActions();

  // Estado para o modal de adicionar agendamento via clique no calendário
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<Date | undefined>();
  const [initialTime, setInitialTime] = useState<string | undefined>();

  const handleCellClick = (date: Date, time: string) => {
    setInitialDate(date);
    setInitialTime(time);
    setAddDialogOpen(true);
  };

  return (
    <>
      <AppointmentsViewWrapper
        appointments={appointments}
        patients={patients}
        doctors={doctors}
        patientRecords={patientRecords}
        userRole={userRole}
        onAttendClick={handleAttendClick}
        onPresenceClick={handlePresenceClick}
        onEvolutionClick={handleEvolutionClick}
        onConfirmationClick={handleConfirmationClick}
        onEditClick={handleEditClick}
        onCellClick={handleCellClick}
      />
      <AppointmentActionsDialogs
        confirmationDialogOpen={confirmationDialogOpen}
        setConfirmationDialogOpen={setConfirmationDialogOpen}
        presenceDialogOpen={presenceDialogOpen}
        setPresenceDialogOpen={setPresenceDialogOpen}
        evolutionDialogOpen={evolutionDialogOpen}
        setEvolutionDialogOpen={setEvolutionDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        selectedAppointment={selectedAppointment}
        existingRecord={existingRecord}
        clinicId={clinicId}
        doctors={doctors}
        onSuccess={handleSuccess}
      />
      {/* Sheet de adicionar agendamento via clique no calendário */}
      <Sheet open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <AddAppointmentForm
          isOpen={addDialogOpen}
          patients={patients}
          doctors={doctors}
          initialDate={initialDate}
          initialTime={initialTime}
          onSuccess={() => setAddDialogOpen(false)}
        />
      </Sheet>
    </>
  );
};

export default AppointmentsActionsProvider;
