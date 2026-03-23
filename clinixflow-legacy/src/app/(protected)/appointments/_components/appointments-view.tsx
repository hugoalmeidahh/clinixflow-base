"use client";

import { isSameDay } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";
import { doctorsTable, patientsTable } from "@/src/db/schema";

import { AppointmentsDataTable } from "./appointments-data-table";
import CardsView from "./cards-view";
import DailyCalendarView from "./daily-calendar-view";
import { createAppointmentsTableColumns } from "./table-columns";
import WeeklyCalendarView from "./weekly-calendar-view";

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

interface AppointmentsViewProps {
  appointments: AppointmentWithRelations[];
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  patientRecords?: (typeof patientRecordsTable.$inferSelect)[];
  userRole?: string;
  filters?: FilterData;
  onFiltersChange?: (filters: FilterData) => void;
  currentView?: "table" | "daily" | "weekly" | "cards";
  onAttendClick?: (appointment: AppointmentWithRelations) => void;
  onPresenceClick?: (appointment: AppointmentWithRelations) => void;
  onEvolutionClick?: (appointment: AppointmentWithRelations) => void;
  onConfirmationClick?: (appointment: AppointmentWithRelations) => void;
  onEditClick?: (appointment: AppointmentWithRelations) => void;
  onCellClick?: (date: Date, time: string) => void;
}

type FilterData = {
  date?: Date;
  doctorId?: string;
  patientId?: string;
};

const AppointmentsView = ({
  appointments,
  patientRecords = [],
  userRole,
  filters: externalFilters,
  onFiltersChange: externalOnFiltersChange,
  currentView: externalView,
  onAttendClick,
  onPresenceClick,
  onEvolutionClick,
  onConfirmationClick,
  onEditClick,
  onCellClick,
}: AppointmentsViewProps) => {
  const t = useTranslations("appointments");
  const [internalFilters, setInternalFilters] = useState<FilterData>({});

  // Usar filtros externos se fornecidos, caso contrário usar internos
  const filters = externalFilters ?? internalFilters;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _setFilters = externalOnFiltersChange ?? setInternalFilters;
  const currentView = externalView ?? "daily";

  const prevFiltersRef = useRef(filters);

  // Detectar mudanças nos filtros
  useEffect(() => {
    prevFiltersRef.current = filters;
  }, [filters]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Filtro por data
      if (filters.date) {
        const appointmentDate = new Date(appointment.date);
        const filterDate = filters.date;

        if (!isSameDay(appointmentDate, filterDate)) {
          return false;
        }
      }

      // Filtro por médico
      if (filters.doctorId && filters.doctorId !== "") {
        if (appointment.doctorId !== filters.doctorId) {
          return false;
        }
      }

      // Filtro por paciente
      if (filters.patientId && filters.patientId !== "") {
        if (appointment.patientId !== filters.patientId) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, filters]);

  const handleAppointmentClick = () => {
    // Handler para clique em agendamento (pode ser usado no futuro)
  };

  // Criar mapa de appointmentId -> record
  const recordsMap = useMemo(() => {
    const map = new Map<string, typeof patientRecordsTable.$inferSelect>();
    patientRecords.forEach((record) => {
      if (record.appointmentId) {
        map.set(record.appointmentId, record);
      }
    });
    return map;
  }, [patientRecords]);

  return (
    <div className="space-y-6">
      {/* Visualização */}
      {currentView === "table" ? (
        <AppointmentsDataTable
          data={filteredAppointments}
          recordsMap={recordsMap}
          columns={createAppointmentsTableColumns(
            onAttendClick,
            onPresenceClick,
            onEvolutionClick,
            onConfirmationClick,
            onEditClick,
            recordsMap,
            userRole,
            t,
          )}
        />
      ) : currentView === "daily" ? (
        <DailyCalendarView
          appointments={filteredAppointments}
          recordsMap={recordsMap}
          onAppointmentClick={handleAppointmentClick}
          onAttendClick={onAttendClick}
          onPresenceClick={onPresenceClick}
          onEvolutionClick={onEvolutionClick}
          onConfirmationClick={onConfirmationClick}
          onEditClick={onEditClick}
          onCellClick={onCellClick}
        />
      ) : currentView === "weekly" ? (
        <WeeklyCalendarView
          appointments={filteredAppointments}
          recordsMap={recordsMap}
          onAppointmentClick={handleAppointmentClick}
          onAttendClick={onAttendClick}
          onPresenceClick={onPresenceClick}
          onEvolutionClick={onEvolutionClick}
          onConfirmationClick={onConfirmationClick}
          onEditClick={onEditClick}
          onCellClick={onCellClick}
        />
      ) : (
        <CardsView
          appointments={filteredAppointments}
          recordsMap={recordsMap}
          onAttendClick={onAttendClick}
          onPresenceClick={onPresenceClick}
          onEvolutionClick={onEvolutionClick}
          onConfirmationClick={onConfirmationClick}
          onEditClick={onEditClick}
        />
      )}
    </div>
  );
};

export default AppointmentsView;
