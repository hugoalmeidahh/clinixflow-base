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

import { PatientsWithFilters } from "./_components/patients-with-filters";

export const metadata: Metadata = {
  title: "Todos os Pacientes | Master",
  description: "Visualizar todos os pacientes do sistema",
};

const MasterPatientsPage = async () => {
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
          <PageTitle>Todos os Pacientes</PageTitle>
          <PageDescription>
            Selecione a clínica para listar os pacientes
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <PatientsWithFilters clinics={clinics} />
      </PageContent>
    </PageContainer>
  );
};

export default MasterPatientsPage;
