import { AlertTriangle, Mail, Phone, RefreshCw } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

import { LogoutButton } from "./_components/logout-button";

export const metadata: Metadata = {
  title: "Licença Expirada",
  description: "Sua licença expirou. Entre em contato para renovar.",
};

// Desabilitar streaming para evitar loops infinitos
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function LicenseExpiredPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Se o plano não estiver expirado e não for doctor, redirecionar para dashboard
  // Isso evita que usuários acessem esta página sem necessidade
  if (session.user.role !== "doctor" && !session.user.isPlanExpired) {
    redirect("/dashboard");
  }

  const isDoctor = session.user.role === "doctor";
  const message = isDoctor
    ? "Entre em contato com a Administração da clínica para renovar sua licença."
    : "Entre em contato com o Suporte para renovar sua licença.";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background suave com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-purple-100 dark:from-blue-950 dark:via-purple-950/50 dark:to-purple-900" />
      <div className="absolute inset-0 bg-black/5 dark:bg-black/30" />
      
      <main className="relative z-10 flex-1">
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2-xl font-bold">Licença Expirada</h1>
              <p className="text-muted-foreground text-sm">
                Sua licença de acesso ao sistema expirou.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
                <div className="mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
                    Acesso Bloqueado
                  </h2>
                </div>
                <p className="mb-4 text-red-800 dark:text-red-200">{message}</p>
                <div className="space-y-3">
                  {!isDoctor && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                        <Mail className="h-4 w-4" />
                        <span>Email: suporte@clinixflow.com.br</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                        <Phone className="h-4 w-4" />
                        <span>Telefone: (00) 0000-0000</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Seção para reativar a conta */}
              {!isDoctor && (
                <>
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/20">
                 <div className="mb-4 flex items-center gap-3">
                   <RefreshCw className="h-6 w-6 text-green-600 dark:text-green-400" />
                   <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    Primeiro Acesso? Ative sua conta aqui! 🚀
                   </h3>
                 </div>
                 <p className="mb-4 text-green-800 dark:text-green-200">
                   Você pode ativar sua conta escolhendo um novo plano ou usando um código de ativação.
                 </p>
                 <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                   <Button asChild className="bg-green-600 hover:bg-green-700">
                     <Link href="/new-subscription" prefetch={false}>
                       <RefreshCw className="mr-2 h-4 w-4" />
                       Ativar Conta
                     </Link>
                   </Button>
                 </div>
               </div>
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/20">
                  <div className="mb-4 flex items-center gap-3">
                    <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      Já tem uma conta? Reative sua conta aqui! 🔄
                    </h3>
                  </div>
                  <p className="mb-4 text-blue-800 dark:text-blue-200">
                    Você pode reativar sua conta escolhendo um novo plano.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/new-subscription" prefetch={false}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reativar Conta
                      </Link>
                    </Button>
                  </div>
                </div>
                </>
              )}

              <div className="mt-6 flex justify-center">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
