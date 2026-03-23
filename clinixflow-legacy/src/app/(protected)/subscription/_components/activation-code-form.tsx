"use client";

import { CheckCircle2, Key, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { activateCode } from "@/src/actions/activate-code";

interface ActivationCodeFormProps {
  className?: string;
}

export function ActivationCodeForm({ className }: ActivationCodeFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const activateCodeAction = useAction(activateCode, {
    onSuccess: async ({ data }) => {
      console.log("✅ Código ativado com sucesso:", data);
      if (data) {
        toast.success(`Código ativado! Acesso liberado por ${data.days} dias.`);
      }
      setIsSuccess(true);
      setIsRedirecting(true);
      
      router.refresh();
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    },
    onError: (error) => {
      console.error("❌ Erro ao ativar código:", error);
      toast.error("Erro ao ativar código");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      activateCodeAction.execute({ code: code.trim() });
    }
  };

  if (isSuccess) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            {isRedirecting ? (
              <>
                <Loader2 className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Processando...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Atualizando sua sessão e redirecionando...
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  Código Ativado com Sucesso!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Redirecionando para o dashboard...
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Código de Ativação</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Digite seu código de ativação para acessar o sistema
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Código de Ativação</Label>
            <Input
              id="code"
              type="text"
              placeholder="Ex: MENSAL2630"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1"
              disabled={activateCodeAction.isExecuting}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!code.trim() || activateCodeAction.isExecuting}
          >
            {activateCodeAction.isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ativando...
              </>
            ) : (
              "Ativar Código"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 