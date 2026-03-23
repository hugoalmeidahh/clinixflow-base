import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAvailablePlans, useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Loader2, ArrowLeft, Crown } from "lucide-react";
import logoColor from "@/assets/logo-color.png";

const tierOrder: Record<string, number> = { FREE: 0, STARTER: 1, PROFESSIONAL: 2, ENTERPRISE: 3 };
const tierColors: Record<string, string> = {
  FREE: "bg-slate-100 text-slate-700",
  STARTER: "bg-blue-100 text-blue-700",
  PROFESSIONAL: "bg-primary/10 text-primary",
  ENTERPRISE: "bg-amber-100 text-amber-700",
};

const moduleLabels: Record<string, string> = {
  BASE: "Clínica",
  EVALUATIONS: "Avaliações",
  FINANCIAL: "Financeiro",
  REPORTS: "Relatórios",
  VACCINES: "Vacinas",
};

const formatCurrency = (centavos: number) =>
  `R$ ${(centavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const Plans = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { data: plans, isLoading } = useAvailablePlans();
  const { data: subData } = useSubscription();
  const [yearly, setYearly] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  const currentPlanId = subData?.subscription?.plan_id;
  const isAdmin = userRole?.role === "ORG_ADMIN";

  const handleSubscribe = async (planId: string) => {
    if (!isAdmin) {
      toast.error("Apenas o administrador pode alterar o plano.");
      return;
    }

    setCheckingOut(planId);
    try {
      const { data, error } = await supabase.functions.invoke("billing-checkout", {
        body: { planId, billingCycle: yearly ? "YEARLY" : "MONTHLY" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.success("Plano atualizado com sucesso!");
        navigate("/settings?tab=subscription");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar assinatura");
    } finally {
      setCheckingOut(null);
    }
  };

  const sortedPlans = (plans || []).sort(
    (a, b) => (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <img src={logoColor} alt="ClinixFlow" className="mx-auto h-8" />
          <h1 className="text-3xl font-heading font-bold">Escolha o plano ideal</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Comece com o que precisa e escale conforme sua clínica cresce.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Label className={`text-sm ${!yearly ? "font-bold" : "text-muted-foreground"}`}>Mensal</Label>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <Label className={`text-sm ${yearly ? "font-bold" : "text-muted-foreground"}`}>
              Anual <Badge variant="secondary" className="ml-1 text-xs">Economize</Badge>
            </Label>
          </div>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedPlans.map((plan) => {
              const price = yearly ? plan.price_yearly : plan.price_monthly;
              const isCurrent = plan.id === currentPlanId;
              const isPopular = plan.tier === "PROFESSIONAL";

              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${isPopular ? "border-primary shadow-md" : ""} ${isCurrent ? "ring-2 ring-primary" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white">
                        <Crown className="h-3 w-3 mr-1" /> Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={tierColors[plan.tier] || ""}>{plan.tier}</Badge>
                      {isCurrent && <Badge variant="outline">Atual</Badge>}
                    </div>
                    <CardTitle className="font-heading text-lg">{plan.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    {/* Price */}
                    <div className="mb-4">
                      {price > 0 ? (
                        <>
                          <span className="text-3xl font-bold">{formatCurrency(price)}</span>
                          <span className="text-sm text-muted-foreground">
                            {yearly ? "/ano" : "/mês"}
                          </span>
                          {yearly && plan.price_monthly > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              equivale a {formatCurrency(Math.round(plan.price_yearly / 12))}/mês
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-3xl font-bold">Grátis</span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-2 flex-1 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{plan.max_users} {plan.max_users === 1 ? "usuário" : "usuários"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{plan.max_patients ? `${plan.max_patients} pacientes` : "Pacientes ilimitados"}</span>
                      </div>
                      {(plan.allowed_modules || []).map((mod: string) => (
                        <div key={mod} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          <span>{moduleLabels[mod] || mod}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    {isCurrent ? (
                      <Button variant="outline" disabled className="w-full">
                        Plano atual
                      </Button>
                    ) : (
                      <Button
                        variant={isPopular ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={checkingOut !== null || !isAdmin}
                      >
                        {checkingOut === plan.id && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {price > 0 ? "Assinar" : "Começar grátis"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Back button */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Plans;
