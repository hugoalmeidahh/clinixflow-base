import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import {
  ClipboardList, Plus, ChevronDown, ChevronUp, Trash2, Edit2, Check,
  Eye, Copy, Loader2, GripVertical,
} from "lucide-react";

type QuestionType = "SCALE" | "MULTIPLE" | "BOOLEAN" | "TEXT" | "NUMERIC";

interface Template {
  id: string;
  name: string;
  description?: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  version: number;
  is_system_template: boolean;
  is_universal: boolean;
  specialties?: { name: string } | null;
}

interface Section { id: string; title: string; order_index: number; weight_multiplier: number; }
interface Question { id: string; section_id: string; text: string; type: QuestionType; order_index: number; is_required: boolean; }
interface Option { id: string; question_id: string; label: string; weight: number; order_index: number; }
interface ScoreRange { id: string; template_id: string; section_id: string | null; min_score: number; max_score: number; label: string; consideration_text: string; }

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  SCALE: "Escala Likert",
  MULTIPLE: "Múltipla Escolha",
  BOOLEAN: "Sim/Não",
  TEXT: "Texto Livre",
  NUMERIC: "Numérico",
};

// ── Template Builder ─────────────────────────────────────────────────────────

const TemplateBuilder = () => {
  const { tenantId, user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState<any[]>([]);

  // Create/edit template dialog
  const [templateDialog, setTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [tForm, setTForm] = useState({ name: "", description: "", is_universal: true, specialtyId: "" });
  const [tSaving, setTSaving] = useState(false);

  // Builder dialog
  const [builderTemplate, setBuilderTemplate] = useState<Template | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [scoreRanges, setScoreRanges] = useState<ScoreRange[]>([]);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Add section
  const [newSectionTitle, setNewSectionTitle] = useState("");

  // Add question
  const [addingQuestion, setAddingQuestion] = useState<{ sectionId: string } | null>(null);
  const [qForm, setQForm] = useState({ text: "", type: "SCALE" as QuestionType, is_required: true });

  // Add option
  const [addingOption, setAddingOption] = useState<{ questionId: string } | null>(null);
  const [oForm, setOForm] = useState({ label: "", weight: "0" });

  // Score range
  const [rangeDialog, setRangeDialog] = useState<{ templateId: string; sectionId: string | null } | null>(null);
  const [rForm, setRForm] = useState({ min_score: "0", max_score: "100", label: "", consideration_text: "" });

  // Preview
  const [previewOpen, setPreviewOpen] = useState(false);

  // Clone
  const [cloning, setCloning] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    const [tmplRes, specRes] = await Promise.all([
      (supabase as any).from("assessment_templates")
        .select("*, specialties(name)")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false }),
      supabase.from("specialties").select("id, name").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
    ]);
    setTemplates(tmplRes.data || []);
    setSpecialties(specRes.data || []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const openBuilder = async (tmpl: Template) => {
    setBuilderTemplate(tmpl);
    setBuilderLoading(true);
    const [secRes, qRes, optRes, rangeRes] = await Promise.all([
      (supabase as any).from("assessment_sections").select("*").eq("template_id", tmpl.id).order("order_index"),
      (supabase as any).from("assessment_questions").select("*, assessment_sections!inner(template_id)").eq("assessment_sections.template_id", tmpl.id).order("order_index"),
      (supabase as any).from("assessment_options").select("*").order("order_index"),
      (supabase as any).from("assessment_score_ranges").select("*").eq("template_id", tmpl.id),
    ]);
    setSections(secRes.data || []);
    setQuestions(qRes.data || []);
    setOptions(optRes.data || []);
    setScoreRanges(rangeRes.data || []);
    setBuilderLoading(false);
    if ((secRes.data || []).length > 0) setExpandedSection(secRes.data[0].id);
  };

  const handleCreateTemplate = async () => {
    if (!tenantId || !tForm.name) return;
    setTSaving(true);
    if (editingTemplate) {
      const { error } = await (supabase as any).from("assessment_templates").update({
        name: tForm.name,
        description: tForm.description || null,
        is_universal: tForm.is_universal,
        specialty_id: tForm.specialtyId || null,
      }).eq("id", editingTemplate.id);
      if (error) toast.error(error.message);
      else { toast.success("Instrumento atualizado!"); setTemplateDialog(false); fetchTemplates(); }
    } else {
      const { error } = await (supabase as any).from("assessment_templates").insert({
        tenant_id: tenantId,
        name: tForm.name,
        description: tForm.description || null,
        is_universal: tForm.is_universal,
        specialty_id: tForm.specialtyId || null,
        status: "DRAFT",
        version: 1,
        is_system_template: false,
        created_by: user?.id,
      });
      if (error) toast.error(error.message);
      else { toast.success("Instrumento criado!"); setTemplateDialog(false); fetchTemplates(); }
    }
    setTSaving(false);
  };

  const activateTemplate = async (tmpl: Template) => {
    const newStatus = tmpl.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const { error } = await (supabase as any).from("assessment_templates").update({ status: newStatus }).eq("id", tmpl.id);
    if (error) toast.error(error.message);
    else { toast.success(`Instrumento ${newStatus === "ACTIVE" ? "ativado" : "desativado"}!`); fetchTemplates(); }
  };

  const addSection = async () => {
    if (!builderTemplate || !newSectionTitle.trim()) return;
    const orderIndex = sections.length;
    const { data, error } = await (supabase as any).from("assessment_sections").insert({
      template_id: builderTemplate.id, title: newSectionTitle.trim(), order_index: orderIndex, weight_multiplier: 1.0,
    }).select().single();
    if (error) toast.error(error.message);
    else { setSections(p => [...p, data]); setNewSectionTitle(""); setExpandedSection(data.id); }
  };

  const deleteSection = async (sectionId: string) => {
    const { error } = await (supabase as any).from("assessment_sections").delete().eq("id", sectionId);
    if (error) toast.error(error.message);
    else {
      setSections(p => p.filter(s => s.id !== sectionId));
      setQuestions(p => p.filter(q => q.section_id !== sectionId));
    }
  };

  const addQuestion = async () => {
    if (!addingQuestion || !qForm.text.trim()) return;
    const sectionQuestions = questions.filter(q => q.section_id === addingQuestion.sectionId);
    const { data, error } = await (supabase as any).from("assessment_questions").insert({
      section_id: addingQuestion.sectionId, text: qForm.text.trim(), type: qForm.type,
      order_index: sectionQuestions.length, is_required: qForm.is_required,
    }).select().single();
    if (error) toast.error(error.message);
    else { setQuestions(p => [...p, data]); setAddingQuestion(null); setQForm({ text: "", type: "SCALE", is_required: true }); }
  };

  const deleteQuestion = async (questionId: string) => {
    const { error } = await (supabase as any).from("assessment_questions").delete().eq("id", questionId);
    if (error) toast.error(error.message);
    else { setQuestions(p => p.filter(q => q.id !== questionId)); setOptions(p => p.filter(o => o.question_id !== questionId)); }
  };

  const addOption = async () => {
    if (!addingOption || !oForm.label.trim()) return;
    const qOptions = options.filter(o => o.question_id === addingOption.questionId);
    const { data, error } = await (supabase as any).from("assessment_options").insert({
      question_id: addingOption.questionId, label: oForm.label.trim(), weight: parseFloat(oForm.weight) || 0,
      order_index: qOptions.length,
    }).select().single();
    if (error) toast.error(error.message);
    else { setOptions(p => [...p, data]); setOForm({ label: "", weight: "0" }); }
  };

  const deleteOption = async (optionId: string) => {
    const { error } = await (supabase as any).from("assessment_options").delete().eq("id", optionId);
    if (error) toast.error(error.message);
    else setOptions(p => p.filter(o => o.id !== optionId));
  };

  const addScoreRange = async () => {
    if (!rangeDialog || !rForm.label.trim()) return;
    const { error } = await (supabase as any).from("assessment_score_ranges").insert({
      template_id: rangeDialog.templateId,
      section_id: rangeDialog.sectionId,
      min_score: parseFloat(rForm.min_score),
      max_score: parseFloat(rForm.max_score),
      label: rForm.label.trim(),
      consideration_text: rForm.consideration_text || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Faixa adicionada!");
      setRangeDialog(null);
      setRForm({ min_score: "0", max_score: "100", label: "", consideration_text: "" });
      if (builderTemplate) openBuilder(builderTemplate);
    }
  };

  const cloneTemplate = async (tmpl: Template) => {
    if (!tenantId) return;
    setCloning(tmpl.id);
    // Load full template data
    const [secRes, qRes, optRes, rangeRes] = await Promise.all([
      (supabase as any).from("assessment_sections").select("*").eq("template_id", tmpl.id).order("order_index"),
      (supabase as any).from("assessment_questions").select("*").order("order_index"),
      (supabase as any).from("assessment_options").select("*").order("order_index"),
      (supabase as any).from("assessment_score_ranges").select("*").eq("template_id", tmpl.id),
    ]);
    const srcSections: Section[] = secRes.data || [];
    const allQs: Question[] = qRes.data || [];
    const allOpts: Option[] = optRes.data || [];
    const srcRanges: ScoreRange[] = rangeRes.data || [];

    // Create new template
    const { data: newTmpl, error: tmplErr } = await (supabase as any).from("assessment_templates").insert({
      tenant_id: tenantId, name: `${tmpl.name} (cópia)`, description: tmpl.description,
      is_universal: tmpl.is_universal, status: "DRAFT", version: 1, is_system_template: false, created_by: user?.id,
    }).select().single();
    if (tmplErr) { toast.error(tmplErr.message); setCloning(null); return; }

    // Clone sections
    for (const s of srcSections) {
      const { data: newSec } = await (supabase as any).from("assessment_sections").insert({
        template_id: newTmpl.id, title: s.title, order_index: s.order_index, weight_multiplier: s.weight_multiplier,
      }).select().single();
      if (!newSec) continue;
      const sectionQs = allQs.filter(q => q.section_id === s.id);
      for (const q of sectionQs) {
        const { data: newQ } = await (supabase as any).from("assessment_questions").insert({
          section_id: newSec.id, text: q.text, type: q.type, order_index: q.order_index, is_required: q.is_required,
        }).select().single();
        if (!newQ) continue;
        const qOpts = allOpts.filter(o => o.question_id === q.id);
        if (qOpts.length > 0) {
          await (supabase as any).from("assessment_options").insert(qOpts.map(o => ({
            question_id: newQ.id, label: o.label, weight: o.weight, order_index: o.order_index,
          })));
        }
      }
    }

    // Clone score ranges
    if (srcRanges.length > 0) {
      await (supabase as any).from("assessment_score_ranges").insert(srcRanges.map(r => ({
        template_id: newTmpl.id, section_id: null, min_score: r.min_score, max_score: r.max_score,
        label: r.label, consideration_text: r.consideration_text,
      })));
    }

    toast.success("Instrumento clonado com sucesso!");
    setCloning(null);
    fetchTemplates();
  };

  const statusVariant = (s: string) => s === "ACTIVE" ? "default" : s === "DRAFT" ? "secondary" : "outline";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Crie instrumentos com seções, perguntas e faixas de score</p>
        <Button size="sm" onClick={() => { setEditingTemplate(null); setTForm({ name: "", description: "", is_universal: true, specialtyId: "" }); setTemplateDialog(true); }} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Novo Instrumento
        </Button>
      </div>

      {/* Template List */}
      {loading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div> :
        templates.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Nenhum instrumento" description="Crie o primeiro instrumento de avaliação." actionLabel="Novo Instrumento" onAction={() => setTemplateDialog(true)} />
        ) : (
          <div className="space-y-2">
            {templates.map(t => (
              <Card key={t.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{t.name}</p>
                      <Badge variant={statusVariant(t.status)} className="text-xs">v{t.version} · {t.status === "ACTIVE" ? "Ativo" : t.status === "DRAFT" ? "Rascunho" : "Inativo"}</Badge>
                      {t.is_universal && <Badge variant="outline" className="text-xs">Universal</Badge>}
                    </div>
                    {t.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openBuilder(t)} title="Construir">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { openBuilder(t); setPreviewOpen(true); }} title="Preview">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => cloneTemplate(t)} title="Clonar" disabled={cloning === t.id}>
                      {cloning === t.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => activateTemplate(t)}>
                      {t.status === "ACTIVE" ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      }

      {/* Create/Edit Template Dialog */}
      <Dialog open={templateDialog} onOpenChange={setTemplateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingTemplate ? "Editar Instrumento" : "Novo Instrumento"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input value={tForm.name} onChange={e => setTForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Avaliação Psicomotora" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descrição</Label>
              <Textarea value={tForm.description} onChange={e => setTForm(p => ({ ...p, description: e.target.value }))} placeholder="Descreva o objetivo do instrumento" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Especialidade (opcional)</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={tForm.specialtyId} onChange={e => setTForm(p => ({ ...p, specialtyId: e.target.value }))}>
                <option value="">Todas as especialidades</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isUniversal" checked={tForm.is_universal} onChange={e => setTForm(p => ({ ...p, is_universal: e.target.checked }))} className="h-4 w-4" />
              <Label htmlFor="isUniversal" className="cursor-pointer text-sm">Universal (visível a todos os profissionais)</Label>
            </div>
            <Button onClick={handleCreateTemplate} disabled={tSaving || !tForm.name} className="w-full">
              {tSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingTemplate ? "Salvar" : "Criar Instrumento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Builder Dialog */}
      <Dialog open={!!builderTemplate && !previewOpen} onOpenChange={v => { if (!v) { setBuilderTemplate(null); fetchTemplates(); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Construtor — {builderTemplate?.name}</DialogTitle>
          </DialogHeader>
          {builderLoading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> : (
            <div className="space-y-4">
              {/* Sections */}
              {sections.map(sec => (
                <Card key={sec.id} className="border-l-4 border-l-primary">
                  <CardHeader className="p-3 pb-0">
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 text-sm font-semibold text-left flex-1" onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        {sec.title}
                        <span className="text-xs font-normal text-muted-foreground">({questions.filter(q => q.section_id === sec.id).length} perguntas)</span>
                        {expandedSection === sec.id ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
                      </button>
                      <div className="flex items-center gap-1 ml-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => builderTemplate && setRangeDialog({ templateId: builderTemplate.id, sectionId: sec.id })}>
                          <span className="text-xs">±</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteSection(sec.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedSection === sec.id && (
                    <CardContent className="p-3 space-y-2">
                      {questions.filter(q => q.section_id === sec.id).map(q => (
                        <div key={q.id} className="rounded-md border bg-muted/30 p-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{q.text}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Badge variant="outline" className="text-xs">{QUESTION_TYPE_LABELS[q.type]}</Badge>
                                {q.is_required && <Badge variant="secondary" className="text-xs">Obrigatória</Badge>}
                              </div>
                              {/* Options for SCALE/MULTIPLE/BOOLEAN */}
                              {(q.type === "SCALE" || q.type === "MULTIPLE" || q.type === "BOOLEAN") && (
                                <div className="mt-2 space-y-1">
                                  {options.filter(o => o.question_id === q.id).map(o => (
                                    <div key={o.id} className="flex items-center justify-between text-xs bg-background rounded px-2 py-1">
                                      <span>{o.label}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">peso: {o.weight}</span>
                                        <button onClick={() => deleteOption(o.id)} className="text-destructive hover:opacity-70"><Trash2 className="h-3 w-3" /></button>
                                      </div>
                                    </div>
                                  ))}
                                  {addingOption?.questionId === q.id ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <Input value={oForm.label} onChange={e => setOForm(p => ({ ...p, label: e.target.value }))} placeholder="Rótulo" className="h-7 text-xs flex-1" />
                                      <Input value={oForm.weight} onChange={e => setOForm(p => ({ ...p, weight: e.target.value }))} type="number" placeholder="Peso" className="h-7 text-xs w-16" />
                                      <Button size="sm" className="h-7 text-xs" onClick={addOption}>OK</Button>
                                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setAddingOption(null)}>✕</Button>
                                    </div>
                                  ) : (
                                    <button className="text-xs text-primary hover:underline mt-1" onClick={() => setAddingOption({ questionId: q.id })}>+ Opção</button>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-destructive" onClick={() => deleteQuestion(q.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Score ranges for section */}
                      {scoreRanges.filter(r => r.section_id === sec.id).length > 0 && (
                        <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-2 space-y-1">
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Faixas de Score da Seção:</p>
                          {scoreRanges.filter(r => r.section_id === sec.id).map(r => (
                            <p key={r.id} className="text-xs">{r.min_score}–{r.max_score}: <strong>{r.label}</strong> — {r.consideration_text}</p>
                          ))}
                        </div>
                      )}

                      {/* Add question */}
                      {addingQuestion?.sectionId === sec.id ? (
                        <div className="border rounded-md p-2.5 space-y-2 bg-background">
                          <Input value={qForm.text} onChange={e => setQForm(p => ({ ...p, text: e.target.value }))} placeholder="Texto da pergunta" className="text-sm" />
                          <div className="flex gap-2">
                            <select className="flex-1 h-9 rounded-md border border-input bg-background px-2 text-sm" value={qForm.type} onChange={e => setQForm(p => ({ ...p, type: e.target.value as QuestionType }))}>
                              {Object.entries(QUESTION_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                            <label className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                              <input type="checkbox" checked={qForm.is_required} onChange={e => setQForm(p => ({ ...p, is_required: e.target.checked }))} />
                              Obrigatória
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={addQuestion}>Adicionar</Button>
                            <Button variant="outline" size="sm" onClick={() => setAddingQuestion(null)}>Cancelar</Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5" onClick={() => setAddingQuestion({ sectionId: sec.id })}>
                          <Plus className="h-3 w-3" /> Adicionar Pergunta
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}

              {/* Add Section */}
              <div className="flex gap-2">
                <Input value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} placeholder="Nome da nova seção..." className="text-sm" onKeyDown={e => e.key === "Enter" && addSection()} />
                <Button onClick={addSection} disabled={!newSectionTitle.trim()} size="sm" className="gap-1.5 shrink-0">
                  <Plus className="h-3.5 w-3.5" /> Seção
                </Button>
              </div>

              {/* Global score ranges */}
              {scoreRanges.filter(r => r.section_id === null).length > 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold mb-2">Faixas de Score Global:</p>
                    {scoreRanges.filter(r => r.section_id === null).map(r => (
                      <p key={r.id} className="text-xs">{r.min_score}–{r.max_score}: <strong>{r.label}</strong> — {r.consideration_text}</p>
                    ))}
                  </CardContent>
                </Card>
              )}
              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => builderTemplate && setRangeDialog({ templateId: builderTemplate.id, sectionId: null })}>
                <Plus className="h-3 w-3" /> Faixa de Score Global
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Score Range Dialog */}
      <Dialog open={!!rangeDialog} onOpenChange={v => !v && setRangeDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Adicionar Faixa de Score</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Score Mínimo</Label><Input type="number" value={rForm.min_score} onChange={e => setRForm(p => ({ ...p, min_score: e.target.value }))} /></div>
              <div className="space-y-1"><Label className="text-xs">Score Máximo</Label><Input type="number" value={rForm.max_score} onChange={e => setRForm(p => ({ ...p, max_score: e.target.value }))} /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Rótulo *</Label><Input value={rForm.label} onChange={e => setRForm(p => ({ ...p, label: e.target.value }))} placeholder="Ex: Adequado" /></div>
            <div className="space-y-1"><Label className="text-xs">Texto de Consideração</Label><Textarea rows={2} value={rForm.consideration_text} onChange={e => setRForm(p => ({ ...p, consideration_text: e.target.value }))} placeholder="Orientação clínica para esta faixa..." /></div>
            <Button onClick={addScoreRange} disabled={!rForm.label} className="w-full">Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={v => { setPreviewOpen(v); if (!v) setBuilderTemplate(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Preview — {builderTemplate?.name}</DialogTitle></DialogHeader>
          <div className="space-y-6">
            {builderTemplate?.description && <p className="text-sm text-muted-foreground">{builderTemplate.description}</p>}
            {sections.map((sec, si) => (
              <div key={sec.id}>
                <h3 className="font-semibold text-sm mb-3">{si + 1}. {sec.title}</h3>
                <div className="space-y-4">
                  {questions.filter(q => q.section_id === sec.id).map((q, qi) => (
                    <div key={q.id} className="p-3 rounded-md border">
                      <p className="text-sm font-medium">{qi + 1}. {q.text} {q.is_required && <span className="text-destructive">*</span>}</p>
                      <div className="mt-2">
                        {(q.type === "SCALE" || q.type === "MULTIPLE") && (
                          <div className="flex flex-wrap gap-2">
                            {options.filter(o => o.question_id === q.id).map(o => (
                              <label key={o.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                                <input type={q.type === "MULTIPLE" ? "checkbox" : "radio"} name={`q-${q.id}`} disabled />
                                {o.label}
                              </label>
                            ))}
                          </div>
                        )}
                        {q.type === "BOOLEAN" && (
                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 text-sm"><input type="radio" disabled /> Sim</label>
                            <label className="flex items-center gap-1.5 text-sm"><input type="radio" disabled /> Não</label>
                          </div>
                        )}
                        {q.type === "TEXT" && <Textarea disabled placeholder="Resposta livre..." rows={2} className="mt-1 text-sm" />}
                        {q.type === "NUMERIC" && <Input disabled type="number" placeholder="0" className="mt-1 w-32 text-sm" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {sections.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma seção adicionada ainda.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateBuilder;
