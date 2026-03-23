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
import { getAllUsers } from "@/src/actions/get-all-users";

import { UsersList } from "./_components/users-list";

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

  const usersResult = await getAllUsers();
  const users = usersResult?.data || [];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Gerenciar Usuários</PageTitle>
          <PageDescription>
            Visualize todos os usuários e altere senhas quando necessário
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <div className="text-sm text-muted-foreground">
            Total: {users.length} usuários
          </div>
        </PageActions>
      </PageHeader>
      <PageContent>
        <UsersList users={users} />
      </PageContent>
    </PageContainer>
  );
};

export default MasterUsersPage;
