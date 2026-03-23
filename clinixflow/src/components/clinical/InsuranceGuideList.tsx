import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "@/components/ui/sonner";
import { Plus, FileText, Activity } from "lucide-react";

interface InsuranceGuideListProps {
  patientId: string;
  conventions: any[];
}

const InsuranceGuideList = ({ patientId, conventions }: InsuranceGuideListProps) => {
  const { tenantId } = useAuth();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    conventionId: "",
    guideNumber: "",
    authorizationCode: "",
    sessionsAuthorized: "10",
    validFrom: "",
    validUntil: "",
    notes: "",
  });

  const fetchGuides = async () => {
    if (!tenantId) return;
    const { data } = await supabase
      .from("insurance_guides" as any)
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    setGuides(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchGuides(); }, [tenantId, patientId]);

  const handleCreate = async () => {
    if (!tenantId || !form.conventionId || !form.guideNumber || !form.validFrom) return;
    setSaving(true);
    const { error } = await supabase.from("insurance_guides" as any).insert({
      tenant_id: tenantId,
      patient_id: patientId,
      convention_id: form.conventionId,
      guide_number: form.guideNumber,
      authorization_code: form.authorizationCode || null,
      sessions_authorized: parseInt(form.sessionsAuthorized) || 10,
      valid_from: form.validFrom,
      valid_until: form.validUntil || null,
      notes: form.notes || null,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Guia cadastrada!");
      setDialogOpen(false);
      setForm({ conventionId: "", guideNumber: "", authorizationCode: "", sessionsAuthorized: "10", validFrom: "", validUntil: "", notes: "" });
      fetchGuides();
    }
    setSaving(false);
  };

  const getConventionName = (convId: string) => {
    const conv = conventions.find((c: any) => c.id === convId);
    return conv?.name || "—";
  };

  const statusVariant = (status: string): "active" | "warning" | "inactive" | "danger" => {
    switch (status) {
      case "ACTIVE": return "active";
      case "EXHAUSTED": return "warning";
      case "EXPIRED": return "danger";
      case "CANCELLED": return "inactive";
      default: return "inactive";
    }
  };

  const statusLabel: Record<string, string> = {
    ACTIVE: "Ativa",
    EXHAUSTED: "Esgotada",
    EXPIRED: "Expirada",
    CANCELLED: "Cancelada",
  };

  if (loading) {
    return <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Guias de Convênio</h3>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nova Guia
        </Button>
      </div>

      {guides.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhuma guia"
          description="Nenhuma guia de convênio cadastrada."
          actionLabel="+ Nova Guia"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="space-y-2">
          {guides.map((g: any) => (
            <Card key={g.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{getConventionName(g.convention_id)}</span>
                      <span className="text-xs text-muted-foreground font-mono">#{g.guide_number}</span>
                      <StatusBadge variant={statusVariant(g.status)} label={statusLabel[g.status] || g.status} />
                    </div>
                    {g.authorization_code && (
                      <p className="text-xs text-muted-foreground">Autorização: {g.authorization_code}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-mono font-medium">
                        {g.sessions_used}/{g.sessions_authorized}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">sessões usadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create guide dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Guia de Convênio</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Convênio *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.conventionId}
                onChange={e => setForm(p => ({ ...p, conventionId: e.target.value }))}
              >
                <option value="">Selecionar convênio</option>
                {conventions.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nº da Guia *</Label>
                <Input value={form.guideNumber} onChange={e => setForm(p => ({ ...p, guideNumber: e.target.value }))} placeholder="123456789" />
              </div>
              <div className="space-y-2">
                <Label>Código de Autorização</Label>
                <Input value={form.authorizationCode} onChange={e => setForm(p => ({ ...p, authorizationCode: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sessões Autorizadas</Label>
              <Input type="number" value={form.sessionsAuthorized} onChange={e => setForm(p => ({ ...p, sessionsAuthorized: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Válida a partir de *</Label>
                <Input type="date" value={form.validFrom} onChange={e => setForm(p => ({ ...p, validFrom: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Válida até</Label>
                <Input type="date" value={form.validUntil} onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Observações opcionais" />
            </div>
            <Button onClick={handleCreate} disabled={saving || !form.conventionId || !form.guideNumber || !form.validFrom} className="w-full">
              {saving ? "Salvando..." : "Cadastrar Guia"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsuranceGuideList;
