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
import { plansTable, subscriptionsTable } from "@/src/db/schema";

import { SubscriptionPlan } from "./_components/subscription-plan";

export const metadata: Metadata = {
  title: "Assinatura",
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

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  // Master não precisa de clínica
  if (session.user.role !== "master" && !session.user.clinic) {
    redirect("/clinic-form");
  }
  // Master não acessa esta página
  if (session.user.role === "master") {
    redirect("/master/dashboard");
  }

  // Buscar subscription e plano atual
  let currentPlanName: string | null = null;
  if (session.user.subscriptionId) {
    const subscriptions = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.id, session.user.subscriptionId))
      .limit(1);

    if (subscriptions.length > 0) {
      const subscription = subscriptions[0];
      const plans = await db
        .select()
        .from(plansTable)
        .where(eq(plansTable.id, subscription.planId))
        .limit(1);

      if (plans.length > 0) {
        currentPlanName = plans[0].name;
      }
    }
  }

  // Se não encontrou na subscription, usar o plan do user
  if (!currentPlanName && session.user.plan) {
    currentPlanName = session.user.plan;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura.</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <SubscriptionPlan
          className="w-[350px]"
          active={!!currentPlanName}
          currentPlanName={currentPlanName}
          userEmail={session.user.email}
        />
      </PageContent>
    </PageContainer>
  );
};

export default SubscriptionPage;
