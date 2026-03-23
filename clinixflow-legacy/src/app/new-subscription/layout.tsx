import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Nova Assinatura",
  description: "Escolha um plano ou ative um código para continuar usando o sistema.",
};

export default async function NewSubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar autenticação
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // IMPORTANTE: Esta página permite acesso mesmo com plano expirado
  // É justamente para renovar a assinatura
  // Não fazer nenhuma verificação de isPlanExpired aqui

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
