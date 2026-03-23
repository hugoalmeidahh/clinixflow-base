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
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { exportToCsv } from "@/lib/exportCsv";

const VaccineReport = () => {
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

    // Fetch applications in range with vaccine info
    const { data: apps } = await supabase
      .from("vaccine_applications")
      .select("*, vaccines(name, manufacturer), professionals(full_name)")
      .eq("tenant_id", tenantId)
      .gte("applied_at", dateRange.start)
      .lte("applied_at", dateRange.end + "T23:59:59")
      .order("applied_at");

    const items = apps || [];

    // Volume by vaccine (top 10)
    const vaccineMap = new Map<string, { count: number; manufacturer: string }>();
    items.forEach((a: any) => {
      const name = a.vaccines?.name || "Desconhecida";
      const manufacturer = a.vaccines?.manufacturer || "";
      const existing = vaccineMap.get(name) || { count: 0, manufacturer };
      vaccineMap.set(name, { count: existing.count + 1, manufacturer });
    });
    const topVaccines = Array.from(vaccineMap.entries())
      .map(([name, { count, manufacturer }]) => ({ name, count, manufacturer }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Volume by professional
    const profMap = new Map<string, number>();
    items.forEach((a: any) => {
      const name = a.professionals?.full_name || "Desconhecido";
      profMap.set(name, (profMap.get(name) || 0) + 1);
    });
    const byProfessional = Array.from(profMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Monthly evolution: last 12 months
    const monthlyData = await Promise.all(
      Array.from({ length: 12 }, (_, i) => subMonths(new Date(), 11 - i)).map(async month => {
        const { count } = await supabase
          .from("vaccine_applications")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenantId)
          .gte("applied_at", format(startOfMonth(month), "yyyy-MM-dd"))
          .lte("applied_at", format(endOfMonth(month), "yyyy-MM-dd") + "T23:59:59");
        return {
          month: format(month, "MMM/yy", { locale: ptBR }),
          doses: count || 0,
        };
      })
    );

    // Previous period comparison
    const periodDays = Math.max(
      1,
      Math.round((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / 86400000)
    );
    const prevStart = format(subMonths(new Date(dateRange.start), 1), "yyyy-MM-dd");
    const prevEnd = format(subMonths(new Date(dateRange.end), 1), "yyyy-MM-dd");
    const { count: prevCount } = await supabase
      .from("vaccine_applications")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("applied_at", prevStart)
      .lte("applied_at", prevEnd + "T23:59:59");

    const currentCount = items.length;
    const prevCountVal = prevCount || 0;
    const deltaPct = prevCountVal > 0
      ? Math.round(((currentCount - prevCountVal) / prevCountVal) * 100)
      : null;

    setReport({ items, topVaccines, byProfessional, monthlyData, currentCount, prevCountVal, deltaPct });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
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
        <Button onClick={generate} disabled={loading}>{loading ? "Gerando..." : "Gerar Relatório"}</Button>
        {report && (
          <Button variant="outline" size="sm" onClick={() => exportToCsv(
            `relatorio_vacinas_${dateRange.start}`,
            report.topVaccines,
            [{ key: "name", label: "Vacina" }, { key: "manufacturer", label: "Fabricante" }, { key: "count", label: "Doses Aplicadas" }]
          )}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        )}
      </div>

      {loading && <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>}

      {report && !loading && (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xl font-bold font-heading text-primary">{report.currentCount}</p>
                <p className="text-xs text-muted-foreground">Doses Aplicadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xl font-bold font-heading">{report.prevCountVal}</p>
                <p className="text-xs text-muted-foreground">Período Anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className={`text-xl font-bold font-heading ${report.deltaPct === null ? "" : report.deltaPct >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {report.deltaPct === null ? "—" : `${report.deltaPct > 0 ? "+" : ""}${report.deltaPct}%`}
                </p>
                <p className="text-xs text-muted-foreground">Variação vs Período Anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly line chart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Evolução Mensal de Doses</CardTitle></CardHeader>
              <CardContent className="p-2">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={report.monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} width={30} />
                    <Tooltip />
                    <Line type="monotone" dataKey="doses" stroke="#0F766E" strokeWidth={2} dot={{ r: 3 }} name="Doses" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top 10 bar chart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Top 10 Vacinas por Volume</CardTitle></CardHeader>
              <CardContent className="p-2">
                {report.topVaccines.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Sem dados no período.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={report.topVaccines} layout="vertical" margin={{ top: 5, right: 5, left: 60, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={60} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0F766E" radius={[0, 2, 2, 0]} name="Doses" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Professional ranking */}
          {report.byProfessional.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Volume por Profissional</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {report.byProfessional.map((p: any, i: number) => (
                    <div key={p.name} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}.</span>
                        <span className="text-sm font-medium">{p.name}</span>
                      </div>
                      <span className="font-bold text-primary">{p.count} doses</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vaccine details table */}
          {report.topVaccines.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Detalhamento por Vacina</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {report.topVaccines.map((v: any) => (
                    <div key={v.name} className="flex items-center justify-between px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium">{v.name}</p>
                        {v.manufacturer && <p className="text-xs text-muted-foreground">{v.manufacturer}</p>}
                      </div>
                      <span className="font-bold text-primary">{v.count} doses</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default VaccineReport;
