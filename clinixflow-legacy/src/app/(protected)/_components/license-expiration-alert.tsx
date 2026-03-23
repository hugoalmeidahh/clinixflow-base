"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";

import { RenewSubscriptionDialog } from "./renew-subscription-dialog";

export function LicenseExpirationAlert() {
  const session = authClient.useSession();
  const user = session.data?.user;
  const [showRenewDialog, setShowRenewDialog] = useState(false);

  // Não mostrar para profissionais ou se não houver dados
  if (!user || user.role === "doctor" || !user.isPlanExpiringSoon) {
    return null;
  }

  const daysLeft = user.daysUntilExpiration ?? 0;
  const daysText = daysLeft === 1 ? "dia" : "dias";

  return (
    <>
      <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-900 dark:text-amber-100">
          Licença Expirando
        </AlertTitle>
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          Sua licença expira em{" "}
          <span className="font-semibold">{daysLeft} {daysText}</span>.{" "}
          <button
            onClick={() => setShowRenewDialog(true)}
            className="font-medium underline hover:text-amber-900 dark:hover:text-amber-100"
          >
            Renove agora
          </button>{" "}
          para continuar usando o sistema.
        </AlertDescription>
      </Alert>
      <RenewSubscriptionDialog
        open={showRenewDialog}
        onOpenChange={setShowRenewDialog}
      />
    </>
  );
}

