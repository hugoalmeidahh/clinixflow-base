import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Download, UserCheck, Calendar, ClipboardList } from "lucide-react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { exportToCsv } from "@/lib/exportCsv";

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const PatientTrackingReport = () => {
  const { tenantId } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPatients = useCallback(async () => {
    if (!tenantId || patients.length > 0) return;
    setPatientsLoading(true);
    const { data } = await supabase.from("patients").select("id, full_name, record_number").eq("tenant_id", tenantId).eq("is_active", true).order("full_name");
    setPatients(data || []);
    setPatientsLoading(false);
  }, [tenantId, patients.length]);

  const generate = async () => {
    if (!tenantId || !selectedPatient) return;
    setLoading(true);
    const patient = patients.find(p => p.id === selectedPatient);

    const [aptsRes, assessRes] = await Promise.all([
      supabase.from("appointments")
        .select("*, professionals(full_name), specialties(name)")
        .eq("tenant_id", tenantId).eq("patient_id", selectedPatient)
        .gte("scheduled_at", dateRange.start).lte("scheduled_at", dateRange.end + "T23:59:59")
        .order("scheduled_at", { ascending: true }),
      (supabase as any).from("assessments")
        .select("*, assessment_templates(name), professionals(full_name), assessment_results(section_id, normalized_score, range_label)")
        .eq("tenant_id", tenantId).eq("patient_id", selectedPatient)
        .eq("status", "FINALIZED")
        .gte("applied_at", dateRange.start).lte("applied_at", dateRange.end)
        .order("applied_at", { ascending: true }),
    ]);

    const apts = aptsRes.data || [];
    const assessments = assessRes.data || [];

    const attended = apts.filter(a => a.status === "ATTENDED").length;
    const scheduled = apts.filter(a => !["CANCELLED"].includes(a.status)).length;
    const attendanceRate = scheduled > 0 ? Math.round((attended / scheduled) * 100) : 0;

    // Chart data: score evolution grouped by template
    const assessmentChartData: any[] = [];
    const templateMap = new Map<string, any[]>();
    assessments.forEach((a: any) => {
      const name = a.assessment_templates?.name || "Sem nome";
      if (!templateMap.has(name)) templateMap.set(name, []);
      const global = a.assessment_results?.find((r: any) => r.section_id === null);
      templateMap.get(name)!.push({
        date: format(parseISO(a.applied_at), "dd/MM", { locale: ptBR }),
        score: global?.normalized_score || 0,
        label: global?.range_label || "",
      });
    });

    setReport({ patient, apts, assessments, attended, scheduled, attendanceRate, templateMap });
    setLoading(false);
  };

  const exportReport = () => {
    if (!report) return;
    exportToCsv(
      `relatorio_paciente_${report.patient?.full_name}_${dateRange.start}`,
      report.apts.map((a: any) => ({
        data: format(new Date(a.scheduled_at), "dd/MM/yyyy"),
        profissional: a.professionals?.full_name || "",
        especialidade: a.specialties?.name || "",
        status: a.status,
      })),
      [
        { key: "data", label: "Data" },
        { key: "profissional", label: "Profissional" },
        { key: "especialidade", label: "Especialidade" },
        { key: "status", label: "Status" },
      ]
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Paciente *</Label>
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-56"
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
            onFocus={loadPatients}
          >
            <option value="">Selecionar paciente</option>
            {patients.map(p => <option key={p.id} value={p.id}>#{p.record_number} {p.full_name}</option>)}
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
        <Button onClick={generate} disabled={!selectedPatient || loading}>
          {loading ? "Gerando..." : "Gerar Relatório"}
        </Button>
        {report && (
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        )}
      </div>

      {loading && <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>}

      {report && !loading && (
        <div className="space-y-4 print:space-y-6" id="patient-report">
          {/* Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{report.patient?.full_name}</h2>
                  <p className="text-sm text-muted-foreground">Prontuário #{report.patient?.record_number} · {format(parseISO(dateRange.start), "dd/MM/yyyy")} – {format(parseISO(dateRange.end), "dd/MM/yyyy")}</p>
                </div>
                <div className="flex gap-4 text-center">
                  <div><p className="text-2xl font-bold text-primary">{report.attendanceRate}%</p><p className="text-xs text-muted-foreground">Frequência</p></div>
                  <div><p className="text-2xl font-bold">{report.attended}</p><p className="text-xs text-muted-foreground">Atendimentos</p></div>
                  <div><p className="text-2xl font-bold">{report.assessments.length}</p><p className="text-xs text-muted-foreground">Avaliações</p></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment evolution charts */}
          {report.templateMap.size > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />Evolução das Avaliações</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {Array.from(report.templateMap.entries()).map(([name, data]: [string, any[]]) => (
                  <div key={name}>
                    <p className="text-xs font-medium mb-2">{name}</p>
                    {data.length > 1 ? (
                      <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" width={35} />
                            <Tooltip formatter={(v: number) => `${v}%`} />
                            <Line type="monotone" dataKey="score" stroke="#0F766E" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-sm">Score: <strong>{data[0]?.score}%</strong> {data[0]?.label && <Badge variant="secondary" className="text-xs ml-1">{data[0].label}</Badge>}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Appointments history */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Histórico de Atendimentos ({report.apts.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {report.apts.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">Nenhum atendimento no período.</p>
              ) : (
                <div className="divide-y divide-border">
                  {report.apts.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between px-4 py-2.5 gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{format(new Date(a.scheduled_at), "dd/MM/yyyy HH:mm")}</p>
                        <p className="text-xs text-muted-foreground">{a.professionals?.full_name} · {a.specialties?.name}</p>
                      </div>
                      <Badge variant={a.status === "ATTENDED" ? "default" : a.status === "CANCELLED" ? "destructive" : "secondary"} className="text-xs shrink-0">
                        {a.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientTrackingReport;
