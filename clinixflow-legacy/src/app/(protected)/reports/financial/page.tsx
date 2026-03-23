import { Metadata } from "next";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { CashFlowChart } from "./_components/cash-flow-chart";
import { FinancialSummaryCards } from "./_components/financial-summary-cards";
import { LedgerSummaryChart } from "./_components/ledger-summary-chart";
import { ProfitabilityBySpecialtyChart } from "./_components/profitability-by-specialty-chart";

export const metadata: Metadata = {
  title: "Relatórios Financeiros",
  description: "Fluxo de caixa, livro caixa e rentabilidade por especialidade",
};

const FinancialReportsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Relatórios Financeiros</PageTitle>
          <PageDescription>
            Fluxo de caixa, livro caixa, análise financeira e rentabilidade por
            especialidade.
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <FinancialSummaryCards />
        <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
          <CashFlowChart />
          <LedgerSummaryChart />
        </div>
        <ProfitabilityBySpecialtyChart />
      </PageContent>
    </PageContainer>
  );
};

export default FinancialReportsPage;
