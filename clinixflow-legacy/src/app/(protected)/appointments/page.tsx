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
  doctorsTable,
  patientRecordsTable,
  patientsTable,
} from "@/src/db/schema";
import { canCreateAppointments, requiresPlan } from "@/src/lib/permissions";

import AddAppointmentButton from "./_components/add-appointment-button";
import AppointmentsActionsProvider from "./_components/appointments-actions-provider";
import {
  AppointmentsFiltersProvider,
  FilterButtonWrapper,
  ViewToggleWrapper,
} from "./_components/appointments-filters-wrapper";
import FiltersTagsHeader from "./_components/filters-tags-header";
import { RefreshButton } from "./_components/refresh-button";

export const metadata: Metadata = {
  title: "Agendamentos",
  keywords: [
    "agendamento de consultas",
    "agendamento de consultas online",
    "gestão de clínica",
    "gestão de clínica online",
    "prontuário eletrônico",
    "controle de agenda de profissionais da saúde",
    "controle de agenda de pacientes",
  ],
  description: "O seu sistema de gestão clínica",
  authors: [
    { name: "ClinixFLow", url: "https://www.clinixflow.com.br" },
  ],
};

const AppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  // Master não precisa de clínica
  if (session.user.role !== "master" && !session.user.clinic) {
    redirect("/clinic-form");
  }
  // Master não acessa esta página
  if (session.user.role === "master") {
    redirect("/master/dashboard");
  }
  // Verificar se precisa de plano
  if (requiresPlan(session.user.role) && !session.user.plan) {
    redirect("/new-subscription");
  }
  // Se for profissional, redirecionar para agenda do profissional
  if (session.user.role === "doctor") {
    redirect("/professional/appointments");
  }
  // Se for paciente, permitir acesso mas filtrar apenas seus agendamentos
  const isPatient = session.user.role === "patient";
  
  // Se não for paciente e não pode fazer agendamentos, redirecionar
  if (!isPatient && !canCreateAppointments(session.user.role)) {
    redirect("/dashboard");
  }
  
  const clinicId = session.user.clinic?.id;
  if (!clinicId) {
    redirect("/dashboard");
  }

  // Se for paciente, buscar apenas seus agendamentos
  const appointmentsWhere = isPatient && session.user.patientId
    ? and(
        eq(appointmentsTable.clinicId, clinicId),
        eq(appointmentsTable.patientId, session.user.patientId),
      )
    : eq(appointmentsTable.clinicId, clinicId);

  const [patients, doctors, appointments, patientRecords] = await Promise.all([
    // Pacientes: se for patient, não precisa da lista completa
    isPatient
      ? Promise.resolve([])
      : db.query.patientsTable.findMany({
          where: eq(patientsTable.clinicId, clinicId),
        }),
    // Médicos: sempre buscar para exibição
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, clinicId),
    }),
    db.query.appointmentsTable.findMany({
      where: appointmentsWhere,
      with: {
        patient: true,
        doctor: true,
      },
    }),
    db.query.patientRecordsTable.findMany({
      where: eq(patientRecordsTable.clinicId, clinicId),
    }),
  ]);

  return (
    <AppointmentsFiltersProvider>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Agendamentos</PageTitle>
            <PageDescription>
              {
              //TODO: aplicar tradução nessa telas
              isPatient
                ? "Seus agendamentos e consultas agendadas"
                : "Gerencie os agendamentos da sua clínica"}
            </PageDescription>
            <FiltersTagsHeader patients={patients} doctors={doctors} />
          </PageHeaderContent>
          <PageActions>
            <div className="flex flex-wrap items-center gap-2">
              {!isPatient && (
                <AddAppointmentButton patients={patients} doctors={doctors} />
              )}
              <RefreshButton />
              <FilterButtonWrapper patients={patients} doctors={doctors} />
              <ViewToggleWrapper />
            </div>
          </PageActions>
        </PageHeader>
        <PageContent>
          <AppointmentsActionsProvider
            appointments={appointments}
            patients={patients}
            doctors={doctors}
            patientRecords={patientRecords}
            userRole={session.user.role || ""}
            clinicId={clinicId}
          />
        </PageContent>
      </PageContainer>
    </AppointmentsFiltersProvider>
  );
};

export default AppointmentsPage;
