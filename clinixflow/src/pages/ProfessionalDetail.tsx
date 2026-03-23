import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import EmptyState from "@/components/EmptyState";
import AddressTab from "@/components/shared/AddressTab";
import { toast } from "@/components/ui/sonner";
import {
  ArrowLeft, Save, Loader2, Stethoscope, Plus, Trash2, Link2, MapPin, User,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Professional = Tables<"professionals">;
type Specialty = Tables<"specialties">;
type Availability = Tables<"professional_availability">;

const dayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const staffRoleLabels: Record<string, string> = {
  HEALTH_PROFESSIONAL: "Profissional de Saúde",
  ORG_ADMIN: "Administrador",
  MANAGER: "Gerente",
  RECEPTIONIST: "Recepcionista",
  FINANCIAL: "Financeiro",
};

const staffRoles = [
  { value: "HEALTH_PROFESSIONAL", label: "Profissional de Saúde" },
  { value: "ORG_ADMIN", label: "Administrador" },
  { value: "MANAGER", label: "Gerente" },
  { value: "RECEPTIONIST", label: "Recepcionista" },
  { value: "FINANCIAL", label: "Financeiro" },
];

const registrationTypes = [
  { value: "CRM", label: "CRM" },
  { value: "CRP", label: "CRP" },
  { value: "CREFITO", label: "CREFITO" },
  { value: "COREN", label: "COREN" },
  { value: "CRFa", label: "CRFa" },
  { value: "OTHER", label: "Outro" },
];

interface DayAvailRow {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  dbId?: string;
}

const buildDayRows = (existing: Availability[]): DayAvailRow[] => {
  return dayLabels.map((_, i) => {
    const match = existing.find(a => a.day_of_week === i);
    return {
      dayOfWeek: i,
      enabled: !!match,
      startTime: match ? match.start_time.slice(0, 5) : "08:00",
      endTime: match ? match.end_time.slice(0, 5) : "18:00",
      dbId: match?.id,
    };
  });
};

const ProfessionalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenantId, user } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "", cpf: "", staff_role: "HEALTH_PROFESSIONAL",
    registration_type: "CRM", registration_number: "",
    phone: "", email: "",
  });

  const isHealthPro = form.staff_role === "HEALTH_PROFESSIONAL";

  // Specialties
  const [profSpecialties, setProfSpecialties] = useState<any[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [specLoading, setSpecLoading] = useState(true);
  const [addSpecDialog, setAddSpecDialog] = useState(false);
  const [selectedSpecId, setSelectedSpecId] = useState("");
  const [customFee, setCustomFee] = useState("");

  // Availability
  const [dayRows, setDayRows] = useState<DayAvailRow[]>(buildDayRows([]));
  const [availLoading, setAvailLoading] = useState(true);
  const [availSaving, setAvailSaving] = useState(false);

  useEffect(() => {
    if (!id || !tenantId) return;
    const fetchAll = async () => {
      const [profRes, profSpecRes, allSpecRes, availRes] = await Promise.all([
        supabase.from("professionals").select("*").eq("id", id).eq("tenant_id", tenantId).single(),
        supabase.from("professional_specialties").select("*, specialties!inner(name, default_fee)").eq("professional_id", id),
        supabase.from("specialties").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
        supabase.from("professional_availability").select("*").eq("professional_id", id).order("day_of_week"),
      ]);

      if (profRes.data) {
        setProfessional(profRes.data);
        setForm({
          full_name: profRes.data.full_name,
          cpf: profRes.data.cpf || "",
          staff_role: (profRes.data as any).staff_role || "HEALTH_PROFESSIONAL",
          registration_type: profRes.data.registration_type || "CRM",
          registration_number: profRes.data.registration_number || "",
          phone: profRes.data.phone || "",
          email: profRes.data.email || "",
        });
      }
      setProfSpecialties(profSpecRes.data || []);
      setAllSpecialties(allSpecRes.data || []);
      setDayRows(buildDayRows(availRes.data || []));
      setLoading(false);
      setSpecLoading(false);
      setAvailLoading(false);
    };
    fetchAll();
  }, [id, tenantId]);

  const handleSave = async () => {
    if (!id || !form.full_name) return;
    setSaving(true);
    const { error } = await supabase.from("professionals").update({
      full_name: form.full_name,
      cpf: form.cpf || null,
      staff_role: form.staff_role,
      registration_type: isHealthPro ? form.registration_type : null,
      registration_number: isHealthPro ? (form.registration_number || null) : null,
      phone: form.phone || null,
      email: form.email || null,
    }).eq("id", id);

    if (error) toast.error(error.message);
    else toast.success("Membro atualizado!");
    setSaving(false);
  };

  const handleLinkToMe = async () => {
    if (!id || !user) return;
    const { error } = await supabase.from("professionals").update({ user_id: user.id }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Membro vinculado à sua conta!");
      setProfessional(prev => prev ? { ...prev, user_id: user.id } : prev);
    }
  };

  const handleAddSpecialty = async () => {
    if (!id || !selectedSpecId) return;
    const { error } = await supabase.from("professional_specialties").insert({
      professional_id: id,
      specialty_id: selectedSpecId,
      custom_fee: customFee ? parseFloat(customFee) : null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Especialidade adicionada!");
      setAddSpecDialog(false);
      setSelectedSpecId("");
      setCustomFee("");
      const { data } = await supabase.from("professional_specialties")
        .select("*, specialties!inner(name, default_fee)").eq("professional_id", id);
      setProfSpecialties(data || []);
    }
  };

  const handleRemoveSpecialty = async (psId: string) => {
    const { error } = await supabase.from("professional_specialties").delete().eq("id", psId);
    if (error) toast.error(error.message);
    else {
      setProfSpecialties(prev => prev.filter(s => s.id !== psId));
      toast.success("Especialidade removida!");
    }
  };

  const handleSaveAvailability = async () => {
    if (!id) return;
    setAvailSaving(true);
    await supabase.from("professional_availability").delete().eq("professional_id", id);
    const toInsert = dayRows
      .filter(r => r.enabled)
      .map(r => ({
        professional_id: id,
        day_of_week: r.dayOfWeek,
        start_time: r.startTime,
        end_time: r.endTime,
        appointment_interval_min: 30,
      }));

    if (toInsert.length > 0) {
      const { error } = await supabase.from("professional_availability").insert(toInsert);
      if (error) {
        toast.error(error.message);
        setAvailSaving(false);
        return;
      }
    }

    toast.success("Horários salvos!");
    const { data } = await supabase.from("professional_availability")
      .select("*").eq("professional_id", id).order("day_of_week");
    setDayRows(buildDayRows(data || []));
    setAvailSaving(false);
  };

  const updateDayRow = (idx: number, patch: Partial<DayAvailRow>) => {
    setDayRows(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Membro não encontrado.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/professionals")}>Voltar</Button>
      </div>
    );
  }

  const linkedSpecIds = profSpecialties.map(ps => ps.specialty_id);
  const availableSpecs = allSpecialties.filter(s => !linkedSpecIds.includes(s.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/professionals")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-bold">{professional.full_name}</h1>
            <Badge variant="outline" className="text-xs">
              {staffRoleLabels[(professional as any).staff_role] || "Profissional de Saúde"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {professional.registration_number
              ? `${professional.registration_type}/${professional.registration_number}`
              : "Sem registro profissional"}
            {professional.user_id && " · Vinculado a conta de usuário"}
          </p>
        </div>
        {!professional.user_id && (
          <Button variant="outline" onClick={handleLinkToMe}>
            <Link2 className="h-4 w-4 mr-1" /> Vincular à minha conta
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="justify-start">
          <TabsTrigger value="profile"><User className="h-4 w-4" /><span className="hidden sm:inline ml-1">Dados</span></TabsTrigger>
          <TabsTrigger value="address"><MapPin className="h-4 w-4" /><span className="hidden sm:inline ml-1">Endereço</span></TabsTrigger>
          {isHealthPro && (
            <>
              <TabsTrigger value="specialties"><Stethoscope className="h-4 w-4" /><span className="hidden sm:inline ml-1">Especialidades</span></TabsTrigger>
              <TabsTrigger value="availability"><span className="hidden sm:inline">Agenda</span><span className="sm:hidden text-xs">📅</span></TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Função</Label>
                  <Select value={form.staff_role} onValueChange={v => setForm(p => ({ ...p, staff_role: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {staffRoles.map(r => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: e.target.value }))} placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>

                {isHealthPro && (
                  <>
                    <div className="space-y-2">
                      <Label>Conselho profissional</Label>
                      <Select value={form.registration_type} onValueChange={v => setForm(p => ({ ...p, registration_type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {registrationTypes.map(rt => (
                            <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Número do registro</Label>
                      <Input value={form.registration_number} onChange={e => setForm(p => ({ ...p, registration_number: e.target.value }))} />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          {professional && tenantId && (
            <AddressTab
              address={null}
              entityId={professional.id}
              table="professionals"
              tenantId={tenantId}
            />
          )}
        </TabsContent>

        {isHealthPro && (
          <>
            <TabsContent value="specialties">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-heading">Especialidades</CardTitle>
                  <Button size="sm" onClick={() => setAddSpecDialog(true)} disabled={availableSpecs.length === 0}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </CardHeader>
                <CardContent>
                  {specLoading ? (
                    <Skeleton className="h-24" />
                  ) : profSpecialties.length === 0 ? (
                    <EmptyState
                      icon={Stethoscope}
                      title="Nenhuma especialidade vinculada"
                      description="Vincule especialidades a este profissional."
                      actionLabel="+ Adicionar"
                      onAction={() => setAddSpecDialog(true)}
                    />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Especialidade</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profSpecialties.map(ps => (
                          <TableRow key={ps.id}>
                            <TableCell className="font-medium">{ps.specialties?.name}</TableCell>
                            <TableCell>
                              {(ps.custom_fee ?? ps.specialties?.default_fee)
                                ? `R$ ${Number(ps.custom_fee ?? ps.specialties?.default_fee).toFixed(2)}`
                                : "—"}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveSpecialty(ps.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Horários de Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  {availLoading ? (
                    <Skeleton className="h-48" />
                  ) : (
                    <div className="space-y-3">
                      {dayRows.map((row, idx) => (
                        <div key={row.dayOfWeek} className="flex items-center gap-3">
                          <Checkbox
                            checked={row.enabled}
                            onCheckedChange={(checked) => updateDayRow(idx, { enabled: !!checked })}
                          />
                          <span className="w-24 text-sm font-medium">{dayLabels[row.dayOfWeek]}</span>
                          <Input
                            type="time"
                            className="w-28"
                            value={row.startTime}
                            onChange={e => updateDayRow(idx, { startTime: e.target.value })}
                            disabled={!row.enabled}
                          />
                          <span className="text-sm text-muted-foreground">às</span>
                          <Input
                            type="time"
                            className="w-28"
                            value={row.endTime}
                            onChange={e => updateDayRow(idx, { endTime: e.target.value })}
                            disabled={!row.enabled}
                          />
                        </div>
                      ))}
                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSaveAvailability} disabled={availSaving}>
                          {availSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                          Salvar horários
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Add Specialty Dialog */}
      <Dialog open={addSpecDialog} onOpenChange={setAddSpecDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Especialidade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Especialidade</Label>
              <Select value={selectedSpecId} onValueChange={setSelectedSpecId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {availableSpecs.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor (opcional)</Label>
              <Input type="number" step="0.01" placeholder="R$ 0,00" value={customFee} onChange={e => setCustomFee(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSpecDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddSpecialty} disabled={!selectedSpecId}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalDetail;
