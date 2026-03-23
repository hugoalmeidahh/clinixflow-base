import dayjs from "dayjs";
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
import { getDashboard } from "@/src/data/get-dashboard";

import { AppointmentsByInsuranceChart } from "./_components/appointments-by-insurance-chart";
import AppointmentsChart from "./_components/appointments-chart";
import { MonthSelector } from "./_components/month-selector";
import { ScheduledVsCompletedChart } from "./_components/scheduled-vs-completed-chart";
import StatsCards from "./_components/stats-card";
import { TodaySummaryCards } from "./_components/today-summary-cards";
import TopDoctors from "./_components/top-doctors";

interface DashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

export const metadata: Metadata = {
  title: "Dashboard",
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

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
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
  // Se for master, redirecionar para dashboard master
  if (session.user.role === "master") {
    redirect("/master/dashboard");
  }
  // Se for profissional, redirecionar para dashboard do profissional
  if (session.user.role === "doctor") {
    redirect("/professional/dashboard");
  }

  // Se for paciente, redirecionar para dashboard do paciente
  if (session.user.role === "patient") {
    redirect("/patient/dashboard");
  }

  // Apenas owners precisam de plan, profissionais e pacientes não
  if (!session.user.plan) {
    redirect("/new-subscription");
  }
  const { from, to } = await searchParams;
  if (!from || !to) {
    const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");
    redirect(`/dashboard?from=${startOfMonth}&to=${endOfMonth}`);
  }
  const {
    totalRevenueScheduled,
    totalRevenueAttended,
    totalAppointments,
    totalAttended,
    totalNoShow,
    totalPatients,
    topDoctors,
    dailyAppointmentsData,
    appointmentsToday,
    confirmedAppointments,
    pendingAppointments,
    appointmentsByInsurance,
  } = await getDashboard({
    from,
    to,
    session: {
      user: {
        clinic: {
          id: session.user.clinic?.id || "",
        },
      },
    },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral da sua clínica.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <MonthSelector />
        </PageActions>
      </PageHeader>
      <PageContent>
        {/* Today's summary cards */}
        <TodaySummaryCards
          appointmentsToday={appointmentsToday?.total || 0}
          confirmed={confirmedAppointments?.total || 0}
          pending={pendingAppointments?.total || 0}
        />
        {/* Main stats */}
        <StatsCards
          totalRevenueScheduled={totalRevenueScheduled?.total ? Number(totalRevenueScheduled.total) : 0}
          totalRevenueAttended={totalRevenueAttended?.total || 0}
          totalAppointments={totalAppointments?.total || 0}
          totalAttended={totalAttended?.total || 0}
          totalNoShow={totalNoShow?.total || 0}
          totalPatients={totalPatients?.total || 0}
        />
        {/* Charts row 1 */}
        <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
          <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
        </div>
        {/* Charts row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
          <AppointmentsByInsuranceChart data={appointmentsByInsurance} />
          <ScheduledVsCompletedChart data={dailyAppointmentsData} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
