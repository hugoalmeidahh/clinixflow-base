import { and, eq } from "drizzle-orm";
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
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";

export const metadata: Metadata = {
  title: "Agendamentos - Paciente",
  description: "Acompanhe seus agendamentos",
};

const PatientAppointmentsPage = async () => {
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

  // Buscar todos os agendamentos do paciente
  const appointments = await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.clinicId, clinicId),
      eq(appointmentsTable.patientId, patientId),
    ),
    with: {
      doctor: true,
    },
    orderBy: (appointments, { desc }) => [desc(appointments.date)],
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Meus Agendamentos</PageTitle>
          <PageDescription>
            Acompanhe todos os seus agendamentos
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Você ainda não possui agendamentos.
            </p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-lg border p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {appointment.doctor?.name || "Profissional não informado"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(appointment.date).toLocaleString(
                        "pt-BR",
                        {
                          dateStyle: "full",
                          timeStyle: "short",
                        },
                      )}
                    </p>
                    {appointment.attendanceJustification && (
                      <p className="mt-2 text-sm">{appointment.attendanceJustification}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        (() => {
                          if (appointment.attended === true) {
                            return "bg-green-100 text-green-800";
                          }
                          if (appointment.attended === false) {
                            const aptDate = new Date(appointment.date);
                            const now = new Date();
                            // Se o agendamento ainda não aconteceu, tratar como agendado (azul)
                            if (aptDate > now) {
                              return "bg-blue-100 text-blue-800";
                            }
                            // Se já passou e está marcado como false, é falta (vermelho)
                            return "bg-red-100 text-red-800";
                          }
                          return "bg-blue-100 text-blue-800";
                        })()
                      }`}
                    >
                      {(() => {
                        if (appointment.attended === true) {
                          return "Concluído";
                        }
                        if (appointment.attended === false) {
                          const aptDate = new Date(appointment.date);
                          const now = new Date();
                          // Se o agendamento ainda não aconteceu, tratar como agendado
                          if (aptDate > now) {
                            return "Agendado";
                          }
                          // Se já passou e está marcado como false, é falta
                          return "Ausente";
                        }
                        return "Agendado";
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default PatientAppointmentsPage;
