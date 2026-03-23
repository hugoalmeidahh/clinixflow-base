import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

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
import { doctorsTable } from "@/src/db/schema";
import { canCreateDoctors, requiresPlan } from "@/src/lib/permissions";

import AddDoctorButton from "./_components/add-doctor-button";
import DoctorCard from "./_components/doctor-card";

export async function generateMetadata() {
  const t = await getTranslations("doctors.metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "ClinixFLow", url: "https://www.clinixflow.com.br" }],
  };
}

const DoctorsPage = async () => {
  const t = await getTranslations("doctors");
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
  // Verificar se pode cadastrar profissionais
  if (!canCreateDoctors(session.user.role)) {
    if (session.user.role === "doctor") {
      redirect("/professional/dashboard");
    }
    redirect("/dashboard");
  }
  //Pegar os Profissionais pertencentes à clínica do usuário logado
  const clinicId = session.user.clinic?.id;
  if (!clinicId) {
    redirect("/dashboard");
  }

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, clinicId),
    with: {
      clinic: {
        columns: {
          id: true,
          name: true,
          clinicCode: true,
        },
      },
    },
  });
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>{t("title")}</PageTitle>
          <PageDescription>
            {t("description")}
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        {doctors.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("noProfessionals")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <DoctorCard key={doctor.id} doctor={doctor as any} />
            ))}
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
