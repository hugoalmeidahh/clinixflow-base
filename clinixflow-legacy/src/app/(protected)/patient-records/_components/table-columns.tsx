"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";



type PatientRecordWithRelations = {
  id: number;
  patientId: string | null;
  doctorId: string | null;
  appointmentId: string | null;
  firstConsultation: boolean;
  avaliationContent: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  patient: {
    id: string;
    name: string;
    email?: string;
    patientRecordNumber?: number | null;
  } | null;
  doctor: {
    id: string;
    name: string;
    specialty?: string | null;
  } | null;
  appointment: {
    id: string;
    date: Date;
  } | null;
};

export const PatientRecordsTableColumns: ColumnDef<PatientRecordWithRelations>[] = [
  {
    id: "patientRecordNumber",
    header: "Nº Prontuário",
    cell: ({ row }) => {
      return row.original.patient?.patientRecordNumber || "-";
    },
  },
  {
    id: "patientName",
    header: "Paciente",
    cell: ({ row }) => {
      const patient = row.original.patient;
      if (!patient) return "-";
      
      return (
        <Link
          href={`/professional/patient-records/${patient.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
        >
          {patient.name}
        </Link>
      );
    },
  },
  {
    id: "doctorName",
    header: "Médico",
    cell: ({ row }) => {
      return row.original.doctor?.name || "-";
    },
  },
  {
    id: "doctorSpecialty",
    header: "Especialidade",
    cell: ({ row }) => {
      return row.original.doctor?.specialty || "-";
    },
  },
  {
    id: "appointmentDate",
    header: "Data da Consulta",
    cell: ({ row }) => {
      const record = row.original;
      const date = record.appointment?.date || record.createdAt;
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    },
  },
  {
    accessorKey: "firstConsultation",
    header: "Primeira Consulta",
    cell: ({ row }) => {
      const isFirst = row.getValue("firstConsultation") as boolean;
      return isFirst ? "Sim" : "Não";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data do Registro",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    },
  },
]; 