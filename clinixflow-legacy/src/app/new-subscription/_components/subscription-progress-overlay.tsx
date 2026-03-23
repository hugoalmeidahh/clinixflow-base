"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";

type Step = "creating_key" | "generating_license" | "activating" | "preparing" | "redirecting";

interface SubscriptionProgressOverlayProps {
  currentStep: Step;
}

const steps: Record<Step, { label: string; message: string }> = {
  creating_key: {
    label: "Criando chave de acesso",
    message: "Gerando sua chave única de acesso...",
  },
  generating_license: {
    label: "Gerando licença",
    message: "Criando sua nova licença do sistema...",
  },
  activating: {
    label: "Ativando licença",
    message: "Ativando sua licença e liberando acesso...",
  },
  preparing: {
    label: "Preparando dados",
    message: "Preparando seus dados iniciais...",
  },
  redirecting: {
    label: "Redirecionando para Dashboard",
    message: "Tudo pronto! Levando você ao sistema...",
  },
};

export function SubscriptionProgressOverlay({
  currentStep,
}: SubscriptionProgressOverlayProps) {
  const currentStepIndex = Object.keys(steps).indexOf(currentStep);
  const stepKeys = Object.keys(steps) as Step[];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden">
      {/* Background suave com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-purple-100 dark:from-blue-950 dark:via-purple-950/50 dark:to-purple-900" />
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-md" />
      
      {/* Conteúdo */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-xl bg-background/95 backdrop-blur-lg p-8 shadow-2xl border border-white/10">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative h-[50px] w-[150px]">
            <Image
              src="/clinix_flow_dark.png"
              alt="ClinixFlow"
              width={150}
              height={50}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/clinix_flow_white.png"
              alt="ClinixFlow"
              width={150}
              height={50}
              className="hidden dark:block"
              priority
            />
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {stepKeys.map((step, index) => {
            const stepData = steps[step];
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-lg p-3 transition-all duration-300 ${
                  isCurrent
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-300 dark:border-blue-700 shadow-lg scale-[1.02]"
                    : isCompleted
                      ? "border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
                      : "bg-muted/50 border border-transparent opacity-60"
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-blue-700 dark:text-blue-300"
                        : isCompleted
                          ? "text-green-700 dark:text-green-300"
                          : "text-muted-foreground"
                    }`}
                  >
                    {stepData.label}
                  </div>
                  {isCurrent && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {stepData.message}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-700 ease-out shadow-lg"
              style={{
                width: `${((currentStepIndex + 1) / stepKeys.length) * 100}%`,
              }}
            />
          </div>
          <div className="mt-2 text-center text-xs text-muted-foreground font-medium">
            {Math.round(((currentStepIndex + 1) / stepKeys.length) * 100)}% concluído
          </div>
        </div>
      </div>
    </div>
  );
}
