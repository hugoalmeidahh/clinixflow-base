import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, Package, BarChart3, Receipt, AlertTriangle, ChevronDown, ChevronRight, Lock } from "lucide-react";

// ─── Formatters ────────────────────────────────────────────────────────────────
const fmt = (c: number) =>
  `R$ ${(c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return iso;
  }
};

// ─── Status badge configs ──────────────────────────────────────────────────────
type SubscriptionStatus = "ACTIVE" | "TRIAL" | "PAST_DUE" | "SUSPENDED" | "CANCELLED";

const STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  ACTIVE: { label: "Ativo", variant: "default" },
  TRIAL: { label: "Trial", variant: "secondary" },
  PAST_DUE: { label: "Inadimplente", variant: "destructive" },
  SUSPENDED: { label: "Suspenso", variant: "destructive" },
  CANCELLED: { label: "Cancelado", variant: "outline" },
};

const INVOICE_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  PAID: { label: "Pago", className: "bg-green-100 text-green-800 border-green-200" },
  FAILED: { label: "Falhou", className: "bg-red-100 text-red-800 border-red-200" },
  PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  CANCELLED: { label: "Cancelado", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface BillingData {
  plan_name: string;
  status: SubscriptionStatus;
  next_billing_date: string | null;
  next_billing_amount: number;
  current_period_end: string | null;
  active_modules: string[];
  current_patients: number;
  max_patients: number;
  current_members: number;
  max_members: number;
}

interface AddonModule {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  module_key: string;
}

interface Invoice {
  id: string;
  created_at: string;
  period_start: string | null;
  period_end: string | null;
  amount_total: number;
  status: string;
  items?: InvoiceItem[];
  expanded?: boolean;
}

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const progressColor = (pct: number) => {
  if (pct >= 100) return "bg-red-500";
  if (pct >= 80) return "bg-yellow-500";
  return "bg-primary";
};

// ─── Component ─────────────────────────────────────────────────────────────────
const Billing = () => {
  const { userRole, tenantId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [addons, setAddons] = useState<AddonModule[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Addon dialog
  const [addonDialogOpen, setAddonDialogOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<AddonModule | null>(null);
  const [contractingAddon, setContractingAddon] = useState(false);

  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isOwner = userRole?.role === "OWNER";

  // ── Load billing summary ──
  useEffect(() => {
    if (!isOwner || !tenantId) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("billing-checkout", {
          method: "GET",
        });
        if (error) throw error;
        setBillingData(data as BillingData);
      } catch (err: any) {
        toast.error(err?.message ?? "Erro ao carregar dados de faturamento.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isOwner, tenantId]);

  // ── Load addons ──
  useEffect(() => {
    if (!isOwner || !tenantId) return;
    const loadAddons = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("modules")
          .select("id, name, description, price_monthly, module_key")
          .eq("is_available_as_addon", true)
          .order("name");
        if (error) throw error;
        setAddons(data ?? []);
      } catch (err: any) {
        console.error("Error loading addons:", err);
      }
    };
    loadAddons();
  }, [isOwner, tenantId]);

  // ── Load invoices ──
  useEffect(() => {
    if (!isOwner || !tenantId) return;
    const loadInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from("subscription_invoices")
          .select("id, created_at, period_start, period_end, amount_total, status")
          .eq("tenant_id", tenantId)
          .order("created_at", { ascending: false })
          .limit(12);
        if (error) throw error;
        setInvoices((data ?? []).map((inv: any) => ({ ...inv, expanded: false })));
      } catch (err: any) {
        console.error("Error loading invoices:", err);
      }
    };
    loadInvoices();
  }, [isOwner, tenantId]);

  // ── Toggle invoice row expansion ──
  const toggleInvoice = async (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const nowExpanded = !inv.expanded;
        if (nowExpanded && !inv.items) {
          // Lazy load items
          (supabase as any)
            .from("subscription_invoice_items")
            .select("id, description, amount, quantity")
            .eq("invoice_id", invoiceId)
            .then(({ data }: { data: InvoiceItem[] }) => {
              setInvoices((prev2) =>
                prev2.map((i) => (i.id === invoiceId ? { ...i, items: data ?? [], expanded: true } : i))
              );
            });
          return { ...inv, expanded: true, items: undefined };
        }
        return { ...inv, expanded: nowExpanded };
      })
    );
  };

  // ── Contract addon ──
  const handleContractAddon = async () => {
    if (!selectedAddon) return;
    setContractingAddon(true);
    try {
      const { error } = await supabase.functions.invoke("billing-checkout", {
        method: "POST",
        body: { action: "contract_addon", module_id: selectedAddon.id },
      });
      if (error) throw error;
      toast.success(`Módulo "${selectedAddon.name}" contratado com sucesso!`);
      setAddonDialogOpen(false);
      setSelectedAddon(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao contratar módulo.");
    } finally {
      setContractingAddon(false);
    }
  };

  // ── Cancel subscription ──
  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const { error } = await supabase.functions.invoke("billing-checkout", {
        method: "POST",
        body: { action: "cancel_subscription" },
      });
      if (error) throw error;
      toast.success("Assinatura cancelada. Seu acesso permanece até o fim do período.");
      setCancelDialogOpen(false);
      // Refresh billing data
      const { data } = await supabase.functions.invoke("billing-checkout", { method: "GET" });
      if (data) setBillingData(data as BillingData);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao cancelar assinatura.");
    } finally {
      setCancelling(false);
    }
  };

  // ── Pro-rata estimate ──
  const proRata = selectedAddon
    ? Math.round((selectedAddon.price_monthly / 30) * 15) // simplified: ~15 days remaining
    : 0;

  // ── Access guard ──────────────────────────────────────────────────────────────
  if (!isOwner) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Acesso restrito ao proprietário</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          As configurações de faturamento e assinatura são acessíveis apenas pelo proprietário da conta.
        </p>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faturamento</h1>
        <p className="text-muted-foreground">Gerencie sua assinatura, módulos e faturas.</p>
      </div>

      {/* ── 1. Subscription Summary ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Assinatura atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : billingData ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xl font-semibold">{billingData.plan_name}</span>
                <Badge
                  variant={
                    STATUS_CONFIG[billingData.status]?.variant ?? "default"
                  }
                >
                  {STATUS_CONFIG[billingData.status]?.label ?? billingData.status}
                </Badge>
              </div>
              <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                <span>
                  Próxima cobrança:{" "}
                  <span className="font-medium text-foreground">
                    {fmtDate(billingData.next_billing_date)}
                  </span>
                </span>
                <span>
                  Valor:{" "}
                  <span className="font-medium text-foreground">
                    {fmt(billingData.next_billing_amount)}
                  </span>
                </span>
              </div>
              {billingData.active_modules?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {billingData.active_modules.map((mod) => (
                    <Badge key={mod} variant="secondary">
                      {mod}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma assinatura encontrada.</p>
          )}
        </CardContent>
      </Card>

      {/* ── 2. Usage vs Limits ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Uso do plano
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : billingData ? (
            <div className="space-y-5">
              {/* Patients */}
              {(() => {
                const pct =
                  billingData.max_patients > 0
                    ? Math.min(
                        Math.round((billingData.current_patients / billingData.max_patients) * 100),
                        100
                      )
                    : 0;
                return (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Pacientes ativos</span>
                      <span className="text-muted-foreground">
                        {billingData.current_patients} /{" "}
                        {billingData.max_patients === 0
                          ? "Ilimitado"
                          : billingData.max_patients}
                      </span>
                    </div>
                    {billingData.max_patients > 0 && (
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${progressColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
              {/* Team members */}
              {(() => {
                const pct =
                  billingData.max_members > 0
                    ? Math.min(
                        Math.round((billingData.current_members / billingData.max_members) * 100),
                        100
                      )
                    : 0;
                return (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Membros da equipe</span>
                      <span className="text-muted-foreground">
                        {billingData.current_members} /{" "}
                        {billingData.max_members === 0
                          ? "Ilimitado"
                          : billingData.max_members}
                      </span>
                    </div>
                    {billingData.max_members > 0 && (
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${progressColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Dados de uso não disponíveis.</p>
          )}
        </CardContent>
      </Card>

      {/* ── 3. Available Add-ons ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Módulos adicionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          {addons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum módulo adicional disponível.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex flex-col justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{addon.name}</p>
                    {addon.description && (
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      R${" "}
                      {(addon.price_monthly / 100).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                      /mês
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedAddon(addon);
                        setAddonDialogOpen(true);
                      }}
                    >
                      Contratar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 4. Invoice History ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Histórico de faturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma fatura encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Data</th>
                    <th className="pb-2 pr-4 font-medium">Período</th>
                    <th className="pb-2 pr-4 font-medium">Valor</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <>
                      <tr
                        key={inv.id}
                        className="cursor-pointer border-b last:border-0 hover:bg-muted/40"
                        onClick={() => toggleInvoice(inv.id)}
                      >
                        <td className="py-3 pr-4">{fmtDate(inv.created_at)}</td>
                        <td className="py-3 pr-4">
                          {inv.period_start && inv.period_end
                            ? `${fmtDate(inv.period_start)} – ${fmtDate(inv.period_end)}`
                            : "—"}
                        </td>
                        <td className="py-3 pr-4 font-medium">{fmt(inv.amount_total)}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              INVOICE_STATUS_CONFIG[inv.status]?.className ??
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {INVOICE_STATUS_CONFIG[inv.status]?.label ?? inv.status}
                          </span>
                        </td>
                        <td className="py-3 pl-2">
                          {inv.expanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                      </tr>
                      {inv.expanded && (
                        <tr key={`${inv.id}-items`} className="bg-muted/20">
                          <td colSpan={5} className="px-4 pb-3 pt-1">
                            {inv.items === undefined ? (
                              <Skeleton className="h-4 w-full" />
                            ) : inv.items.length === 0 ? (
                              <p className="text-xs text-muted-foreground">
                                Nenhum item nesta fatura.
                              </p>
                            ) : (
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-muted-foreground">
                                    <th className="pb-1 pr-4 text-left font-medium">Descrição</th>
                                    <th className="pb-1 pr-4 text-left font-medium">Qtd</th>
                                    <th className="pb-1 text-left font-medium">Valor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {inv.items.map((item) => (
                                    <tr key={item.id}>
                                      <td className="pr-4 py-0.5">{item.description}</td>
                                      <td className="pr-4 py-0.5">{item.quantity}</td>
                                      <td className="py-0.5">{fmt(item.amount)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 5. Danger Zone ── */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Zona de risco
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Cancelar assinatura</p>
              <p className="text-sm text-muted-foreground">
                Seu acesso será encerrado ao fim do período atual. Os dados ficam retidos por 90 dias.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => setCancelDialogOpen(true)}
              disabled={billingData?.status === "CANCELLED"}
            >
              Cancelar assinatura
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Addon contract dialog ── */}
      <Dialog open={addonDialogOpen} onOpenChange={setAddonDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contratar módulo</DialogTitle>
            <DialogDescription>
              Confirme a contratação do módulo abaixo.
            </DialogDescription>
          </DialogHeader>
          {selectedAddon && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="font-semibold">{selectedAddon.name}</p>
                {selectedAddon.description && (
                  <p className="text-sm text-muted-foreground">{selectedAddon.description}</p>
                )}
              </div>
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Você será cobrado agora (pro-rata):</span>
                  <span className="font-semibold">{fmt(proRata)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">A partir do próximo ciclo:</span>
                  <span className="font-semibold">
                    +{" "}
                    R${" "}
                    {(selectedAddon.price_monthly / 100).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                    /mês
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddonDialogOpen(false)} disabled={contractingAddon}>
              Cancelar
            </Button>
            <Button onClick={handleContractAddon} disabled={contractingAddon}>
              {contractingAddon ? "Contratando..." : "Confirmar contratação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Cancel subscription dialog ── */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Cancelar assinatura</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm">
              Você tem certeza? Seu acesso será encerrado em{" "}
              <span className="font-semibold">
                {fmtDate(billingData?.current_period_end ?? null)}
              </span>
              . Seus dados ficam retidos por{" "}
              <span className="font-semibold">90 dias</span> após o cancelamento.
            </p>
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Após o cancelamento, todos os profissionais perderão acesso à plataforma.
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
              Manter assinatura
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={cancelling}
            >
              {cancelling ? "Cancelando..." : "Confirmar cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
