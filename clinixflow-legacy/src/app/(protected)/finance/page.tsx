import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { FinanceDashboardContent } from "./_components/finance-dashboard-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("finance");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const FinancePage = async () => {
  const t = await getTranslations("finance");
  // Mock data - replace with real API calls when available
  const totalRevenue = 15850000; // R$ 158.500,00 in cents
  const totalExpenses = 4230000; // R$ 42.300,00 in cents
  const netProfit = totalRevenue - totalExpenses;
  const averageTicket = 25000; // R$ 250,00 in cents

//TODO: get especialidades do banco buscar valores por atendimentos realizados
  const revenueBySpecialty = [
     { name: "teparapia_ocupacional", value: 4500000 },
  ];

  //TODO: get Insurance on database and map the values by appointments, you need exclude appotintment with justifications
  const revenueByInsurance = [
   { name: "Unimed", value: 5200000 },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>{t("title")}</PageTitle>
          <PageDescription>{t("description")}</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <FinanceDashboardContent
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          netProfit={netProfit}
          averageTicket={averageTicket}
          revenueBySpecialty={revenueBySpecialty}
          revenueByInsurance={revenueByInsurance}
        />
      </PageContent>
    </PageContainer>
  );
};

export default FinancePage;
