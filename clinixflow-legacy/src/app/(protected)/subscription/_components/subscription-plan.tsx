"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createStripeCheckout } from "@/src/actions/create-stripe-chekout";

interface SubscriptionPlanProps {
  active?: boolean;
  className?: string;
  userEmail: string;
  currentPlanName?: string | null;
}

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  essential: "Essencial",
  professional: "Profissional",
  super: "Super",
  custom: "Customizado",
};

const PLAN_PRICES: Record<string, number> = {
  essential: 89.9,
  professional: 129.9,
  super: 189.9,
};

export function SubscriptionPlan({
  active = false,
  className,
  userEmail,
  currentPlanName,
}: SubscriptionPlanProps) { 
  const router = useRouter();
  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      console.log("✅ Checkout criado com sucesso:", data);
      
      // Modo de desenvolvimento - contorna validação do Stripe
      if (process.env.NODE_ENV === 'development' && data?.sessionId === "mock_session_id_dev_mode") {
        console.log("🔧 Modo de desenvolvimento: Simulando sucesso do checkout");
        alert("🎉 Modo de desenvolvimento: Assinatura simulada com sucesso! Redirecionando para o dashboard...");
        router.push("/dashboard");
        return;
      }
      
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        console.error("❌ Stripe publishable key não encontrada");
        throw new Error("Stripe publishable key not found");
      }
      
      try {
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        );
        
        if (!stripe) {
          console.error("❌ Stripe não foi carregado");
          throw new Error("Stripe not found");
        }
        
        if (!data?.sessionId) {
          console.error("❌ Session ID não encontrado");
          throw new Error("Session ID not found");
        }
        
        console.log("🔄 Redirecionando para Stripe checkout...");
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        
        if (result.error) {
          console.error("❌ Erro ao redirecionar para Stripe:", result.error);
        }
      } catch (error) {
        console.error("❌ Erro durante o processo de checkout:", error);
      }
    },
    onError: (error) => {
      console.error("❌ Erro na action createStripeCheckout:", error);
    },
  });

  const features = [
    "Cadastro de até 10 profissionais",
    "Agendamentos ilimitados",
    "Métricas básicas",
    "Cadastro de pacientes",
    "Confirmação manual",
    "Suporte via e-mail",
  ];

  const handleSubscribeClick = () => {
    console.log("🔄 Iniciando processo de assinatura...");
    createStripeCheckoutAction.execute();
  };

  const handleManagePlanClick = () => {
    // Modo de desenvolvimento - contorna validação do Stripe
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL) {
      console.log("🔧 Modo de desenvolvimento: Simulando acesso ao portal do cliente");
      alert("🔧 Modo de desenvolvimento: Portal do cliente não configurado. Redirecionando para o dashboard...");
      router.push("/dashboard");
      return;
    }
    
    router.push(
      `${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${userEmail}`,
    );
  };

  const displayName =
    currentPlanName && PLAN_DISPLAY_NAMES[currentPlanName]
      ? PLAN_DISPLAY_NAMES[currentPlanName]
      : "Essencial";
  const price =
    currentPlanName && PLAN_PRICES[currentPlanName]
      ? PLAN_PRICES[currentPlanName]
      : 89.9;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">
            {displayName}
          </h3>
          {active && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
              Atual
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {currentPlanName === "professional"
            ? "Para clínicas em crescimento"
            : currentPlanName === "super"
              ? "Para grandes clínicas e redes"
              : "Para profissionais autônomos ou pequenas clínicas"}
        </p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-foreground">
            R$ {price.toFixed(2)}
          </span>
          <span className="ml-1 text-muted-foreground">/ mês</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 border-t border-border pt-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <p className="ml-3 text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            className="w-full"
            variant="outline"
            onClick={active ? handleManagePlanClick : handleSubscribeClick}
            disabled={createStripeCheckoutAction.isExecuting}
          >
            {createStripeCheckoutAction.isExecuting ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : active ? (
              "Gerenciar assinatura"
            ) : (
              "Fazer assinatura"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}