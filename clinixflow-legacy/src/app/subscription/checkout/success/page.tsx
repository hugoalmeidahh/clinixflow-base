import { CheckCircle2, Clock } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/src/db";

export const metadata: Metadata = {
  title: "Licença Solicitada",
  description: "Sua solicitação de licença foi criada com sucesso",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ subscriptionId?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const params = await searchParams;
  const subscriptionId = params.subscriptionId;

  if (!subscriptionId) {
    redirect("/subscription/checkout");
  }

  // Buscar subscription e payment request
  const subscription = await db.query.subscriptionsTable.findFirst({
    where: (subs, { eq }) => eq(subs.id, subscriptionId),
  });

  if (!subscription || subscription.userId !== session.user.id) {
    redirect("/subscription/checkout");
  }

  const amount = (subscription.amount / 100).toFixed(2);
  const trialEndsAt = subscription.trialEndsAt
    ? new Date(subscription.trialEndsAt)
    : null;

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <CardTitle className="text-2xl">Licença Solicitada com Sucesso!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-muted-foreground">
              Sua solicitação de licença foi criada. Você tem acesso ao sistema por{" "}
              <strong>1 dia</strong> enquanto aguardamos o pagamento.
            </p>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Código de Ativação:</span>
              <span className="font-mono font-semibold text-lg bg-blue-50 dark:bg-blue-950/20 px-3 py-1 rounded">
                {subscription.licenseKey}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Guarde este código! Ele é sua licença única de acesso.
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor:</span>
              <span className="font-semibold">R$ {amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método de Pagamento:</span>
              <span className="font-semibold uppercase">
                {subscription.paymentMethod}
              </span>
            </div>
            {trialEndsAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trial até:</span>
                <span className="font-semibold">
                  {trialEndsAt.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-lg border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Próximos Passos
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  {subscription.paymentMethod === "pix"
                    ? "Você receberá as informações do PIX em breve. Após o pagamento, sua licença será ativada automaticamente."
                    : "Você receberá o boleto em breve. Após o pagamento, sua licença será ativada automaticamente."}
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-2">
                  ⚠️ Se o pagamento não for confirmado em até 1 dia, seu acesso será
                  bloqueado.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <Link href="/dashboard">Ir para Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/subscription">Ver Minha Assinatura</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

