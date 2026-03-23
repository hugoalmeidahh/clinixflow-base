import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription, useInvoices } from "@/hooks/useSubscription";
import { CreditCard, ArrowRight, Users, Database, Puzzle, XCircle, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  TRIAL: { label: "Período de Teste", variant: "secondary" },
  ACTIVE: { label: "Ativa", variant: "default" },
  PAST_DUE: { label: "Pagamento Pendente", variant: "destructive" },
  SUSPENDED: { label: "Suspensa", variant: "destructive" },
  CANCELLED: { label: "Cancelada", variant: "outline" },
};

const invoiceStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendente", variant: "secondary" },
  PAID: { label: "Pago", variant: "default" },
  FAILED: { label: "Falhou", variant: "destructive" },
  REFUNDED: { label: "Reembolsado", variant: "outline" },
  CANCELLED: { label: "Cancelado", variant: "outline" },
};

const formatCurrency = (centavos: number) =>
  `R$ ${(centavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const SubscriptionTab = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useSubscription();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("billing-manage", {
        body: { action: "cancel" },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      toast.success("Assinatura será cancelada ao final do período atual.");
      setCancelDialog(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao cancelar assinatura");
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  const subscription = data?.subscription;
  const plan = subscription?.plans;
  const usage = data?.usage;
  const status = statusConfig[subscription?.status || "TRIAL"] || statusConfig.TRIAL;

  return (
    <div className="space-y-4">
      {/* Current Plan Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Plano Atual
          </CardTitle>
          <Badge variant={status.variant}>{status.label}</Badge>
        </CardHeader>
        <CardContent>
          {subscription && plan ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold font-heading">{plan.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{plan.tier?.toLowerCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {formatCurrency(subscription.price_centavos)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.billing_cycle === "YEARLY" ? "/ano" : "/mês"}
                  </p>
                </div>
              </div>

              {subscription.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  {subscription.cancel_at_period_end
                    ? "Cancela em: "
                    : "Próxima cobrança: "}
                  <strong>{new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}</strong>
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/plans")}>
                  <ArrowRight className="h-4 w-4 mr-1" /> Trocar plano
                </Button>
                {subscription.status === "ACTIVE" && !subscription.cancel_at_period_end && (
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setCancelDialog(true)}>
                    <XCircle className="h-4 w-4 mr-1" /> Cancelar assinatura
                  </Button>
                )}
                {subscription.cancel_at_period_end && (
                  <Badge variant="outline" className="text-amber-600">Cancelamento agendado</Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-3">Nenhum plano ativo</p>
              <Button onClick={() => navigate("/plans")}>
                Ver planos disponíveis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Card */}
      {plan && usage && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Uso Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Usuários</p>
                  <p className="text-xs text-muted-foreground">
                    {usage.currentUsers} / {plan.max_users}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Pacientes</p>
                  <p className="text-xs text-muted-foreground">
                    {usage.currentPatients} / {plan.max_patients ?? "Ilimitado"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Puzzle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Módulos</p>
                  <p className="text-xs text-muted-foreground">
                    {plan.allowed_modules?.length || 0} disponíveis
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Histórico de Cobranças</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoicesLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : !invoices || invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhuma cobrança registrada
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ciclo</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => {
                  const invStatus = invoiceStatusConfig[inv.status] || invoiceStatusConfig.PENDING;
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="text-sm">
                        {new Date(inv.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(inv.amount_centavos)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {inv.billing_cycle === "YEARLY" ? "Anual" : "Mensal"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {inv.payment_method === "PIX" ? "PIX" :
                         inv.payment_method === "BOLETO" ? "Boleto" :
                         inv.payment_method === "CREDIT_CARD" ? "Cartão" : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={invStatus.variant}>{invStatus.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Assinatura</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar? Você poderá continuar usando o sistema até o final do período atual.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionTab;
