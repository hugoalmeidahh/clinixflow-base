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
import { getPaymentInconsistencies } from "@/src/actions/get-payment-inconsistencies";

import { PaymentInconsistenciesList } from "./_components/payment-inconsistencies-list";

export const metadata: Metadata = {
  title: "Inconsistências de Pagamento | Master",
  description: "Owners com pagamentos vencidos aguardando validação",
};

const PaymentInconsistenciesPage = async () => {
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

  // Buscar inconsistências
  const inconsistenciesResult = await getPaymentInconsistencies();
  const inconsistencies = inconsistenciesResult?.data || [];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Inconsistências de Pagamento</PageTitle>
          <PageDescription>
            Owners com planos vencidos aguardando validação de pagamento
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <PaymentInconsistenciesList inconsistencies={inconsistencies} />
      </PageContent>
    </PageContainer>
  );
};

export default PaymentInconsistenciesPage;
