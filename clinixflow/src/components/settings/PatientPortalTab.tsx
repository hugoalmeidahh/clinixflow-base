import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { usePortalSettings } from "@/hooks/usePortalSettings";
import type { PatientPortalSettings } from "@/types/portalSettings";

const features: { key: keyof PatientPortalSettings; label: string; description: string; alwaysOn?: boolean }[] = [
  { key: "allow_track_appointments", label: "Visualizar consultas", description: "Paciente pode ver suas consultas agendadas e histórico", alwaysOn: false },
  { key: "allow_confirm_appointments", label: "Confirmar presença", description: "Paciente pode confirmar presença em consultas agendadas" },
  { key: "allow_request_booking", label: "Solicitar agendamento", description: "Paciente pode solicitar um novo agendamento com datas preferenciais" },
  { key: "allow_request_certificate", label: "Solicitar atestado", description: "Paciente pode solicitar atestado de comparecimento" },
  { key: "allow_upload_medical_request", label: "Enviar pedido médico", description: "Paciente pode enviar pedidos médicos via upload de documentos" },
  { key: "allow_view_reports", label: "Visualizar relatórios", description: "Paciente pode visualizar relatórios periódicos disponibilizados pela clínica" },
];

const PatientPortalTab = () => {
  const { settings, loading, updateSettings } = usePortalSettings();
  const [local, setLocal] = useState<PatientPortalSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const hasChanges = JSON.stringify(local) !== JSON.stringify(settings);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(local);
      toast.success("Configurações do portal salvas!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Portal do Paciente</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure quais funcionalidades ficam disponíveis para os pacientes no portal.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {features.map((f) => (
          <div key={f.key} className="rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.description}</p>
            </div>
            <Switch
              checked={local[f.key]}
              onCheckedChange={(v) => setLocal((prev) => ({ ...prev, [f.key]: v }))}
            />
          </div>
        ))}
        <Button onClick={handleSave} disabled={saving || !hasChanges} className="mt-4">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientPortalTab;
