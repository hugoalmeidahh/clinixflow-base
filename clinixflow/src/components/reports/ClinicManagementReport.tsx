import { useState, useCallback } from "react";
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
  PieChart, Pie, Cell,
} from "recharts";
import { exportToCsv } from "@/lib/exportCsv";

const PIE_COLORS = ["#0F766E", "#14B8A6", "#5EEAD4", "#0891B2", "#0EA5E9", "#6366F1", "#8B5CF6"];

const ClinicManagementReport = () => {
  const { tenantId } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [profFilter, setProfFilter] = useState("ALL");
  const [specFilter, setSpecFilter] = useState("ALL");

  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [metaLoaded, setMetaLoaded] = useState(false);

  const loadMeta = useCallback(async () => {
    if (!tenantId || metaLoaded) return;
    const [profRes, specRes] = await Promise.all([
      supabase.from("professionals").select("id, full_name").eq("tenant_id", tenantId).eq("is_active", true).order("full_name"),
      supabase.from("specialties").select("id, name").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
    ]);
    setProfessionals(profRes.data || []);
    setSpecialties(specRes.data || []);
    setMetaLoaded(true);
  }, [tenantId, metaLoaded]);

  const generate = async () => {
    if (!tenantId) return;
    setLoading(true);

    let q = supabase.from("appointments")
      .select("status, professional_id, specialty_id, professionals(full_name), specialties(name)")
      .eq("tenant_id", tenantId)
      .gte("scheduled_at", dateRange.start)
      .lte("scheduled_at", dateRange.end + "T23:59:59");
    if (profFilter !== "ALL") q = q.eq("professional_id", profFilter);
    if (specFilter !== "ALL") q = q.eq("specialty_id", specFilter);

    const { data: apts } = await q;
    const items = apts || [];

    const attended = items.filter(a => a.status === "ATTENDED").length;
    const absent = items.filter(a => ["ABSENCE", "JUSTIFIED_ABSENCE"].includes(a.status)).length;
    const cancelled = items.filter(a => a.status === "CANCELLED").length;
    const denom = attended + absent;
    const attendanceRate = denom > 0 ? Math.round((attended / denom) * 100) : 0;
    const absenceRate = denom > 0 ? Math.round((absent / denom) * 100) : 0;

    const { count: newPatients } = await supabase.from("patients")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("created_at", dateRange.start)
      .lte("created_at", dateRange.end + "T23:59:59");

    // Monthly chart: last 12 months
    const monthlyData = await Promise.all(
      Array.from({ length: 12 }, (_, i) => subMonths(new Date(), 11 - i)).map(async month => {
        const { data: md } = await supabase.from("appointments")
          .select("status")
          .eq("tenant_id", tenantId)
          .gte("scheduled_at", format(startOfMonth(month), "yyyy-MM-dd"))
          .lte("scheduled_at", format(endOfMonth(month), "yyyy-MM-dd") + "T23:59:59");
        const m = md || [];
        return {
          month: format(month, "MMM", { locale: ptBR }),
          Atendidos: m.filter(a => a.status === "ATTENDED").length,
          Faltas: m.filter(a => ["ABSENCE", "JUSTIFIED_ABSENCE"].includes(a.status)).length,
          Cancelados: m.filter(a => a.status === "CANCELLED").length,
        };
      })
    );

    // Specialty donut
    const specMap = new Map<string, number>();
    items.filter(a => a.status === "ATTENDED").forEach(a => {
      const name = (a.specialties as any)?.name || "Sem especialidade";
      specMap.set(name, (specMap.get(name) || 0) + 1);
    });
    const specChart = Array.from(specMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // Professional ranking
    const profMap = new Map<string, number>();
    items.filter(a => a.status === "ATTENDED").forEach(a => {
      const name = (a.professionals as any)?.full_name || "Desconhecido";
      profMap.set(name, (profMap.get(name) || 0) + 1);
    });
    const profRanking = Array.from(profMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

    setReport({ items, attended, absent, cancelled, attendanceRate, absenceRate, newPatients: newPatients || 0, monthlyData, specChart, profRanking });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end" onFocus={loadMeta}>
        <div className="space-y-1">
          <Label className="text-xs">De</Label>
          <Input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Até</Label>
          <Input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Profissional</Label>
          <select className="flex h-10 rounded-md border border-input bg-background px-3 text-sm" value={profFilter} onChange={e => setProfFilter(e.target.value)}>
            <option value="ALL">Todos</option>
            {professionals.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Especialidade</Label>
          <select className="flex h-10 rounded-md border border-input bg-background px-3 text-sm" value={specFilter} onChange={e => setSpecFilter(e.target.value)}>
            <option value="ALL">Todas</option>
            {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <Button onClick={generate} disabled={loading}>{loading ? "Gerando..." : "Gerar Relatório"}</Button>
        {report && (
          <Button variant="outline" size="sm" onClick={() => exportToCsv(
            `relatorio_gerencial_${dateRange.start}`,
            report.profRanking,
            [{ key: "name", label: "Profissional" }, { key: "count", label: "Atendimentos" }]
          )}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        )}
      </div>

      {loading && <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-14" /></CardContent></Card>)}</div>}

      {report && !loading && (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Total Agendamentos", value: report.items.length },
              { label: "Atendidos", value: report.attended },
              { label: "Taxa de Presença", value: `${report.attendanceRate}%` },
              { label: "Absenteísmo", value: `${report.absenceRate}%` },
              { label: "Novos Pacientes", value: report.newPatients },
            ].map(k => (
              <Card key={k.label}>
                <CardContent className="p-4">
                  <p className="text-xl font-bold font-heading text-primary">{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly bar chart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Atendimentos — últimos 12 meses</CardTitle></CardHeader>
              <CardContent className="p-2">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={report.monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} width={30} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Atendidos" fill="#0F766E" radius={[2, 2, 0, 0]} stackId="a" />
                    <Bar dataKey="Faltas" fill="#EF4444" radius={[2, 2, 0, 0]} stackId="a" />
                    <Bar dataKey="Cancelados" fill="#F59E0B" radius={[2, 2, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Specialty donut */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Atendimentos por Especialidade</CardTitle></CardHeader>
              <CardContent className="p-2">
                {report.specChart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Sem dados.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={report.specChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name.substring(0, 10)} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {report.specChart.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Professional ranking */}
          {report.profRanking.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Ranking de Profissionais</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {report.profRanking.map((p: any, i: number) => (
                    <div key={p.name} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}.</span>
                        <span className="text-sm font-medium">{p.name}</span>
                      </div>
                      <span className="font-bold text-primary">{p.count} atendimentos</span>
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

export default ClinicManagementReport;
