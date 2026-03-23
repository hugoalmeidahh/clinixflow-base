import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Check, Loader2, AlertTriangle } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  assessmentId: string;
  onClose: () => void;
  onFinalized?: () => void;
}

type AnswerMap = Record<string, { optionId?: string; textValue?: string; numericValue?: number }>;

const AssessmentSession = ({ assessmentId, onClose, onFinalized }: Props) => {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [optionsMap, setOptionsMap] = useState<Record<string, any[]>>({});
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [notes, setNotes] = useState("");
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [confirmFinalize, setConfirmFinalize] = useState(false);
  const [scoreRanges, setScoreRanges] = useState<any[]>([]);

  useEffect(() => {
    loadSession();
  }, [assessmentId]);

  const loadSession = async () => {
    setLoading(true);
    const { data: asmnt } = await (supabase as any).from("assessments")
      .select("*, assessment_templates(id, name, description), patients(full_name), professionals(full_name)")
      .eq("id", assessmentId).single();
    if (!asmnt) { toast.error("Avaliação não encontrada"); onClose(); return; }
    setAssessment(asmnt);
    setNotes(asmnt.notes || "");

    const tmpl = asmnt.assessment_templates;
    setTemplate(tmpl);

    const [secRes, qRes, rangeRes] = await Promise.all([
      (supabase as any).from("assessment_sections").select("*").eq("template_id", tmpl.id).order("order_index"),
      (supabase as any).from("assessment_questions").select("*, assessment_sections!inner(template_id)").eq("assessment_sections.template_id", tmpl.id).order("order_index"),
      (supabase as any).from("assessment_score_ranges").select("*").eq("template_id", tmpl.id),
    ]);
    const secs = secRes.data || [];
    const qs = qRes.data || [];
    setSections(secs);
    setQuestions(qs);
    setScoreRanges(rangeRes.data || []);

    // Load options for objective questions
    const objectiveQIds = qs.filter((q: any) => ["SCALE", "MULTIPLE", "BOOLEAN"].includes(q.type)).map((q: any) => q.id);
    if (objectiveQIds.length > 0) {
      const { data: opts } = await (supabase as any).from("assessment_options").select("*").in("question_id", objectiveQIds).order("order_index");
      const map: Record<string, any[]> = {};
      (opts || []).forEach((o: any) => { if (!map[o.question_id]) map[o.question_id] = []; map[o.question_id].push(o); });
      setOptionsMap(map);
    }

    // Load existing answers
    const { data: existingAnswers } = await (supabase as any).from("assessment_answers").select("*").eq("assessment_id", assessmentId);
    const ansMap: AnswerMap = {};
    (existingAnswers || []).forEach((a: any) => {
      ansMap[a.question_id] = { optionId: a.option_id, textValue: a.text_value, numericValue: a.numeric_value };
    });
    setAnswers(ansMap);

    // If finalized, load results
    if (asmnt.status === "FINALIZED") {
      const { data: res } = await (supabase as any).from("assessment_results").select("*").eq("assessment_id", assessmentId);
      setResults(res || []);
      setShowResults(true);
    }

    setLoading(false);
  };

  const autoSave = useCallback(async (questionId: string, ans: AnswerMap[string]) => {
    if (assessment?.status === "FINALIZED") return;
    const existing = await (supabase as any).from("assessment_answers").select("id").eq("assessment_id", assessmentId).eq("question_id", questionId).single();
    const payload = {
      assessment_id: assessmentId,
      question_id: questionId,
      option_id: ans.optionId || null,
      text_value: ans.textValue || null,
      numeric_value: ans.numericValue ?? null,
    };
    if (existing.data) {
      await (supabase as any).from("assessment_answers").update(payload).eq("id", existing.data.id);
    } else {
      await (supabase as any).from("assessment_answers").insert(payload);
    }
  }, [assessmentId, assessment]);

  const setAnswer = async (questionId: string, ans: AnswerMap[string]) => {
    setAnswers(p => ({ ...p, [questionId]: ans }));
    await autoSave(questionId, ans);
  };

  const calculateAndFinalize = async () => {
    if (!assessment || !template) return;
    setFinalizing(true);

    // Save notes
    await (supabase as any).from("assessments").update({ notes }).eq("id", assessmentId);

    // Calculate scores per section
    const resultsToInsert: any[] = [];
    for (const sec of sections) {
      const sectionQs = questions.filter(q => q.section_id === sec.id);
      let rawScore = 0;
      let maxScore = 0;
      for (const q of sectionQs) {
        const ans = answers[q.id];
        if (!ans) continue;
        if (ans.optionId) {
          const opts = optionsMap[q.id] || [];
          const opt = opts.find(o => o.id === ans.optionId);
          if (opt) { rawScore += Number(opt.weight); maxScore += Math.max(...opts.map((o: any) => Number(o.weight)), 0); }
        } else if (ans.numericValue != null) {
          rawScore += ans.numericValue;
        }
      }
      rawScore *= Number(sec.weight_multiplier);
      const normalized = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
      const range = scoreRanges.filter(r => r.section_id === sec.id).find(r => normalized >= r.min_score && normalized <= r.max_score);
      resultsToInsert.push({
        assessment_id: assessmentId,
        section_id: sec.id,
        raw_score: rawScore,
        normalized_score: normalized,
        range_label: range?.label || null,
        consideration_text: range?.consideration_text || null,
      });
    }

    // Global score
    const totalRaw = resultsToInsert.reduce((s, r) => s + r.raw_score, 0);
    const totalNorm = resultsToInsert.length > 0 ? Math.round(resultsToInsert.reduce((s, r) => s + r.normalized_score, 0) / resultsToInsert.length) : 0;
    const globalRange = scoreRanges.filter(r => r.section_id === null).find(r => totalNorm >= r.min_score && totalNorm <= r.max_score);
    resultsToInsert.push({
      assessment_id: assessmentId,
      section_id: null,
      raw_score: totalRaw,
      normalized_score: totalNorm,
      range_label: globalRange?.label || null,
      consideration_text: globalRange?.consideration_text || null,
    });

    // Delete old results and insert new
    await (supabase as any).from("assessment_results").delete().eq("assessment_id", assessmentId);
    if (resultsToInsert.length > 0) await (supabase as any).from("assessment_results").insert(resultsToInsert);

    // Finalize assessment
    const { error } = await (supabase as any).from("assessments").update({
      status: "FINALIZED",
      finalized_by: user?.id,
      finalized_at: new Date().toISOString(),
      notes,
    }).eq("id", assessmentId);

    if (error) { toast.error(error.message); setFinalizing(false); return; }

    toast.success("Avaliação finalizada e calculada!");
    setResults(resultsToInsert);
    setShowResults(true);
    setConfirmFinalize(false);
    setFinalizing(false);
    setAssessment((p: any) => ({ ...p, status: "FINALIZED" }));
    onFinalized?.();
  };

  const currentSection = sections[currentSectionIndex];
  const currentSectionQuestions = questions.filter(q => q.section_id === currentSection?.id);
  const answeredInSection = currentSectionQuestions.filter(q => answers[q.id] !== undefined).length;
  const requiredInSection = currentSectionQuestions.filter(q => q.is_required).length;
  const requiredAnswered = currentSectionQuestions.filter(q => q.is_required && answers[q.id] !== undefined).length;
  const totalQuestions = questions.length;
  const totalAnswered = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;
  const allRequiredAnswered = questions.filter(q => q.is_required).every(q => answers[q.id] !== undefined);

  // Radar chart data
  const radarData = sections.map(s => {
    const result = results.find(r => r.section_id === s.id);
    return { section: s.title.substring(0, 12), score: result?.normalized_score || 0, fullMark: 100 };
  });

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  // Results view (finalized)
  if (showResults && assessment?.status === "FINALIZED") {
    const globalResult = results.find(r => r.section_id === null);
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">{template?.name}</h2>
          <p className="text-sm text-muted-foreground">{assessment?.patients?.full_name} · {assessment?.professionals?.full_name}</p>
        </div>

        {/* Global score */}
        {globalResult && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Score Global</p>
                {globalResult.range_label && <Badge className="mt-1">{globalResult.range_label}</Badge>}
              </div>
              <span className="text-3xl font-bold text-primary">{globalResult.normalized_score}%</span>
            </div>
            {globalResult.consideration_text && <p className="text-sm text-muted-foreground mt-2">{globalResult.consideration_text}</p>}
          </div>
        )}

        {/* Radar chart */}
        {radarData.length > 2 && (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="section" tick={{ fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#0F766E" fill="#0F766E" fillOpacity={0.3} />
                <Tooltip formatter={(v: number) => `${v}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Per section results */}
        <div className="space-y-2">
          {sections.map(sec => {
            const r = results.find(res => res.section_id === sec.id);
            if (!r) return null;
            return (
              <div key={sec.id} className="flex items-center justify-between p-3 rounded-md border">
                <div>
                  <p className="text-sm font-medium">{sec.title}</p>
                  {r.range_label && <Badge variant="secondary" className="text-xs mt-0.5">{r.range_label}</Badge>}
                  {r.consideration_text && <p className="text-xs text-muted-foreground mt-0.5">{r.consideration_text}</p>}
                </div>
                <span className="font-bold text-primary">{r.normalized_score}%</span>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        {assessment?.notes && (
          <div className="rounded-md bg-muted/40 p-3">
            <p className="text-xs font-medium mb-1">Observações do profissional:</p>
            <p className="text-sm">{assessment.notes}</p>
          </div>
        )}

        <Button variant="outline" onClick={onClose} className="w-full">Fechar</Button>
      </div>
    );
  }

  // Fill-out view (draft)
  return (
    <div className="space-y-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{Math.round(progress)}% concluído</span>
          <span>{totalAnswered}/{totalQuestions} respondidas</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Section tabs */}
      {sections.length > 1 && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {sections.map((sec, i) => (
            <button key={sec.id} onClick={() => setCurrentSectionIndex(i)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${i === currentSectionIndex ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}>
              {i + 1}. {sec.title}
            </button>
          ))}
        </div>
      )}

      {/* Current section questions */}
      {currentSection && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{currentSection.title}</h3>
            <span className="text-xs text-muted-foreground">{answeredInSection}/{currentSectionQuestions.length}</span>
          </div>

          {currentSectionQuestions.map((q, qi) => {
            const ans = answers[q.id];
            const qOpts = optionsMap[q.id] || [];
            return (
              <div key={q.id} className={`p-3 rounded-md border ${ans !== undefined ? "border-primary/30 bg-primary/5" : ""}`}>
                <p className="text-sm font-medium mb-2">
                  {qi + 1}. {q.text}
                  {q.is_required && <span className="text-destructive ml-1">*</span>}
                </p>

                {(q.type === "SCALE" || q.type === "MULTIPLE") && qOpts.length > 0 && (
                  <div className="space-y-1.5">
                    {qOpts.map((opt: any) => (
                      <label key={opt.id} className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
                        <input
                          type={q.type === "MULTIPLE" ? "checkbox" : "radio"}
                          name={`q-${q.id}`}
                          checked={ans?.optionId === opt.id}
                          onChange={() => setAnswer(q.id, { optionId: opt.id })}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{opt.label}</span>
                        <span className="ml-auto text-xs text-muted-foreground">({opt.weight})</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "BOOLEAN" && (
                  <div className="flex gap-4">
                    {["sim", "nao"].map(v => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q-${q.id}`} checked={ans?.textValue === v} onChange={() => setAnswer(q.id, { textValue: v })} className="h-4 w-4" />
                        <span className="text-sm capitalize">{v === "sim" ? "Sim" : "Não"}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "TEXT" && (
                  <Textarea
                    value={ans?.textValue || ""}
                    onChange={e => setAnswer(q.id, { textValue: e.target.value })}
                    placeholder="Digite a resposta..."
                    rows={2}
                    className="text-sm"
                  />
                )}

                {q.type === "NUMERIC" && (
                  <Input
                    type="number"
                    value={ans?.numericValue ?? ""}
                    onChange={e => setAnswer(q.id, { numericValue: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-32 text-sm"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Notes (last section) */}
      {currentSectionIndex === sections.length - 1 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Observações do Profissional</Label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observações gerais sobre a avaliação..." rows={2} className="text-sm" />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t">
        <Button variant="outline" size="sm" onClick={() => setCurrentSectionIndex(p => Math.max(0, p - 1))} disabled={currentSectionIndex === 0} className="gap-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Anterior
        </Button>

        {currentSectionIndex < sections.length - 1 ? (
          <Button size="sm" onClick={() => setCurrentSectionIndex(p => p + 1)} className="gap-1">
            Próxima <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button size="sm" onClick={() => setConfirmFinalize(true)} disabled={!allRequiredAnswered} className="gap-1 bg-green-600 hover:bg-green-700">
            <Check className="h-3.5 w-3.5" /> Calcular e Finalizar
          </Button>
        )}
      </div>
      {!allRequiredAnswered && currentSectionIndex === sections.length - 1 && (
        <p className="text-xs text-muted-foreground text-center">Responda todas as perguntas obrigatórias para finalizar</p>
      )}

      {/* Confirm Finalize */}
      <Dialog open={confirmFinalize} onOpenChange={setConfirmFinalize}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" /> Finalizar Avaliação
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Esta ação é <strong>irreversível</strong>. A avaliação será calculada e bloqueada para edição.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmFinalize(false)} className="flex-1">Cancelar</Button>
            <Button onClick={calculateAndFinalize} disabled={finalizing} className="flex-1 bg-green-600 hover:bg-green-700">
              {finalizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
              Finalizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentSession;
