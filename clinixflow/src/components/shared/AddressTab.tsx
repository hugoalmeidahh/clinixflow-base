import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { Json } from "@/integrations/supabase/types";

interface AddressForm {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

const emptyAddress: AddressForm = {
  street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zip_code: "",
};

const parseAddress = (addr: Json | null): AddressForm => {
  if (!addr || typeof addr !== "object" || Array.isArray(addr)) return { ...emptyAddress };
  const a = addr as Record<string, unknown>;
  return {
    street: (a.street as string) || "",
    number: (a.number as string) || "",
    complement: (a.complement as string) || "",
    neighborhood: (a.neighborhood as string) || "",
    city: (a.city as string) || "",
    state: (a.state as string) || "",
    zip_code: (a.zip_code as string) || "",
  };
};

interface AddressTabProps {
  address: Json | null;
  entityId: string;
  table: "patients" | "professionals";
  tenantId: string;
}

const AddressTab = ({ address, entityId, table, tenantId }: AddressTabProps) => {
  const [form, setForm] = useState<AddressForm>(parseAddress(address));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingCep, setFetchingCep] = useState(false);

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setForm(p => ({ ...p, zip_code: formatted }));
  };

  const fetchViaCep = async () => {
    const cep = form.zip_code.replace(/\D/g, "");
    if (cep.length !== 8) {
      toast.error("CEP deve ter 8 dígitos.");
      return;
    }
    setFetchingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error("CEP não encontrado.");
      } else {
        setForm(p => ({
          ...p,
          street: data.logradouro || p.street,
          neighborhood: data.bairro || p.neighborhood,
          city: data.localidade || p.city,
          state: data.uf || p.state,
          complement: data.complemento || p.complement,
        }));
        toast.success("Endereço preenchido automaticamente!");
      }
    } catch {
      toast.error("Erro ao buscar CEP.");
    }
    setFetchingCep(false);
  };

  const handleCepBlur = () => {
    const cep = form.zip_code.replace(/\D/g, "");
    if (cep.length === 8 && editing) {
      fetchViaCep();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const addressJson = Object.values(form).some(v => v) ? form : null;
    const addressData = addressJson as unknown as Record<string, unknown>;
    const result = table === "patients"
      ? await supabase.from("patients").update({ address: addressData as any }).eq("id", entityId).eq("tenant_id", tenantId)
      : await supabase.from("professionals").update({ address: addressData as any }).eq("id", entityId).eq("tenant_id", tenantId);

    const { error } = result;
    if (error) toast.error(error.message);
    else {
      toast.success("Endereço atualizado!");
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading">Endereço</CardTitle>
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
          {/* CEP first with ViaCEP lookup */}
          <div className="space-y-2">
            <Label>CEP</Label>
            <div className="flex gap-2">
              <Input
                value={form.zip_code}
                disabled={!editing}
                onChange={handleCepChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
              />
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={fetchViaCep}
                  disabled={fetchingCep}
                  title="Buscar CEP"
                >
                  {fetchingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Estado (UF)</Label>
            <Input value={form.state} disabled={!editing} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} maxLength={2} placeholder="SP" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Rua / Logradouro</Label>
            <Input value={form.street} disabled={!editing} onChange={e => setForm(p => ({ ...p, street: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Número</Label>
            <Input value={form.number} disabled={!editing} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Complemento</Label>
            <Input value={form.complement} disabled={!editing} onChange={e => setForm(p => ({ ...p, complement: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Bairro</Label>
            <Input value={form.neighborhood} disabled={!editing} onChange={e => setForm(p => ({ ...p, neighborhood: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Input value={form.city} disabled={!editing} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressTab;
