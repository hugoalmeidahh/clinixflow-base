"use client";

import { CheckCircle2, Copy, Loader2, Mail, MessageCircle, Rocket, Shield, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requestSubscription } from "@/src/actions/request-subscription";

import { SubscriptionProgressOverlay } from "./subscription-progress-overlay";

const PLAN = {
  name: "beta_partner",
  displayName: "Plano Parceiro",
  price: 249,
  trialDays: 1,
  features: [
    { icon: Zap, text: "Acesso completo a todas as funcionalidades" },
    { icon: Shield, text: "Gestão de agendamentos e presença" },
    { icon: Rocket, text: "Prontuário eletrônico completo" },
    { icon: Sparkles, text: "Múltiplos perfis de acesso" },
  ],
} as const;

type Step = "info" | "confirm" | "success";

interface SubscriptionWizardProps {
  onClose: () => void;
}

export function SubscriptionWizard({ onClose }: SubscriptionWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showProgressOverlay, setShowProgressOverlay] = useState(false);
  const [progressStep, setProgressStep] = useState<"creating_key" | "generating_license" | "activating" | "preparing" | "redirecting">("creating_key");

  const requestSubscriptionAction = useAction(requestSubscription, {
    onSuccess: ({ data }) => {
      if (data) {
        setLicenseKey(data.licenseKey);
        // O progresso dos steps é controlado pelo handleConfirm
      }
    },
    onError: ({ error }) => {
      setShowProgressOverlay(false);
      console.error("Erro ao solicitar acesso:", error);
      
      let errorMessage = "Erro ao solicitar acesso";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.serverError) {
        errorMessage = error.serverError;
      } else if (typeof error === "object" && error !== null) {
        const errorObj = error as Record<string, unknown>;
        errorMessage = 
          (typeof errorObj.serverError === "string" ? errorObj.serverError : undefined) ||
          (typeof errorObj.message === "string" ? errorObj.message : undefined) ||
          "Erro ao solicitar acesso. Tente novamente.";
      }
      
      toast.error(errorMessage);
    },
  });

  const handleStartTrial = () => {
    setCurrentStep("confirm");
  };

  const handleConfirm = async () => {
    // Mostrar overlay e iniciar progresso
    setShowProgressOverlay(true);
    setProgressStep("creating_key");
    
    try {
      // Step 1: Criando chave (7 segundos para ler)
      await new Promise((resolve) => setTimeout(resolve, 7000));
      
      // Step 2: Gerando licença (7 segundos para ler)
      setProgressStep("generating_license");
      await new Promise((resolve) => setTimeout(resolve, 7000));
      
      // Executar action enquanto mostra steps
      requestSubscriptionAction.execute({
        planName: "beta_partner",
        planType: "mensal",
        paymentMethod: "pix",
      });
      
      // Step 3: Ativando (7 segundos para ler)
      setProgressStep("activating");
      await new Promise((resolve) => setTimeout(resolve, 7000));
      
      // Step 4: Preparando dados (7 segundos para ler)
      setProgressStep("preparing");
      await new Promise((resolve) => setTimeout(resolve, 7000));
      
      // Step 5: Redirecionando (15 segundos para testar)
      setProgressStep("redirecting");
      
      // Recarregar sessão
      router.refresh();
      
      await new Promise((resolve) => setTimeout(resolve, 15000));
      
      // Redirecionar
      window.location.href = "/dashboard";
    } catch (error) {
      setShowProgressOverlay(false);
      console.error("Erro no processo:", error);
      toast.error("Erro ao processar. Tente novamente.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "info":
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-2">
                <Rocket className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {PLAN.displayName}
              </h3>
              <p className="text-muted-foreground">
                Transforme a gestão da sua clínica com nossa solução completa
              </p>
            </div>

            {/* Preço */}
            <div className="text-center py-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border">
              <div className="text-sm text-muted-foreground mb-1">Investimento mensal</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-lg text-muted-foreground">R$</span>
                <span className="text-5xl font-bold text-foreground">{PLAN.price}</span>
                <span className="text-muted-foreground">/mês</span>
                        </div>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Teste grátis por {PLAN.trialDays} dia
                        </div>
                      </div>

            {/* Features */}
            <div className="space-y-3">
              {PLAN.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-primary" />
                      </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Info de contato */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                💬 Após o período de teste, o pagamento pode ser <strong>negociado diretamente</strong> com nossa equipe via WhatsApp ou E-mail.
              </p>
            </div>
          </div>
        );

      case "confirm":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold">Confirmar Acesso de Teste</h3>
              <p className="text-muted-foreground text-sm">
                Você terá acesso completo por {PLAN.trialDays} dia para explorar todas as funcionalidades
              </p>
            </div>

            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Plano:</span>
                  <span className="font-semibold">{PLAN.displayName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Período de teste:</span>
                  <span className="font-semibold">{PLAN.trialDays} dia</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valor após teste:</span>
                  <span className="font-semibold">R$ {PLAN.price},00/mês</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Hoje você paga:</span>
                    <span className="font-bold text-green-600 text-2xl">GRÁTIS</span>
                </div>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                Após o teste, entre em contato para negociar:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="https://wa.me/5512981565612"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href="mailto:contato@clinixflow.com.br"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                >
                  <Mail className="h-4 w-4" />
                  E-mail
                </a>
              </div>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Acesso Liberado!</h3>
              <p className="text-muted-foreground">
                Seu período de teste foi ativado com sucesso
              </p>
            </div>
            {licenseKey && (
              <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
                <div className="mb-2 text-sm font-medium text-muted-foreground">
                  Seu Código de Licença:
                </div>
                <div className="font-mono text-xl font-bold text-primary mb-4 break-all">
                  {licenseKey}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(licenseKey);
                      toast.success("Código copiado!");
                    } catch {
                      toast.error("Erro ao copiar código");
                    }
                  }}
                  className="w-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Código
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Guarde este código! Ele é sua chave de acesso ao sistema.
                </p>
              </div>
            )}

            {/* Lembrete de contato */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Lembre-se: após o período de teste, entre em contato pelo{" "}
                <a href="https://wa.me/5512981565612" className="font-semibold underline" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                ou{" "}
                <a href="mailto:contato@clinixflow.com.br" className="font-semibold underline">
                  E-mail
                </a>{" "}
                para continuar usando o ClinixFlow.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "info": return "Conheça o Plano";
      case "confirm": return "Confirmar";
      case "success": return "Sucesso!";
      default: return "";
    }
  };

  const getProgressPercentage = () => {
    const steps: Step[] = ["info", "confirm", "success"];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <>
      {showProgressOverlay && (
        <SubscriptionProgressOverlay currentStep={progressStep} />
      )}
      
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                {getStepTitle()}
              </CardTitle>
              <CardDescription>
                Passo {currentStep === "info" ? "1" : currentStep === "confirm" ? "2" : "3"} de 3
              </CardDescription>
            </div>
            {currentStep !== "success" && (
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                ×
              </Button>
            )}
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}

          {/* Botões de Ação */}
          {currentStep === "info" && (
            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={handleStartTrial}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Começar Teste Grátis
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full">
                Agora não
              </Button>
            </div>
          )}

          {currentStep === "confirm" && (
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("info")}
                disabled={requestSubscriptionAction.isExecuting}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={requestSubscriptionAction.isExecuting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {requestSubscriptionAction.isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ativando...
                  </>
                ) : (
                  "Confirmar e Ativar"
                )}
              </Button>
            </div>
          )}

          {currentStep === "success" && (
            <div className="pt-2">
              <Button
                onClick={() => {
                    setIsRedirecting(true);
                  toast.success("Redirecionando para o sistema...");
                    router.refresh();
                    setTimeout(() => {
                      window.location.href = "/dashboard";
                  }, 2000);
                }}
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isRedirecting}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando no sistema...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Acessar o ClinixFlow
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}

