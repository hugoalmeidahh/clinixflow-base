"use client";

import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";

export function PendingPaymentAlert() {
  const session = authClient.useSession();
  const user = session.data?.user;

  // Não mostrar para profissionais ou se não houver dados
  if (!user || user.role === "doctor" || !user.hasPendingPayment) {
    return null;
  }

  const trialEndsAt = user.trialEndsAt
    ? new Date(user.trialEndsAt)
    : null;
  const now = new Date();
  const hoursLeft = trialEndsAt
    ? Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60))
    : 0;

  if (hoursLeft <= 0) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-900 dark:text-red-100">
          Pagamento Pendente - Acesso Bloqueado
        </AlertTitle>
        <AlertDescription className="text-red-800 dark:text-red-200">
          Seu período de trial expirou e o pagamento ainda não foi confirmado.{" "}
          <Link
            href="/subscription"
            className="font-medium underline hover:text-red-900 dark:hover:text-red-100"
          >
            Entre em contato com o suporte
          </Link>{" "}
          para reativar sua licença.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-900 dark:text-amber-100">
        Pagamento Pendente
      </AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        Você tem acesso por mais{" "}
        <span className="font-semibold">
          {hoursLeft} {hoursLeft === 1 ? "hora" : "horas"}
        </span>
        . Após isso, o acesso será bloqueado até a confirmação do pagamento.{" "}
        <Link
          href="/subscription"
          className="font-medium underline hover:text-amber-900 dark:hover:text-amber-100"
        >
          Ver detalhes da assinatura
        </Link>
      </AlertDescription>
    </Alert>
  );
}

