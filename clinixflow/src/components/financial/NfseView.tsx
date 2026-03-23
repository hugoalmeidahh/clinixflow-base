import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import { Receipt, Plus, Settings2, Loader2, X, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ── Types ─────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Rascunho", variant: "secondary" },
  PENDING: { label: "Aguardando", variant: "secondary" },
  AUTHORIZED: { label: "Autorizada", variant: "default" },
  CANCELLED: { label: "Cancelada", variant: "destructive" },
  ERROR: { label: "Erro", variant: "destructive" },
};

const fmt = (v: number) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

// ── Component ──────────────────────────────────────────────────────────────────

const NfseView = () => {
  const { tenantId, user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);

  // Config
  const [configDialog, setConfigDialog] = useState(false);
  const [config, setConfig] = useState({ provider: "", apiKey: "", im: "", regime: "", codigoServico: "" });
  const [configSaving, setConfigSaving] = useState(false);

  // New invoice
  const [newDialog, setNewDialog] = useState(false);
  const [form, setForm] = useState({ patientId: "", amount: "", description: "", serviceCode: "" });
  const [formSaving, setFormSaving] = useState(false);

  // Cancel
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelSaving, setCancelSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    const [invRes, patRes, tenantRes] = await Promise.all([
      (supabase as any).from("invoices").select("*, patients(full_name)").eq("tenant_id", tenantId).order("created_at", { ascending: false }),
      supabase.from("patients").select("id, full_name").eq("tenant_id", tenantId).eq("is_active", true).order("full_name"),
      supabase.from("tenants").select("nfse_provider, nfse_api_key, nfse_inscricao_municipal, nfse_regime_tributario, nfse_codigo_servico").eq("id", tenantId).single(),
    ]);
    setInvoices(invRes.data || []);
    setPatients(patRes.data || []);
    if (tenantRes.data) {
      setConfig({
        provider: tenantRes.data.nfse_provider || "",
        apiKey: tenantRes.data.nfse_api_key || "",
        im: tenantRes.data.nfse_inscricao_municipal || "",
        regime: tenantRes.data.nfse_regime_tributario || "",
        codigoServico: tenantRes.data.nfse_codigo_servico || "",
      });
    }
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveConfig = async () => {
    if (!tenantId) return;
    setConfigSaving(true);
    const { error } = await (supabase as any).from("tenants").update({
      nfse_provider: config.provider || null,
      nfse_api_key: config.apiKey || null,
      nfse_inscricao_municipal: config.im || null,
      nfse_regime_tributario: config.regime || null,
      nfse_codigo_servico: config.codigoServico || null,
    }).eq("id", tenantId);
    if (error) toast.error(error.message);
    else { toast.success("Configuração NFSe salva!"); setConfigDialog(false); }
    setConfigSaving(false);
  };

  const handleCreateInvoice = async () => {
    if (!tenantId || !form.amount || !form.description) return;
    setFormSaving(true);
    const { error } = await (supabase as any).from("invoices").insert({
      tenant_id: tenantId,
      patient_id: form.patientId || null,
      amount: parseFloat(form.amount),
      description: form.description,
      service_code: form.serviceCode || null,
      status: "DRAFT",
      created_by: user?.id,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Nota fiscal criada como rascunho! Configure o provedor NFSe para emitir.");
      setNewDialog(false);
      setForm({ patientId: "", amount: "", description: "", serviceCode: "" });
      fetchData();
    }
    setFormSaving(false);
  };

  const handleEmit = async (invoice: any) => {
    if (!config.provider || !config.apiKey) {
      toast.error("Configure o provedor NFSe primeiro em 'Configurações NFSe'.");
      return;
    }
    // Mark as PENDING — actual API call would happen via Edge Function
    const { error } = await (supabase as any).from("invoices").update({ status: "PENDING", issued_at: new Date().toISOString() }).eq("id", invoice.id);
    if (error) toast.error(error.message);
    else {
      toast.info("Nota enviada para processamento! Atualize em instantes para ver o status.");
      fetchData();
    }
  };

  const handleCancel = async () => {
    if (!cancelId || !cancelReason) return;
    setCancelSaving(true);
    const { error } = await (supabase as any).from("invoices").update({
      status: "CANCELLED",
      cancelled_at: new Date().toISOString(),
      cancel_reason: cancelReason,
    }).eq("id", cancelId);
    if (error) toast.error(error.message);
    else { toast.success("Nota cancelada!"); setCancelId(null); setCancelReason(""); fetchData(); }
    setCancelSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Emissão e gestão de Notas Fiscais de Serviço (NFSe)</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfigDialog(true)} className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Configurações NFSe
          </Button>
          <Button size="sm" onClick={() => setNewDialog(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Nova Nota
          </Button>
        </div>
      </div>

      {/* NFSe Config status banner */}
      {!config.provider && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-3 flex items-center gap-2 text-sm text-amber-800">
            <Settings2 className="h-4 w-4 shrink-0" />
            Integração NFSe não configurada. Clique em "Configurações NFSe" para conectar seu provedor (Focus NFe ou eNotas).
          </CardContent>
        </Card>
      )}

      {/* Invoices table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            Notas Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : invoices.length === 0 ? (
            <EmptyState icon={Receipt} title="Nenhuma nota fiscal" description="Crie a primeira nota fiscal de serviço." actionLabel="Nova Nota" onAction={() => setNewDialog(true)} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nº NFS-e</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm">{format(new Date(inv.created_at), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell className="font-mono text-sm">{inv.nfse_number || "—"}</TableCell>
                    <TableCell className="text-sm">{inv.patients?.full_name || "—"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{inv.description}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-sm">{fmt(inv.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_CONFIG[inv.status]?.variant || "secondary"} className="text-xs">
                        {STATUS_CONFIG[inv.status]?.label || inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {inv.status === "DRAFT" && (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleEmit(inv)}>Emitir</Button>
                        )}
                        {inv.status === "AUTHORIZED" && inv.pdf_url && (
                          <Button size="sm" variant="ghost" className="text-xs gap-1" onClick={() => window.open(inv.pdf_url, "_blank")}>
                            <ExternalLink className="h-3 w-3" /> PDF
                          </Button>
                        )}
                        {["DRAFT", "AUTHORIZED"].includes(inv.status) && (
                          <Button size="sm" variant="ghost" className="text-xs text-destructive" onClick={() => { setCancelId(inv.id); setCancelReason(""); }}>
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Config Dialog */}
      <Dialog open={configDialog} onOpenChange={setConfigDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Configurações NFSe</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Provedor</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={config.provider} onChange={e => setConfig(p => ({ ...p, provider: e.target.value }))}>
                <option value="">Selecionar</option>
                <option value="FOCUS_NFE">Focus NFe</option>
                <option value="ENOTAS">eNotas</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">API Key *</Label>
              <Input type="password" value={config.apiKey} onChange={e => setConfig(p => ({ ...p, apiKey: e.target.value }))} placeholder="Token de autenticação do provedor" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Inscrição Municipal</Label>
              <Input value={config.im} onChange={e => setConfig(p => ({ ...p, im: e.target.value }))} placeholder="Número de IM" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Regime Tributário</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={config.regime} onChange={e => setConfig(p => ({ ...p, regime: e.target.value }))}>
                <option value="">Selecionar</option>
                <option value="1">Simples Nacional</option>
                <option value="2">Lucro Presumido</option>
                <option value="3">Lucro Real</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Código de Serviço (LC116)</Label>
              <Input value={config.codigoServico} onChange={e => setConfig(p => ({ ...p, codigoServico: e.target.value }))} placeholder="Ex: 8011400" />
            </div>
            <Button onClick={handleSaveConfig} disabled={configSaving} className="w-full">
              {configSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Configurações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Invoice Dialog */}
      <Dialog open={newDialog} onOpenChange={setNewDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nova Nota Fiscal</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Paciente (Tomador)</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))}>
                <option value="">Sem vínculo</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Valor (R$) *</Label>
              <Input type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descrição do Serviço *</Label>
              <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Serviços de saúde..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Código de Serviço</Label>
              <Input value={form.serviceCode} onChange={e => setForm(p => ({ ...p, serviceCode: e.target.value }))} placeholder={config.codigoServico || "LC116"} />
              {config.codigoServico && <p className="text-xs text-muted-foreground">Padrão configurado: {config.codigoServico}</p>}
            </div>
            <Button onClick={handleCreateInvoice} disabled={formSaving || !form.amount || !form.description} className="w-full">
              {formSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Nota
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={!!cancelId} onOpenChange={v => !v && setCancelId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-destructive">Cancelar Nota Fiscal</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Informe o motivo do cancelamento (obrigatório).</p>
            <Input value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Motivo do cancelamento..." />
            <Button variant="destructive" onClick={handleCancel} disabled={cancelSaving || !cancelReason} className="w-full">
              {cancelSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmar Cancelamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NfseView;
