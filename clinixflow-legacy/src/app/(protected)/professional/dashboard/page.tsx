import dayjs from "dayjs";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
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
import { appointmentsTable } from "@/src/db/schema";

import { RefreshButton } from "../../appointments/_components/refresh-button";
import { appointmentsTableColumns } from "../../appointments/_components/table-columns";

export const metadata: Metadata = {
  title: "Dashboard - Profissional",
  description: "Visão geral dos seus atendimentos",
};

const ProfessionalDashboardPage = async () => {
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

  // Buscar dados do profissional
  const today = dayjs().startOf("day").toDate();
  const todayEnd = dayjs().endOf("day").toDate();

  const [
    totalAttended,
    todayAppointments,
    upcomingAppointments,
  ] = await Promise.all([
    // Total de pacientes atendidos
    db
      .select({ total: count() })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.doctorId, doctorId),
          eq(appointmentsTable.clinicId, clinicId),
          eq(appointmentsTable.attended, true),
        ),
      ),
    // Agendamentos de hoje
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.doctorId, doctorId),
        eq(appointmentsTable.clinicId, clinicId),
        gte(appointmentsTable.date, today),
        lte(appointmentsTable.date, todayEnd),
      ),
      with: {
        patient: true,
        doctor: true,
      },
      orderBy: (appointments, { asc }) => [asc(appointments.date)],
    }),
    // Próximos agendamentos (próximos 7 dias)
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.doctorId, doctorId),
        eq(appointmentsTable.clinicId, clinicId),
        gte(appointmentsTable.date, todayEnd),
        lte(appointmentsTable.date, dayjs().add(7, "days").endOf("day").toDate()),
      ),
      with: {
        patient: true,
        doctor: true,
      },
      orderBy: (appointments, { asc }) => [asc(appointments.date)],
      limit: 10,
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Visão geral dos seus atendimentos e agendamentos
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <RefreshButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pacientes Atendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalAttended[0]?.total || 0}
              </div>
              <p className="text-muted-foreground text-sm">
                Total de pacientes que você já atendeu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agendamentos de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {todayAppointments.length}
              </div>
              <p className="text-muted-foreground text-sm">
                Consultas agendadas para hoje
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum agendamento para hoje
                </p>
              ) : (
                <DataTable
                  columns={appointmentsTableColumns}
                  data={todayAppointments}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum agendamento nos próximos 7 dias
                </p>
              ) : (
                <DataTable
                  columns={appointmentsTableColumns}
                  data={upcomingAppointments}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default ProfessionalDashboardPage;

