import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmptyState from "@/components/EmptyState";
import { AlertTriangle, CheckCircle, Eye, DollarSign, ClipboardList, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";

interface Inconsistency {
  id: string;
  type: string;
  priority: "high" | "medium" | "info";
  description: string;
  patientName: string;
  patientId?: string;
  professionalName?: string;
  appointmentId?: string;
  appointmentCode?: string;
  date?: string;
  resolveLink?: string;
  details?: Record<string, string>;
}

const priorityConfig = {
  high: { label: "🔴 Alta", className: "text-badge-absent font-semibold" },
  medium: { label: "🟡 Média", className: "text-badge-justified font-semibold" },
  info: { label: "🔵 Info", className: "text-badge-scheduled font-semibold" },
};

const Inconsistencies = () => {
  const { tenantId, user } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();
  const [items, setItems] = useState<Inconsistency[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Inconsistency | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Evolution dialog state
  const [evolutionOpen, setEvolutionOpen] = useState(false);
  const [evolutionItem, setEvolutionItem] = useState<Inconsistency | null>(null);
  const [evolutionForm, setEvolutionForm] = useState({ queixa: "", conduta: "", observacoes: "" });
  const [evolutionSaving, setEvolutionSaving] = useState(false);

  // Fee dialog state
  const [feeOpen, setFeeOpen] = useState(false);
  const [feeItem, setFeeItem] = useState<Inconsistency | null>(null);
  const [feeValue, setFeeValue] = useState("");
  const [feeSaving, setFeeSaving] = useState(false);

  const canViewFinancial = can("financial", "view");

  useEffect(() => {
    if (!tenantId) return;

    const fetchInconsistencies = async () => {
      const results: Inconsistency[] = [];
      const now = new Date().toISOString();
      const today = format(new Date(), "yyyy-MM-dd");
      const in30Days = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

      // 1. Past appointments without action (HIGH)
      const { data: pastApts } = await supabase
        .from("appointments")
        .select("id, code, scheduled_at, patient_id, patients!inner(full_name), professionals!inner(full_name)")
        .eq("tenant_id", tenantId).eq("status", "SCHEDULED").lt("scheduled_at", now).limit(50);

      pastApts?.forEach(apt => {
        results.push({
          id: `past-${apt.id}`, type: "Agendamento sem ação", priority: "high",
          description: "Agendamento passado sem registro de presença ou ausência",
          patientName: (apt.patients as any)?.full_name || "",
          patientId: apt.patient_id,
          professionalName: (apt.professionals as any)?.full_name || "",
          appointmentId: apt.id, appointmentCode: apt.code, date: apt.scheduled_at,
          details: {
            "Paciente": (apt.patients as any)?.full_name || "",
            "Profissional": (apt.professionals as any)?.full_name || "",
            "Código": apt.code,
            "Data/Hora": format(new Date(apt.scheduled_at), "dd/MM/yyyy HH:mm"),
            "Problema": "O agendamento já passou e não foi marcado como compareceu, falta ou cancelado.",
          },
        });
      });

      // 2. Appointments without fee - ONLY ATTENDED + CONFIRMED (only if user can view financial)
      if (canViewFinancial) {
        const { data: noFeeApts } = await supabase
          .from("appointments")
          .select("id, code, scheduled_at, patient_id, patients!inner(full_name), professionals!inner(full_name)")
          .eq("tenant_id", tenantId).in("status", ["ATTENDED", "CONFIRMED"]).is("fee", null).limit(50);

        noFeeApts?.forEach(apt => {
          results.push({
            id: `nofee-${apt.id}`, type: "Agendamento sem valor", priority: "high",
            description: "Atendimento confirmado/realizado sem valor de sessão",
            patientName: (apt.patients as any)?.full_name || "",
            patientId: apt.patient_id,
            professionalName: (apt.professionals as any)?.full_name || "",
            appointmentId: apt.id, appointmentCode: apt.code, date: apt.scheduled_at,
            details: {
              "Paciente": (apt.patients as any)?.full_name || "",
              "Profissional": (apt.professionals as any)?.full_name || "",
              "Código": apt.code,
              "Data/Hora": format(new Date(apt.scheduled_at), "dd/MM/yyyy HH:mm"),
              "Problema": "O agendamento foi confirmado ou atendido mas não possui valor (fee) definido.",
            },
          });
        });
      }

      // 3. Attended without clinical note (MEDIUM)
      const { data: attendedApts } = await supabase
        .from("appointments")
        .select("id, code, scheduled_at, patient_id, patients!inner(full_name), professionals!inner(full_name)")
        .eq("tenant_id", tenantId).eq("status", "ATTENDED").limit(100);

      if (attendedApts && attendedApts.length > 0) {
        const aptIds = attendedApts.map(a => a.id);
        const { data: events } = await supabase
          .from("clinical_events").select("appointment_id")
          .eq("tenant_id", tenantId).eq("event_type", "NOTE").in("appointment_id", aptIds);

        const eventsSet = new Set((events || []).map(e => e.appointment_id));
        attendedApts.forEach(apt => {
          if (!eventsSet.has(apt.id)) {
            results.push({
              id: `nonote-${apt.id}`, type: "Atendido sem evolução", priority: "medium",
              description: "Consulta realizada sem nota clínica registrada",
              patientName: (apt.patients as any)?.full_name || "",
              patientId: apt.patient_id,
              professionalName: (apt.professionals as any)?.full_name || "",
              appointmentId: apt.id, appointmentCode: apt.code, date: apt.scheduled_at,
              details: {
                "Paciente": (apt.patients as any)?.full_name || "",
                "Profissional": (apt.professionals as any)?.full_name || "",
                "Código": apt.code,
                "Data/Hora": format(new Date(apt.scheduled_at), "dd/MM/yyyy HH:mm"),
                "Problema": "O atendimento foi realizado mas nenhuma nota clínica foi registrada.",
              },
            });
          }
        });
      }

      // 4. Expired insurance card (MEDIUM)
      const { data: expiredCards } = await supabase
        .from("patients").select("id, full_name, insurance_card_expiry, insurance_card_number")
        .eq("tenant_id", tenantId).eq("is_active", true)
        .not("insurance_card_expiry", "is", null).lt("insurance_card_expiry", today).limit(50);

      expiredCards?.forEach(p => {
        results.push({
          id: `expired-${p.id}`, type: "Carteirinha vencida", priority: "medium",
          description: `Vencida em ${format(new Date(p.insurance_card_expiry!), "dd/MM/yyyy")}`,
          patientName: p.full_name, patientId: p.id,
          resolveLink: `/patients/${p.id}`,
          details: {
            "Paciente": p.full_name,
            "Nº Carteirinha": p.insurance_card_number || "—",
            "Vencimento": format(new Date(p.insurance_card_expiry!), "dd/MM/yyyy"),
            "Problema": "A carteirinha do convênio está vencida e precisa ser renovada.",
          },
        });
      });

      // 5. Card expiring soon (INFO)
      const { data: expiringCards } = await supabase
        .from("patients").select("id, full_name, insurance_card_expiry")
        .eq("tenant_id", tenantId).eq("is_active", true)
        .not("insurance_card_expiry", "is", null).gte("insurance_card_expiry", today).lte("insurance_card_expiry", in30Days).limit(50);

      expiringCards?.forEach(p => {
        results.push({
          id: `expiring-${p.id}`, type: "Carteirinha vencendo", priority: "info",
          description: `Vence em ${format(new Date(p.insurance_card_expiry!), "dd/MM/yyyy")}`,
          patientName: p.full_name, patientId: p.id,
          resolveLink: `/patients/${p.id}`,
          details: {
            "Paciente": p.full_name,
            "Vencimento": format(new Date(p.insurance_card_expiry!), "dd/MM/yyyy"),
            "Ação sugerida": "Solicitar renovação da carteirinha antes do vencimento.",
          },
        });
      });

      // 6. Professional without availability (INFO)
      const { data: profs } = await supabase
        .from("professionals").select("id, full_name")
        .eq("tenant_id", tenantId).eq("is_active", true).eq("staff_role", "HEALTH_PROFESSIONAL");

      if (profs && profs.length > 0) {
        const { data: avail } = await supabase
          .from("professional_availability").select("professional_id").in("professional_id", profs.map(p => p.id));
        const availSet = new Set((avail || []).map(a => a.professional_id));
        profs.forEach(p => {
          if (!availSet.has(p.id)) {
            results.push({
              id: `noavail-${p.id}`, type: "Sem disponibilidade", priority: "info",
              description: "Profissional sem horários configurados", patientName: "—", professionalName: p.full_name,
              resolveLink: `/professionals/${p.id}`,
              details: { "Profissional": p.full_name, "Problema": "Nenhum horário configurado.", "Ação sugerida": "Configure a agenda do profissional." },
            });
          }
        });
      }

      results.sort((a, b) => ({ high: 0, medium: 1, info: 2 }[a.priority] - { high: 0, medium: 1, info: 2 }[b.priority]));
      setItems(results);
      setLoading(false);
    };

    fetchInconsistencies();
  }, [tenantId, canViewFinancial]);

  const handleMarkAttended = async (appointmentId: string) => {
    setActionLoading(true);
    const { error } = await supabase.from("appointments").update({ status: "ATTENDED" as any, attended_at: new Date().toISOString() }).eq("id", appointmentId);
    if (error) toast.error(error.message);
    else { toast.success("Marcado como compareceu!"); setSelectedItem(null); setItems(prev => prev.filter(i => i.appointmentId !== appointmentId || i.type !== "Agendamento sem ação")); }
    setActionLoading(false);
  };

  const handleMarkAbsent = async (appointmentId: string) => {
    setActionLoading(true);
    const { error } = await supabase.from("appointments").update({ status: "ABSENCE" as any }).eq("id", appointmentId);
    if (error) toast.error(error.message);
    else { toast.success("Marcado como falta!"); setSelectedItem(null); setItems(prev => prev.filter(i => i.appointmentId !== appointmentId || i.type !== "Agendamento sem ação")); }
    setActionLoading(false);
  };

  const openEvolutionDialog = (item: Inconsistency) => {
    setEvolutionItem(item);
    setEvolutionForm({ queixa: "", conduta: "", observacoes: "" });
    setEvolutionOpen(true);
    setSelectedItem(null);
  };

  const handleSaveEvolution = async () => {
    if (!evolutionItem?.appointmentId || !tenantId || !user) return;
    setEvolutionSaving(true);

    const content = [
      evolutionForm.queixa ? `**Queixa/Demanda:**\n${evolutionForm.queixa}` : "",
      evolutionForm.conduta ? `**Conduta/Procedimento:**\n${evolutionForm.conduta}` : "",
      evolutionForm.observacoes ? `**Observações:**\n${evolutionForm.observacoes}` : "",
    ].filter(Boolean).join("\n\n");

    const { error } = await supabase.from("clinical_events").insert({
      tenant_id: tenantId,
      patient_id: evolutionItem.patientId!,
      appointment_id: evolutionItem.appointmentId,
      event_type: "NOTE",
      content,
      performed_by: user.id,
      is_immutable: false,
    });

    if (error) toast.error(error.message);
    else {
      toast.success("Evolução registrada!");
      setEvolutionOpen(false);
      setItems(prev => prev.filter(i => i.id !== evolutionItem.id));
    }
    setEvolutionSaving(false);
  };

  const openFeeDialog = (item: Inconsistency) => {
    setFeeItem(item);
    setFeeValue("");
    setFeeOpen(true);
    setSelectedItem(null);
  };

  const handleSaveFee = async () => {
    if (!feeItem?.appointmentId || !feeValue) return;
    setFeeSaving(true);
    const { error } = await supabase.from("appointments").update({ fee: parseFloat(feeValue) }).eq("id", feeItem.appointmentId);
    if (error) toast.error(error.message);
    else {
      toast.success("Valor definido!");
      setFeeOpen(false);
      setItems(prev => prev.filter(i => i.id !== feeItem.id));
    }
    setFeeSaving(false);
  };

  const counts = {
    high: items.filter(i => i.priority === "high").length,
    medium: items.filter(i => i.priority === "medium").length,
    info: items.filter(i => i.priority === "info").length,
  };

  const renderActions = (item: Inconsistency) => {
    switch (item.type) {
      case "Agendamento sem ação":
        return (
          <div className="flex gap-2 mt-4 flex-wrap">
            <Button size="sm" onClick={() => handleMarkAttended(item.appointmentId!)} disabled={actionLoading}>
              <CheckCircle className="h-4 w-4 mr-1" /> Compareceu
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleMarkAbsent(item.appointmentId!)} disabled={actionLoading}>
              <AlertTriangle className="h-4 w-4 mr-1" /> Falta
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/appointments")}>
              <Calendar className="h-4 w-4 mr-1" /> Ver Agenda
            </Button>
          </div>
        );
      case "Agendamento sem valor":
        return (
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={() => openFeeDialog(item)}>
              <DollarSign className="h-4 w-4 mr-1" /> Definir Valor
            </Button>
          </div>
        );
      case "Atendido sem evolução":
        return (
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={() => openEvolutionDialog(item)}>
              <ClipboardList className="h-4 w-4 mr-1" /> Registrar Evolução
            </Button>
          </div>
        );
      default:
        return item.resolveLink ? (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => { navigate(item.resolveLink!); setSelectedItem(null); }}>
              Ver detalhes
            </Button>
          </div>
        ) : null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Inconsistências</h1>
        <p className="text-sm text-muted-foreground">Itens que precisam de atenção</p>
      </div>

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-badge-absent">{counts.high}</p><p className="text-xs text-muted-foreground">Alta prioridade</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-badge-justified">{counts.medium}</p><p className="text-xs text-muted-foreground">Média prioridade</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-badge-scheduled">{counts.info}</p><p className="text-xs text-muted-foreground">Informativo</p></CardContent></Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : items.length === 0 ? (
            <EmptyState icon={CheckCircle} title="Tudo em ordem!" description="Não foram encontradas inconsistências." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedItem(item)}>
                    <TableCell className={priorityConfig[item.priority].className}>{priorityConfig[item.priority].label}</TableCell>
                    <TableCell className="text-sm font-medium">{item.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{item.description}</TableCell>
                    <TableCell className="font-medium">{item.patientName}</TableCell>
                    <TableCell className="text-sm">{item.professionalName || "—"}</TableCell>
                    <TableCell className="font-mono text-sm">{item.appointmentCode || "—"}</TableCell>
                    <TableCell className="text-sm">{item.date ? format(new Date(item.date), "dd/MM/yyyy HH:mm") : "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>
                        <Eye className="h-3 w-3 mr-1" /> Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(o) => !o && setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-badge-absent" />
              {selectedItem?.type}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                {selectedItem.details && Object.entries(selectedItem.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
              <div className={`rounded-md p-3 text-sm ${
                selectedItem.priority === "high" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                selectedItem.priority === "medium" ? "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20" :
                "bg-blue-500/10 text-blue-700 border border-blue-500/20"
              }`}>
                Prioridade: {priorityConfig[selectedItem.priority].label}
              </div>
              {renderActions(selectedItem)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Evolution dialog */}
      <Dialog open={evolutionOpen} onOpenChange={setEvolutionOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Registrar Evolução
            </DialogTitle>
          </DialogHeader>
          {evolutionItem && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Paciente:</span><span className="font-medium">{evolutionItem.patientName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Profissional:</span><span className="font-medium">{evolutionItem.professionalName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Código:</span><span className="font-mono">{evolutionItem.appointmentCode}</span></div>
                {evolutionItem.date && <div className="flex justify-between"><span className="text-muted-foreground">Data:</span><span>{format(new Date(evolutionItem.date), "dd/MM/yyyy HH:mm")}</span></div>}
              </div>
              <div className="space-y-2">
                <Label>Queixa / Demanda</Label>
                <Textarea value={evolutionForm.queixa} onChange={e => setEvolutionForm(p => ({ ...p, queixa: e.target.value }))} placeholder="Descreva a queixa ou demanda do paciente..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Conduta / Procedimento</Label>
                <Textarea value={evolutionForm.conduta} onChange={e => setEvolutionForm(p => ({ ...p, conduta: e.target.value }))} placeholder="Descreva a conduta adotada..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={evolutionForm.observacoes} onChange={e => setEvolutionForm(p => ({ ...p, observacoes: e.target.value }))} placeholder="Observações adicionais..." rows={2} />
              </div>
              <Button onClick={handleSaveEvolution} disabled={evolutionSaving || (!evolutionForm.queixa && !evolutionForm.conduta)} className="w-full">
                {evolutionSaving ? "Salvando..." : "Salvar Evolução"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fee dialog */}
      <Dialog open={feeOpen} onOpenChange={setFeeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> Definir Valor da Sessão
            </DialogTitle>
          </DialogHeader>
          {feeItem && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Paciente:</span><span className="font-medium">{feeItem.patientName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Código:</span><span className="font-mono">{feeItem.appointmentCode}</span></div>
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input type="number" step="0.01" value={feeValue} onChange={e => setFeeValue(e.target.value)} placeholder="150.00" />
              </div>
              <Button onClick={handleSaveFee} disabled={feeSaving || !feeValue} className="w-full">
                {feeSaving ? "Salvando..." : "Salvar Valor"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inconsistencies;
