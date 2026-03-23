"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/ui/data-table";
import { getPatientRecords } from "@/src/actions/get-patient-records";

import { PatientRecordsTableColumns } from "./table-columns";

export function PatientRecordsTable() {
  const { data: patientRecords, isLoading } = useQuery({
    queryKey: ["patient-records"],
    queryFn: getPatientRecords,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={PatientRecordsTableColumns}
        data={patientRecords || []}
      />
    </div>
  );
} 