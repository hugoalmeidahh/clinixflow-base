import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { Users2, Plus, Search, UserPlus, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import type { Tables } from "@/integrations/supabase/types";

type Professional = Tables<"professionals">;

const staffRoles = [
  { value: "HEALTH_PROFESSIONAL", label: "Profissional de Saúde" },
  { value: "ORG_ADMIN", label: "Administrador" },
  { value: "MANAGER", label: "Gerente" },
  { value: "RECEPTIONIST", label: "Recepcionista" },
  { value: "FINANCIAL", label: "Financeiro" },
];

const staffRoleLabels: Record<string, string> = {
  HEALTH_PROFESSIONAL: "Profissional de Saúde",
  ORG_ADMIN: "Administrador",
  MANAGER: "Gerente",
  RECEPTIONIST: "Recepcionista",
  FINANCIAL: "Financeiro",
};

const orgRoleMap: Record<string, string> = {
  HEALTH_PROFESSIONAL: "HEALTH_PROFESSIONAL",
  ORG_ADMIN: "ORG_ADMIN",
  MANAGER: "MANAGER",
  RECEPTIONIST: "RECEPTIONIST",
  FINANCIAL: "FINANCIAL",
};

const registrationTypes = [
  { value: "CRM", label: "CRM (Medicina)" },
  { value: "CRP", label: "CRP (Psicologia)" },
  { value: "CREFITO", label: "CREFITO (Fisioterapia/TO)" },
  { value: "COREN", label: "COREN (Enfermagem)" },
  { value: "CRFa", label: "CRFa (Fonoaudiologia)" },
  { value: "OTHER", label: "Outro" },
];

const Professionals = () => {
  const { tenantId, session } = useAuth();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    cpf: "",
    staffRole: "HEALTH_PROFESSIONAL",
    registrationType: "CRM",
    registrationNumber: "",
    phone: "",
    email: "",
    createLogin: true,
    password: "",
  });

  const isHealthPro = form.staffRole === "HEALTH_PROFESSIONAL";

  const fetchProfessionals = async () => {
    if (!tenantId) return;
    let query = supabase
      .from("professionals")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,registration_number.ilike.%${search}%`);
    }

    const { data } = await query;
    setProfessionals(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProfessionals(); }, [tenantId, search]);

  const handleCreate = async () => {
    if (!tenantId || !form.fullName) return;
    if (isHealthPro && !form.registrationNumber) return;
    if (form.createLogin && (!form.email || !form.password)) {
      toast.error("E-mail e senha são obrigatórios para criar login.");
      return;
    }
    if (form.createLogin && form.password.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    setSaving(true);

    // 1. Create professional record
    const { data: profData, error: profError } = await supabase.from("professionals").insert({
      tenant_id: tenantId,
      full_name: form.fullName,
      cpf: form.cpf || null,
      staff_role: form.staffRole,
      registration_type: isHealthPro ? form.registrationType : null,
      registration_number: isHealthPro ? form.registrationNumber : null,
      phone: form.phone || null,
      email: form.email || null,
    }).select("id").single();

    if (profError) {
      toast.error(profError.message);
      setSaving(false);
      return;
    }

    // 2. Create user login if requested
    if (form.createLogin && form.email && form.password) {
      const { data: fnData, error: fnError } = await supabase.functions.invoke("create-user", {
        body: {
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          role: orgRoleMap[form.staffRole] || "HEALTH_PROFESSIONAL",
          professionalId: profData?.id,
        },
      });

      if (fnError) {
        toast.error("Membro criado, mas erro ao criar login: " + fnError.message);
      } else if (fnData?.error) {
        toast.error("Membro criado, mas erro ao criar login: " + fnData.error);
      } else {
        toast.success("Membro cadastrado com login criado! No primeiro acesso, o sistema pedirá troca de senha.");
      }
    } else {
      toast.success("Membro cadastrado!");
    }

    setDialogOpen(false);
    setForm({ fullName: "", cpf: "", staffRole: "HEALTH_PROFESSIONAL", registrationType: "CRM", registrationNumber: "", phone: "", email: "", createLogin: true, password: "" });
    fetchProfessionals();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Equipe</h1>
          <p className="text-sm text-muted-foreground">Gerencie os membros da clínica</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Novo Membro</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Cadastrar Membro</DialogTitle>
              <DialogDescription>Preencha os dados e defina a senha inicial de acesso.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="space-y-2">
                <Label>Função *</Label>
                <Select value={form.staffRole} onValueChange={v => setForm(p => ({ ...p, staffRole: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {staffRoles.map(r => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nome completo *</Label>
                <Input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Nome do membro" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: e.target.value }))} placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(11) 99999-9999" />
                </div>
              </div>

              {isHealthPro && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Conselho profissional *</Label>
                    <Select value={form.registrationType} onValueChange={v => setForm(p => ({ ...p, registrationType: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {registrationTypes.map(rt => (
                          <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Número do registro *</Label>
                    <Input value={form.registrationNumber} onChange={e => setForm(p => ({ ...p, registrationNumber: e.target.value }))} placeholder="12345-SP" />
                  </div>
                </div>
              )}

              {/* Login credentials section */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="createLogin"
                    checked={form.createLogin}
                    onCheckedChange={(checked) => setForm(p => ({ ...p, createLogin: !!checked }))}
                  />
                  <Label htmlFor="createLogin" className="text-sm font-medium cursor-pointer">
                    Criar acesso ao sistema (login)
                  </Label>
                </div>

                {form.createLogin && (
                  <div className="space-y-3 pl-6 border-l-2 border-primary/20">
                    <div className="space-y-2">
                      <Label>E-mail de login *</Label>
                      <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@clinica.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Senha inicial *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                          placeholder="Mínimo 8 caracteres"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        O membro será solicitado a trocar a senha no primeiro login.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleCreate} disabled={saving || !form.fullName || (isHealthPro && !form.registrationNumber)} className="w-full">
                {saving ? "Cadastrando..." : "Cadastrar Membro"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou registro..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : professionals.length === 0 ? (
            <EmptyState icon={Users2} title="Nenhum membro cadastrado" description="Cadastre o primeiro membro da equipe." actionLabel="+ Novo Membro" onAction={() => setDialogOpen(true)} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((prof) => (
                  <TableRow key={prof.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/professionals/${prof.id}`)}>
                    <TableCell className="font-medium">{prof.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {staffRoleLabels[(prof as any).staff_role] || "Profissional de Saúde"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {prof.registration_number ? (
                        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                          {prof.registration_type}/{prof.registration_number}
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell>{prof.phone || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge variant={prof.is_active ? "active" : "inactive"} label={prof.is_active ? "Ativo" : "Inativo"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Professionals;
