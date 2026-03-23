import { eq } from "drizzle-orm";
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
import { usersTable } from "@/src/db/schema";

import { OwnerDetailsForm } from "./_components/owner-details-form";

type OwnerDetailsPageProps = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({
  params,
}: OwnerDetailsPageProps): Promise<Metadata> {
  const { userId } = await params;
  return {
    title: `Detalhes do Owner ${userId} | Master`,
    description: "Gerenciar acesso e licença do owner",
  };
}

const OwnerDetailsPage = async ({ params }: OwnerDetailsPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Apenas usuário master pode acessar
  if (session.user.role !== "master") {
    redirect("/dashboard");
  }

  const { userId } = await params;

  // Buscar o owner
  const owner = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!owner) {
    redirect("/master/owners");
  }

  if (owner.role !== "clinic_owner") {
    redirect("/master/owners");
  }

  // Calcular status
  const now = new Date();
  const isExpired = owner.planExpiresAt
    ? new Date(owner.planExpiresAt) < now
    : !owner.plan;

  let status: "active" | "expiring_soon" | "expired" | "no_plan" = "no_plan";
  let daysUntilExpiration: number | null = null;

  if (owner.plan && owner.planExpiresAt) {
    daysUntilExpiration = Math.ceil(
      (new Date(owner.planExpiresAt).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (isExpired) {
      status = "expired";
    } else if (daysUntilExpiration <= 7) {
      status = "expiring_soon";
    } else {
      status = "active";
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>{owner.name}</PageTitle>
          <PageDescription>
            Gerenciar acesso, licença e pagamentos do owner
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <OwnerDetailsForm
          owner={{
            ...owner,
            status,
            daysUntilExpiration,
          }}
        />
      </PageContent>
    </PageContainer>
  );
};

export default OwnerDetailsPage;
