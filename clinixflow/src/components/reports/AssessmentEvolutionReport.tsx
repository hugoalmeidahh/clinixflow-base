import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { exportToCsv } from "@/lib/exportCsv";

const PIE_COLORS = ["#0F766E", "#14B8A6", "#5EEAD4", "#0891B2", "#EF4444"];

const AssessmentEvolutionReport = () => {
  const { tenantId } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTemplates = useCallback(async () => {
    if (!tenantId || templates.length > 0) return;
    const { data } = await (supabase as any).from("assessment_templates")
      .select("id, name").eq("tenant_id", tenantId).eq("status", "ACTIVE").order("name");
    setTemplates(data || []);
  }, [tenantId, templates.length]);

  const generate = async () => {
    if (!tenantId || !selectedTemplate) return;
    setLoading(true);

    const { data: assessments } = await (supabase as any).from("assessments")
      .select("id, patient_id, applied_at, patients(full_name), assessment_results(section_id, normalized_score, range_label)")
      .eq("tenant_id", tenantId)
      .eq("template_id", selectedTemplate)
      .eq("status", "FINALIZED")
      .gte("applied_at", dateRange.start)
      .lte("applied_at", dateRange.end)
      .order("applied_at", { ascending: true });

    const allAssessments = assessments || [];

    // Group by patient: first and last assessment
    const patientMap = new Map<string, { name: string; first: any; last: any }>();
    allAssessments.forEach((a: any) => {
      const pid = a.patient_id;
      const globalResult = a.assessment_results?.find((r: any) => r.section_id === null);
      if (!globalResult) return;
      const entry = patientMap.get(pid);
      if (!entry) {
        patientMap.set(pid, { name: a.patients?.full_name || pid, first: { score: globalResult.normalized_score, date: a.applied_at, range: globalResult.range_label }, last: { score: globalResult.normalized_score, date: a.applied_at, range: globalResult.range_label } });
      } else {
        // Since ordered by applied_at asc, last is always more recent
        entry.last = { score: globalResult.normalized_score, date: a.applied_at, range: globalResult.range_label };
      }
    });

    const rows = Array.from(patientMap.entries()).map(([, v]) => ({
      name: v.name,
      firstDate: format(parseISO(v.first.date), "dd/MM/yyyy"),
      lastDate: format(parseISO(v.last.date), "dd/MM/yyyy"),
      firstScore: v.first.score,
      lastScore: v.last.score,
      delta: v.last.score - v.first.score,
      lastRange: v.last.range,
    })).sort((a, b) => b.delta - a.delta);

    // Scatter chart data
    const scatterData = rows.map(r => ({ x: r.firstScore, y: r.lastScore, name: r.name }));

    // Distribution by last range
    const rangeMap = new Map<string, number>();
    rows.forEach(r => { const k = r.lastRange || "Sem faixa"; rangeMap.set(k, (rangeMap.get(k) || 0) + 1); });
    const distChart = Array.from(rangeMap.entries()).map(([name, value]) => ({ name, value }));

    setReport({ rows, scatterData, distChart });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end" onFocus={loadTemplates}>
        <div className="space-y-1">
          <Label className="text-xs">Instrumento *</Label>
          <select className="flex h-10 rounded-md border border-input bg-background px-3 text-sm w-56" value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} onFocus={loadTemplates}>
            <option value="">Selecionar instrumento</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">De</Label>
          <Input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Até</Label>
          <Input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} className="w-40" />
        </div>
        <Button onClick={generate} disabled={!selectedTemplate || loading}>{loading ? "Gerando..." : "Gerar Relatório"}</Button>
        {report && (
          <Button variant="outline" size="sm" onClick={() => exportToCsv(
            `evolucao_avaliacoes_${dateRange.start}`,
            report.rows,
            [
              { key: "name", label: "Paciente" },
              { key: "firstDate", label: "1ª Avaliação" },
              { key: "lastDate", label: "Última Avaliação" },
              { key: "firstScore", label: "Score Inicial" },
              { key: "lastScore", label: "Score Final" },
              { key: "delta", label: "Variação (%pt)" },
              { key: "lastRange", label: "Faixa Final" },
            ]
          )}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        )}
      </div>

      {loading && <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>}

      {report && !loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Scatter chart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Score Inicial vs Final (por paciente)</CardTitle></CardHeader>
              <CardContent className="p-2">
                {report.scatterData.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Sem dados.</p> : (
                  <ResponsiveContainer width="100%" height={200}>
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="x" name="Inicial" unit="%" domain={[0, 100]} tick={{ fontSize: 10 }} label={{ value: "Inicial (%)", position: "bottom", fontSize: 10 }} />
                      <YAxis dataKey="y" name="Final" unit="%" domain={[0, 100]} tick={{ fontSize: 10 }} label={{ value: "Final (%)", angle: -90, position: "left", fontSize: 10 }} />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => payload?.[0] ? <div className="bg-background border rounded p-2 text-xs"><p>{payload[0].payload.name}</p><p>Inicial: {payload[0].payload.x}% → Final: {payload[0].payload.y}%</p></div> : null} />
                      <Scatter data={report.scatterData} fill="#0F766E" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Distribution pie */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Distribuição por Faixa (última avaliação)</CardTitle></CardHeader>
              <CardContent className="p-2">
                {report.distChart.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Sem dados.</p> : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={report.distChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name.substring(0, 12)} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {report.distChart.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          {report.rows.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum paciente com avaliações no período.</p>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground">Paciente</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">1ª Avaliação</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Última</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Inicial</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Final</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Variação</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Faixa Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {report.rows.map((r: any) => (
                        <tr key={r.name} className="hover:bg-muted/30">
                          <td className="p-3 font-medium">{r.name}</td>
                          <td className="p-3 text-center text-xs text-muted-foreground">{r.firstDate}</td>
                          <td className="p-3 text-center text-xs text-muted-foreground">{r.lastDate}</td>
                          <td className="p-3 text-center font-mono">{r.firstScore}%</td>
                          <td className="p-3 text-center font-mono font-semibold">{r.lastScore}%</td>
                          <td className="p-3 text-center">
                            <span className={`font-semibold text-xs ${r.delta > 0 ? "text-green-600" : r.delta < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                              {r.delta > 0 ? "↑" : r.delta < 0 ? "↓" : "→"} {Math.abs(r.delta)}%
                            </span>
                          </td>
                          <td className="p-3 text-center">{r.lastRange ? <Badge variant="secondary" className="text-xs">{r.lastRange}</Badge> : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentEvolutionReport;
