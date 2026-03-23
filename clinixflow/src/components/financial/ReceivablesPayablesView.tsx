import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DollarSign, TrendingDown, TrendingUp, CheckCircle2, Loader2, AlertTriangle, Clock, Calendar } from "lucide-react";
import { format, isAfter, isBefore, isToday, addDays, startOfDay, endOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PendingEntry {
  id: string;
  type: "INCOME" | "EXPENSE";
  description: string;
  amount: number;
  reference_date: string;
  payment_method?: string;
  patients?: { full_name: string } | null;
  financial_status?: string;
  is_paid?: boolean;
  dueStatus?: "overdue" | "today" | "soon" | "future";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const getDueStatus = (dateStr: string): "overdue" | "today" | "soon" | "future" => {
  const d = parseISO(dateStr);
  const now = new Date();
  if (isBefore(d, startOfDay(now))) return "overdue";
  if (isToday(d)) return "today";
  if (isBefore(d, addDays(now, 7))) return "soon";
  return "future";
};

const DueBadge = ({ status }: { status: "overdue" | "today" | "soon" | "future" }) => {
  const config = {
    overdue: { label: "Vencido", className: "bg-red-100 text-red-700 border-red-200" },
    today: { label: "Vence hoje", className: "bg-amber-100 text-amber-700 border-amber-200" },
    soon: { label: "Vence em breve", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    future: { label: "No prazo", className: "bg-muted text-muted-foreground" },
  }[status];
  return <Badge variant="outline" className={`text-xs ${config.className}`}>{config.label}</Badge>;
};

// ── Settle Dialog ──────────────────────────────────────────────────────────────

const SettleDialog = ({
  entry,
  open,
  onClose,
  onSettled,
}: {
  entry: PendingEntry | null;
  open: boolean;
  onClose: () => void;
  onSettled: () => void;
}) => {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (entry) setAmount(Number(entry.amount).toFixed(2));
  }, [entry]);

  const handleSettle = async () => {
    if (!entry) return;
    setSaving(true);
    const { error } = await supabase.from("transactions").update({
      financial_status: "RECEIVED" as any,
      is_paid: true,
      paid_at: new Date(paymentDate).toISOString(),
      amount: parseFloat(amount) as any,
    }).eq("id", entry.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Lançamento baixado com sucesso!");
      onSettled();
      onClose();
    }
    setSaving(false);
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Baixar {entry.type === "INCOME" ? "Recebível" : "Pagável"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{entry.description}</p>
          <div className="space-y-2">
            <Label>Valor Recebido/Pago (R$)</Label>
            <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
            <p className="text-xs text-muted-foreground">Valor original: {fmt(Number(entry.amount))}</p>
          </div>
          <div className="space-y-2">
            <Label>Data do Pagamento</Label>
            <Input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
          </div>
          <Button onClick={handleSettle} disabled={saving || !amount} className="w-full">
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirmar Baixa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Entries Panel ──────────────────────────────────────────────────────────────

const EntriesPanel = ({
  entries,
  loading,
  type,
  onSettle,
}: {
  entries: PendingEntry[];
  loading: boolean;
  type: "INCOME" | "EXPENSE";
  onSettle: (e: PendingEntry) => void;
}) => {
  const total = entries.reduce((s, e) => s + Number(e.amount), 0);
  const overdue = entries.filter(e => e.dueStatus === "overdue").reduce((s, e) => s + Number(e.amount), 0);

  if (loading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>;

  const icon = type === "INCOME" ? TrendingUp : TrendingDown;
  const label = type === "INCOME" ? "receber" : "pagar";

  return (
    <div className="space-y-4">
      {/* Totals */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            {type === "INCOME" ? <TrendingUp className="h-5 w-5 text-badge-attended shrink-0" /> : <TrendingDown className="h-5 w-5 text-badge-absent shrink-0" />}
            <div>
              <p className={`font-semibold text-sm font-heading ${type === "INCOME" ? "text-badge-attended" : "text-badge-absent"}`}>{fmt(total)}</p>
              <p className="text-xs text-muted-foreground">Total a {label}</p>
            </div>
          </CardContent>
        </Card>
        {overdue > 0 && (
          <Card className="border-red-200">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="font-semibold text-sm font-heading text-red-600">{fmt(overdue)}</p>
                <p className="text-xs text-muted-foreground">Vencido</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* List */}
      {entries.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Tudo em dia!" description={`Nenhum lançamento pendente a ${label}.`} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map(e => (
                  <TableRow key={e.id} className={e.dueStatus === "overdue" ? "bg-red-50/50" : e.dueStatus === "today" ? "bg-amber-50/50" : undefined}>
                    <TableCell className="text-sm whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(parseISO(e.reference_date), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm max-w-[180px] truncate">{e.description}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.patients?.full_name || "—"}</TableCell>
                    <TableCell className={`text-right font-mono font-semibold text-sm ${type === "INCOME" ? "text-badge-attended" : "text-badge-absent"}`}>
                      {fmt(Number(e.amount))}
                    </TableCell>
                    <TableCell><DueBadge status={e.dueStatus!} /></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onSettle(e)}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Baixar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

const ReceivablesPayablesView = () => {
  const { tenantId } = useAuth();
  const [receivables, setReceivables] = useState<PendingEntry[]>([]);
  const [payables, setPayables] = useState<PendingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [settleEntry, setSettleEntry] = useState<PendingEntry | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [categories, setCategories] = useState<any[]>([]);
  const [dateEnd, setDateEnd] = useState("");

  useEffect(() => {
    if (!tenantId) return;
    (supabase as any).from("financial_categories").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("name").then(({ data }: any) => setCategories(data || []));
  }, [tenantId]);

  const fetchPending = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);

    let query = supabase
      .from("transactions")
      .select("*, patients(full_name)")
      .eq("tenant_id", tenantId)
      .eq("is_paid", false)
      .not("financial_status", "eq", "RECEIVED" as any)
      .order("reference_date", { ascending: true });

    if (dateEnd) query = query.lte("reference_date", dateEnd);
    if (categoryFilter !== "ALL") query = (query as any).eq("category_id", categoryFilter);

    const { data } = await query;
    const items: PendingEntry[] = (data || []).map((e: any) => ({
      ...e,
      dueStatus: getDueStatus(e.reference_date),
    }));

    setReceivables(items.filter(e => e.type === "INCOME"));
    setPayables(items.filter(e => e.type === "EXPENSE"));
    setLoading(false);
  }, [tenantId, dateEnd, categoryFilter]);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Vencimento até</Label>
          <Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="w-40" />
        </div>
        {categories.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs">Categoria</Label>
            <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="ALL">Todas</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
      </div>

      <Tabs defaultValue="receivables">
        <TabsList>
          <TabsTrigger value="receivables" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            A Receber {receivables.length > 0 && `(${receivables.length})`}
          </TabsTrigger>
          <TabsTrigger value="payables" className="gap-1.5">
            <TrendingDown className="h-3.5 w-3.5" />
            A Pagar {payables.length > 0 && `(${payables.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="receivables" className="mt-4">
          <EntriesPanel entries={receivables} loading={loading} type="INCOME" onSettle={setSettleEntry} />
        </TabsContent>

        <TabsContent value="payables" className="mt-4">
          <EntriesPanel entries={payables} loading={loading} type="EXPENSE" onSettle={setSettleEntry} />
        </TabsContent>
      </Tabs>

      <SettleDialog
        entry={settleEntry}
        open={!!settleEntry}
        onClose={() => setSettleEntry(null)}
        onSettled={fetchPending}
      />
    </div>
  );
};

export default ReceivablesPayablesView;
