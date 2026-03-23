import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

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
import { patientsTable } from "@/src/db/schema";
import { canCreatePatients, requiresPlan } from "@/src/lib/permissions";

import AddPatientButton from "./_components/add-patient-button";
import { patientsTableColumns } from "./_components/table-columns";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("patients");
  return {
    title: t("title"),
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
}

const PatientsPage = async () => {
  const t = await getTranslations("patients");
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
  // Verificar se pode cadastrar pacientes
  if (!canCreatePatients(session.user.role)) {
    if (session.user.role === "doctor") {
      redirect("/professional/dashboard");
    }
    redirect("/dashboard");
  }
  const clinicId = session.user.clinic?.id;
  if (!clinicId) {
    redirect("/dashboard");
  }

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, clinicId),
  });
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>{t("title")}</PageTitle>
          <PageDescription>{t("description")}</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={patients} columns={patientsTableColumns} />
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
