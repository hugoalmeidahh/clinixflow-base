import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import LoginForm from "./_components/login-form";
import SignUpForm from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "Autenticação",
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

const AuthenticationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const defaultTab = params.tab === "signup" ? "register" : "login";

  return (
    <div className="flex min-h-screen w-full">
      <Tabs defaultValue={defaultTab} className="flex min-h-screen w-full">
        {/* Login Tab Content - Form on right */}
        <TabsContent value="login" className="m-0 flex min-h-screen w-full">
          {/* Left - Branding */}
          <div className="hidden min-h-screen w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-12 lg:flex">
            <div className="max-w-md text-center">
              <Image
                src="/clinix_flow_white.png"
                alt="Logo ClinixFlow"
                width={280}
                height={93}
                className="mx-auto mb-8"
                style={{ width: "auto", height: "auto" }}
              />
              <h2 className="mb-4 text-3xl font-bold text-white">
                Gestão clínica simplificada
              </h2>
              <p className="text-lg text-blue-100">
                Sistema completo para gestão de clínicas multidisciplinares.
                Agendamentos, prontuários, financeiro e muito mais.
              </p>
            </div>
            <p className="mt-12 text-center text-sm text-blue-200">
              Ao continuar, você concorda com os{" "}
              <a href="/terms" className="text-white underline hover:text-blue-100">
                Termos de Serviço
              </a>{" "}
              e a{" "}
              <a href="/privacy" className="text-white underline hover:text-blue-100">
                Política de Privacidade
              </a>
            </p>
          </div>
          {/* Right - Login Form */}
          <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 lg:w-1/2">
            <div className="mb-6 lg:hidden">
              <Image
                src="/clinix_flow_dark.png"
                alt="Logo ClinixFlow"
                width={200}
                height={66}
                className="block dark:hidden"
              />
              <Image
                src="/clinix_flow_white.png"
                alt="Logo ClinixFlow"
                width={200}
                height={66}
                className="hidden dark:block"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className="w-full max-w-[420px]">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>
              <LoginForm />
            </div>
          </div>
        </TabsContent>

        {/* Register Tab Content - Form on left */}
        <TabsContent value="register" className="m-0 flex min-h-screen w-full">
          {/* Left - Register Form */}
          <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 lg:w-1/2">
            <div className="mb-6 lg:hidden">
              <Image
                src="/clinix_flow_dark.png"
                alt="Logo ClinixFlow"
                width={200}
                height={66}
                className="block dark:hidden"
              />
              <Image
                src="/clinix_flow_white.png"
                alt="Logo ClinixFlow"
                width={200}
                height={66}
                className="hidden dark:block"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className="w-full max-w-[420px]">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>
              <SignUpForm />
            </div>
          </div>
          {/* Right - Branding/Benefits */}
          <div className="hidden min-h-screen w-1/2 flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 p-12 lg:flex">
            <div className="max-w-md text-center">
              <Image
                src="/clinix_flow_white.png"
                alt="Logo ClinixFlow"
                width={280}
                height={93}
                className="mx-auto mb-8"
                style={{ width: "auto", height: "auto" }}
              />
              <h2 className="mb-6 text-3xl font-bold text-white">
                Comece a gerenciar sua clínica agora
              </h2>
              <ul className="space-y-4 text-left text-blue-100">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm text-white">1</span>
                  <span>Agendamento inteligente com controle de disponibilidade</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm text-white">2</span>
                  <span>Prontuários eletrônicos seguros e organizados</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm text-white">3</span>
                  <span>Gestão financeira completa com relatórios detalhados</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm text-white">4</span>
                  <span>Multi-clínica com controle de acesso por perfil</span>
                </li>
              </ul>
            </div>
            <p className="mt-12 text-center text-sm text-blue-200">
              Ao continuar, você concorda com os{" "}
              <a href="/terms" className="text-white underline hover:text-blue-100">
                Termos de Serviço
              </a>{" "}
              e a{" "}
              <a href="/privacy" className="text-white underline hover:text-blue-100">
                Política de Privacidade
              </a>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
