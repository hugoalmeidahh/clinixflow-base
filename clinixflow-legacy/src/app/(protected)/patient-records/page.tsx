import { Suspense } from "react";

import { PageContainer } from "@/components/ui/page-container";

import { PatientRecordsTable } from "./_components/patient-records-table";
import { PatientRecordsTableSkeleton } from "./_components/patient-records-table-skeleton";

export default function PatientRecordsPage() {
  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Prontuários</h1>
        <p className="text-muted-foreground">
          Histórico de consultas e relatórios médicos dos pacientes
        </p>
      </div>
      
      <Suspense fallback={<PatientRecordsTableSkeleton />}>
        <PatientRecordsTable />
      </Suspense>
    </PageContainer>
  );
} 