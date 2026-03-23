import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { exportToCsv } from "@/lib/exportCsv";

const FeedbackReport = () => {
  const { tenantId } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [report, setReport] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!tenantId) return;
    setLoading(true);
    // Get finalized assessments in period
    const { data: assessments } = await (supabase as any).from("assessments")
      .select("id, applied_at, patients(full_name), professionals(full_name), assessment_templates(name), assessment_feedback(id, channel, sent_at, recipient)")
      .eq("tenant_id", tenantId)
      .eq("status", "FINALIZED")
      .gte("applied_at", dateRange.start)
      .lte("applied_at", dateRange.end)
      .order("applied_at", { ascending: false });

    setReport(assessments || []);
    setLoading(false);
  };

  const sent = (report || []).filter(a => a.assessment_feedback?.length > 0);
  const pending = (report || []).filter(a => !a.assessment_feedback?.length);

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
            `devolutivas_${dateRange.start}`,
            (report || []).map(a => ({
              paciente: a.patients?.full_name,
              instrumento: a.assessment_templates?.name,
              data: format(parseISO(a.applied_at), "dd/MM/yyyy"),
              profissional: a.professionals?.full_name,
              status: a.assessment_feedback?.length > 0 ? "Enviado" : "Pendente",
              canal: a.assessment_feedback?.[0]?.channel || "",
            })),
            [
              { key: "paciente", label: "Paciente" },
              { key: "instrumento", label: "Instrumento" },
              { key: "data", label: "Data Avaliação" },
              { key: "profissional", label: "Profissional" },
              { key: "status", label: "Status" },
              { key: "canal", label: "Canal" },
            ]
          )}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        )}
      </div>

      {loading && <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>}

      {report && !loading && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{report.length}</p><p className="text-xs text-muted-foreground">Total Avaliações</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{sent.length}</p><p className="text-xs text-muted-foreground">Devolutivas Enviadas</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{pending.length}</p><p className="text-xs text-muted-foreground">Pendentes</p></CardContent></Card>
          </div>

          {/* List */}
          {report.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhuma avaliação finalizada no período.</p>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {report.map(a => {
                    const hasFeedback = a.assessment_feedback?.length > 0;
                    const fb = a.assessment_feedback?.[0];
                    return (
                      <div key={a.id} className="flex items-center justify-between px-4 py-3 gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{a.patients?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{a.assessment_templates?.name} · {format(parseISO(a.applied_at), "dd/MM/yyyy")} · {a.professionals?.full_name}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {hasFeedback ? (
                            <>
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Enviado
                              </Badge>
                              {fb?.channel && <Badge variant="outline" className="text-xs">{fb.channel}</Badge>}
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 gap-1">
                              <AlertTriangle className="h-3 w-3" /> Pendente
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackReport;
