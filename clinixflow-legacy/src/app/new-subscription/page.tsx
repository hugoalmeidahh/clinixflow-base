import { and, eq } from "drizzle-orm";
import { AlertTriangle, Mail, Phone } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { subscriptionsTable } from "@/src/db/schema";

// import { ActivationCodeForm } from "../(protected)/subscription/_components/activation-code-form";
import { PlansGrid } from "./_components/plans-grid";

export default async function NewSubscriptionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  // Verificar autenticação
  if (!session?.user) {
    redirect("/authentication");
  }

  if (session.user.subscriptionStatus === "active" && !session.user.isPlanExpired) {
    redirect("/dashboard");
  }

  const pendingSubscription = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, session.user.id),
        eq(subscriptionsTable.status, "pending_payment"),
      ),
    )
    .limit(1);

  let pendingSubscriptionWithPlan = null;
  if (pendingSubscription.length > 0) {
    const plan = await db.query.plansTable.findFirst({
      where: (plans, { eq }) => eq(plans.id, pendingSubscription[0].planId),
    });
    pendingSubscriptionWithPlan = {
      ...pendingSubscription[0],
      plan,
    };
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  if (pendingSubscriptionWithPlan) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Assinatura Pendente de Pagamento
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Você possui uma assinatura pendente de pagamento. Para continuar utilizando nossa plataforma, é necessário regularizar o pagamento.
          </p>
        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-8 dark:border-orange-900 dark:bg-orange-950/20">
          <div className="mb-6 flex items-center justify-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <h2 className="text-2xl font-semibold text-orange-900 dark:text-orange-100">
              Detalhes da Assinatura
            </h2>
          </div>
          
          <div className="mb-6 space-y-3 text-orange-800 dark:text-orange-200">
            <div className="rounded-lg border border-orange-300 bg-white p-4 dark:border-orange-800 dark:bg-orange-950/40">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Plano:</span>
                  <p className="text-lg">{pendingSubscriptionWithPlan.plan?.displayName || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Tipo:</span>
                  <p className="text-lg">
                    {pendingSubscriptionWithPlan.planType === "mensal"
                      ? "Mensal"
                      : pendingSubscriptionWithPlan.planType === "semestral"
                        ? "Semestral"
                        : "Anual"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Valor:</span>
                  <p className="text-lg">{formatCurrency(pendingSubscriptionWithPlan.amount)}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Chave de Licença:</span>
                  <p className="text-lg font-mono text-sm">{pendingSubscriptionWithPlan.licenseKey}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-orange-300 bg-white p-6 dark:border-orange-800 dark:bg-orange-950/40">
            <p className="mb-4 text-center text-lg font-semibold text-orange-900 dark:text-orange-100">
              Para regularizar e liberar sua assinatura, entre em contato com nossa equipe:
            </p>
            <div className="mx-auto max-w-md space-y-3 text-sm text-orange-800 dark:text-orange-200">
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-5 w-5" />
                <span>
                  <span className="font-semibold">Contato:</span>{" "}
                  <a
                    href="mailto:contato@clinixflow.com.br"
                    className="underline hover:text-orange-900 dark:hover:text-orange-100"
                  >
                    contato@clinixflow.com.br
                  </a>
                </span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-5 w-5" />
                <span>
                  <span className="font-semibold">Financeiro:</span>{" "}
                  <a
                    href="mailto:financeiro@clinixflow.com.br"
                    className="underline hover:text-orange-900 dark:hover:text-orange-100"
                  >
                    financeiro@clinixflow.com.br
                  </a>
                </span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-5 w-5" />
                <span>
                  <span className="font-semibold">Telefone:</span>{" "}
                  <a
                    href="tel:+5512981565612"
                    className="underline hover:text-orange-900 dark:hover:text-orange-100"
                  >
                    (12) 98156-5612
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se não houver subscription pendente, mostrar planos normalmente
  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Desbloqueie todo o potencial da sua clínica
        </h1>
        {/* <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Transforme a gestão do seu consultório ou clínica com nossa solução completa.
          Agora você pode escolher um plano que se adapte às suas necessidades e começar a usar o ClinixFlow.
        </p> */}
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <p className="font-medium text-amber-800 dark:text-amber-200">
            🚀{" "}
            <span className="font-semibold">
              Profissionais que utilizam nossa plataforma economizam em média 15
              horas por semana
            </span>{" "}
            em tarefas administrativas. Não perca mais tempo com agendas manuais
            e processos ineficientes!
          </p>
        </div>
      </div>

      {/* Planos */}
      <div className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Escolha seu Plano
        </h2>
        <PlansGrid />
      </div>

      {/* Divisor */}
      {/* <div className="my-12 flex items-center gap-4">
        <div className="flex-1 border-t" />
        <span className="text-sm font-medium text-muted-foreground">OU</span>
        <div className="flex-1 border-t" />
      </div> */}

      {/* Código de Ativação */}
      {/* <div className="mx-auto max-w-md">
        
        {/* <h2 className="mb-4 text-center text-2xl font-semibold">
          Já tenho um código de ativação
        </h2>
        <ActivationCodeForm className="w-full" /> 
      </div> */}

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Junte-se a mais de 2.000 profissionais de saúde que já transformaram
          sua rotina com nossa solução. Garantia de satisfação de 30 dias ou seu
          dinheiro de volta.
        </p>
      </div>
    </div>
  );
}