import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, DollarSign, ChevronLeft, ChevronRight, AlertTriangle, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, addMonths, isBefore, parseISO, isToday, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const fmtShort = (v: number) => `R$${(v / 1000).toFixed(0)}k`;

const PIE_COLORS = ["#0F766E", "#14B8A6", "#5EEAD4", "#0891B2", "#0EA5E9"];

const getDueStatus = (dateStr: string): "overdue" | "today" | "soon" | "future" => {
  const d = parseISO(dateStr);
  const now = new Date();
  if (isBefore(d, startOfMonth(now)) || (isBefore(d, now) && !isToday(d))) return "overdue";
  if (isToday(d)) return "today";
  if (isBefore(d, addDays(now, 7))) return "soon";
  return "future";
};

const DueBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    overdue: { label: "Vencido", className: "bg-red-100 text-red-700 border-red-200" },
    today: { label: "Vence hoje", className: "bg-amber-100 text-amber-700 border-amber-200" },
    soon: { label: "Em breve", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    future: { label: "No prazo", className: "bg-muted text-muted-foreground" },
  };
  const c = config[status] || config.future;
  return <Badge variant="outline" className={`text-xs ${c.className}`}>{c.label}</Badge>;
};

// ── Component ──────────────────────────────────────────────────────────────────

const FinancialDashboard = () => {
  const { tenantId } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [loading, setLoading] = useState(true);

  const [kpi, setKpi] = useState({ income: 0, expense: 0, balance: 0, outstanding: 0, payable: 0 });
  const [monthlyChart, setMonthlyChart] = useState<any[]>([]);
  const [categoryChart, setCategoryChart] = useState<any[]>([]);
  const [pendingList, setPendingList] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    const monthStart = format(currentMonth, "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    // ── KPI for current month ──────────────────────────────────────────────
    const { data: monthData } = await supabase
      .from("transactions")
      .select("type, amount, is_paid, financial_status")
      .eq("tenant_id", tenantId)
      .gte("reference_date", monthStart)
      .lte("reference_date", monthEnd);

    const md = monthData || [];
    const income = md.filter(t => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
    const expense = md.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);
    const received = md.filter(t => t.type === "INCOME" && t.is_paid).reduce((s, t) => s + Number(t.amount), 0);
    const outstanding = income - received;

    // Pending payables
    const { data: payData } = await supabase.from("transactions")
      .select("amount")
      .eq("tenant_id", tenantId)
      .eq("type", "EXPENSE")
      .eq("is_paid", false);
    const payable = (payData || []).reduce((s, t) => s + Number(t.amount), 0);

    setKpi({ income, expense, balance: income - expense, outstanding, payable });

    // ── 6-month bar chart ─────────────────────────────────────────────────
    const chartData = await Promise.all(
      Array.from({ length: 6 }, (_, i) => subMonths(currentMonth, 5 - i)).map(async month => {
        const { data } = await supabase
          .from("transactions")
          .select("type, amount")
          .eq("tenant_id", tenantId)
          .gte("reference_date", format(startOfMonth(month), "yyyy-MM-dd"))
          .lte("reference_date", format(endOfMonth(month), "yyyy-MM-dd"));
        const items = data || [];
        return {
          month: format(month, "MMM", { locale: ptBR }),
          Receitas: items.filter(t => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0),
          Despesas: items.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0),
        };
      })
    );
    setMonthlyChart(chartData);

    // ── Category pie chart (top 5 income categories) ──────────────────────
    const { data: catData } = await (supabase as any)
      .from("transactions")
      .select("category_id, amount, financial_categories(name)")
      .eq("tenant_id", tenantId)
      .eq("type", "INCOME")
      .gte("reference_date", monthStart)
      .lte("reference_date", monthEnd)
      .not("category_id", "is", null);

    const catMap = new Map<string, { name: string; value: number }>();
    (catData || []).forEach((t: any) => {
      const name = t.financial_categories?.name || "Sem categoria";
      const existing = catMap.get(t.category_id) || { name, value: 0 };
      catMap.set(t.category_id, { name, value: existing.value + Number(t.amount) });
    });
    const pie = Array.from(catMap.values()).sort((a, b) => b.value - a.value).slice(0, 5);
    setCategoryChart(pie);

    // ── 5 closest pending items ────────────────────────────────────────────
    const { data: pending } = await supabase
      .from("transactions")
      .select("id, description, amount, reference_date, type, patients(full_name)")
      .eq("tenant_id", tenantId)
      .eq("is_paid", false)
      .not("financial_status", "eq", "RECEIVED" as any)
      .order("reference_date", { ascending: true })
      .limit(5);

    setPendingList((pending || []).map((t: any) => ({ ...t, dueStatus: getDueStatus(t.reference_date) })));
    setLoading(false);
  }, [tenantId, currentMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const kpiCards = [
    { label: "Receitas do Mês", value: fmt(kpi.income), icon: TrendingUp, color: "text-badge-attended" },
    { label: "Despesas do Mês", value: fmt(kpi.expense), icon: TrendingDown, color: "text-badge-absent" },
    { label: "Saldo do Mês", value: fmt(kpi.balance), icon: Wallet, color: kpi.balance >= 0 ? "text-primary" : "text-badge-absent" },
    { label: "A Receber", value: fmt(kpi.outstanding), icon: DollarSign, color: "text-badge-justified" },
    { label: "A Pagar", value: fmt(kpi.payable), icon: AlertTriangle, color: "text-badge-absent" },
  ];

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-sm capitalize min-w-[120px] text-center">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </span>
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} disabled={addMonths(currentMonth, 1) > new Date()}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {loading ? Array.from({ length: 5 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-12" /></CardContent></Card>) :
          kpiCards.map(card => (
            <Card key={card.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <card.icon className={`h-6 w-6 ${card.color}`} />
                <p className={`text-base font-bold font-heading mt-2 ${card.color}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Receitas vs Despesas (6 meses)</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {loading ? <Skeleton className="h-48" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyChart} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => fmtShort(v)} width={50} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Receitas" fill="#0F766E" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Despesas" fill="#EF4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Receitas por Categoria (Top 5)</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {loading ? <Skeleton className="h-48" /> : categoryChart.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                Sem receitas por categoria no período.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {categoryChart.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Próximos Vencimentos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : pendingList.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">Nenhum vencimento pendente.</p>
          ) : (
            <div className="divide-y divide-border">
              {pendingList.map(t => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(t.reference_date), "dd/MM/yyyy", { locale: ptBR })}
                      {t.patients?.full_name ? ` · ${t.patients.full_name}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <DueBadge status={t.dueStatus} />
                    <span className={`font-mono font-semibold text-sm ${t.type === "INCOME" ? "text-badge-attended" : "text-badge-absent"}`}>
                      {fmt(Number(t.amount))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
