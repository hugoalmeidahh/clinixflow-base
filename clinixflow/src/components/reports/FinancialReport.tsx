import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToCsv } from "@/lib/exportCsv";

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const FinancialReport = () => {
  const { tenantId } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!tenantId) return;
    setLoading(true);

    // Current period
    const { data: currData } = await (supabase as any).from("transactions")
      .select("type, amount, financial_categories(name, type, parent_id), financial_status")
      .eq("tenant_id", tenantId)
      .gte("reference_date", dateRange.start)
      .lte("reference_date", dateRange.end);

    const curr = currData || [];
    const income = curr.filter((t: any) => t.type === "INCOME").reduce((s: number, t: any) => s + Number(t.amount), 0);
    const expense = curr.filter((t: any) => t.type === "EXPENSE").reduce((s: number, t: any) => s + Number(t.amount), 0);

    // Previous month
    const prevStart = format(startOfMonth(subMonths(new Date(dateRange.start), 1)), "yyyy-MM-dd");
    const prevEnd = format(endOfMonth(subMonths(new Date(dateRange.start), 1)), "yyyy-MM-dd");
    const { data: prevData } = await supabase.from("transactions")
      .select("type, amount")
      .eq("tenant_id", tenantId)
      .gte("reference_date", prevStart)
      .lte("reference_date", prevEnd);
    const prevIncome = (prevData || []).filter(t => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
    const prevExpense = (prevData || []).filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

    // Same month last year
    const lyStart = format(new Date(dateRange.start.replace(/^\d{4}/, String(new Date(dateRange.start).getFullYear() - 1))), "yyyy-MM-dd");
    const lyEnd = format(new Date(dateRange.end.replace(/^\d{4}/, String(new Date(dateRange.end).getFullYear() - 1))), "yyyy-MM-dd");
    const { data: lyData } = await supabase.from("transactions")
      .select("type, amount")
      .eq("tenant_id", tenantId)
      .gte("reference_date", lyStart)
      .lte("reference_date", lyEnd);
    const lyIncome = (lyData || []).filter(t => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
    const lyExpense = (lyData || []).filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

    // Category breakdown (top 10 income + top 10 expense)
    const incomeCats = new Map<string, number>();
    const expenseCats = new Map<string, number>();
    curr.forEach((t: any) => {
      const name = t.financial_categories?.name || "Sem categoria";
      if (t.type === "INCOME") incomeCats.set(name, (incomeCats.get(name) || 0) + Number(t.amount));
      else expenseCats.set(name, (expenseCats.get(name) || 0) + Number(t.amount));
    });
    const topIncome = Array.from(incomeCats.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));
    const topExpense = Array.from(expenseCats.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));

    // 6-month chart
    const monthlyChart = await Promise.all(
      Array.from({ length: 6 }, (_, i) => subMonths(new Date(dateRange.start), 5 - i)).map(async month => {
        const { data: md } = await supabase.from("transactions")
          .select("type, amount")
          .eq("tenant_id", tenantId)
          .gte("reference_date", format(startOfMonth(month), "yyyy-MM-dd"))
          .lte("reference_date", format(endOfMonth(month), "yyyy-MM-dd"));
        const m = md || [];
        return {
          month: format(month, "MMM", { locale: ptBR }),
          Receitas: m.filter(t => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0),
          Despesas: m.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0),
        };
      })
    );

    setReport({ income, expense, result: income - expense, prevIncome, prevExpense, lyIncome, lyExpense, topIncome, topExpense, monthlyChart });
    setLoading(false);
  };

  const diffBadge = (curr: number, prev: number) => {
    if (prev === 0) return null;
    const pct = Math.round(((curr - prev) / prev) * 100);
    return <span className={`text-xs ml-2 font-semibold ${pct >= 0 ? "text-green-600" : "text-red-600"}`}>{pct >= 0 ? "↑" : "↓"} {Math.abs(pct)}%</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs">De</Label>
          <Input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Até</Label>
          <Input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} className="w-40" />
        </div>
        <Button onClick={generate} disabled={loading}>{loading ? "Gerando..." : "Gerar Relatório"}</Button>
        {report && (
          <Button variant="outline" size="sm" onClick={() => exportToCsv(
            `dre_${dateRange.start}`,
            [
              { item: "Receita Bruta", valor: report.income.toFixed(2) },
              { item: "(-) Despesas", valor: report.expense.toFixed(2) },
              { item: "Resultado do Período", valor: report.result.toFixed(2) },
            ],
            [{ key: "item", label: "Item" }, { key: "valor", label: "Valor (R$)" }]
          )}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        )}
      </div>

      {loading && <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>}

      {report && !loading && (
        <div className="space-y-4">
          {/* DRE simplificado */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">DRE Simplificado</CardTitle></CardHeader>
            <CardContent className="p-0">
              {[
                { label: "Receita Bruta", value: report.income, prev: report.prevIncome, ly: report.lyIncome, positive: true },
                { label: "(-) Despesas Totais", value: report.expense, prev: report.prevExpense, ly: report.lyExpense, positive: false },
                { label: "Resultado do Período", value: report.result, prev: report.prevIncome - report.prevExpense, ly: report.lyIncome - report.lyExpense, isBold: true, positive: report.result >= 0 },
              ].map(row => (
                <div key={row.label} className={`flex items-center justify-between px-4 py-3 border-b last:border-b-0 ${row.isBold ? "bg-muted/30" : ""}`}>
                  <span className={`text-sm ${row.isBold ? "font-bold" : ""}`}>{row.label}</span>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className={`text-xs text-muted-foreground`}>{fmt(row.ly)} <span className="opacity-60">ano ant.</span></span>
                    </div>
                    <div>
                      <span className={`text-xs text-muted-foreground`}>{fmt(row.prev)} <span className="opacity-60">mês ant.</span></span>
                    </div>
                    <div>
                      <span className={`font-mono font-semibold text-sm ${row.isBold ? (row.positive ? "text-green-600" : "text-red-600") : ""}`}>{fmt(row.value)}</span>
                      {diffBadge(row.value, row.prev)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 6-month chart */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Receitas vs Despesas — últimos 6 meses</CardTitle></CardHeader>
            <CardContent className="p-2">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={report.monthlyChart} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} width={50} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Receitas" fill="#0F766E" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Despesas" fill="#EF4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top income categories */}
            {report.topIncome.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-badge-attended">Top Receitas por Categoria</CardTitle></CardHeader>
                <CardContent className="p-0">
                  {report.topIncome.map((c: any) => (
                    <div key={c.name} className="flex justify-between items-center px-4 py-2 border-b last:border-b-0">
                      <span className="text-sm">{c.name}</span>
                      <span className="font-mono text-sm text-badge-attended font-semibold">{fmt(c.value)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Top expense categories */}
            {report.topExpense.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-badge-absent">Top Despesas por Categoria</CardTitle></CardHeader>
                <CardContent className="p-0">
                  {report.topExpense.map((c: any) => (
                    <div key={c.name} className="flex justify-between items-center px-4 py-2 border-b last:border-b-0">
                      <span className="text-sm">{c.name}</span>
                      <span className="font-mono text-sm text-badge-absent font-semibold">{fmt(c.value)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReport;
