"use client";

import { Rocket, Shield, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SubscriptionWizard } from "./subscription-wizard";

const PLAN = {
  name: "beta_partner",
  displayName: "Plano Parceiro",
  price: 249,
  description: "Solução completa para gestão de clínicas e consultórios",
    features: [
    { icon: Zap, text: "Gestão completa de agendamentos" },
    { icon: Shield, text: "Prontuário eletrônico seguro" },
    { icon: Rocket, text: "Múltiplos perfis de acesso" },
    { icon: Sparkles, text: "Suporte dedicado" },
    ],
};

export function PlansGrid() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-lg">
        <Card className="relative overflow-hidden border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all">
          {/* Badge */}
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
              Teste Grátis
            </div>
          </div>

          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">{PLAN.displayName}</CardTitle>
            <CardDescription className="text-base">{PLAN.description}</CardDescription>
            
            {/* Preço */}
            <div className="mt-6 py-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
              <div className="text-sm text-muted-foreground">A partir de</div>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-lg text-muted-foreground">R$</span>
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {PLAN.price}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                ✨ Experimente 1 dia grátis
              </div>
              </div>
            </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Features */}
            <ul className="space-y-3">
              {PLAN.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>

            {/* CTA Button */}
              <Button
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
              onClick={() => setShowWizard(true)}
              >
              <Rocket className="mr-2 h-5 w-5" />
              Começar Teste Grátis
              </Button>

            {/* Info */}
            <p className="text-xs text-center text-muted-foreground">
              Sem necessidade de cartão de crédito • Pagamento negociável
            </p>
            </CardContent>
          </Card>
      </div>

      {showWizard && (
        <SubscriptionWizard
          onClose={() => setShowWizard(false)}
        />
      )}
    </>
  );
}

