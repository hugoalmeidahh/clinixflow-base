import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Loader2 } from "lucide-react";

interface PatientForm {
  full_name: string;
  cpf: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  guardian_name: string;
  guardian_cpf: string;
  guardian_phone: string;
  guardian_relationship: string;
  guardian_email: string;
  allergy_alerts: string;
  general_observations: string;
  needs_guardian: boolean;
}

interface PatientInfoTabProps {
  form: PatientForm;
  setForm: React.Dispatch<React.SetStateAction<PatientForm>>;
  editing: boolean;
  setEditing: (v: boolean) => void;
  saving: boolean;
  onSave: () => void;
  isMinor: boolean;
}

const PatientInfoTab = ({ form, setForm, editing, setEditing, saving, onSave, isMinor }: PatientInfoTabProps) => {
  const showGuardian = isMinor || form.needs_guardian || form.guardian_name;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading">Dados Pessoais</CardTitle>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Editar</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancelar</Button>
            <Button size="sm" onClick={onSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Salvar
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome completo</Label>
            <Input value={form.full_name} disabled={!editing} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input value={form.cpf} disabled={!editing} onChange={e => setForm(p => ({ ...p, cpf: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Data de Nascimento</Label>
            <Input type="date" value={form.date_of_birth} disabled={!editing} onChange={e => setForm(p => ({ ...p, date_of_birth: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Gênero</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
              value={form.gender} disabled={!editing}
              onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
            >
              <option value="">Selecionar</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.phone} disabled={!editing} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input type="email" value={form.email} disabled={!editing} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
        </div>

        {/* Guardian checkbox for TEA/elderly */}
        {!isMinor && (
          <div className="flex items-center gap-2 mt-6">
            <Checkbox
              id="needsGuardian"
              checked={form.needs_guardian}
              disabled={!editing}
              onCheckedChange={(c) => setForm(p => ({ ...p, needs_guardian: !!c }))}
            />
            <Label htmlFor="needsGuardian" className="cursor-pointer text-sm font-normal">
              Necessita de responsável/acompanhante (TEA, idoso, PCD, etc.)
            </Label>
          </div>
        )}

        {isMinor && (
          <div className="mt-4 rounded-md border border-accent bg-accent/10 p-3 text-sm text-muted-foreground">
            ⚠️ Paciente menor de 18 anos — preenchimento do responsável legal é obrigatório.
          </div>
        )}

        {showGuardian && (
          <>
            <h3 className="text-sm font-semibold mt-6 mb-3">Responsável / Acompanhante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Parentesco *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                  value={form.guardian_relationship} disabled={!editing}
                  onChange={e => setForm(p => ({ ...p, guardian_relationship: e.target.value }))}
                >
                  <option value="">Selecionar</option>
                  <option value="PARENT">Pai/Mãe</option>
                  <option value="GUARDIAN">Responsável Legal</option>
                  <option value="SPOUSE">Cônjuge</option>
                  <option value="SIBLING">Irmão(ã)</option>
                  <option value="CAREGIVER">Cuidador(a)</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Nome do responsável *</Label>
                <Input value={form.guardian_name} disabled={!editing} onChange={e => setForm(p => ({ ...p, guardian_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>CPF do responsável</Label>
                <Input value={form.guardian_cpf} disabled={!editing} onChange={e => setForm(p => ({ ...p, guardian_cpf: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Telefone do responsável *</Label>
                <Input value={form.guardian_phone} disabled={!editing} onChange={e => setForm(p => ({ ...p, guardian_phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>E-mail do responsável</Label>
                <Input type="email" value={form.guardian_email} disabled={!editing} onChange={e => setForm(p => ({ ...p, guardian_email: e.target.value }))} />
              </div>
            </div>
          </>
        )}

        <h3 className="text-sm font-semibold mt-6 mb-3">Observações Clínicas</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-destructive">Alergias (alerta permanente)</Label>
            <Input value={form.allergy_alerts} disabled={!editing} onChange={e => setForm(p => ({ ...p, allergy_alerts: e.target.value }))} placeholder="Penicilina, Dipirona..." />
          </div>
          <div className="space-y-2">
            <Label>Observações gerais</Label>
            <textarea
              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
              value={form.general_observations} disabled={!editing}
              onChange={e => setForm(p => ({ ...p, general_observations: e.target.value }))}
              placeholder="Observações sobre o paciente..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoTab;
