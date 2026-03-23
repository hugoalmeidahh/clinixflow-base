"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import {
  doctorsTable,
  patientRecordsTable,
  patientsTable,
} from "@/src/db/schema";
import { appointmentsTable } from "@/src/db/schema";

import AppointmentsView from "./appointments-view";
import FilterButton from "./filter-button";
import ViewToggle from "./view-toggle";

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

type FilterData = {
  date?: Date;
  doctorId?: string;
  patientId?: string;
};

type ViewType = "table" | "daily" | "weekly" | "cards";

interface AppointmentsFiltersContextType {
  filters: FilterData;
  setFilters: (filters: FilterData) => void;
  view: ViewType;
  setView: (view: ViewType) => void;
}

const AppointmentsFiltersContext = createContext<
  AppointmentsFiltersContextType | undefined
>(undefined);

export const useAppointmentsFilters = () => {
  const context = useContext(AppointmentsFiltersContext);
  if (!context) {
    throw new Error(
      "useAppointmentsFilters must be used within AppointmentsFiltersProvider",
    );
  }
  return context;
};

interface AppointmentsFiltersProviderProps {
  children: ReactNode;
}

export const AppointmentsFiltersProvider = ({
  children,
}: AppointmentsFiltersProviderProps) => {
  const [filters, setFilters] = useState<FilterData>({});
  const [view, setView] = useState<ViewType>("daily");

  return (
    <AppointmentsFiltersContext.Provider
      value={{ filters, setFilters, view, setView }}
    >
      {children}
    </AppointmentsFiltersContext.Provider>
  );
};

interface AppointmentsFiltersWrapperProps {
  appointments: AppointmentWithRelations[];
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

// Componente para renderizar apenas o botão de filtro (usado no header)
export const FilterButtonWrapper = ({
  patients,
  doctors,
  hideDoctorFilter = false,
}: {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  hideDoctorFilter?: boolean;
}) => {
  const { filters, setFilters } = useAppointmentsFilters();

  return (
    <FilterButton
      patients={patients}
      doctors={doctors}
      onFiltersChange={setFilters}
      initialFilters={filters}
      hideDoctorFilter={hideDoctorFilter}
    />
  );
};

// Componente para renderizar o toggle de visualização (usado no header)
export const ViewToggleWrapper = () => {
  const { view, setView } = useAppointmentsFilters();

  return <ViewToggle currentView={view} onViewChange={setView} />;
};

// Componente para renderizar apenas a view (usado no content)
export const AppointmentsViewWrapper = ({
  appointments,
  patients,
  doctors,
  patientRecords = [],
  userRole,
  onAttendClick,
  onPresenceClick,
  onEvolutionClick,
  onConfirmationClick,
  onEditClick,
  onCellClick,
}: AppointmentsFiltersWrapperProps & {
  patientRecords?: (typeof patientRecordsTable.$inferSelect)[];
  userRole?: string;
  onAttendClick?: (appointment: AppointmentWithRelations) => void;
  onPresenceClick?: (appointment: AppointmentWithRelations) => void;
  onEvolutionClick?: (appointment: AppointmentWithRelations) => void;
  onConfirmationClick?: (appointment: AppointmentWithRelations) => void;
  onEditClick?: (appointment: AppointmentWithRelations) => void;
  onCellClick?: (date: Date, time: string) => void;
}) => {
  const { filters, setFilters, view } = useAppointmentsFilters();

  return (
    <AppointmentsView
      appointments={appointments}
      patients={patients}
      doctors={doctors}
      patientRecords={patientRecords}
      userRole={userRole}
      filters={filters}
      onFiltersChange={setFilters}
      currentView={view}
      onAttendClick={onAttendClick}
      onPresenceClick={onPresenceClick}
      onEvolutionClick={onEvolutionClick}
      onConfirmationClick={onConfirmationClick}
      onEditClick={onEditClick}
      onCellClick={onCellClick}
    />
  );
};

const AppointmentsFiltersWrapper = ({
  appointments,
  patients,
  doctors,
}: AppointmentsFiltersWrapperProps) => {
  return (
    <AppointmentsFiltersProvider>
      <AppointmentsViewWrapper
        appointments={appointments}
        patients={patients}
        doctors={doctors}
      />
    </AppointmentsFiltersProvider>
  );
};

export default AppointmentsFiltersWrapper;
