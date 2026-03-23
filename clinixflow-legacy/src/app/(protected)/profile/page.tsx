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
import { getUserProfile } from "@/src/data/get-user-profile";

import UserProfileForm from "./_components/user-profile-form";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Gerencie suas informações pessoais",
};

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const userProfile = await getUserProfile({
    userId: session.user.id,
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Perfil</PageTitle>
          <PageDescription>
            Gerencie suas informações pessoais e de contato.
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <UserProfileForm userProfile={userProfile ?? null} />
      </PageContent>
    </PageContainer>
  );
};

export default ProfilePage; 