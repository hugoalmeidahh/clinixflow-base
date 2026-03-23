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
import { Building2, Plus, ChevronRight, Loader2, CheckCircle2, Send } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(2025, i, 1), "MMMM", { locale: ptBR }),
}));

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  OPEN: { label: "Em Aberto", variant: "secondary" },
  SENT: { label: "Enviado à Operadora", variant: "default" },
  RECEIVED: { label: "Recebido", variant: "outline" },
};

const fmt = (v?: number | null) => v != null ? `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—";

// ── Component ──────────────────────────────────────────────────────────────────

const InsuranceBatchView = () => {
  const { tenantId, user } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);
  const [conventions, setConventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [batchItems, setBatchItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // New batch
  const [newDialog, setNewDialog] = useState(false);
  const [form, setForm] = useState({ conventionId: "", month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()) });
  const [formSaving, setFormSaving] = useState(false);

  // Mark sent/received
  const [markDialog, setMarkDialog] = useState<{ batch: any; action: "SENT" | "RECEIVED" } | null>(null);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [markSaving, setMarkSaving] = useState(false);

  const fetchBatches = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    const [batchRes, convRes] = await Promise.all([
      (supabase as any).from("insurance_batches").select("*, conventions(name)").eq("tenant_id", tenantId).order("period_year", { ascending: false }).order("period_month", { ascending: false }),
      supabase.from("conventions").select("id, name").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
    ]);
    setBatches(batchRes.data || []);
    setConventions(convRes.data || []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const loadBatchItems = async (batch: any) => {
    setSelectedBatch(batch);
    setItemsLoading(true);
    // Load appointments for this convention + period
    const startDate = `${batch.period_year}-${String(batch.period_month).padStart(2, "0")}-01`;
    const endDate = format(new Date(batch.period_year, batch.period_month, 0), "yyyy-MM-dd");
    const { data } = await supabase
      .from("appointments")
      .select("*, patients(full_name, cpf), professionals(full_name), specialties(name, tuss_code)")
      .eq("tenant_id", tenantId!)
      .eq("convention_id", batch.convention_id)
      .gte("scheduled_at", startDate)
      .lte("scheduled_at", endDate)
      .in("status", ["ATTENDED"] as any);
    setBatchItems(data || []);
    setItemsLoading(false);
  };

  const handleCreate = async () => {
    if (!tenantId || !form.conventionId) return;
    setFormSaving(true);
    const { error } = await (supabase as any).from("insurance_batches").insert({
      tenant_id: tenantId,
      convention_id: form.conventionId,
      period_month: parseInt(form.month),
      period_year: parseInt(form.year),
      status: "OPEN",
      created_by: user?.id,
    });
    if (error) toast.error(error.code === "23505" ? "Já existe um fechamento para este convênio e período." : error.message);
    else { toast.success("Fechamento criado!"); setNewDialog(false); fetchBatches(); }
    setFormSaving(false);
  };

  const handleMarkStatus = async () => {
    if (!markDialog) return;
    setMarkSaving(true);
    const payload: any = { status: markDialog.action };
    if (markDialog.action === "SENT") payload.sent_at = new Date().toISOString();
    if (markDialog.action === "RECEIVED") {
      payload.received_at = new Date().toISOString();
      if (receivedAmount) payload.received_amount = parseFloat(receivedAmount);
    }
    const { error } = await (supabase as any).from("insurance_batches").update(payload).eq("id", markDialog.batch.id);
    if (error) toast.error(error.message);
    else { toast.success(`Marcado como ${markDialog.action === "SENT" ? "enviado" : "recebido"}!`); setMarkDialog(null); fetchBatches(); }
    setMarkSaving(false);
  };

  const exportCsv = () => {
    if (!selectedBatch || batchItems.length === 0) return;
    const rows = [
      ["Paciente", "CPF", "Data", "Procedimento", "Código TUSS", "Profissional", "Valor"],
      ...batchItems.map((a: any) => [
        a.patients?.full_name || "",
        a.patients?.cpf || "",
        format(new Date(a.scheduled_at), "dd/MM/yyyy"),
        a.specialties?.name || "",
        a.specialties?.tuss_code || "",
        a.professionals?.full_name || "",
        Number(a.fee || 0).toFixed(2),
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fechamento_${selectedBatch.conventions?.name}_${selectedBatch.period_month}_${selectedBatch.period_year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Fechamento mensal de atendimentos por convênio para cobrança à operadora</p>
        <Button size="sm" onClick={() => setNewDialog(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Novo Fechamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Batch list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Fechamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> :
              batches.length === 0 ? (
                <EmptyState icon={Building2} title="Nenhum fechamento" description="Crie o primeiro fechamento por convênio." actionLabel="Novo Fechamento" onAction={() => setNewDialog(true)} />
              ) : (
                <div className="divide-y divide-border">
                  {batches.map(b => (
                    <button key={b.id} onClick={() => loadBatchItems(b)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent transition-colors ${selectedBatch?.id === b.id ? "bg-accent" : ""}`}>
                      <div>
                        <p className="font-medium text-sm">{b.conventions?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {MONTHS.find(m => m.value === b.period_month)?.label} de {b.period_year}
                        </p>
                        {b.billed_amount > 0 && <p className="text-xs text-muted-foreground">{fmt(b.billed_amount)}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_CONFIG[b.status]?.variant || "secondary"} className="text-xs">
                          {STATUS_CONFIG[b.status]?.label || b.status}
                        </Badge>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              )
            }
          </CardContent>
        </Card>

        {/* Batch details */}
        {selectedBatch && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{selectedBatch.conventions?.name}</CardTitle>
                  <p className="text-xs text-muted-foreground capitalize">
                    {MONTHS.find(m => m.value === selectedBatch.period_month)?.label} de {selectedBatch.period_year}
                  </p>
                </div>
                <div className="flex gap-2">
                  {batchItems.length > 0 && (
                    <Button size="sm" variant="outline" onClick={exportCsv} className="text-xs">CSV</Button>
                  )}
                  {selectedBatch.status === "OPEN" && (
                    <Button size="sm" className="gap-1 text-xs" onClick={() => setMarkDialog({ batch: selectedBatch, action: "SENT" })}>
                      <Send className="h-3 w-3" /> Enviado
                    </Button>
                  )}
                  {selectedBatch.status === "SENT" && (
                    <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { setReceivedAmount(""); setMarkDialog({ batch: selectedBatch, action: "RECEIVED" }); }}>
                      <CheckCircle2 className="h-3 w-3" /> Recebido
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {itemsLoading ? <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
                batchItems.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">Nenhum atendimento encontrado neste período para este convênio.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Procedimento</TableHead>
                          <TableHead>TUSS</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchItems.map((a: any) => (
                          <TableRow key={a.id}>
                            <TableCell className="text-sm font-medium">{a.patients?.full_name}</TableCell>
                            <TableCell className="text-sm">{format(new Date(a.scheduled_at), "dd/MM/yyyy")}</TableCell>
                            <TableCell className="text-sm">{a.specialties?.name || "—"}</TableCell>
                            <TableCell className="text-xs font-mono">{a.specialties?.tuss_code || "—"}</TableCell>
                            <TableCell className="text-right font-mono text-sm">{fmt(a.fee)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <tfoot>
                        <tr className="border-t font-semibold">
                          <td className="p-3 text-sm" colSpan={4}>Total ({batchItems.length} atendimentos)</td>
                          <td className="p-3 text-right font-mono text-sm">
                            {fmt(batchItems.reduce((s, a) => s + Number(a.fee || 0), 0))}
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                )
              }
            </CardContent>
          </Card>
        )}
      </div>

      {/* New batch dialog */}
      <Dialog open={newDialog} onOpenChange={setNewDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Novo Fechamento por Convênio</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Convênio *</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.conventionId} onChange={e => setForm(p => ({ ...p, conventionId: e.target.value }))}>
                <option value="">Selecionar</option>
                {conventions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Mês *</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm capitalize" value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))}>
                  {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Ano *</Label>
                <Input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} type="number" min={2020} />
              </div>
            </div>
            <Button onClick={handleCreate} disabled={formSaving || !form.conventionId} className="w-full">
              {formSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Fechamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mark sent/received dialog */}
      <Dialog open={!!markDialog} onOpenChange={v => !v && setMarkDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{markDialog?.action === "SENT" ? "Marcar como Enviado à Operadora" : "Marcar como Recebido"}</DialogTitle>
          </DialogHeader>
          {markDialog?.action === "RECEIVED" && (
            <div className="space-y-3 pb-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Valor Efetivamente Recebido (R$)</Label>
                <Input type="number" step="0.01" value={receivedAmount} onChange={e => setReceivedAmount(e.target.value)} placeholder="Pode diferir do cobrado" />
              </div>
            </div>
          )}
          <Button onClick={handleMarkStatus} disabled={markSaving} className="w-full">
            {markSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirmar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsuranceBatchView;
