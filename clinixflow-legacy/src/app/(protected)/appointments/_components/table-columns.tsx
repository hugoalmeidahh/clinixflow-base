"use client";

import { ColumnDef } from "@tanstack/react-table";

import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";
import { formatLocalDateTime } from "@/src/lib/date-utils";
import { canViewAppointmentPrice } from "@/src/lib/permissions";

import AppointmentStatusIndicator from "./appointment-status-indicator";
import AppointmentsTableActions from "./table-actions";

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

export const createAppointmentsTableColumns = (
  onAttendClick?: (appointment: AppointmentWithRelations) => void,
  onPresenceClick?: (appointment: AppointmentWithRelations) => void,
  onEvolutionClick?: (appointment: AppointmentWithRelations) => void,
  onConfirmationClick?: (appointment: AppointmentWithRelations) => void,
  onEditClick?: (appointment: AppointmentWithRelations) => void,
  recordsMap?: Map<string, typeof patientRecordsTable.$inferSelect>,
  userRole?: string,
  t?: (key: string) => string,
): ColumnDef<AppointmentWithRelations>[] => {
  // Verificar se o usuário pode ver o valor da consulta
  const shouldHidePrice = !canViewAppointmentPrice(userRole);

  const columns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "patient",
    accessorKey: "patient.name",
    header: t ? t("patient") : "Paciente",
    cell: (params) => {
      const appointment = params.row.original;
      const existingRecord = recordsMap?.get(appointment.id);
      return (
        <div className="relative flex items-center">
          <AppointmentStatusIndicator
            appointment={appointment}
            existingRecord={existingRecord}
            className="mr-2"
          />
          <span>{appointment.patient ? appointment.patient.name : "-"}</span>
        </div>
      );
    },
  },
  {
    id: "doctor",
    accessorKey: "doctor.name",
    header: t ? t("doctor") : "Médico",
    cell: (params) => {
      const appointment = params.row.original;
      return appointment.doctor ? appointment.doctor.name : "-";
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: t ? t("dateAndTime") : "Data e Hora",
    cell: (params) => {
      const appointment = params.row.original;
      // Converter de UTC (banco) para local (exibição)
      return formatLocalDateTime(appointment.date, "DD/MM/YYYY [às] HH:mm");
    },
  },
  {
    id: "specialty",
    accessorKey: "doctor.specialty",
    header: t ? t("specialty") : "Especialidade",
    cell: (params) => {
      const appointment = params.row.original;
      return appointment.doctor ? appointment.doctor.specialty : "-";
    },
  },
  ];

  // Adicionar coluna de preço apenas se o usuário pode ver
  if (!shouldHidePrice) {
    columns.push({
      id: "price",
      accessorKey: "appointmentPriceInCents",
      header: t ? t("value") : "Valor",
      cell: (params) => {
        const appointment = params.row.original;
        const price = appointment.appointmentPriceInCents / 100;
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price);
      },
    });
  }

  // Adicionar coluna de ações
  columns.push({
    id: "actions",
    cell: (params) => {
      const appointment = params.row.original;
      return (
        <AppointmentsTableActions
          appointment={appointment}
          onAttendClick={onAttendClick}
          onPresenceClick={onPresenceClick}
          onEvolutionClick={onEvolutionClick}
          onConfirmationClick={onConfirmationClick}
          onEditClick={onEditClick}
        />
      );
    },
  });

  return columns;
};

// Exportar também a versão padrão para compatibilidade
export const appointmentsTableColumns = createAppointmentsTableColumns();
