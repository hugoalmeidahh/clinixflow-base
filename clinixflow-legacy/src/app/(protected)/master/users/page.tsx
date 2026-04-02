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

import { UsersWithFilters } from "./_components/users-with-filters";

export const metadata: Metadata = {
  title: "Gerenciar Usuários | Master",
  description: "Gerenciar senhas e usuários do sistema",
};

const MasterUsersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (session.user.role !== "master") {
    redirect("/dashboard");
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Gerenciar Usuários</PageTitle>
          <PageDescription>
            Selecione o tipo de usuário para listar e gerenciar senhas
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <UsersWithFilters />
      </PageContent>
    </PageContainer>
  );
};

export default MasterUsersPage;
