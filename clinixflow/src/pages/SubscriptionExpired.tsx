import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/hooks/useTenant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, LogOut } from "lucide-react";
import logoColor from "@/assets/logo-color.png";

const SubscriptionExpired = () => {
  const navigate = useNavigate();
  const { signOut, userRole } = useAuth();
  const { tenant } = useTenant();

  const trialEndDate = tenant?.subscription_ends_at
    ? new Date(tenant.subscription_ends_at).toLocaleDateString("pt-BR")
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logoColor} alt="ClinixFlow" className="mx-auto mb-4 h-10" />
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-xl">Período de teste encerrado</CardTitle>
          <CardDescription>
            {trialEndDate
              ? `Seu período de teste gratuito expirou em ${trialEndDate}.`
              : "Seu período de teste gratuito expirou."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Para continuar usando o ClinixFlow, escolha um plano que melhor se encaixa nas necessidades da sua clínica.
          </p>

          {userRole?.role === "ORG_ADMIN" && (
            <Button className="w-full" size="lg" onClick={() => navigate("/plans")}>
              Ver planos disponíveis
            </Button>
          )}

          {userRole?.role !== "ORG_ADMIN" && (
            <p className="text-center text-sm text-muted-foreground">
              Entre em contato com o administrador da sua clínica para renovar a assinatura.
            </p>
          )}

          <Button variant="outline" className="w-full" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionExpired;
