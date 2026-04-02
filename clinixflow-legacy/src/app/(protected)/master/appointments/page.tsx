import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { getClinicsMaster } from "@/src/actions/get-clinics-master";

import { AppointmentsWithFilters } from "./_components/appointments-with-filters";

export const metadata: Metadata = {
  title: "Todos os Agendamentos | Master",
  description: "Visualizar todos os agendamentos do sistema",
};

const MasterAppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (session.user.role !== "master") {
    redirect("/dashboard");
  }

  const clinicsResult = await getClinicsMaster();
  const clinics = clinicsResult?.data || [];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Todos os Agendamentos</PageTitle>
          <PageDescription>
            Selecione a clínica e o mês para listar os agendamentos
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <AppointmentsWithFilters clinics={clinics} />
      </PageContent>
    </PageContainer>
  );
};

export default MasterAppointmentsPage;
