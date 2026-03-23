import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Building2, Users, Puzzle, BookOpen, DoorOpen, Mail, UserPlus, Shield, CalendarOff, CreditCard, Coins } from "lucide-react";
import PermissionsTab from "@/components/settings/PermissionsTab";
import HolidaysTab from "@/components/settings/HolidaysTab";
import SubscriptionTab from "@/components/settings/SubscriptionTab";
import FinancialSettingsTab from "@/components/settings/FinancialSettingsTab";
import { Switch } from "@/components/ui/switch";
import type { Database, Tables } from "@/integrations/supabase/types";

type ModuleType = Database["public"]["Enums"]["module_type"];

const moduleInfo: { key: ModuleType; label: string; description: string }[] = [
  { key: "EVALUATIONS", label: "Avaliações", description: "Formulários de avaliação clínica padronizados" },
  { key: "FINANCIAL", label: "Financeiro", description: "Controle de receitas, despesas e relatórios" },
  { key: "REPORTS", label: "Relatórios", description: "Relatórios operacionais e financeiros avançados" },
  { key: "VACCINES", label: "Vacinas", description: "Gestão de estoque e aplicação de vacinas" },
];

const Settings = () => {
  const { tenantId, user } = useAuth();
  const { tenant } = useTenant();
  const [saving, setSaving] = useState(false);

  // Clinic profile
  const [form, setForm] = useState({ name: "", cnpj: "", phone: "", email: "", website: "" });

  // Specialties
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [specLoading, setSpecLoading] = useState(true);
  const [specDialog, setSpecDialog] = useState(false);
  const [specForm, setSpecForm] = useState({ name: "", category: "health" });
  const [specSaving, setSpecSaving] = useState(false);

  // Rooms
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomDialog, setRoomDialog] = useState(false);
  const [roomForm, setRoomForm] = useState({ name: "", capacity: "1", equipmentNotes: "" });
  const [roomSaving, setRoomSaving] = useState(false);

  // Users
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Create user dialog
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({ email: "", password: "", fullName: "", role: "RECEPTIONIST" as string });
  const [createUserSaving, setCreateUserSaving] = useState(false);

  // Modules
  const [activeModules, setActiveModules] = useState<ModuleType[]>(["BASE"]);
  const [moduleSaving, setModuleSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setForm({
        name: tenant.name || "", cnpj: tenant.cnpj || "",
        phone: tenant.phone || "", email: tenant.email || "",
        website: tenant.website || "",
      });
      setActiveModules((tenant.active_modules as ModuleType[]) || ["BASE"]);
    }
  }, [tenant]);

  // Fetch data
  useEffect(() => {
    if (!tenantId) return;
    const fetchAll = async () => {
      const [specRes, roomRes, rolesRes] = await Promise.all([
        supabase.from("specialties").select("*").eq("tenant_id", tenantId).order("name"),
        supabase.from("rooms").select("*").eq("tenant_id", tenantId).order("name"),
        supabase.from("user_roles").select("*").eq("tenant_id", tenantId).order("created_at"),
      ]);
      setSpecialties(specRes.data || []);
      setSpecLoading(false);
      setRooms(roomRes.data || []);
      setRoomsLoading(false);

      // Fetch profiles for each user role
      const roles = rolesRes.data || [];
      if (roles.length > 0) {
        const userIds = roles.map(r => r.user_id);
        const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", userIds);
        const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
        const enriched = roles.map(r => ({ ...r, profile: profileMap.get(r.user_id) || null }));
        setUserRoles(enriched);
      } else {
        setUserRoles([]);
      }
      setUsersLoading(false);
    };
    fetchAll();
  }, [tenantId]);

  // Save clinic profile
  const handleSaveClinic = async () => {
    if (!tenantId) return;
    setSaving(true);
    const { error } = await supabase.from("tenants").update({
      name: form.name, cnpj: form.cnpj || null,
      phone: form.phone || null, email: form.email || null,
      website: form.website || null,
    }).eq("id", tenantId);
    if (error) toast.error(error.message);
    else toast.success("Configurações salvas!");
    setSaving(false);
  };

  // Create specialty
  const handleCreateSpecialty = async () => {
    if (!tenantId || !specForm.name) return;
    setSpecSaving(true);
    const { error } = await supabase.from("specialties").insert({
      tenant_id: tenantId, name: specForm.name,
      category: specForm.category,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Especialidade criada!");
      setSpecDialog(false);
      setSpecForm({ name: "", category: "health" });
      const { data } = await supabase.from("specialties").select("*").eq("tenant_id", tenantId).order("name");
      setSpecialties(data || []);
    }
    setSpecSaving(false);
  };

  // Create room
  const handleCreateRoom = async () => {
    if (!tenantId || !roomForm.name) return;
    setRoomSaving(true);
    const { error } = await supabase.from("rooms").insert({
      tenant_id: tenantId, name: roomForm.name,
      capacity: parseInt(roomForm.capacity) || 1,
      equipment_notes: roomForm.equipmentNotes || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Sala criada!");
      setRoomDialog(false);
      setRoomForm({ name: "", capacity: "1", equipmentNotes: "" });
      const { data } = await supabase.from("rooms").select("*").eq("tenant_id", tenantId).order("name");
      setRooms(data || []);
    }
    setRoomSaving(false);
  };

  // Toggle module
  const handleToggleModule = async (mod: ModuleType) => {
    const updated = activeModules.includes(mod)
      ? activeModules.filter(m => m !== mod)
      : [...activeModules, mod];
    setModuleSaving(true);
    const { error } = await supabase.from("tenants").update({ active_modules: updated }).eq("id", tenantId!);
    if (error) toast.error(error.message);
    else {
      setActiveModules(updated);
      toast.success("Módulos atualizados!");
    }
    setModuleSaving(false);
  };

  // Refresh users list
  const refreshUsers = async () => {
    if (!tenantId) return;
    const { data: roles } = await supabase.from("user_roles").select("*").eq("tenant_id", tenantId).order("created_at");
    const list = roles || [];
    if (list.length > 0) {
      const userIds = list.map(r => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", userIds);
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      setUserRoles(list.map(r => ({ ...r, profile: profileMap.get(r.user_id) || null })));
    } else {
      setUserRoles([]);
    }
  };

  // Create user via Edge Function
  const handleCreateUser = async () => {
    if (!createUserForm.email || !createUserForm.password || !createUserForm.fullName) return;
    setCreateUserSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada");

      const res = await supabase.functions.invoke("create-user", {
        body: {
          email: createUserForm.email,
          password: createUserForm.password,
          fullName: createUserForm.fullName,
          role: createUserForm.role,
        },
      });

      if (res.error) throw new Error(res.error.message);
      const result = res.data as any;
      if (result?.error) throw new Error(result.error);

      toast.success("Usuário criado! A senha temporária deve ser informada ao usuário.");
      setCreateUserDialog(false);
      setCreateUserForm({ email: "", password: "", fullName: "", role: "RECEPTIONIST" });
      await refreshUsers();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar usuário");
    } finally {
      setCreateUserSaving(false);
    }
  };

  // Change user role
  const handleChangeRole = async (userRoleId: string, newRole: string) => {
    const { error } = await supabase.from("user_roles").update({ role: newRole as any }).eq("id", userRoleId);
    if (error) toast.error(error.message);
    else {
      toast.success("Função atualizada!");
      await refreshUsers();
    }
  };

  // Toggle user active status
  const handleToggleUserActive = async (userRoleId: string, currentActive: boolean) => {
    const { error } = await supabase.from("user_roles").update({ is_active: !currentActive }).eq("id", userRoleId);
    if (error) toast.error(error.message);
    else {
      toast.success(currentActive ? "Usuário desativado" : "Usuário reativado");
      await refreshUsers();
    }
  };

  const roleLabel: Record<string, string> = {
    ORG_ADMIN: "Administrador", MANAGER: "Gerente",
    HEALTH_PROFESSIONAL: "Profissional", RECEPTIONIST: "Recepcionista",
    FINANCIAL: "Financeiro", PATIENT: "Paciente",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Configurações</h1>

      <Tabs defaultValue="clinic">
        <TabsList className="flex-wrap h-auto justify-start">
          <TabsTrigger value="clinic"><Building2 className="h-4 w-4" /><span className="hidden sm:inline ml-1">Clínica</span></TabsTrigger>
          <TabsTrigger value="specialties"><BookOpen className="h-4 w-4" /><span className="hidden sm:inline ml-1">Especialidades</span></TabsTrigger>
          <TabsTrigger value="rooms"><DoorOpen className="h-4 w-4" /><span className="hidden sm:inline ml-1">Salas</span></TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4" /><span className="hidden sm:inline ml-1">Usuários</span></TabsTrigger>
          <TabsTrigger value="permissions"><Shield className="h-4 w-4" /><span className="hidden sm:inline ml-1">Permissões</span></TabsTrigger>
          <TabsTrigger value="holidays"><CalendarOff className="h-4 w-4" /><span className="hidden sm:inline ml-1">Feriados</span></TabsTrigger>
          <TabsTrigger value="modules"><Puzzle className="h-4 w-4" /><span className="hidden sm:inline ml-1">Módulos</span></TabsTrigger>
          <TabsTrigger value="subscription"><CreditCard className="h-4 w-4" /><span className="hidden sm:inline ml-1">Assinatura</span></TabsTrigger>
          <TabsTrigger value="financial"><Coins className="h-4 w-4" /><span className="hidden sm:inline ml-1">Financeiro</span></TabsTrigger>
        </TabsList>

        {/* Clinic Profile */}
        <TabsContent value="clinic">
          <Card>
            <CardHeader><CardTitle className="font-heading">Dados da Clínica</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>CNPJ</Label><Input value={form.cnpj} onChange={e => setForm(p => ({ ...p, cnpj: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Website</Label><Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} /></div>
              </div>
              <Button onClick={handleSaveClinic} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specialties */}
        <TabsContent value="specialties">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Especialidades</CardTitle>
              <Dialog open={specDialog} onOpenChange={setSpecDialog}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nova Especialidade</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2"><Label>Nome *</Label><Input value={specForm.name} onChange={e => setSpecForm(p => ({ ...p, name: e.target.value }))} placeholder="Fisioterapia" /></div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={specForm.category} onChange={e => setSpecForm(p => ({ ...p, category: e.target.value }))}>
                        <option value="health">Saúde</option>
                        <option value="aesthetic">Estética</option>
                        <option value="veterinary">Veterinária</option>
                        <option value="occupational">Ocupacional</option>
                      </select>
                    </div>
                    <Button onClick={handleCreateSpecialty} disabled={specSaving || !specForm.name} className="w-full">
                      {specSaving ? "Salvando..." : "Criar Especialidade"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              {specLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : specialties.length === 0 ? (
                <EmptyState icon={BookOpen} title="Nenhuma especialidade" description="Crie a primeira especialidade da clínica." actionLabel="+ Nova Especialidade" onAction={() => setSpecDialog(true)} />
              ) : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Nome</TableHead><TableHead>Categoria</TableHead><TableHead>Status</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {specialties.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="capitalize">{s.category || "—"}</TableCell>
                        <TableCell><StatusBadge variant={s.is_active ? "active" : "inactive"} label={s.is_active ? "Ativa" : "Inativa"} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooms */}
        <TabsContent value="rooms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Salas / Consultórios</CardTitle>
              <Dialog open={roomDialog} onOpenChange={setRoomDialog}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Sala</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nova Sala</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2"><Label>Nome *</Label><Input value={roomForm.name} onChange={e => setRoomForm(p => ({ ...p, name: e.target.value }))} placeholder="Sala 1" /></div>
                    <div className="space-y-2"><Label>Capacidade</Label><Input type="number" value={roomForm.capacity} onChange={e => setRoomForm(p => ({ ...p, capacity: e.target.value }))} /></div>
                    <div className="space-y-2"><Label>Equipamentos</Label><Input value={roomForm.equipmentNotes} onChange={e => setRoomForm(p => ({ ...p, equipmentNotes: e.target.value }))} placeholder="Maca, ultrassom..." /></div>
                    <Button onClick={handleCreateRoom} disabled={roomSaving || !roomForm.name} className="w-full">
                      {roomSaving ? "Salvando..." : "Criar Sala"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              {roomsLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : rooms.length === 0 ? (
                <EmptyState icon={DoorOpen} title="Nenhuma sala cadastrada" description="Crie a primeira sala da clínica." actionLabel="+ Nova Sala" onAction={() => setRoomDialog(true)} />
              ) : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Nome</TableHead><TableHead>Capacidade</TableHead><TableHead>Equipamentos</TableHead><TableHead>Status</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {rooms.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.capacity || 1}</TableCell>
                        <TableCell>{r.equipment_notes || "—"}</TableCell>
                        <TableCell><StatusBadge variant={r.is_active ? "active" : "inactive"} label={r.is_active ? "Ativa" : "Inativa"} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Usuários da Organização</CardTitle>
              <Dialog open={createUserDialog} onOpenChange={setCreateUserDialog}>
                <DialogTrigger asChild>
                  <Button size="sm"><UserPlus className="h-4 w-4 mr-1" /> Criar Usuário</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                    <DialogDescription>O usuário será obrigado a trocar a senha no primeiro login.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome completo *</Label>
                      <Input value={createUserForm.fullName} onChange={e => setCreateUserForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Maria Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail *</Label>
                      <Input type="email" value={createUserForm.email} onChange={e => setCreateUserForm(p => ({ ...p, email: e.target.value }))} placeholder="maria@clinica.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Senha temporária *</Label>
                      <Input type="password" value={createUserForm.password} onChange={e => setCreateUserForm(p => ({ ...p, password: e.target.value }))} placeholder="Mínimo 8 caracteres" />
                    </div>
                    <div className="space-y-2">
                      <Label>Função</Label>
                      <Select value={createUserForm.role} onValueChange={v => setCreateUserForm(p => ({ ...p, role: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ORG_ADMIN">Administrador</SelectItem>
                          <SelectItem value="MANAGER">Gerente</SelectItem>
                          <SelectItem value="HEALTH_PROFESSIONAL">Profissional de Saúde</SelectItem>
                          <SelectItem value="RECEPTIONIST">Recepcionista</SelectItem>
                          <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateUser} disabled={createUserSaving || !createUserForm.email || !createUserForm.password || !createUserForm.fullName} className="w-full">
                      {createUserSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Usuário
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              {usersLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : userRoles.length === 0 ? (
                <EmptyState icon={Users} title="Nenhum usuário" description="Crie o primeiro usuário da equipe." actionLabel="+ Criar Usuário" onAction={() => setCreateUserDialog(true)} />
              ) : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Nome</TableHead><TableHead>E-mail</TableHead><TableHead>Função</TableHead><TableHead>Status</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {userRoles.map(ur => (
                      <TableRow key={ur.id}>
                        <TableCell className="font-medium">{(ur.profile as any)?.full_name || "—"}</TableCell>
                        <TableCell>{(ur.profile as any)?.email || "—"}</TableCell>
                        <TableCell>
                          {ur.user_id === user?.id ? (
                            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{roleLabel[ur.role] || ur.role}</span>
                          ) : (
                            <Select value={ur.role} onValueChange={v => handleChangeRole(ur.id, v)}>
                              <SelectTrigger className="h-7 w-[160px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ORG_ADMIN">Administrador</SelectItem>
                                <SelectItem value="MANAGER">Gerente</SelectItem>
                                <SelectItem value="HEALTH_PROFESSIONAL">Profissional</SelectItem>
                                <SelectItem value="RECEPTIONIST">Recepcionista</SelectItem>
                                <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {ur.user_id === user?.id ? (
                            <StatusBadge variant="active" label="Ativo" />
                          ) : (
                            <Switch checked={ur.is_active} onCheckedChange={() => handleToggleUserActive(ur.id, ur.is_active)} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holidays */}
        <TabsContent value="holidays">
          <HolidaysTab />
        </TabsContent>

        {/* Modules */}
        <TabsContent value="modules">
          <Card>
            <CardHeader><CardTitle className="font-heading">Módulos Ativos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Base (Clínica)</p>
                  <p className="text-xs text-muted-foreground">Módulo principal — sempre ativo</p>
                </div>
                <Switch checked disabled />
              </div>
              {moduleInfo.map(mod => (
                <div key={mod.key} className="rounded-lg border p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{mod.label}</p>
                    <p className="text-xs text-muted-foreground">{mod.description}</p>
                  </div>
                  <Switch
                    checked={activeModules.includes(mod.key)}
                    onCheckedChange={() => handleToggleModule(mod.key)}
                    disabled={moduleSaving}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>

        {/* Subscription */}
        <TabsContent value="subscription">
          <SubscriptionTab />
        </TabsContent>

        {/* Financial Settings (Plano de Contas + Centros de Custo) */}
        <TabsContent value="financial">
          <FinancialSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
