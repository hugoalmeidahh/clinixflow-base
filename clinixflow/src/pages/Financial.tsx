import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CashBookView from "@/components/financial/CashBookView";
import ReceivablesPayablesView from "@/components/financial/ReceivablesPayablesView";
import FinancialDashboard from "@/components/financial/FinancialDashboard";
import NfseView from "@/components/financial/NfseView";
import InsuranceBatchView from "@/components/financial/InsuranceBatchView";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import {
  DollarSign, Plus, TrendingUp, TrendingDown, Wallet,
  ArrowUpRight, ArrowDownRight, Download, Paperclip, Loader2,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { exportToCsv } from "@/lib/exportCsv";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FinancialCategory { id: string; name: string; type: string; parent_id: string | null; is_active: boolean; }
interface CostCenter { id: string; code: string; name: string; is_active: boolean; }

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCurrency = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const QUICK_RANGES = [
  { label: "Hoje", getValue: () => ({ start: format(new Date(), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd") }) },
  { label: "Esta semana", getValue: () => ({ start: format(startOfWeek(new Date(), { locale: ptBR }), "yyyy-MM-dd"), end: format(endOfWeek(new Date(), { locale: ptBR }), "yyyy-MM-dd") }) },
  { label: "Este mês", getValue: () => ({ start: format(startOfMonth(new Date()), "yyyy-MM-dd"), end: format(endOfMonth(new Date()), "yyyy-MM-dd") }) },
  { label: "Mês anterior", getValue: () => ({ start: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"), end: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd") }) },
];

const PAYMENT_METHODS = ["PIX", "DINHEIRO", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO", "TRANSFERENCIA"];

// ── Financial Page ────────────────────────────────────────────────────────────

const Financial = () => {
  const { tenantId, user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({ totalIncome: 0, totalExpense: 0, received: 0, outstanding: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);

  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PROJECTED" | "REALIZED" | "RECEIVED">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [costCenterFilter, setCostCenterFilter] = useState("ALL");

  const defaultForm = () => ({
    type: "INCOME" as "INCOME" | "EXPENSE",
    amount: "",
    description: "",
    competenceDate: format(new Date(), "yyyy-MM-dd"),
    paymentDate: "",
    paymentMethod: "",
    categoryId: "",
    costCenterId: "",
    isPaid: false,
    receiptFile: null as File | null,
    // installment/recurrence
    repeatMode: "NONE" as "NONE" | "INSTALLMENT" | "RECURRING",
    installmentCount: "2",
    recurringFreq: "MONTHLY" as "WEEKLY" | "MONTHLY" | "YEARLY",
    recurringCount: "12",
  });

  const [form, setForm] = useState(defaultForm());

  const fetchMeta = useCallback(async () => {
    if (!tenantId) return;
    const [catRes, ccRes] = await Promise.all([
      (supabase as any).from("financial_categories").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
      (supabase as any).from("cost_centers").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
    ]);
    setCategories(catRes.data || []);
    setCostCenters(ccRes.data || []);
  }, [tenantId]);

  const fetchTransactions = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    let query = supabase
      .from("transactions")
      .select("*, patients(full_name), professionals(full_name), conventions(name)")
      .eq("tenant_id", tenantId)
      .gte("reference_date", dateRange.start)
      .lte("reference_date", dateRange.end)
      .order("reference_date", { ascending: false });

    if (typeFilter !== "ALL") query = query.eq("type", typeFilter);
    if (statusFilter !== "ALL") query = query.eq("financial_status", statusFilter as any);
    if (categoryFilter !== "ALL") query = (query as any).eq("category_id", categoryFilter);
    if (costCenterFilter !== "ALL") query = (query as any).eq("cost_center_id", costCenterFilter);

    const { data } = await query;
    const items = data || [];
    setTransactions(items);

    const income = items.filter(t => t.type === "INCOME");
    const expense = items.filter(t => t.type === "EXPENSE");
    const received = income.filter(t => t.is_paid).reduce((s, t) => s + Number(t.amount), 0);
    const totalIncome = income.reduce((s, t) => s + Number(t.amount), 0);
    setKpi({ totalIncome, totalExpense: expense.reduce((s, t) => s + Number(t.amount), 0), received, outstanding: totalIncome - received });
    setLoading(false);
  }, [tenantId, dateRange, typeFilter, statusFilter, categoryFilter, costCenterFilter]);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Build installment dates from base date
  const buildInstallmentDates = (baseDate: string, count: number, freq: "WEEKLY" | "MONTHLY" | "YEARLY") => {
    const dates: string[] = [];
    const base = new Date(baseDate);
    for (let i = 0; i < count; i++) {
      const d = new Date(base);
      if (freq === "WEEKLY") d.setDate(d.getDate() + 7 * i);
      else if (freq === "MONTHLY") d.setMonth(d.getMonth() + i);
      else d.setFullYear(d.getFullYear() + i);
      dates.push(format(d, "yyyy-MM-dd"));
    }
    return dates;
  };

  const handleCreate = async () => {
    if (!tenantId || !form.amount || !form.description) return;
    setSaving(true);
    let receiptUrl: string | null = null;

    if (form.receiptFile) {
      setUploadingReceipt(true);
      const ext = form.receiptFile.name.split(".").pop();
      const path = `${tenantId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("financial-receipts").upload(path, form.receiptFile);
      if (!upErr) receiptUrl = path;
      setUploadingReceipt(false);
    }

    const basePayload = {
      tenant_id: tenantId,
      type: form.type,
      amount: parseFloat(form.amount),
      description: form.description,
      payment_method: form.paymentMethod || null,
      is_paid: form.isPaid,
      paid_at: form.isPaid && form.paymentDate ? new Date(form.paymentDate).toISOString() : form.isPaid ? new Date().toISOString() : null,
      created_by: user?.id || null,
      financial_status: form.isPaid ? "RECEIVED" : "PROJECTED",
      ...(form.categoryId ? { category_id: form.categoryId } : {}),
      ...(form.costCenterId ? { cost_center_id: form.costCenterId } : {}),
      ...(receiptUrl ? { receipt_url: receiptUrl } : {}),
    };

    if (form.repeatMode === "NONE") {
      // Single transaction
      const { error } = await (supabase as any).from("transactions").insert({
        ...basePayload,
        reference_date: form.competenceDate,
      });
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      // Installment or recurrence group
      const groupId = crypto.randomUUID();
      const count = form.repeatMode === "INSTALLMENT" ? parseInt(form.installmentCount) : parseInt(form.recurringCount);
      const freq = form.repeatMode === "INSTALLMENT" ? "MONTHLY" : form.recurringFreq;
      const dates = buildInstallmentDates(form.competenceDate, count, freq);
      const rows = dates.map((d, i) => ({
        ...basePayload,
        reference_date: d,
        is_paid: false, paid_at: null, financial_status: "PROJECTED",
        description: form.repeatMode === "INSTALLMENT"
          ? `${form.description} (${i + 1}/${count})`
          : form.description,
        installment_group_id: groupId,
        installment_number: i + 1,
        installment_total: count,
      }));
      const { error } = await (supabase as any).from("transactions").insert(rows);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success(`${count} parcelas criadas com sucesso!`);
      setDialogOpen(false);
      setForm(defaultForm());
      fetchTransactions();
      setSaving(false);
      return;
    }

    toast.success("Lançamento criado!");
    setDialogOpen(false);
    setForm(defaultForm());
    fetchTransactions();
    setSaving(false);
  };

  const markAsReceived = async (t: any) => {
    const { error } = await supabase.from("transactions").update({ financial_status: "RECEIVED" as any, is_paid: true, paid_at: new Date().toISOString() }).eq("id", t.id);
    if (error) toast.error(error.message);
    else { toast.success("Marcado como recebido!"); fetchTransactions(); }
  };

  const undoReceived = async (t: any) => {
    const { error } = await supabase.from("transactions").update({ financial_status: "REALIZED" as any, is_paid: false, paid_at: null }).eq("id", t.id);
    if (error) toast.error(error.message);
    else fetchTransactions();
  };

  const filteredCategories = categories.filter(c => c.type === form.type);

  const kpiCards = [
    { label: "Receita Total", value: formatCurrency(kpi.totalIncome), icon: TrendingUp, color: "text-badge-attended" },
    { label: "Despesas", value: formatCurrency(kpi.totalExpense), icon: TrendingDown, color: "text-badge-absent" },
    { label: "Recebido", value: formatCurrency(kpi.received), icon: Wallet, color: "text-primary" },
    { label: "A Receber", value: formatCurrency(kpi.outstanding), icon: DollarSign, color: "text-badge-justified" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Controle de receitas e despesas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={v => { setDialogOpen(v); if (!v) setForm(defaultForm()); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Novo Lançamento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-heading">Novo Lançamento</DialogTitle></DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Type */}
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <div className="flex gap-2">
                  {(["INCOME", "EXPENSE"] as const).map(t => (
                    <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t, categoryId: "" }))}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${form.type === t ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                      {t === "INCOME" ? "Receita" : "Despesa"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount + Competence Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Valor (R$) *</Label>
                  <Input type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Data de Competência *</Label>
                  <Input type="date" value={form.competenceDate} onChange={e => setForm(p => ({ ...p, competenceDate: e.target.value }))} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Descrição *</Label>
                <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descrição do lançamento" />
              </div>

              {/* Category + Cost Center */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}>
                    <option value="">Sem categoria</option>
                    {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Centro de Custo</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.costCenterId} onChange={e => setForm(p => ({ ...p, costCenterId: e.target.value }))}>
                    <option value="">Nenhum</option>
                    {costCenters.map(c => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}>
                  <option value="">Selecionar</option>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace(/_/g, " ")}</option>)}
                </select>
              </div>

              {/* Paid toggle + payment date */}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isPaid" checked={form.isPaid} onChange={e => setForm(p => ({ ...p, isPaid: e.target.checked }))} className="rounded border-input h-4 w-4" />
                <Label htmlFor="isPaid" className="cursor-pointer">Já pago/recebido</Label>
              </div>
              {form.isPaid && (
                <div className="space-y-2">
                  <Label>Data do Pagamento</Label>
                  <Input type="date" value={form.paymentDate} onChange={e => setForm(p => ({ ...p, paymentDate: e.target.value }))} />
                </div>
              )}

              {/* Installment / Recurrence */}
              <div className="space-y-2">
                <Label>Repetição</Label>
                <div className="flex gap-2">
                  {(["NONE", "INSTALLMENT", "RECURRING"] as const).map(m => (
                    <button key={m} type="button" onClick={() => setForm(p => ({ ...p, repeatMode: m }))}
                      className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${form.repeatMode === m ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                      {m === "NONE" ? "Avulso" : m === "INSTALLMENT" ? "Parcelado" : "Recorrente"}
                    </button>
                  ))}
                </div>
                {form.repeatMode === "INSTALLMENT" && (
                  <div className="mt-2 p-3 rounded-md bg-muted/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs whitespace-nowrap">Nº de parcelas</Label>
                      <Input type="number" min={2} max={60} value={form.installmentCount} onChange={e => setForm(p => ({ ...p, installmentCount: e.target.value }))} className="w-20 h-8 text-sm" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Serão geradas {form.installmentCount} parcelas mensais de {form.amount ? `R$ ${(parseFloat(form.amount)).toFixed(2)}` : "—"} cada.
                    </p>
                  </div>
                )}
                {form.repeatMode === "RECURRING" && (
                  <div className="mt-2 p-3 rounded-md bg-muted/40 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Frequência</Label>
                        <select className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs" value={form.recurringFreq} onChange={e => setForm(p => ({ ...p, recurringFreq: e.target.value as any }))}>
                          <option value="WEEKLY">Semanal</option>
                          <option value="MONTHLY">Mensal</option>
                          <option value="YEARLY">Anual</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Repetições</Label>
                        <Input type="number" min={2} max={120} value={form.recurringCount} onChange={e => setForm(p => ({ ...p, recurringCount: e.target.value }))} className="mt-1 h-8 text-xs" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Receipt upload (only for single transactions) */}
              {form.repeatMode === "NONE" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Paperclip className="h-3.5 w-3.5" /> Comprovante (PDF/imagem)</Label>
                  <Input type="file" accept="image/*,.pdf" onChange={e => setForm(p => ({ ...p, receiptFile: e.target.files?.[0] || null }))} className="cursor-pointer" />
                </div>
              )}

              <Button onClick={handleCreate} disabled={saving || uploadingReceipt || !form.amount || !form.description} className="w-full">
                {(saving || uploadingReceipt) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {uploadingReceipt ? "Enviando comprovante..." : saving ? "Salvando..." : "Criar Lançamento"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-16" /></CardContent></Card>)
        ) : (
          kpiCards.map(card => (
            <Card key={card.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <card.icon className={`h-8 w-8 ${card.color}`} />
                </div>
                <div className="mt-3">
                  <p className="text-xl font-bold font-heading">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
          <TabsTrigger value="livro-caixa">Livro Caixa</TabsTrigger>
          <TabsTrigger value="contas">A Pagar / A Receber</TabsTrigger>
          <TabsTrigger value="nfse">NFSe</TabsTrigger>
          <TabsTrigger value="fechamento">Fechamento Convênio</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="livro-caixa" className="mt-4">
          <CashBookView />
        </TabsContent>

        <TabsContent value="contas" className="mt-4">
          <ReceivablesPayablesView />
        </TabsContent>

        <TabsContent value="nfse" className="mt-4">
          <NfseView />
        </TabsContent>

        <TabsContent value="fechamento" className="mt-4">
          <InsuranceBatchView />
        </TabsContent>

        <TabsContent value="lancamentos" className="mt-4 space-y-4">

      {/* Quick date filters */}
      <div className="flex flex-wrap gap-2">
        {QUICK_RANGES.map(r => (
          <Button key={r.label} size="sm" variant="outline" className="text-xs" onClick={() => setDateRange(r.getValue())}>
            {r.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs">De</Label>
          <Input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Até</Label>
          <Input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tipo</Label>
          <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
            <option value="ALL">Todos</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Despesas</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Status</Label>
          <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
            <option value="ALL">Todos</option>
            <option value="PROJECTED">Projetado</option>
            <option value="REALIZED">Realizado</option>
            <option value="RECEIVED">Recebido</option>
          </select>
        </div>
        {categories.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs">Categoria</Label>
            <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="ALL">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        {costCenters.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs">Centro de Custo</Label>
            <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={costCenterFilter} onChange={e => setCostCenterFilter(e.target.value)}>
              <option value="ALL">Todos</option>
              {costCenters.map(c => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg">Livro Caixa</CardTitle>
          {transactions.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => exportToCsv(
              `financeiro_${dateRange.start}_${dateRange.end}`,
              transactions.map(t => ({
                data: format(new Date(t.reference_date), "dd/MM/yyyy"),
                tipo: t.type === "INCOME" ? "Receita" : "Despesa",
                descricao: t.description,
                paciente: t.patients?.full_name || "",
                valor: Number(t.amount).toFixed(2),
                pagamento: t.payment_method || "",
                status: t.financial_status || (t.is_paid ? "Pago" : "Pendente"),
              })),
              [
                { key: "data", label: "Data" },
                { key: "tipo", label: "Tipo" },
                { key: "descricao", label: "Descrição" },
                { key: "paciente", label: "Paciente" },
                { key: "valor", label: "Valor" },
                { key: "pagamento", label: "Pagamento" },
                { key: "status", label: "Status" },
              ]
            )}>
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : transactions.length === 0 ? (
            <EmptyState icon={DollarSign} title="Nenhum lançamento" description="Crie o primeiro lançamento financeiro." actionLabel="+ Novo Lançamento" onAction={() => setDialogOpen(true)} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="text-sm">{format(new Date(t.reference_date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      {t.type === "INCOME" ? (
                        <span className="flex items-center gap-1 text-badge-attended text-xs font-semibold"><ArrowUpRight className="h-3 w-3" /> Receita</span>
                      ) : (
                        <span className="flex items-center gap-1 text-badge-absent text-xs font-semibold"><ArrowDownRight className="h-3 w-3" /> Despesa</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{t.description}</TableCell>
                    <TableCell className="text-sm">{t.patients?.full_name || "—"}</TableCell>
                    <TableCell className={`text-right font-mono font-semibold ${t.type === "INCOME" ? "text-badge-attended" : "text-badge-absent"}`}>
                      {t.type === "EXPENSE" ? "- " : ""}R$ {Number(t.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs">{t.payment_method || "—"}</TableCell>
                    <TableCell>
                      {t.financial_status === "RECEIVED" ? (
                        <StatusBadge variant="attended" label="Recebido" />
                      ) : t.financial_status === "REALIZED" ? (
                        <StatusBadge variant="confirmed" label="Realizado" />
                      ) : t.financial_status === "PROJECTED" ? (
                        <StatusBadge variant="info" label="Projetado" />
                      ) : (
                        <StatusBadge variant={t.is_paid ? "attended" : "warning"} label={t.is_paid ? "Pago" : "Pendente"} />
                      )}
                    </TableCell>
                    <TableCell>
                      {t.financial_status === "REALIZED" && t.type === "INCOME" ? (
                        <Button variant="ghost" size="sm" onClick={() => markAsReceived(t)}>Receber</Button>
                      ) : t.financial_status === "RECEIVED" ? (
                        <Button variant="ghost" size="sm" onClick={() => undoReceived(t)}>Desfazer</Button>
                      ) : !t.financial_status || t.financial_status === null ? (
                        <Button variant="ghost" size="sm" onClick={() => markAsReceived(t)}>
                          {t.is_paid ? "Desfazer" : "Pagar"}
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financial;
