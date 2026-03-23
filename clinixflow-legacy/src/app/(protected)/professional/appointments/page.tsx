import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import {
  appointmentsTable,
  patientRecordsTable,
} from "@/src/db/schema";

import AppointmentsActionsProvider from "../../appointments/_components/appointments-actions-provider";
import {
  AppointmentsFiltersProvider,
  FilterButtonWrapper,
  ViewToggleWrapper,
} from "../../appointments/_components/appointments-filters-wrapper";
import FiltersTagsHeader from "../../appointments/_components/filters-tags-header";

export const metadata: Metadata = {
  title: "Agenda - Profissional",
  description: "Seus agendamentos",
};

const ProfessionalAppointmentsPage = async () => {
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

  // Buscar todos os agendamentos deste profissional (incluindo passados para histórico)
  const appointments = await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.doctorId, doctorId),
      eq(appointmentsTable.clinicId, clinicId),
    ),
    with: {
      patient: true,
      doctor: true,
    },
    orderBy: (appointments, { asc }) => [asc(appointments.date)],
  });

  // Buscar pacientes para os filtros (apenas pacientes que têm agendamento com este profissional)
  const patientIds = [...new Set(appointments.map((a) => a.patientId).filter(Boolean))];
  const patients = await db.query.patientsTable.findMany({
    where: (patients, { inArray, eq: eqFn }) =>
      and(
        eqFn(patients.clinicId, clinicId),
        patientIds.length > 0 ? inArray(patients.id, patientIds as string[]) : undefined,
      ),
  });

  // Buscar patient records para os status
  const patientRecords = await db.query.patientRecordsTable.findMany({
    where: eq(patientRecordsTable.clinicId, clinicId),
  });

  return (
    <AppointmentsFiltersProvider>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Agenda</PageTitle>
            <PageDescription>
              Seus agendamentos e consultas agendadas
            </PageDescription>
            <FiltersTagsHeader patients={patients} doctors={[]} />
          </PageHeaderContent>
          <PageActions>
            <div className="flex items-center gap-2">
              <FilterButtonWrapper patients={patients} doctors={[]} hideDoctorFilter />
              <ViewToggleWrapper />
            </div>
          </PageActions>
        </PageHeader>
        <PageContent>
          <AppointmentsActionsProvider
            appointments={appointments}
            patients={patients}
            doctors={[]} // Não precisa de lista de médicos, já está filtrado
            patientRecords={patientRecords}
            userRole={session.user.role || "doctor"}
            clinicId={clinicId}
          />
        </PageContent>
      </PageContainer>
    </AppointmentsFiltersProvider>
  );
};

export default ProfessionalAppointmentsPage;

