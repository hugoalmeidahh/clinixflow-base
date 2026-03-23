"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";

type Step = "creating" | "authenticating" | "loading";

interface SignupProgressOverlayProps {
  currentStep: Step;
}

const steps: Record<Step, { label: string; message: string }> = {
  creating: {
    label: "Criando conta",
    message: "Estamos criando sua conta...",
  },
  authenticating: {
    label: "Autenticando",
    message: "Gerando autenticação e logando você...",
  },
  loading: {
    label: "Carregando",
    message: "Preparando seu dashboard...",
  },
};

export function SignupProgressOverlay({
  currentStep,
}: SignupProgressOverlayProps) {
  const currentStepIndex = Object.keys(steps).indexOf(currentStep);
  const stepKeys = Object.keys(steps) as Step[];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Background com gradiente suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-purple-100 dark:from-blue-950 via-purple-950/50 dark:to-purple-900" />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
      
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
        <div className="space-y-4">
          {stepKeys.map((step, index) => {
            const stepData = steps[step];
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
                  isCurrent
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800 border"
                    : isCompleted
                      ? "border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
                      : "bg-muted/50 border border-transparent"
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                  ) : (
                    <div className="border-muted-foreground/30 h-5 w-5 rounded-full border-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
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
                    <div className="text-muted-foreground mt-1 text-xs">
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
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="from-blue-600 to-purple-600 h-full bg-gradient-to-r transition-all duration-700 ease-out shadow-lg"
              style={{
                width: `${((currentStepIndex + 1) / stepKeys.length) * 100}%`,
              }}
            />
          </div>
          <div className="text-muted-foreground mt-2 text-center text-xs">
            {Math.round(((currentStepIndex + 1) / stepKeys.length) * 100)}%
            concluído
          </div>
        </div>
      </div>
    </div>
  );
}
