"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestSubscription } from "@/src/actions/request-subscription";

const PLANS = [
  {
    name: "essential",
    displayName: "Essencial",
    price: 89.9,
    maxDoctors: 10,
    maxPatients: 50,
    description: "Ideal para profissionais autônomos ou pequenas clínicas",
  },
  {
    name: "professional",
    displayName: "Profissional",
    price: 129.9,
    maxDoctors: 20,
    maxPatients: 150,
    description: "Para clínicas em crescimento",
  },
  {
    name: "super",
    displayName: "Super",
    price: 189.9,
    maxDoctors: 45,
    maxPatients: 500,
    description: "Para grandes clínicas e redes",
  },
] as const;

export function CheckoutForm() {
  const router = useRouter();
  const [planName, setPlanName] = useState<"essential" | "professional" | "super">(
    "essential",
  );
  const [planType, setPlanType] = useState<"mensal" | "semestral" | "anual">(
    "mensal",
  );
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "boleto">("pix");

  const requestSubscriptionAction = useAction(requestSubscription, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success("Licença solicitada com sucesso!");
        router.push(`/subscription/checkout/success?subscriptionId=${data.subscriptionId}`);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao solicitar licença");
    },
  });

  const selectedPlan = PLANS.find((p) => p.name === planName);
  if (!selectedPlan) return null;

  // Calcular preço baseado no tipo
  let price = selectedPlan.price;
  if (planType === "semestral") {
    price = selectedPlan.price * 6 * 0.9; // 10% desconto
  } else if (planType === "anual") {
    price = selectedPlan.price * 12 * 0.8; // 20% desconto
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestSubscriptionAction.execute({
      planName,
      planType,
      paymentMethod,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solicitar Licença</h1>
        <p className="text-muted-foreground mt-2">
          Escolha seu plano e método de pagamento
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de Plano */}
        <Card>
          <CardHeader>
            <CardTitle>Escolha seu Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={planName}
              onValueChange={(v) =>
                setPlanName(v as "essential" | "professional" | "super")
              }
            >
              {PLANS.map((plan) => (
                <div key={plan.name} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value={plan.name} id={plan.name} className="mt-1" />
                  <Label htmlFor={plan.name} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{plan.displayName}</div>
                        <div className="text-sm text-muted-foreground">
                          {plan.description}
                        </div>
                        <div className="text-sm mt-2">
                          Até {plan.maxDoctors} profissionais e {plan.maxPatients} pacientes
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">R$ {plan.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">/mês</div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Tipo de Plano */}
        <Card>
          <CardHeader>
            <CardTitle>Periodicidade</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={planType}
              onValueChange={(v) => setPlanType(v as "mensal" | "semestral" | "anual")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="semestral">Semestral (10% desconto)</SelectItem>
                <SelectItem value="anual">Anual (20% desconto)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Método de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Método de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as "pix" | "boleto")}
            >
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="pix" id="pix" className="mt-1" />
                <Label htmlFor="pix" className="flex-1 cursor-pointer">
                  <div className="font-semibold">PIX</div>
                  <div className="text-sm text-muted-foreground">
                    Pagamento instantâneo
                  </div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="boleto" id="boleto" className="mt-1" />
                <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Boleto</div>
                  <div className="text-sm text-muted-foreground">
                    Vencimento em 3 dias úteis
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Plano:</span>
              <span className="font-semibold">{selectedPlan.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span>Periodicidade:</span>
              <span className="font-semibold">
                {planType === "mensal"
                  ? "Mensal"
                  : planType === "semestral"
                    ? "Semestral"
                    : "Anual"}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>R$ {price.toFixed(2)}</span>
            </div>
            <div className="text-sm text-muted-foreground pt-2">
              ⚠️ Você terá acesso por 1 dia (trial). Após o pagamento, sua licença será
              ativada.
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={requestSubscriptionAction.isExecuting}
        >
          {requestSubscriptionAction.isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Solicitar Licença"
          )}
        </Button>
      </form>
    </div>
  );
}

