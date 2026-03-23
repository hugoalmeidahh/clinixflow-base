import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import { Syringe, Plus, Package, AlertTriangle, CheckCircle2, Clock, RefreshCw, Loader2, Settings, Receipt, Upload } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// ── Helpers ───────────────────────────────────────────────────────────────

const getBatchStatus = (batch: any, today: string) => {
  if (batch.quantity_remaining === 0) return { label: "Esgotado", className: "bg-gray-100 text-gray-600 border-gray-200" };
  if (batch.expiration_date < today) return { label: "Vencido", className: "bg-red-100 text-red-700 border-red-200" };
  const daysLeft = differenceInDays(parseISO(batch.expiration_date), new Date());
  if (daysLeft <= 7) return { label: `Vence em ${daysLeft}d`, className: "bg-red-100 text-red-700 border-red-200" };
  if (daysLeft <= 30) return { label: `Vence em ${daysLeft}d`, className: "bg-yellow-100 text-yellow-700 border-yellow-200" };
  return { label: "OK", className: "bg-green-100 text-green-700 border-green-200" };
};

const getSuggestionStatus = (s: any) => {
  const cfg: Record<string, { label: string; className: string }> = {
    SUGGESTED: { label: "Sugerido", className: "bg-amber-100 text-amber-700 border-amber-200" },
    SCHEDULED: { label: "Agendado", className: "bg-blue-100 text-blue-700 border-blue-200" },
    APPLIED: { label: "Aplicado", className: "bg-green-100 text-green-700 border-green-200" },
    OVERDUE: { label: "Atrasado", className: "bg-red-100 text-red-700 border-red-200" },
  };
  return cfg[s.status] || cfg.SUGGESTED;
};

// ── Component ────────────────────────────────────────────────────────────

