import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldAlert, CreditCard, QrCode, LogOut, Phone } from "lucide-react";
import logoColor from "@/assets/logo-color.png";

const MOCK_PIX_CODE =
  "00020126580014BR.GOV.BCB.PIX0136clinixflow@pagamentos.com.br5204000053039865802BR5925ClinixFlow Saude Digital6009SAO PAULO62070503***6304ABCD";

const Blocked = () => {
  const { signOut } = useAuth();
  const [retrying, setRetrying] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [savingCard, setSavingCard] = useState(false);

  const handleRetryPayment = async () => {
    setRetrying(true);
    try {
      const { error } = await supabase.functions.invoke("billing-checkout", {
        method: "POST",
        body: { action: "retry_payment" },
      });
      if (error) throw error;
      toast.success("Pagamento reprocessado com sucesso! Recarregando...");
      setTimeout(() => window.location.replace("/dashboard"), 2000);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao tentar reprocessar o pagamento. Tente novamente.");
    } finally {
      setRetrying(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(MOCK_PIX_CODE).then(() => {
      setPixCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setPixCopied(false), 3000);
    });
  };

  const handleSaveCard = async () => {
    if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
      toast.error("Preencha todos os campos do cartão.");
      return;
    }
    setSavingCard(true);
    try {
      const { error } = await supabase.functions.invoke("billing-checkout", {
        method: "POST",
        body: { action: "update_card", card: cardForm },
      });
      if (error) throw error;
      toast.success("Cartão atualizado! Tentando reprocessar o pagamento...");
      setCardModalOpen(false);
      setCardForm({ number: "", name: "", expiry: "", cvv: "" });
      setTimeout(handleRetryPayment, 1000);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao atualizar cartão.");
    } finally {
      setSavingCard(false);
    }
  };

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <img src={logoColor} alt="ClinixFlow" className="h-8" />
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Conta suspensa por inadimplência</h1>
          <p className="mt-2 text-muted-foreground">
            Regularize seu pagamento para retomar o acesso à plataforma.
          </p>
        </div>

        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {/* Card 1 — Retry payment */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Tentar novamente</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Reprocesse o pagamento com o cartão já cadastrado.
              </p>
              <Button className="w-full" onClick={handleRetryPayment} disabled={retrying}>
                {retrying ? "Processando..." : "Tentar novamente"}
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 — PIX */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <QrCode className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-base">Pagar via PIX</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Copie o código PIX abaixo e pague pelo app do seu banco. A liberação ocorre em até 1 hora útil.
              </p>
              <div className="space-y-2">
                <div className="rounded-md border bg-muted px-3 py-2">
                  <p className="break-all font-mono text-xs text-muted-foreground">
                    {MOCK_PIX_CODE.slice(0, 40)}...
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={handleCopyPix}>
                  {pixCopied ? "Copiado!" : "Copiar código PIX"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 — Update card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-base">Atualizar cartão</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Cadastre um novo cartão de crédito e reprocesse o pagamento automaticamente.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setCardModalOpen(true)}>
                Atualizar cartão
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support link */}
        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>Precisa de ajuda?</span>
          <a
            href="mailto:suporte@clinixflow.com.br"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Falar com suporte
          </a>
        </div>
      </div>

      {/* Update card modal */}
      <Dialog open={cardModalOpen} onOpenChange={setCardModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Atualizar cartão de crédito</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="card-number">Número do cartão</Label>
              <Input
                id="card-number"
                placeholder="0000 0000 0000 0000"
                value={cardForm.number}
                onChange={(e) =>
                  setCardForm((f) => ({ ...f, number: formatCardNumber(e.target.value) }))
                }
                maxLength={19}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-name">Nome no cartão</Label>
              <Input
                id="card-name"
                placeholder="NOME SOBRENOME"
                value={cardForm.name}
                onChange={(e) =>
                  setCardForm((f) => ({ ...f, name: e.target.value.toUpperCase() }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Validade</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/AA"
                  value={cardForm.expiry}
                  onChange={(e) =>
                    setCardForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))
                  }
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvv">CVV</Label>
                <Input
                  id="card-cvv"
                  placeholder="000"
                  value={cardForm.cvv}
                  onChange={(e) =>
                    setCardForm((f) => ({
                      ...f,
                      cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                    }))
                  }
                  maxLength={4}
                />
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldAlert className="h-3.5 w-3.5 text-green-600" />
              Seus dados são protegidos com criptografia de ponta a ponta.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setCardModalOpen(false)} disabled={savingCard}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCard} disabled={savingCard}>
              {savingCard ? "Salvando..." : "Salvar e pagar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blocked;
