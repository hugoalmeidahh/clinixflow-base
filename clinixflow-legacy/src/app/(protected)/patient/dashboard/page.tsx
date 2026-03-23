import dayjs from "dayjs";
import { and, eq, gte, lte } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RefreshButton } from "@/src/app/(protected)/appointments/_components/refresh-button";
import { db } from "@/src/db";
import { appointmentsTable, patientsTable } from "@/src/db/schema";

export const metadata: Metadata = {
  title: "Dashboard - Paciente",
  description: "Seu painel de controle",
};

const PatientDashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (session.user.role !== "patient") {
    redirect("/dashboard");
  }

  if (!session.user.clinic?.id || !session.user.patientId) {
    redirect("/authentication");
  }

  const clinicId = session.user.clinic.id;
  const patientId = session.user.patientId;

  // Buscar dados do paciente
  const patient = await db.query.patientsTable.findFirst({
    where: eq(patientsTable.id, patientId),
  });

  if (!patient) {
    redirect("/authentication");
  }

  // Buscar agendamentos do mês atual
  const startOfMonth = dayjs().startOf("month").toDate();
  const endOfMonth = dayjs().endOf("month").toDate();

  const monthlyAppointments = await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.clinicId, clinicId),
      eq(appointmentsTable.patientId, patientId),
      gte(appointmentsTable.date, startOfMonth),
      lte(appointmentsTable.date, endOfMonth),
    ),
    with: {
      doctor: true,
      doctorSpecialty: {
        with: {
          specialty: true,
        },
      },
    },
    orderBy: (appointments, { asc }) => [asc(appointments.date)],
  });

  // Agendamentos de hoje
  const today = dayjs().startOf("day").toDate();
  const todayEnd = dayjs().endOf("day").toDate();

  const todayAppointments = monthlyAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return aptDate >= today && aptDate <= todayEnd;
  });

  // Próximos agendamentos (próximos 7 dias, excluindo os de hoje)
  const nextWeek = dayjs().add(7, "days").endOf("day").toDate();
  const upcomingAppointments = monthlyAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return aptDate > todayEnd && aptDate <= nextWeek;
  });

  // Timeline do mês (excluindo os que já aparecem nas seções acima)
  const timelineAppointments = monthlyAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    // Excluir os de hoje e próximos 7 dias da timeline
    return !(aptDate >= today && aptDate <= nextWeek);
  });

  // Função auxiliar para determinar o status e cor do agendamento
  const getAppointmentStatus = (appointment: typeof monthlyAppointments[0]) => {
    const aptDate = new Date(appointment.date);
    const now = new Date();
    const today = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();
    const isToday = aptDate >= today && aptDate <= todayEnd;
    const isPast = aptDate < now;
    const isFuture = aptDate > now;

    // Verde: presença confirmada com evolução (precisa verificar se tem record)
    // Por enquanto, vamos assumir que se attended === true, pode ter evolução
    // A verificação completa de evolução será feita na tela de inconsistências
    
    // Amarelo: presença confirmada mas sem evolução
    if (appointment.attended === true) {
      return { status: "Concluído", color: "text-yellow-600" };
    }

    // Se attended é false
    if (appointment.attended === false) {
      // Se tem justificativa, é falta justificada (laranja)
      if (appointment.attendanceJustification) {
        return { status: "Ausente (Justificado)", color: "text-orange-600" };
      }
      
      // Se é hoje e não tem justificativa, é "Aguardando atendimento" (azul escuro)
      if (isToday) {
        return { status: "Aguardando atendimento", color: "text-blue-700" };
      }
      
      // Se já passou e não tem justificativa, é falta (vermelho)
      if (isPast) {
        return { status: "Ausente", color: "text-red-600" };
      }
      
      // Se ainda não aconteceu, é agendado (azul)
      if (isFuture) {
        return { status: "Agendado", color: "text-blue-600" };
      }
    }

    // Se attended é null/undefined, verificar a data
    if (isToday) {
      return { status: "Aguardando atendimento", color: "text-blue-700" };
    }
    
    if (isFuture) {
      return { status: "Agendado", color: "text-blue-600" };
    }
    
    // Se passou e não foi marcado, pode ser inconsistência
    return { status: "Agendado", color: "text-blue-600" };
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Olá, {patient.name}! Aqui está uma visão geral dos seus agendamentos.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <RefreshButton />
        </PageActions>
      </PageHeader>
      <PageContent className="space-y-6">
        {/* Agendamentos de Hoje */}
        {todayAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos de Hoje</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Agendamentos marcados para hoje
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {dayjs(appointment.date).format("DD/MM/YYYY")} - {dayjs(appointment.date).format("HH:mm")} | Nome Profissional: {appointment.doctor?.name || "Não informado"} | {appointment.doctorSpecialty?.specialty?.name || "Sem especialidade"}
                      </p>
                      {appointment.attendanceJustification && (
                        <p className="text-sm text-muted-foreground">
                          {appointment.attendanceJustification}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getAppointmentStatus(appointment).color}`}>
                        {getAppointmentStatus(appointment).status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Próximos Agendamentos */}
        {upcomingAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos (7 dias)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Agendamentos dos próximos 7 dias
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {dayjs(appointment.date).format("DD/MM/YYYY")} - {dayjs(appointment.date).format("HH:mm")} | Nome Profissional: {appointment.doctor?.name || "Não informado"} | {appointment.doctorSpecialty?.specialty?.name || "Sem especialidade"}
                      </p>
                      {appointment.attendanceJustification && (
                        <p className="text-sm text-muted-foreground">
                          {appointment.attendanceJustification}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getAppointmentStatus(appointment).color}`}>
                        {getAppointmentStatus(appointment).status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline do Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos do Mês</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Todos os agendamentos deste mês (exceto os já exibidos acima)
            </p>
          </CardHeader>
          <CardContent>
            {timelineAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Você não tem mais agendamentos este mês além dos já exibidos acima.
              </p>
            ) : (
              <div className="space-y-4">
                {timelineAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <div className="h-full w-0.5 bg-border" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">
                          {dayjs(appointment.date).format("DD/MM/YYYY")} - {dayjs(appointment.date).format("HH:mm")} | Nome Profissional: {appointment.doctor?.name || "Não informado"} | {appointment.doctorSpecialty?.specialty?.name || "Sem especialidade"}
                        </p>
                        <span className={`text-xs font-medium ${getAppointmentStatus(appointment).color}`}>
                          {getAppointmentStatus(appointment).status}
                        </span>
                      </div>
                      {appointment.attendanceJustification && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {appointment.attendanceJustification}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageContent>
    </PageContainer>
  );
};

export default PatientDashboardPage;
