import { Metadata } from "next";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { ReportsHub } from "./_components/reports-hub";

export const metadata: Metadata = {
  title: "Relatórios",
  description: "Relatórios e análises da clínica",
};

const ReportsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Relatórios</PageTitle>
          <PageDescription>
            Visualize relatórios e análises detalhadas da sua clínica.
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <ReportsHub />
      </PageContent>
    </PageContainer>
  );
};

export default ReportsPage;
