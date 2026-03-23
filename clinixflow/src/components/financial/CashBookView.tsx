import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import { Download, BookOpen, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CashEntry {
  id: string;
  reference_date: string;
  type: "INCOME" | "EXPENSE";
  description: string;
  amount: number;
  payment_method?: string;
  financial_status?: string;
  is_paid?: boolean;
  patients?: { full_name: string } | null;
  runningBalance?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const QUICK_RANGES = [
  { label: "Hoje", getValue: () => ({ start: format(new Date(), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd") }) },
  { label: "Esta semana", getValue: () => ({ start: format(startOfWeek(new Date(), { locale: ptBR }), "yyyy-MM-dd"), end: format(endOfWeek(new Date(), { locale: ptBR }), "yyyy-MM-dd") }) },
  { label: "Este mês", getValue: () => ({ start: format(startOfMonth(new Date()), "yyyy-MM-dd"), end: format(endOfMonth(new Date()), "yyyy-MM-dd") }) },
  { label: "Mês anterior", getValue: () => ({ start: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"), end: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd") }) },
];

// ── Component ──────────────────────────────────────────────────────────────────

const CashBookView = () => {
  const { tenantId } = useAuth();
  const [entries, setEntries] = useState<CashEntry[]>([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);

  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [costCenterFilter, setCostCenterFilter] = useState("ALL");

  useEffect(() => {
    if (!tenantId) return;
    Promise.all([
      (supabase as any).from("financial_categories").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
      (supabase as any).from("cost_centers").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
    ]).then(([catRes, ccRes]) => {
      setCategories(catRes.data || []);
      setCostCenters(ccRes.data || []);
    });
  }, [tenantId]);

  const fetchData = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);

    // Opening balance: sum of all received/paid transactions BEFORE start date
    const { data: prevData } = await supabase
      .from("transactions")
      .select("type, amount, is_paid, financial_status")
      .eq("tenant_id", tenantId)
      .lt("reference_date", dateRange.start)
      .in("financial_status" as any, ["RECEIVED", "REALIZED"]);

    const prevBalance = (prevData || []).reduce((sum, t) => {
      const amt = Number(t.amount);
      return t.type === "INCOME" ? sum + amt : sum - amt;
    }, 0);
    setOpeningBalance(prevBalance);

    // Entries for period
    let query = supabase
      .from("transactions")
      .select("*, patients(full_name)")
      .eq("tenant_id", tenantId)
      .gte("reference_date", dateRange.start)
      .lte("reference_date", dateRange.end)
      .order("reference_date", { ascending: true })
      .order("created_at", { ascending: true });

    if (typeFilter !== "ALL") query = query.eq("type", typeFilter);
    if (categoryFilter !== "ALL") query = (query as any).eq("category_id", categoryFilter);
    if (costCenterFilter !== "ALL") query = (query as any).eq("cost_center_id", costCenterFilter);

    const { data } = await query;
    const items: CashEntry[] = data || [];

    // Compute running balance
    let running = prevBalance;
    const withBalance = items.map(e => {
      const amt = Number(e.amount);
      running = e.type === "INCOME" ? running + amt : running - amt;
      return { ...e, runningBalance: running };
    });

    setEntries(withBalance);
    setLoading(false);
  }, [tenantId, dateRange, typeFilter, categoryFilter, costCenterFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalIncome = entries.filter(e => e.type === "INCOME").reduce((s, e) => s + Number(e.amount), 0);
  const totalExpense = entries.filter(e => e.type === "EXPENSE").reduce((s, e) => s + Number(e.amount), 0);
  const closingBalance = openingBalance + totalIncome - totalExpense;

  const exportCsv = () => {
    const rows = [
      ["Data", "Tipo", "Descrição", "Paciente", "Entrada", "Saída", "Saldo"],
      ["", "", "Saldo anterior", "", "", "", fmt(openingBalance)],
      ...entries.map(e => [
        format(new Date(e.reference_date), "dd/MM/yyyy"),
        e.type === "INCOME" ? "Receita" : "Despesa",
        e.description,
        e.patients?.full_name || "",
        e.type === "INCOME" ? Number(e.amount).toFixed(2) : "",
        e.type === "EXPENSE" ? Number(e.amount).toFixed(2) : "",
        e.runningBalance !== undefined ? e.runningBalance.toFixed(2) : "",
      ]),
      ["", "", "TOTAL", "", totalIncome.toFixed(2), totalExpense.toFixed(2), closingBalance.toFixed(2)],
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livro_caixa_${dateRange.start}_${dateRange.end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards = [
    { label: "Saldo Anterior", value: fmt(openingBalance), icon: Wallet, color: "text-muted-foreground" },
    { label: "Total Entradas", value: fmt(totalIncome), icon: TrendingUp, color: "text-badge-attended" },
    { label: "Total Saídas", value: fmt(totalExpense), icon: TrendingDown, color: "text-badge-absent" },
    { label: "Saldo Final", value: fmt(closingBalance), icon: Wallet, color: closingBalance >= 0 ? "text-primary" : "text-badge-absent" },
  ];

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-12" /></CardContent></Card>) :
          summaryCards.map(c => (
            <Card key={c.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <c.icon className={`h-6 w-6 shrink-0 ${c.color}`} />
                <div>
                  <p className={`font-semibold text-sm font-heading ${c.color}`}>{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Quick filters */}
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
        {categories.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs">Categoria</Label>
            <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="ALL">Todas</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        {costCenters.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs">Centro de Custo</Label>
            <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={costCenterFilter} onChange={e => setCostCenterFilter(e.target.value)}>
              <option value="ALL">Todos</option>
              {costCenters.map((c: any) => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Livro Caixa
          </CardTitle>
          {entries.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : entries.length === 0 ? (
            <EmptyState icon={BookOpen} title="Sem movimentações" description="Nenhum lançamento encontrado no período." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead className="text-right text-badge-attended">Entrada</TableHead>
                    <TableHead className="text-right text-badge-absent">Saída</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Opening balance row */}
                  <TableRow className="bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground" colSpan={2}>Saldo anterior ao período</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell className="text-right font-mono font-semibold text-sm">{fmt(openingBalance)}</TableCell>
                  </TableRow>
                  {entries.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="text-sm whitespace-nowrap">{format(new Date(e.reference_date), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="font-medium text-sm max-w-[200px] truncate">{e.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.patients?.full_name || "—"}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-badge-attended">
                        {e.type === "INCOME" ? fmt(Number(e.amount)) : ""}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-badge-absent">
                        {e.type === "EXPENSE" ? fmt(Number(e.amount)) : ""}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-semibold text-sm ${(e.runningBalance ?? 0) >= 0 ? "text-foreground" : "text-badge-absent"}`}>
                        {fmt(e.runningBalance ?? 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* Footer totals */}
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                    <td className="p-3 text-sm" colSpan={2}>TOTAIS DO PERÍODO</td>
                    <td className="p-3" />
                    <td className="p-3 text-right font-mono text-sm text-badge-attended">{fmt(totalIncome)}</td>
                    <td className="p-3 text-right font-mono text-sm text-badge-absent">{fmt(totalExpense)}</td>
                    <td className={`p-3 text-right font-mono text-sm font-bold ${closingBalance >= 0 ? "text-primary" : "text-badge-absent"}`}>{fmt(closingBalance)}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBookView;
