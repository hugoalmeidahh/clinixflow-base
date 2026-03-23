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
import { getAllAppointments } from "@/src/actions/get-all-appointments";

import { AllAppointmentsList } from "./_components/all-appointments-list";

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

  const appointmentsResult = await getAllAppointments();
  const appointments = appointmentsResult?.data || [];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Todos os Agendamentos</PageTitle>
          <PageDescription>
            Visualize todos os agendamentos de todas as clínicas do sistema
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <div className="text-sm text-muted-foreground">
            Total: {appointments.length} agendamentos
          </div>
        </PageActions>
      </PageHeader>
      <PageContent>
        <AllAppointmentsList appointments={appointments} />
      </PageContent>
    </PageContainer>
  );
};

export default MasterAppointmentsPage;
