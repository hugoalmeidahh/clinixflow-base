import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

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
import { patientsTable } from "@/src/db/schema";

import { GuidesView } from "./_components/guides-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guides");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function GuidesPage() {
  const t = await getTranslations("guides");

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
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
      </PageHeader>
      <PageContent>
        <GuidesView patients={patients} />
      </PageContent>
    </PageContainer>
  );
}
