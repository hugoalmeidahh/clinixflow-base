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
import { requiresPlan } from "@/src/lib/permissions";

import { AppointmentStatusChart } from "./_components/appointment-status-chart";

export const metadata: Metadata = {
  title: "Relatórios de Atendimentos",
  description: "Análise detalhada dos agendamentos, confirmações e comparecimentos",
};

const AppointmentReportsPage = async () => {
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

  // Verificar permissões - apenas owner, admin e doctor podem ver relatórios
  if (
    session.user.role !== "clinic_owner" &&
    session.user.role !== "clinic_admin" &&
    session.user.role !== "doctor"
  ) {
    redirect("/dashboard");
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Relatórios de Atendimentos</PageTitle>
          <PageDescription>
            Análise detalhada dos agendamentos, confirmações e comparecimentos.
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="space-y-4 sm:space-y-6">
          <AppointmentStatusChart />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentReportsPage;
