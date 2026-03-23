import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
import {
  doctorsTable,
  patientsTable,
  prescriptionsTable,
} from "@/src/db/schema";

import AddPrescriptionButton from "./_components/add-prescription-button";
import { prescriptionsTableColumns } from "./_components/table-columns";

export const metadata: Metadata = {
  title: "Receitas",
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
  authors: [{ name: "ClinixFLow", url: "https://www.clinixflow.com.br" }],
};

const PrescriptionsPage = async () => {
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
  // Apenas owners precisam de plan, profissionais não
  if (session.user.role !== "doctor" && !session.user.plan) {
    redirect("/new-subscription");
  }
  // Profissionais não podem acessar esta página
  if (session.user.role === "doctor") {
    redirect("/professional/dashboard");
  }

  const clinicId = session.user.clinic?.id;
  if (!clinicId) {
    redirect("/dashboard");
  }

  const [patients, doctors, prescriptions] = await Promise.all([
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, clinicId),
    }),
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, clinicId),
    }),
    db.query.prescriptionsTable.findMany({
      where: eq(prescriptionsTable.clinicId, clinicId),
      with: {
        patient: true,
        doctor: true,
      },
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Receitas</PageTitle>
          <PageDescription>Gerencie as receitas da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPrescriptionButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={prescriptions as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={prescriptionsTableColumns as any}
        />
        {/* <DownloadPrescriptionButton
          doctor={prescriptions[0]?.doctor?.name ?? ""}
          patient={prescriptions[0]?.patient?.name ?? ""}
          contentHtml={prescriptions[0]?.content ?? ""}
        /> */}
      </PageContent>
    </PageContainer>
  );
};

export default PrescriptionsPage;
