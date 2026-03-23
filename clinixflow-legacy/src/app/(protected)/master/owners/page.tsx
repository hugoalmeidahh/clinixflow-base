import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
import { getOwnersWithSubscriptions } from "@/src/actions/get-owners-with-subscriptions";

import { OwnersListWithSubscriptions } from "./_components/owners-list-with-subscriptions";

export const metadata: Metadata = {
  title: "Gerenciar Owners | Master",
  description: "Gerenciar acesso e licenças dos owners",
};

const MasterOwnersPage = async () => {
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

  // Buscar owners com subscriptions
  const ownersResult = await getOwnersWithSubscriptions();
  const owners = ownersResult?.data || [];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Gerenciar Owners</PageTitle>
          <PageDescription>
            Gerencie acesso, licenças e pagamentos dos owners do sistema
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <div className="text-sm text-muted-foreground">
            Total: {owners.length} owners
          </div>
        </PageActions>
      </PageHeader>
      <PageContent>
        <OwnersListWithSubscriptions owners={owners} />
      </PageContent>
    </PageContainer>
  );
};

export default MasterOwnersPage;
