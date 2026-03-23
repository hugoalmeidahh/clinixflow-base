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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { requiresPlan } from "@/src/lib/permissions";

import { InactivationReasonsTab } from "./_components/inactivation-reasons-tab";

export const metadata: Metadata = {
  title: "Configurações",
  description: "Gerencie as configurações da sua clínica",
};

const SettingsPage = async () => {
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

  // Apenas owner e admin podem acessar configurações
  if (
    session.user.role !== "clinic_owner" &&
    session.user.role !== "clinic_admin"
  ) {
    if (session.user.role === "doctor") {
      redirect("/professional/dashboard");
    }
    redirect("/dashboard");
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Configurações</PageTitle>
          <PageDescription>
            Gerencie as configurações da sua clínica
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <Tabs defaultValue="inactivation-reasons">
          <TabsList>
            <TabsTrigger value="inactivation-reasons">
              Motivos de Inativação
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inactivation-reasons">
            <InactivationReasonsTab />
          </TabsContent>
        </Tabs>
      </PageContent>
    </PageContainer>
  );
};

export default SettingsPage;
