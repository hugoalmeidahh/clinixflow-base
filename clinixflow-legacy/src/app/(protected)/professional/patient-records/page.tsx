import { and,eq } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { PageContainer } from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";

import { PatientRecordsTableSkeleton } from "../../patient-records/_components/patient-records-table-skeleton";
import { ProfessionalPatientRecordsTable } from "./_components/professional-patient-records-table";

export const metadata: Metadata = {
  title: "Prontuários - Profissional",
  description: "Evoluções e prontuários dos seus pacientes",
};

const ProfessionalPatientRecordsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (session.user.role !== "doctor") {
    redirect("/dashboard");
  }

  if (!session.user.clinic?.id || !session.user.doctorId) {
    redirect("/authentication");
  }

  const clinicId = session.user.clinic.id;
  const doctorId = session.user.doctorId;

  // Buscar apenas prontuários de pacientes que têm agendamentos com este profissional
  // e que foram atendidos (attended = true)
  const appointments = await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.doctorId, doctorId),
      eq(appointmentsTable.clinicId, clinicId),
      eq(appointmentsTable.attended, true),
    ),
    columns: {
      patientId: true,
    },
  });

  const patientIds = [...new Set(appointments.map((a) => a.patientId).filter(Boolean))];

  if (patientIds.length === 0) {
    return (
      <PageContainer>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Prontuários</h1>
          <p className="text-muted-foreground">
            Evoluções e prontuários dos pacientes que você atendeu
          </p>
        </div>
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Você ainda não atendeu nenhum paciente. Os prontuários aparecerão aqui após você confirmar a presença dos pacientes nas consultas.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Prontuários</h1>
        <p className="text-muted-foreground">
          Evoluções e prontuários dos pacientes que você atendeu
        </p>
      </div>
      <Suspense fallback={<PatientRecordsTableSkeleton />}>
        <ProfessionalPatientRecordsTable doctorId={doctorId} patientIds={patientIds as string[]} />
      </Suspense>
    </PageContainer>
  );
};

export default ProfessionalPatientRecordsPage;

