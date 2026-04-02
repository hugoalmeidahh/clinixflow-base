import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { Tables } from "@/integrations/supabase/types";

interface InsuranceForm {
  care_type: string;
  convention_id: string;
  insurance_card_number: string;
  insurance_card_expiry: string;
  sus_card_number: string;
  default_location: string;
}

interface PatientInsuranceTabProps {
  patient: Tables<"patients">;
  tenantId: string;
}

const PatientInsuranceTab = ({ patient, tenantId }: PatientInsuranceTabProps) => {
  const [conventions, setConventions] = useState<Tables<"conventions">[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const settings = (patient as any).settings as Record<string, any> | null;

  const [form, setForm] = useState<InsuranceForm>({
    care_type: patient.care_type || "SINGLE_SESSION",
    convention_id: patient.convention_id || "",
    insurance_card_number: patient.insurance_card_number || "",
    insurance_card_expiry: patient.insurance_card_expiry || "",
    sus_card_number: settings?.sus_card_number || "",
    default_location: settings?.default_location || "",
  });

  useEffect(() => {
    supabase.from("conventions").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("name")
      .then(({ data }) => setConventions(data || []));
  }, [tenantId]);

  const handleSave = async () => {
    setSaving(true);
    const currentSettings = (patient as any).settings as Record<string, any> | null;
    const updatedSettings = {
      ...currentSettings,
      sus_card_number: form.sus_card_number || null,
      default_location: form.default_location || null,
    };

    const { error } = await supabase.from("patients").update({
      care_type: form.care_type as any,
      convention_id: form.convention_id && form.convention_id !== "__none__" ? form.convention_id : null,
      insurance_card_number: form.insurance_card_number || null,
      insurance_card_expiry: form.insurance_card_expiry || null,
      settings: updatedSettings,
    } as any).eq("id", patient.id).eq("tenant_id", tenantId);

    if (error) toast.error(error.message);
    else {
      toast.success("Dados de convênio atualizados!");
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading">Cobertura</CardTitle>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Editar</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Salvar
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de atendimento</Label>
            <Select value={form.care_type} onValueChange={v => setForm(p => ({ ...p, care_type: v }))} disabled={!editing}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE_SESSION">Avulso / Particular</SelectItem>
                <SelectItem value="ONGOING_TREATMENT">Tratamento contínuo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Convênio</Label>
            <Select value={form.convention_id} onValueChange={v => setForm(p => ({ ...p, convention_id: v }))} disabled={!editing}>
              <SelectTrigger><SelectValue placeholder="Particular (sem convênio)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Particular (sem convênio)</SelectItem>
                {conventions.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nº Carteirinha do Convênio</Label>
            <Input value={form.insurance_card_number} disabled={!editing} onChange={e => setForm(p => ({ ...p, insurance_card_number: e.target.value }))} placeholder="Número da carteirinha" />
          </div>
          <div className="space-y-2">
            <Label>Validade da Carteirinha</Label>
            <Input type="date" value={form.insurance_card_expiry} disabled={!editing} onChange={e => setForm(p => ({ ...p, insurance_card_expiry: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Cartão SUS</Label>
            <Input value={form.sus_card_number} disabled={!editing} onChange={e => setForm(p => ({ ...p, sus_card_number: e.target.value }))} placeholder="Número do Cartão SUS" />
          </div>
          <div className="space-y-2">
            <Label>Local padrão de atendimento</Label>
            <Input value={form.default_location} disabled={!editing} onChange={e => setForm(p => ({ ...p, default_location: e.target.value }))} placeholder="Ex: Sala 3, Unidade Centro..." />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInsuranceTab;
