import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import { ClipboardList, Plus, Eye, Send, Copy, Loader2, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import TemplateBuilder from "@/components/assessments/TemplateBuilder";
import AssessmentSession from "@/components/assessments/AssessmentSession";
import AssessmentFeedbackDialog from "@/components/assessments/AssessmentFeedbackDialog";

const StatusBadgeLocal = ({ status }: { status: string }) => {
  const cfg: Record<string, { label: string; className: string }> = {
    DRAFT: { label: "Rascunho", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    FINALIZED: { label: "Finalizada", className: "bg-green-100 text-green-700 border-green-200" },
  };
  const c = cfg[status] || cfg.DRAFT;
  return <Badge variant="outline" className={`text-xs ${c.className}`}>{c.label}</Badge>;
};

const Evaluations = () => {
  const { tenantId, user } = useAuth();

  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "FINALIZED">("ALL");
  const [templateFilter, setTemplateFilter] = useState("ALL");

  const [newDialog, setNewDialog] = useState(false);
  const [form, setForm] = useState({ patientId: "", professionalId: "", templateId: "", appliedAt: format(new Date(), "yyyy-MM-dd") });
  const [saving, setSaving] = useState(false);

  const [sessionAssessmentId, setSessionAssessmentId] = useState<string | null>(null);
  const [feedbackAssessment, setFeedbackAssessment] = useState<any | null>(null);

  const [historyDialog, setHistoryDialog] = useState<{ patientId: string; patientName: string } | null>(null);
  const [historyTemplateId, setHistoryTemplateId] = useState("ALL");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [systemTemplates, setSystemTemplates] = useState<any[]>([]);
  const [systemLoading, setSystemLoading] = useState(false);
  const [cloningId, setCloningId] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    let q = (supabase as any).from("assessments")
      .select("*, patients(full_name), professionals(full_name), assessment_templates(name), assessment_results(*)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (statusFilter !== "ALL") q = q.eq("status", statusFilter);
    if (templateFilter !== "ALL") q = q.eq("template_id", templateFilter);
    const { data } = await q;
    setAssessments((data || []).filter((a: any) =>
      !searchFilter || a.patients?.full_name?.toLowerCase().includes(searchFilter.toLowerCase())
    ));
    setLoading(false);
  }, [tenantId, statusFilter, templateFilter, searchFilter]);

  const fetchMeta = useCallback(async () => {
    if (!tenantId) return;
    const [patRes, profRes, tmplRes] = await Promise.all([
      supabase.from("patients").select("id, full_name").eq("tenant_id", tenantId).eq("is_active", true).order("full_name"),
      supabase.from("professionals").select("id, full_name").eq("tenant_id", tenantId).eq("is_active", true).order("full_name"),
      (supabase as any).from("assessment_templates").select("id, name").eq("tenant_id", tenantId).eq("status", "ACTIVE").order("name"),
    ]);
    setPatients(patRes.data || []);
    setProfessionals(profRes.data || []);
    setTemplates(tmplRes.data || []);
  }, [tenantId]);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);
  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  const handleCreate = async () => {
    if (!tenantId || !form.patientId || !form.professionalId || !form.templateId) return;
    setSaving(true);
    const { data, error } = await (supabase as any).from("assessments").insert({
      tenant_id: tenantId,
      patient_id: form.patientId,
      professional_id: form.professionalId,
      template_id: form.templateId,
      template_version: 1,
      applied_at: form.appliedAt,
      status: "DRAFT",
    }).select().single();
    if (error) toast.error(error.message);
    else {
      toast.success("Avaliação criada! Iniciando preenchimento...");
      setNewDialog(false);
      setForm({ patientId: "", professionalId: "", templateId: "", appliedAt: format(new Date(), "yyyy-MM-dd") });
      fetchAssessments();
      setSessionAssessmentId(data.id);
    }
    setSaving(false);
  };

  const loadHistory = useCallback(async () => {
    if (!historyDialog) return;
    setHistoryLoading(true);
    let q = (supabase as any).from("assessments")
      .select("*, assessment_templates(name, id), assessment_results(section_id, normalized_score, range_label, consideration_text)")
      .eq("patient_id", historyDialog.patientId)
      .eq("status", "FINALIZED")
      .order("applied_at", { ascending: true });
    if (historyTemplateId !== "ALL") q = q.eq("template_id", historyTemplateId);
    const { data } = await q;
    setHistoryData(data || []);
    setHistoryLoading(false);
  }, [historyDialog, historyTemplateId]);

  useEffect(() => { if (historyDialog) loadHistory(); }, [historyDialog, historyTemplateId, loadHistory]);

  const chartData = historyData.map(a => {
    const globalResult = a.assessment_results?.find((r: any) => r.section_id === null);
    return {
      date: format(parseISO(a.applied_at), "dd/MM", { locale: ptBR }),
      score: globalResult?.normalized_score || 0,
    };
  });

  const loadSystemTemplates = useCallback(async () => {
    setSystemLoading(true);
    const { data } = await (supabase as any).from("assessment_templates")
      .select("*, assessment_sections(id)")
      .eq("is_system_template", true).eq("status", "ACTIVE").order("name");
    setSystemTemplates(data || []);
    setSystemLoading(false);
  }, []);

  useEffect(() => { loadSystemTemplates(); }, [loadSystemTemplates]);

  const cloneSystemTemplate = async (tmpl: any) => {
    if (!tenantId) return;
    setCloningId(tmpl.id);
    const [secRes, qRes, optRes, rangeRes] = await Promise.all([
      (supabase as any).from("assessment_sections").select("*").eq("template_id", tmpl.id).order("order_index"),
      (supabase as any).from("assessment_questions").select("*").order("order_index"),
      (supabase as any).from("assessment_options").select("*").order("order_index"),
      (supabase as any).from("assessment_score_ranges").select("*").eq("template_id", tmpl.id),
    ]);
    const srcSections = secRes.data || [];
    const allQs = qRes.data || [];
    const allOpts = optRes.data || [];
    const srcRanges = rangeRes.data || [];

    const { data: newTmpl, error } = await (supabase as any).from("assessment_templates").insert({
      tenant_id: tenantId, name: tmpl.name, description: tmpl.description,
      is_universal: tmpl.is_universal, status: "ACTIVE", version: 1, is_system_template: false, created_by: user?.id,
    }).select().single();
    if (error) { toast.error(error.message); setCloningId(null); return; }

    for (const s of srcSections) {
      const { data: newSec } = await (supabase as any).from("assessment_sections").insert({
        template_id: newTmpl.id, title: s.title, order_index: s.order_index, weight_multiplier: s.weight_multiplier,
      }).select().single();
      if (!newSec) continue;
      const sectionQs = allQs.filter((q: any) => q.section_id === s.id);
      for (const q of sectionQs) {
        const { data: newQ } = await (supabase as any).from("assessment_questions").insert({
          section_id: newSec.id, text: q.text, type: q.type, order_index: q.order_index, is_required: q.is_required,
        }).select().single();
        if (!newQ) continue;
        const qOpts = allOpts.filter((o: any) => o.question_id === q.id);
        if (qOpts.length > 0) {
          await (supabase as any).from("assessment_options").insert(qOpts.map((o: any) => ({
            question_id: newQ.id, label: o.label, weight: o.weight, order_index: o.order_index,
          })));
        }
      }
    }
    if (srcRanges.length > 0) {
      await (supabase as any).from("assessment_score_ranges").insert(srcRanges.map((r: any) => ({
        template_id: newTmpl.id, section_id: null, min_score: r.min_score, max_score: r.max_score,
        label: r.label, consideration_text: r.consideration_text,
      })));
    }

    toast.success(`"${tmpl.name}" clonado para sua clínica!`);
    setCloningId(null);
    fetchMeta();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Avaliações</h1>
          <p className="text-sm text-muted-foreground">Instrumentos e sessões de avaliação clínica</p>
        </div>
        <Button onClick={() => setNewDialog(true)} disabled={templates.length === 0} className="gap-1.5">
          <Plus className="h-4 w-4" /> Nova Avaliação
        </Button>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Avaliações</TabsTrigger>
          <TabsTrigger value="instruments">Instrumentos</TabsTrigger>
          <TabsTrigger value="system">Templates do Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Buscar paciente</Label>
              <Input value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Nome do paciente..." className="w-48" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <select className="flex h-10 rounded-md border border-input bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                <option value="ALL">Todos</option>
                <option value="DRAFT">Rascunho</option>
                <option value="FINALIZED">Finalizadas</option>
              </select>
            </div>
            {templates.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs">Instrumento</Label>
                <select className="flex h-10 rounded-md border border-input bg-background px-3 text-sm" value={templateFilter} onChange={e => setTemplateFilter(e.target.value)}>
                  <option value="ALL">Todos</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
              ) : assessments.length === 0 ? (
                <EmptyState icon={ClipboardList} title="Nenhuma avaliação" description={templates.length === 0 ? "Crie primeiro um instrumento na aba 'Instrumentos'." : "Inicie a primeira avaliação."} actionLabel={templates.length > 0 ? "+ Nova Avaliação" : undefined} onAction={templates.length > 0 ? () => setNewDialog(true) : undefined} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Instrumento</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map(a => {
                      const globalResult = a.assessment_results?.find((r: any) => r.section_id === null);
                      return (
                        <TableRow key={a.id}>
                          <TableCell className="text-sm">{format(parseISO(a.applied_at), "dd/MM/yyyy")}</TableCell>
                          <TableCell>
                            <button className="font-medium text-sm hover:text-primary" onClick={() => setHistoryDialog({ patientId: a.patient_id, patientName: a.patients?.full_name })}>
                              {a.patients?.full_name}
                            </button>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{a.professionals?.full_name}</TableCell>
                          <TableCell className="text-xs font-medium">{a.assessment_templates?.name}</TableCell>
                          <TableCell>
                            {globalResult ? <span className="font-bold text-primary text-sm">{globalResult.normalized_score}%</span> : "—"}
                          </TableCell>
                          <TableCell><StatusBadgeLocal status={a.status} /></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSessionAssessmentId(a.id)} title={a.status === "FINALIZED" ? "Ver resultados" : "Continuar"}>
                                {a.status === "FINALIZED" ? <Eye className="h-3.5 w-3.5" /> : <ClipboardList className="h-3.5 w-3.5" />}
                              </Button>
                              {a.status === "FINALIZED" && (
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFeedbackAssessment(a)} title="Enviar devolutiva">
                                  <Send className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instruments" className="mt-4">
          <TemplateBuilder />
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Instrumentos pré-configurados pela equipe ClinixFlow. Clone para sua clínica e personalize.</p>
            {systemLoading ? (
              <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
            ) : systemTemplates.length === 0 ? (
              <EmptyState icon={ClipboardList} title="Sem templates do sistema" description="A equipe ClinixFlow ainda não publicou instrumentos globais." />
            ) : (
              <div className="space-y-2">
                {systemTemplates.map(t => (
                  <Card key={t.id}>
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{t.name}</p>
                          <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Template Oficial ClinixFlow</Badge>
                        </div>
                        {t.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.description}</p>}
                        <p className="text-xs text-muted-foreground">{t.assessment_sections?.length || 0} seções</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => cloneSystemTemplate(t)} disabled={cloningId === t.id} className="gap-1.5 shrink-0">
                        {cloningId === t.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
                        Clonar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Assessment Dialog */}
      <Dialog open={newDialog} onOpenChange={setNewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nova Avaliação</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Paciente *</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))}>
                <option value="">Selecionar paciente</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Profissional *</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.professionalId} onChange={e => setForm(p => ({ ...p, professionalId: e.target.value }))}>
                <option value="">Selecionar profissional</option>
                {professionals.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Instrumento *</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.templateId} onChange={e => setForm(p => ({ ...p, templateId: e.target.value }))}>
                <option value="">Selecionar instrumento</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Data de Aplicação *</Label>
              <Input type="date" value={form.appliedAt} onChange={e => setForm(p => ({ ...p, appliedAt: e.target.value }))} />
            </div>
            <Button onClick={handleCreate} disabled={saving || !form.patientId || !form.professionalId || !form.templateId} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Iniciar Avaliação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assessment Session Dialog */}
      {sessionAssessmentId && (
        <Dialog open={!!sessionAssessmentId} onOpenChange={v => { if (!v) { setSessionAssessmentId(null); fetchAssessments(); } }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <AssessmentSession
              assessmentId={sessionAssessmentId}
              onClose={() => { setSessionAssessmentId(null); fetchAssessments(); }}
              onFinalized={fetchAssessments}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Feedback Dialog */}
      {feedbackAssessment && (
        <AssessmentFeedbackDialog
          open={!!feedbackAssessment}
          assessmentId={feedbackAssessment.id}
          patientName={feedbackAssessment.patients?.full_name || ""}
          globalConsideration={feedbackAssessment.assessment_results?.find((r: any) => r.section_id === null)?.consideration_text}
          appliedAt={feedbackAssessment.applied_at}
          onClose={() => setFeedbackAssessment(null)}
        />
      )}

      {/* History Dialog (AVA-005) */}
      <Dialog open={!!historyDialog} onOpenChange={v => !v && setHistoryDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Histórico — {historyDialog?.patientName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Label className="text-xs shrink-0">Instrumento:</Label>
              <select className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm" value={historyTemplateId} onChange={e => setHistoryTemplateId(e.target.value)}>
                <option value="ALL">Todos</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            {historyLoading ? <Skeleton className="h-40" /> : historyData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhuma avaliação finalizada.</p>
            ) : (
              <>
                {chartData.length > 1 && (
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" width={40} />
                        <Tooltip formatter={(v: number) => `${v}%`} />
                        <Line type="monotone" dataKey="score" stroke="#0F766E" strokeWidth={2} dot={{ r: 4 }} name="Score Global" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="space-y-2">
                  {historyData.map((a, i) => {
                    const global = a.assessment_results?.find((r: any) => r.section_id === null);
                    const prev = i > 0 ? historyData[i - 1].assessment_results?.find((r: any) => r.section_id === null) : null;
                    const diff = global && prev ? global.normalized_score - prev.normalized_score : null;
                    return (
                      <div key={a.id} className="p-3 rounded-md border flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{format(parseISO(a.applied_at), "dd/MM/yyyy", { locale: ptBR })}</p>
                          <p className="text-xs text-muted-foreground">{a.assessment_templates?.name}</p>
                          {global?.range_label && <Badge variant="secondary" className="text-xs mt-0.5">{global.range_label}</Badge>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {diff !== null && (
                            <span className={`text-xs font-semibold ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                              {diff > 0 ? "↑" : diff < 0 ? "↓" : "→"} {Math.abs(diff)}%
                            </span>
                          )}
                          <span className="font-bold text-primary text-lg">{global?.normalized_score ?? "—"}%</span>
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setHistoryDialog(null); setSessionAssessmentId(a.id); }}>Ver</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Evaluations;
