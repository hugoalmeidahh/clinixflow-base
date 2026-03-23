import "../globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ClinicSelector } from "@/components/clinic-selector";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { LanguageSwitcher } from "@/src/components/language-switcher";
import { requiresPlan } from "@/src/lib/permissions";

import { AppSidebar } from "./_components/app-sidebar";
import { InconsistenciesButton } from "./_components/inconsistencies-button";
import { LoadingOverlayWrapper } from "./_components/loading-overlay-wrapper";
import { MobileSidebar } from "./_components/mobile-sidebar";

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "ClinixFlow - Sistema para clínica",
    template: "ClinixFlow - %s",
  },
  keywords: [
    "agendamento de consultas",
    "agendamento de consultas online",
    "gestão de clínica",
    "gestão de clínica online",
    "prontuário eletrônico",
    "controle de agenda de profissionais da saúde",
    "controle de agenda de pacientes",
  ],
  description: "O seu sistema de gestão clínica",
  authors: [{ name: "ClinixFLow", url: "https://www.clinixflow.com.br" }],
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  // Verificar se o usuário está autenticado
  if (!session?.user) {
    redirect("/authentication");
  }

  // Obter o pathname atual através do middleware
  // O middleware sempre adiciona x-pathname ao header, então podemos confiar nele
  const pathnameFromHeader = headersList.get("x-pathname") || "";
  
  // Determinar se estamos na página de new-subscription (license-expired agora está fora deste grupo)
  const isNewSubscriptionPage = pathnameFromHeader.includes("/new-subscription");

  // Verificar se o plano está expirado (apenas para roles que precisam de plano)
  // Profissionais (doctor, patient) não precisam de plano
  // NÃO redirecionar se já estivermos em new-subscription
  // A página /license-expired agora está fora deste grupo, então não precisa verificar aqui
  if (
    !isNewSubscriptionPage &&
    requiresPlan(session.user.role) &&
    session.user.isPlanExpired
  ) {
    redirect("/license-expired");
  }

  return (
    <SidebarProvider>
      <LoadingOverlayWrapper />
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <main className="flex h-screen w-full flex-col overflow-hidden">
        {/* Mobile header - hamburger + centered logo */}
        <header className="bg-background flex h-14 min-h-[3.5rem] shrink-0 items-center border-b border-border px-4 shadow-sm md:hidden">
          <MobileSidebar />
          <div className="flex flex-1 items-center justify-center">
            <Link href="/dashboard">
              <Image
                src="/clinix_flow_dark.png"
                alt="ClinixFlow"
                width={140}
                height={40}
                className="block h-7 w-auto object-contain dark:hidden"
                priority
              />
              <Image
                src="/clinix_flow_white.png"
                alt="ClinixFlow"
                width={140}
                height={40}
                className="hidden h-7 w-auto object-contain dark:block"
                priority
              />
            </Link>
          </div>
          {/* Spacer to balance the hamburger button for centering */}
          <div className="w-10" />
        </header>
        {/* Desktop header */}
        <header className="bg-background hidden h-16 min-h-[4rem] max-h-[4rem] shrink-0 items-center gap-4 border-b border-border px-4 shadow-sm md:flex">
          <SidebarTrigger />
          <div className="flex flex-1 items-center gap-4">
            <Suspense fallback={<div className="h-9 w-32 animate-pulse rounded-md bg-muted" />}>
              <ClinicSelector />
            </Suspense>
          </div>
          <div className="flex items-center gap-2">
            <InconsistenciesButton />
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
