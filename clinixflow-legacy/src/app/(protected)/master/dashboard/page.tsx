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
import { getMasterStats } from "@/src/actions/get-master-stats";

import { MasterStatsCards } from "./_components/master-stats-cards";

export const metadata: Metadata = {
  title: "Dashboard Master | Backoffice",
  description: "Painel de controle master do sistema",
};

const MasterDashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Apenas usuário master pode acessar
  if (session.user.role !== "master") {
    redirect("/dashboard");
  }

  // Buscar estatísticas
  const statsResult = await getMasterStats();
  const stats = statsResult?.data || {
    totalOwners: 0,
    totalClinics: 0,
    totalPatients: 0,
    totalDoctors: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    paymentInconsistencies: 0,
    totalPayments: 0,
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard Master</PageTitle>
          <PageDescription>
            Visão geral do sistema e controle de acesso
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <MasterStatsCards stats={stats} />
      </PageContent>
    </PageContainer>
  );
};

export default MasterDashboardPage;