const Vaccines = () => {
  const { tenantId, user } = useAuth();
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [rndsQueue, setRndsQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);

  // Vaccine dialog
  const [vaccineDialog, setVaccineDialog] = useState(false);
  const [vaccineSaving, setVaccineSaving] = useState(false);
  const [vaccineForm, setVaccineForm] = useState({ name: "", genericName: "", manufacturer: "", dosesMl: "", administrationRoute: "", sipniCode: "", minimumStock: "5" });

  // Batch dialog
  const [batchDialog, setBatchDialog] = useState(false);
  const [batchSaving, setBatchSaving] = useState(false);
  const [batchForm, setBatchForm] = useState({ vaccineId: "", lotNumber: "", quantity: "", expirationDate: "", manufacturer: "", entryInvoice: "" });

  // Application dialog
  const [appDialog, setAppDialog] = useState(false);
  const [appSaving, setAppSaving] = useState(false);
  const [appForm, setAppForm] = useState({ patientId: "", vaccineId: "", batchId: "", doseNumber: "1", doseLabel: "1ª Dose", appliedBy: "", appliedAt: format(new Date(), "yyyy-MM-ddTHH:mm"), applicationSite: "", notes: "" });

  // VAC-009: Mass import
  const [importDialog, setImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<any[]>([]);
  const [importParsing, setImportParsing] = useState(false);
  const [importSaving, setImportSaving] = useState(false);

  // VAC-008: NF emission
  const [nfFilter, setNfFilter] = useState<"ALL" | "SEM_NF" | "COM_NF">("ALL");
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [nfDialog, setNfDialog] = useState(false);
  const [nfForm, setNfForm] = useState({ amount: "", serviceCode: "14.01", description: "" });
  const [nfSaving, setNfSaving] = useState(false);

  // Schedule rule dialog
  const [ruleDialog, setRuleDialog] = useState(false);
  const [ruleVaccineId, setRuleVaccineId] = useState("");
  const [ruleForm, setRuleForm] = useState({ doseNumber: "1", doseLabel: "1ª Dose", minIntervalDays: "0", recommendedIntervalDays: "30" });
  const [ruleSaving, setRuleSaving] = useState(false);
  const [scheduleRules, setScheduleRules] = useState<any[]>([]);

  const today = format(new Date(), "yyyy-MM-dd");

  const fetchAll = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    const [vRes, bRes, aRes, sRes, rRes, patRes, profRes] = await Promise.all([
      supabase.from("vaccines").select("*").eq("tenant_id", tenantId).order("name"),
      supabase.from("vaccine_batches").select("*, vaccines!inner(name)").eq("tenant_id", tenantId).order("expiration_date"),
      supabase.from("vaccine_applications").select("*, patients!inner(full_name), professionals!inner(full_name), vaccines!inner(name), vaccine_batches(lot_number)")
        .eq("tenant_id", tenantId).order("applied_at", { ascending: false }).limit(100),
      (supabase as any).from("vaccine_suggestions").select("*, patients(full_name), vaccines(name)")
        .eq("tenant_id", tenantId).neq("status", "APPLIED").order("suggested_date"),
      (supabase as any).from("rnds_queue").select("*, vaccine_applications(applied_at, vaccines(name), patients(full_name))")
        .eq("tenant_id", tenantId).order("created_at", { ascending: false }).limit(50),
      supabase.from("patients").select("id, full_name").eq("tenant_id", tenantId).eq("is_active", true).order("full_name"),
      supabase.from("professionals").select("id, full_name").eq("tenant_id", tenantId).eq("is_active", true).order("full_name"),
    ]);
    setVaccines(vRes.data || []);
    setBatches(bRes.data || []);
    setApplications(aRes.data || []);
    setSuggestions(sRes.data || []);
    setRndsQueue(rRes.data || []);
    setPatients(patRes.data || []);
    setProfessionals(profRes.data || []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreateVaccine = async () => {
    if (!tenantId || !vaccineForm.name) return;
    setVaccineSaving(true);
    const { error } = await supabase.from("vaccines").insert({
      tenant_id: tenantId,
      name: vaccineForm.name,
      manufacturer: vaccineForm.manufacturer || null,
      doses_required: 1,
      min_interval_days: null,
      description: null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Vacina cadastrada!"); setVaccineDialog(false); setVaccineForm({ name: "", genericName: "", manufacturer: "", dosesMl: "", administrationRoute: "", sipniCode: "", minimumStock: "5" }); fetchAll(); }
    setVaccineSaving(false);
  };

  const handleCreateBatch = async () => {
    if (!tenantId || !batchForm.vaccineId || !batchForm.lotNumber || !batchForm.quantity || !batchForm.expirationDate) return;
    setBatchSaving(true);
    const qty = parseInt(batchForm.quantity);
    const { error } = await supabase.from("vaccine_batches").insert({
      tenant_id: tenantId,
      vaccine_id: batchForm.vaccineId,
      lot_number: batchForm.lotNumber,
      quantity_received: qty,
      quantity_remaining: qty,
      expiration_date: batchForm.expirationDate,
      manufacturer: batchForm.manufacturer || null,
      received_by: user?.id || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Lote cadastrado!"); setBatchDialog(false); setBatchForm({ vaccineId: "", lotNumber: "", quantity: "", expirationDate: "", manufacturer: "", entryInvoice: "" }); fetchAll(); }
    setBatchSaving(false);
  };

  // FIFO: get active batches for selected vaccine sorted by expiration
  const availableBatches = batches.filter(b =>
    b.vaccine_id === appForm.vaccineId &&
    b.quantity_remaining > 0 &&
    b.expiration_date >= today
  ).sort((a, b) => a.expiration_date.localeCompare(b.expiration_date));

  const handleApplication = async () => {
    if (!tenantId || !appForm.patientId || !appForm.vaccineId || !appForm.batchId || !appForm.appliedBy) return;
    setAppSaving(true);

    const { error: appErr } = await supabase.from("vaccine_applications").insert({
      tenant_id: tenantId,
      patient_id: appForm.patientId,
      vaccine_id: appForm.vaccineId,
      batch_id: appForm.batchId,
      dose_label: appForm.doseLabel,
      applied_at: new Date(appForm.appliedAt).toISOString(),
      applied_by: appForm.appliedBy,
      application_site: appForm.applicationSite || null,
      notes: appForm.notes || null,
    });

    if (appErr) { toast.error(appErr.message); setAppSaving(false); return; }

    // Decrement batch quantity
    const batch = batches.find(b => b.id === appForm.batchId);
    if (batch) {
      await supabase.from("vaccine_batches").update({ quantity_remaining: batch.quantity_remaining - 1 }).eq("id", appForm.batchId);
    }

    // Create RNDS queue entry
    const { data: newApp } = await supabase.from("vaccine_applications").select("id").eq("tenant_id", tenantId).eq("patient_id", appForm.patientId).order("applied_at", { ascending: false }).limit(1).single();
    if (newApp) {
      await (supabase as any).from("rnds_queue").insert({ tenant_id: tenantId, application_id: newApp.id, status: "PENDING" });
    }

    toast.success("Aplicação registrada!");
    setAppDialog(false);
    setAppForm({ patientId: "", vaccineId: "", batchId: "", doseNumber: "1", doseLabel: "1ª Dose", appliedBy: "", appliedAt: format(new Date(), "yyyy-MM-ddTHH:mm"), applicationSite: "", notes: "" });
    fetchAll();
    setAppSaving(false);
  };

  const loadRules = async (vaccineId: string) => {
    const { data } = await (supabase as any).from("vaccine_schedule_rules").select("*").eq("vaccine_id", vaccineId).order("dose_number");
    setScheduleRules(data || []);
    setRuleVaccineId(vaccineId);
    setRuleDialog(true);
  };

  const handleCreateRule = async () => {
    if (!ruleVaccineId) return;
    setRuleSaving(true);
    const { error } = await (supabase as any).from("vaccine_schedule_rules").insert({
      vaccine_id: ruleVaccineId,
      dose_number: parseInt(ruleForm.doseNumber),
      dose_label: ruleForm.doseLabel,
      min_interval_days: parseInt(ruleForm.minIntervalDays),
      recommended_interval_days: parseInt(ruleForm.recommendedIntervalDays),
    });
    if (error) toast.error(error.message);
    else { toast.success("Regra adicionada!"); await loadRules(ruleVaccineId); setRuleForm({ doseNumber: "1", doseLabel: "1ª Dose", minIntervalDays: "0", recommendedIntervalDays: "30" }); }
    setRuleSaving(false);
  };

  const downloadImportTemplate = () => {
    const header = "paciente_id,vacina_id,lote_id,profissional_id,data_aplicacao,dose_label,local_aplicacao,observacoes\n";
    const blob = new Blob([header], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "modelo_importacao_vacinas.csv"; a.click();
  };

  const parseImportFile = async (file: File) => {
    setImportParsing(true);
    setImportPreview([]); setImportErrors([]);
    const text = await file.text();
    const lines = text.trim().split("\n").slice(1); // skip header
    const valid: any[] = []; const errors: any[] = [];
    lines.forEach((line, idx) => {
      const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
      const [patientId, vaccineId, batchId, appliedBy, appliedAt, doseLabel, applicationSite, notes] = cols;
      if (!patientId || !vaccineId || !batchId || !appliedBy || !appliedAt) {
        errors.push({ row: idx + 2, reason: "Campos obrigatórios ausentes", raw: line });
        return;
      }
      const patient = patients.find(p => p.id === patientId);
      const vaccine = vaccines.find(v => v.id === vaccineId);
      const batch = batches.find(b => b.id === batchId);
      if (!patient) { errors.push({ row: idx + 2, reason: `Paciente não encontrado: ${patientId}`, raw: line }); return; }
      if (!vaccine) { errors.push({ row: idx + 2, reason: `Vacina não encontrada: ${vaccineId}`, raw: line }); return; }
      if (!batch) { errors.push({ row: idx + 2, reason: `Lote não encontrado: ${batchId}`, raw: line }); return; }
      if (batch.quantity_remaining < 1) { errors.push({ row: idx + 2, reason: `Lote ${batch.lot_number} sem estoque`, raw: line }); return; }
      valid.push({ patientId, vaccineId, batchId, appliedBy, appliedAt, doseLabel: doseLabel || "1ª Dose", applicationSite: applicationSite || null, notes: notes || null, patientName: patient.full_name, vaccineName: vaccine.name, lotNumber: batch.lot_number });
    });
    setImportPreview(valid);
    setImportErrors(errors);
    setImportParsing(false);
  };

  const handleImport = async () => {
    if (!tenantId || importPreview.length === 0) return;
    setImportSaving(true);
    let successCount = 0;
    // Process in chunks of 10 to avoid rate limits
    for (let i = 0; i < importPreview.length; i += 10) {
      const chunk = importPreview.slice(i, i + 10);
      await Promise.all(chunk.map(async (row: any) => {
        const { error } = await supabase.from("vaccine_applications").insert({
          tenant_id: tenantId,
          patient_id: row.patientId,
          vaccine_id: row.vaccineId,
          batch_id: row.batchId,
          applied_by: row.appliedBy,
          applied_at: new Date(row.appliedAt).toISOString(),
          dose_label: row.doseLabel,
          application_site: row.applicationSite,
          notes: row.notes,
        });
        if (!error) {
          await supabase.from("vaccine_batches").update({ quantity_remaining: batches.find(b => b.id === row.batchId)!.quantity_remaining - 1 }).eq("id", row.batchId);
          successCount++;
        }
      }));
    }
    toast.success(`${successCount} aplicação(ões) importada(s) com sucesso!`);
    setImportDialog(false);
    setImportFile(null);
    setImportPreview([]);
    setImportErrors([]);
    fetchAll();
    setImportSaving(false);
  };

  const handleGenerateNf = async () => {
    if (!tenantId || selectedApps.size === 0 || !nfForm.amount) return;
    setNfSaving(true);
    // Create NFSe invoice draft referencing selected vaccine applications
    const { data: inv, error } = await (supabase as any).from("nfse_invoices").insert({
      tenant_id: tenantId,
      patient_id: applications.find(a => selectedApps.has(a.id))?.patient_id || null,
      amount: parseFloat(nfForm.amount),
      description: nfForm.description || `Aplicação de vacinas (${selectedApps.size} dose(s))`,
      service_code: nfForm.serviceCode,
      status: "DRAFT",
      created_by: user?.id,
    }).select("id").single();
    if (error) { toast.error(error.message); setNfSaving(false); return; }
    // Link applications to invoice
    if (inv) {
      await Promise.all(Array.from(selectedApps).map(appId =>
        supabase.from("vaccine_applications").update({ invoice_id: inv.id } as any).eq("id", appId)
      ));
    }
    toast.success(`NFSe em rascunho criada para ${selectedApps.size} aplicação(ões).`);
    setNfDialog(false);
    setSelectedApps(new Set());
    setNfForm({ amount: "", serviceCode: "14.01", description: "" });
    fetchAll();
    setNfSaving(false);
  };

  const toggleAppSelect = (id: string) => {
    setSelectedApps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredApplications = applications.filter(a => {
    if (nfFilter === "SEM_NF") return !(a as any).invoice_id;
    if (nfFilter === "COM_NF") return !!(a as any).invoice_id;
    return true;
  });

  const retryRnds = async (id: string) => {
    await (supabase as any).from("rnds_queue").update({ status: "PENDING", attempts: 0, error_message: null }).eq("id", id);
    toast.success("Reprocessamento agendado!");
    fetchAll();
  };

  // Alerts
  const expiringSoon = batches.filter(b => {
    if (b.quantity_remaining === 0 || b.expiration_date < today) return false;
    const d = differenceInDays(parseISO(b.expiration_date), new Date());
    return d <= 30;
  });
  const overdueCount = suggestions.filter(s => s.status === "OVERDUE").length;
  const rndsFailedCount = rndsQueue.filter(r => r.status === "FAILED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold">Vacinas</h1>
          <p className="text-sm text-muted-foreground">Gestão de vacinas, estoque, aplicações e calendário vacinal</p>
        </div>
        <Button onClick={() => setAppDialog(true)} className="gap-1.5">
          <Syringe className="h-4 w-4" /> Registrar Aplicação
        </Button>
      </div>

      {/* Alert bar */}
      {(expiringSoon.length > 0 || overdueCount > 0 || rndsFailedCount > 0) && (
        <div className="flex flex-wrap gap-2">
          {expiringSoon.length > 0 && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1.5 text-xs">
              <AlertTriangle className="h-3 w-3" /> {expiringSoon.length} lote(s) vencendo em breve
            </Badge>
          )}
          {overdueCount > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 text-xs">
              <AlertTriangle className="h-3 w-3" /> {overdueCount} dose(s) atrasada(s)
            </Badge>
          )}
          {rndsFailedCount > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 text-xs">
              <AlertTriangle className="h-3 w-3" /> {rndsFailedCount} falha(s) RNDS
            </Badge>
          )}
        </div>
      )}

      <Tabs defaultValue="vaccines">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="vaccines"><Syringe className="h-3.5 w-3.5 mr-1" />Vacinas</TabsTrigger>
          <TabsTrigger value="stock"><Package className="h-3.5 w-3.5 mr-1" />Estoque</TabsTrigger>
          <TabsTrigger value="applications"><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Aplicações</TabsTrigger>
          <TabsTrigger value="suggestions"><Clock className="h-3.5 w-3.5 mr-1" />Sugestões {overdueCount > 0 && <span className="ml-1 bg-red-500 text-white rounded-full text-[10px] px-1">{overdueCount}</span>}</TabsTrigger>
          <TabsTrigger value="rnds"><RefreshCw className="h-3.5 w-3.5 mr-1" />RNDS {rndsFailedCount > 0 && <span className="ml-1 bg-red-500 text-white rounded-full text-[10px] px-1">{rndsFailedCount}</span>}</TabsTrigger>
        </TabsList>

        {/* ── Vaccines ──────────────────────────────────────────────── */}
        <TabsContent value="vaccines" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Cadastro de Vacinas</CardTitle>
              <Button size="sm" onClick={() => setVaccineDialog(true)} className="gap-1"><Plus className="h-3.5 w-3.5" /> Nova</Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
                vaccines.length === 0 ? <EmptyState icon={Syringe} title="Nenhuma vacina" description="Cadastre a primeira vacina." actionLabel="+ Nova" onAction={() => setVaccineDialog(true)} /> :
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Fabricante</TableHead>
                      <TableHead>Estoque Total</TableHead>
                      <TableHead>Estoque Mín.</TableHead>
                      <TableHead>Calendário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccines.map(v => {
                      const stock = batches.filter(b => b.vaccine_id === v.id && b.expiration_date >= today).reduce((s: number, b: any) => s + b.quantity_remaining, 0);
                      const lowStock = stock < (v.minimum_stock || 5);
                      return (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{v.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{v.manufacturer || "—"}</TableCell>
                          <TableCell>
                            <span className={`font-mono font-semibold ${lowStock ? "text-amber-600" : "text-foreground"}`}>{stock}</span>
                            {lowStock && <Badge variant="outline" className="ml-2 text-xs bg-amber-50 text-amber-700 border-amber-200">Baixo</Badge>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{v.minimum_stock || 5}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => loadRules(v.id)}>
                              <Settings className="h-3 w-3" /> Regras
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              }
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Stock ─────────────────────────────────────────────────── */}
        <TabsContent value="stock" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Lotes e Estoque</CardTitle>
              <Button size="sm" onClick={() => setBatchDialog(true)} className="gap-1"><Plus className="h-3.5 w-3.5" /> Novo Lote</Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
                batches.length === 0 ? <EmptyState icon={Package} title="Nenhum lote" description="Cadastre o primeiro lote." actionLabel="+ Novo Lote" onAction={() => setBatchDialog(true)} /> :
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vacina</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead>Disponível</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map(b => {
                      const st = getBatchStatus(b, today);
                      return (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium text-sm">{b.vaccines?.name}</TableCell>
                          <TableCell className="font-mono text-sm">{b.lot_number}</TableCell>
                          <TableCell><span className="font-semibold">{b.quantity_remaining}</span><span className="text-muted-foreground text-xs"> / {b.quantity_received}</span></TableCell>
                          <TableCell className="text-sm">{format(parseISO(b.expiration_date), "dd/MM/yyyy")}</TableCell>
                          <TableCell><Badge variant="outline" className={`text-xs ${st.className}`}>{st.label}</Badge></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              }
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Applications ──────────────────────────────────────────── */}
        <TabsContent value="applications" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">Histórico de Aplicações</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <select className="h-8 rounded-md border border-input bg-background px-2 text-xs" value={nfFilter} onChange={e => setNfFilter(e.target.value as any)}>
                    <option value="ALL">Todas</option>
                    <option value="SEM_NF">Sem NF</option>
                    <option value="COM_NF">Com NF</option>
                  </select>
                  {selectedApps.size > 0 && (
                    <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setNfDialog(true)}>
                      <Receipt className="h-3.5 w-3.5" /> Gerar NF ({selectedApps.size})
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => setImportDialog(true)}><Upload className="h-3.5 w-3.5" /> Importar</Button>
                  <Button size="sm" onClick={() => setAppDialog(true)} className="h-8 gap-1"><Plus className="h-3.5 w-3.5" /> Registrar</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
                filteredApplications.length === 0 ? <EmptyState icon={Syringe} title="Nenhuma aplicação" description="Nenhuma aplicação registrada." actionLabel="+ Registrar" onAction={() => setAppDialog(true)} /> :
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Vacina</TableHead>
                      <TableHead>Dose</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead>Profissional</TableHead>
                      <TableHead>RNDS</TableHead>
                      <TableHead>NF</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((a: any) => (
                      <TableRow key={a.id} className={selectedApps.has(a.id) ? "bg-muted/40" : ""}>
                        <TableCell>
                          {!a.invoice_id && (
                            <input type="checkbox" checked={selectedApps.has(a.id)} onChange={() => toggleAppSelect(a.id)} className="rounded" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{format(new Date(a.applied_at), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="font-medium text-sm">{a.patients?.full_name}</TableCell>
                        <TableCell className="text-sm">{a.vaccines?.name}</TableCell>
                        <TableCell className="text-xs font-mono">{a.dose_label}</TableCell>
                        <TableCell className="text-xs font-mono">{a.vaccine_batches?.lot_number || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{a.professionals?.full_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${a.synced_to_rnds ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                            {a.synced_to_rnds ? "Sincronizado" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {a.invoice_id ? (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">NF emitida</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Suggestions ───────────────────────────────────────────── */}
        <TabsContent value="suggestions" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Doses Sugeridas e em Atraso</CardTitle></CardHeader>
            <CardContent className="p-0">
              {loading ? <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
                suggestions.length === 0 ? <p className="text-sm text-muted-foreground p-4">Nenhuma dose pendente.</p> :
                <div className="divide-y divide-border">
                  {suggestions.map(s => {
                    const st = getSuggestionStatus(s);
                    return (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3 gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{s.patients?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{s.vaccines?.name} · {s.dose_label || `Dose ${s.dose_number}`}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground">{format(parseISO(s.suggested_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                          <Badge variant="outline" className={`text-xs ${st.className}`}>{st.label}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── RNDS ──────────────────────────────────────────────────── */}
        <TabsContent value="rnds" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Fila de Sincronização RNDS</CardTitle>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400 inline-block"></span>Pendente: {rndsQueue.filter(r => r.status === "PENDING").length}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>Enviado: {rndsQueue.filter(r => r.status === "SENT").length}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>Falha: {rndsFailedCount}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
                rndsQueue.length === 0 ? <p className="text-sm text-muted-foreground p-4">Nenhuma transmissão registrada.</p> :
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Vacina</TableHead>
                      <TableHead>Tentativas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rndsQueue.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="text-sm">{format(new Date(r.created_at), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="font-medium text-sm">{r.vaccine_applications?.patients?.full_name || "—"}</TableCell>
                        <TableCell className="text-sm">{r.vaccine_applications?.vaccines?.name || "—"}</TableCell>
                        <TableCell className="text-sm">{r.attempts}/5</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${r.status === "SENT" ? "bg-green-50 text-green-700 border-green-200" : r.status === "FAILED" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                            {r.status === "PENDING" ? "Pendente" : r.status === "SENT" ? "Enviado" : "Falha"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {r.status === "FAILED" && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => retryRnds(r.id)}>
                              <RefreshCw className="h-3 w-3" /> Reprocessar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground">Configure as credenciais RNDS (CNES, certificado digital) nas <strong>Configurações</strong> da clínica.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vaccine Dialog */}
      <Dialog open={vaccineDialog} onOpenChange={setVaccineDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nova Vacina</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Nome Comercial *</Label><Input value={vaccineForm.name} onChange={e => setVaccineForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label className="text-xs">Fabricante</Label><Input value={vaccineForm.manufacturer} onChange={e => setVaccineForm(p => ({ ...p, manufacturer: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Código SIPNI</Label><Input value={vaccineForm.sipniCode} onChange={e => setVaccineForm(p => ({ ...p, sipniCode: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label className="text-xs">Via de Administração</Label><Input value={vaccineForm.administrationRoute} onChange={e => setVaccineForm(p => ({ ...p, administrationRoute: e.target.value }))} placeholder="IM, SC, ID..." /></div>
              <div className="space-y-1.5"><Label className="text-xs">Estoque Mínimo</Label><Input type="number" value={vaccineForm.minimumStock} onChange={e => setVaccineForm(p => ({ ...p, minimumStock: e.target.value }))} /></div>
            </div>
            <Button onClick={handleCreateVaccine} disabled={vaccineSaving || !vaccineForm.name} className="w-full">
              {vaccineSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Cadastrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Batch Dialog */}
      <Dialog open={batchDialog} onOpenChange={setBatchDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Lote</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Vacina *</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={batchForm.vaccineId} onChange={e => setBatchForm(p => ({ ...p, vaccineId: e.target.value }))}>
                <option value="">Selecionar</option>
                {vaccines.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label className="text-xs">Nº do Lote *</Label><Input value={batchForm.lotNumber} onChange={e => setBatchForm(p => ({ ...p, lotNumber: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Quantidade *</Label><Input type="number" value={batchForm.quantity} onChange={e => setBatchForm(p => ({ ...p, quantity: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label className="text-xs">Validade *</Label><Input type="date" value={batchForm.expirationDate} onChange={e => setBatchForm(p => ({ ...p, expirationDate: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">NF Entrada</Label><Input value={batchForm.entryInvoice} onChange={e => setBatchForm(p => ({ ...p, entryInvoice: e.target.value }))} /></div>
            </div>
            <Button onClick={handleCreateBatch} disabled={batchSaving || !batchForm.vaccineId || !batchForm.lotNumber || !batchForm.quantity || !batchForm.expirationDate} className="w-full">
              {batchSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Cadastrar Lote
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={appDialog} onOpenChange={setAppDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Registrar Aplicação de Vacina</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Paciente *</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={appForm.patientId} onChange={e => setAppForm(p => ({ ...p, patientId: e.target.value }))}>
                  <option value="">Selecionar</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Profissional Aplicador *</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={appForm.appliedBy} onChange={e => setAppForm(p => ({ ...p, appliedBy: e.target.value }))}>
                  <option value="">Selecionar</option>
                  {professionals.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Vacina *</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={appForm.vaccineId} onChange={e => setAppForm(p => ({ ...p, vaccineId: e.target.value, batchId: "" }))}>
                <option value="">Selecionar</option>
                {vaccines.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lote * (FIFO — por validade)</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={appForm.batchId} onChange={e => setAppForm(p => ({ ...p, batchId: e.target.value }))} disabled={!appForm.vaccineId}>
                <option value="">Selecionar lote</option>
                {availableBatches.map(b => <option key={b.id} value={b.id}>{b.lot_number} · val: {format(parseISO(b.expiration_date), "dd/MM/yyyy")} · estoque: {b.quantity_remaining}</option>)}
              </select>
              {appForm.vaccineId && availableBatches.length === 0 && <p className="text-xs text-red-600">Sem lotes disponíveis para esta vacina.</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Dose</Label>
                <Input value={appForm.doseLabel} onChange={e => setAppForm(p => ({ ...p, doseLabel: e.target.value }))} placeholder="1ª Dose, 2ª Dose, Reforço..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Local de Aplicação</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={appForm.applicationSite} onChange={e => setAppForm(p => ({ ...p, applicationSite: e.target.value }))}>
                  <option value="">Selecionar</option>
                  {["Braço Direito", "Braço Esquerdo", "Coxa Direita", "Coxa Esquerda", "Abdome", "Glúteo"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Data/Hora *</Label>
              <Input type="datetime-local" value={appForm.appliedAt} onChange={e => setAppForm(p => ({ ...p, appliedAt: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Observações</Label>
              <Textarea value={appForm.notes} onChange={e => setAppForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="text-sm" />
            </div>
            <Button onClick={handleApplication} disabled={appSaving || !appForm.patientId || !appForm.vaccineId || !appForm.batchId || !appForm.appliedBy} className="w-full">
              {appSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Registrar Aplicação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog (VAC-009) */}
      <Dialog open={importDialog} onOpenChange={setImportDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader><DialogTitle>Importar Aplicações em Massa</DialogTitle></DialogHeader>
          <div className="space-y-3 overflow-y-auto flex-1">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadImportTemplate} className="gap-1.5 text-xs">
                <Upload className="h-3.5 w-3.5" /> Baixar Modelo CSV
              </Button>
              <p className="text-xs text-muted-foreground">Preencha o modelo e faça o upload abaixo.</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Arquivo CSV *</Label>
              <Input type="file" accept=".csv" onChange={e => {
                const f = e.target.files?.[0] || null;
                setImportFile(f);
                if (f) parseImportFile(f);
              }} />
            </div>
            {importParsing && <p className="text-xs text-muted-foreground">Validando arquivo...</p>}
            {(importPreview.length > 0 || importErrors.length > 0) && (
              <div className="space-y-3">
                {importPreview.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1">{importPreview.length} linha(s) válida(s):</p>
                    <div className="bg-green-50 rounded-md p-2 max-h-32 overflow-y-auto">
                      {importPreview.slice(0, 10).map((r, i) => (
                        <p key={i} className="text-xs">{r.patientName} · {r.vaccineName} · Lote {r.lotNumber} · {r.appliedAt}</p>
                      ))}
                      {importPreview.length > 10 && <p className="text-xs text-muted-foreground">... e mais {importPreview.length - 10}</p>}
                    </div>
                  </div>
                )}
                {importErrors.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1">{importErrors.length} linha(s) com erro (serão ignoradas):</p>
                    <div className="bg-red-50 rounded-md p-2 max-h-32 overflow-y-auto">
                      {importErrors.map((e, i) => <p key={i} className="text-xs">Linha {e.row}: {e.reason}</p>)}
                    </div>
                  </div>
                )}
              </div>
            )}
            {importPreview.length > 0 && (
              <Button onClick={handleImport} disabled={importSaving} className="w-full">
                {importSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Importar {importPreview.length} linha(s) válida(s)
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* NF Generation Dialog (VAC-008) */}
      <Dialog open={nfDialog} onOpenChange={setNfDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Emitir NFSe — {selectedApps.size} aplicação(ões)</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="bg-muted/40 rounded-md p-3 text-xs text-muted-foreground">
              {Array.from(selectedApps).map(id => {
                const a = applications.find(x => x.id === id);
                return <p key={id}>{a?.patients?.full_name} · {a?.vaccines?.name} · {a?.dose_label}</p>;
              })}
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Valor Total R$ *</Label><Input type="number" step="0.01" value={nfForm.amount} onChange={e => setNfForm(p => ({ ...p, amount: e.target.value }))} placeholder="0,00" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Código de Serviço LC116</Label><Input value={nfForm.serviceCode} onChange={e => setNfForm(p => ({ ...p, serviceCode: e.target.value }))} placeholder="14.01" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Descrição</Label><Input value={nfForm.description} onChange={e => setNfForm(p => ({ ...p, description: e.target.value }))} placeholder="Aplicação de vacinas" /></div>
            <p className="text-xs text-muted-foreground">A nota será criada em rascunho. Acesse <strong>Financeiro → NFSe</strong> para autorizar e emitir.</p>
            <Button onClick={handleGenerateNf} disabled={nfSaving || !nfForm.amount} className="w-full">
              {nfSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Criar Rascunho NFSe
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Rules Dialog */}
      <Dialog open={ruleDialog} onOpenChange={setRuleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Calendário Vacinal — {vaccines.find(v => v.id === ruleVaccineId)?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {scheduleRules.length > 0 && (
              <div className="space-y-1">
                {scheduleRules.map(r => (
                  <div key={r.id} className="text-sm flex justify-between items-center rounded-md bg-muted/40 px-3 py-2">
                    <span className="font-medium">{r.dose_label}</span>
                    <span className="text-muted-foreground text-xs">Intervalo: {r.recommended_interval_days}d (min {r.min_interval_days}d)</span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t pt-3 space-y-2">
              <p className="text-xs font-medium">Adicionar regra de dose:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label className="text-xs">Nº Dose</Label><Input type="number" value={ruleForm.doseNumber} onChange={e => setRuleForm(p => ({ ...p, doseNumber: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">Rótulo</Label><Input value={ruleForm.doseLabel} onChange={e => setRuleForm(p => ({ ...p, doseLabel: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label className="text-xs">Intervalo Mín. (dias)</Label><Input type="number" value={ruleForm.minIntervalDays} onChange={e => setRuleForm(p => ({ ...p, minIntervalDays: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">Intervalo Recomendado</Label><Input type="number" value={ruleForm.recommendedIntervalDays} onChange={e => setRuleForm(p => ({ ...p, recommendedIntervalDays: e.target.value }))} /></div>
              </div>
              <Button size="sm" onClick={handleCreateRule} disabled={ruleSaving} className="w-full">
                {ruleSaving && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />} Adicionar Regra
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vaccines;
