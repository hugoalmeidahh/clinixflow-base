import dayjs from "dayjs";
import { AlertTriangle, FileText } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getInconsistencies } from "@/src/actions/get-inconsistencies";

import { RefreshButton } from "../appointments/_components/refresh-button";

export const metadata: Metadata = {
  title: "Inconsistências",
  description: "Agendamentos que precisam de atenção",
};

const InconsistenciesPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Verificar se o usuário tem permissão para ver inconsistências
  const allowedRoles = [
    "clinic_owner",
    "clinic_admin",
    "clinic_gestor",
    "clinic_recepcionist",
    "doctor",
  ];

  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }

  const inconsistencies = await getInconsistencies();

  const noActionInconsistencies = inconsistencies.filter(
    (item) => item.type === "no_action",
  );
  const noEvolutionInconsistencies = inconsistencies.filter(
    (item) => item.type === "no_evolution",
  );

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Inconsistências</PageTitle>
          <PageDescription>
            Agendamentos que precisam de atenção e ação
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <RefreshButton />
        </PageActions>
      </PageHeader>
      <PageContent className="space-y-6">
        {/* Resumo */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Sem Ação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {noActionInconsistencies.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Agendamentos que passaram sem nenhuma ação registrada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-500" />
                Sem Evolução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {noEvolutionInconsistencies.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Pacientes que compareceram mas não têm evolução preenchida
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agendamentos sem ação */}
        {noActionInconsistencies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Sem Ação</CardTitle>
              <p className="text-sm text-muted-foreground">
                Estes agendamentos passaram e não têm presença, falta ou evolução
                registrada
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {noActionInconsistencies.map((item) => (
                  <div
                    key={item.appointment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">Sem Ação</Badge>
                        <span className="text-sm text-muted-foreground">
                          {dayjs(item.appointment.date).format(
                            "DD/MM/YYYY [às] HH:mm",
                          )}
                        </span>
                      </div>
                      <p className="font-semibold">
                        {item.appointment.patient?.name || "Paciente não informado"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Profissional: {item.appointment.doctor?.name || "Não informado"}
                        {item.appointment.doctorSpecialty?.specialty?.name && (
                          <> | {item.appointment.doctorSpecialty.specialty.name}</>
                        )}
                      </p>
                    </div>
                    {session.user.role === "doctor" && item.appointment.patientId && (
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/professional/patient-records/${item.appointment.patientId}?appointmentId=${item.appointment.id}`}
                          >
                            Evoluir
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agendamentos sem evolução */}
        {noEvolutionInconsistencies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Sem Evolução</CardTitle>
              <p className="text-sm text-muted-foreground">
                Estes pacientes compareceram mas não têm evolução preenchida
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {noEvolutionInconsistencies.map((item) => (
                  <div
                    key={item.appointment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Sem Evolução</Badge>
                        <span className="text-sm text-muted-foreground">
                          {dayjs(item.appointment.date).format(
                            "DD/MM/YYYY [às] HH:mm",
                          )}
                        </span>
                      </div>
                      <p className="font-semibold">
                        {item.appointment.patient?.name || "Paciente não informado"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Profissional: {item.appointment.doctor?.name || "Não informado"}
                        {item.appointment.doctorSpecialty?.specialty?.name && (
                          <> | {item.appointment.doctorSpecialty.specialty.name}</>
                        )}
                      </p>
                    </div>
                    {session.user.role === "doctor" && item.appointment.patientId && (
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/professional/patient-records/${item.appointment.patientId}?appointmentId=${item.appointment.id}`}
                          >
                            Evoluir
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sem inconsistências */}
        {inconsistencies.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg font-semibold text-muted-foreground">
                Nenhuma inconsistência encontrada
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Todos os agendamentos estão em dia!
              </p>
            </CardContent>
          </Card>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default InconsistenciesPage;
