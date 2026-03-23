import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Activity, Building2, UserPlus, BookOpen, Puzzle, ArrowRight, ArrowLeft, Loader2, Check, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ModuleType = Database["public"]["Enums"]["module_type"];

const steps = [
  { title: "Dados da Clínica", icon: Building2 },
  { title: "Profissional de Saúde", icon: UserPlus },
  { title: "Especialidades", icon: BookOpen },
  { title: "Módulos", icon: Puzzle },
];

const moduleInfo: { key: ModuleType; label: string; description: string }[] = [
  { key: "EVALUATIONS", label: "Avaliações", description: "Formulários de avaliação clínica padronizados" },
  { key: "FINANCIAL", label: "Financeiro", description: "Controle de receitas, despesas e relatórios" },
  { key: "REPORTS", label: "Relatórios", description: "Relatórios operacionais e financeiros avançados" },
  { key: "VACCINES", label: "Vacinas", description: "Gestão de estoque e aplicação de vacinas" },
];

const registrationTypes = [
  { value: "CREFITO", label: "CREFITO — Fisioterapia / Terapia Ocupacional" },
  { value: "CRP", label: "CRP — Psicologia" },
  { value: "CRM", label: "CRM — Medicina" },
  { value: "CRN", label: "CRN — Nutrição" },
  { value: "COREN", label: "COREN — Enfermagem" },
  { value: "CRFa", label: "CRFa — Fonoaudiologia" },
  { value: "COFFITO", label: "COFFITO — Psicomotricidade" },
  { value: "OTHER", label: "Outro" },
];

const defaultSpecialties = [
  { name: "Fisioterapia", category: "health" },
  { name: "Terapia Ocupacional", category: "health" },
  { name: "Psicologia", category: "health" },
  { name: "Psicomotricidade", category: "health" },
  { name: "Nutrição", category: "health" },
];

const formatCnpj = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { tenantId, user, profile, userRole } = useAuth();
  const { tenant, refetch: refetchTenant } = useTenant();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Step 1 - Clinic details
  const [clinic, setClinic] = useState({ name: "", cnpj: "", phone: "", email: "", website: "", address: "" });

  // Step 2 - Admin is also a professional?
  const [isAdminProfessional, setIsAdminProfessional] = useState(false);
  const [professional, setProfessional] = useState({ fullName: "", registrationNumber: "", registrationType: "CREFITO" });

  // Step 3 - Specialties (seeded with defaults)
  const [specialties, setSpecialties] = useState(
    defaultSpecialties.map(s => ({ name: s.name, category: s.category, selected: true }))
  );

  // Step 4 - Modules
  const [activeModules, setActiveModules] = useState<ModuleType[]>(["BASE"]);

  // Pre-fill from existing tenant and profile data
  useEffect(() => {
    if (dataLoaded) return;
    if (tenant) {
      setClinic({
        name: tenant.name || "",
        cnpj: tenant.cnpj ? formatCnpj(tenant.cnpj) : "",
        phone: tenant.phone ? formatPhone(tenant.phone) : "",
        email: tenant.email || "",
        website: tenant.website || "",
        address: typeof tenant.address === "object" && tenant.address !== null ? (tenant.address as any).raw || "" : "",
      });
      if (tenant.active_modules) {
        setActiveModules(tenant.active_modules as ModuleType[]);
      }
      setDataLoaded(true);
    }
    if (profile && !professional.fullName) {
      setProfessional(prev => ({ ...prev, fullName: profile.full_name || "" }));
    }
  }, [tenant, profile, dataLoaded]);

  const toggleModule = (mod: ModuleType) => {
    setActiveModules(prev =>
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const toggleSpecialty = (idx: number) => {
    const updated = [...specialties];
    updated[idx].selected = !updated[idx].selected;
    setSpecialties(updated);
  };

  const addCustomSpecialty = () => {
    setSpecialties(prev => [...prev, { name: "", category: "health", selected: true }]);
  };

  const removeSpecialty = (idx: number) => {
    setSpecialties(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFinish = async () => {
    if (!tenantId || !user) return;
    setLoading(true);

    try {
      // Update tenant
      await supabase.from("tenants").update({
        name: clinic.name || undefined,
        cnpj: clinic.cnpj ? clinic.cnpj.replace(/\D/g, "") : null,
        phone: clinic.phone ? clinic.phone.replace(/\D/g, "") : null,
        email: clinic.email || null,
        website: clinic.website || null,
        address: clinic.address ? { raw: clinic.address } : null,
        active_modules: activeModules,
        onboarding_completed: true,
      }).eq("id", tenantId);

      // Create selected specialties
      const selectedSpecs = specialties.filter(s => s.selected && s.name.trim());
      if (selectedSpecs.length > 0) {
        await supabase.from("specialties").insert(
          selectedSpecs.map(spec => ({
            tenant_id: tenantId,
            name: spec.name,
            category: spec.category,
          }))
        );
      }

      // Create professional only if admin is also a professional
      if (isAdminProfessional && professional.fullName && professional.registrationNumber) {
        await supabase.from("professionals").insert({
          tenant_id: tenantId,
          full_name: professional.fullName,
          registration_number: professional.registrationNumber,
          registration_type: professional.registrationType,
          user_id: user.id,
        });
      }

      toast.success("Configuração concluída!");
      await refetchTenant();
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar configuração.");
    } finally {
      setLoading(false);
    }
  };

  // Only ORG_ADMIN can access onboarding
  if (userRole && userRole.role !== "ORG_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // Already completed — redirect out
  if (tenant && tenant.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-primary mb-8">
          <Activity className="h-8 w-8" />
          <span className="text-2xl font-bold font-heading">ClinixFlow</span>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i < step ? "bg-primary text-primary-foreground" :
                i === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 ${i < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">{steps[step].title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1 - Clinic */}
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <Label>Nome da clínica</Label>
                  <Input placeholder="Nome da organização" value={clinic.name} onChange={e => setClinic(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CPF / CNPJ</Label>
                    <Input placeholder="00.000.000/0000-00" value={clinic.cnpj} onChange={e => setClinic(p => ({ ...p, cnpj: formatCnpj(e.target.value) }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input type="email" placeholder="contato@clinica.com" value={clinic.email} onChange={e => setClinic(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input placeholder="(11) 99999-9999" value={clinic.phone} onChange={e => setClinic(p => ({ ...p, phone: formatPhone(e.target.value) }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input placeholder="www.suaclinica.com" value={clinic.website} onChange={e => setClinic(p => ({ ...p, website: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input placeholder="Rua, número, bairro, cidade - UF" value={clinic.address} onChange={e => setClinic(p => ({ ...p, address: e.target.value }))} />
                </div>
              </>
            )}

            {/* Step 2 - Professional */}
            {step === 1 && (
              <>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="admin-is-professional"
                      checked={isAdminProfessional}
                      onCheckedChange={(checked) => setIsAdminProfessional(checked === true)}
                      className="mt-0.5"
                    />
                    <div>
                      <Label htmlFor="admin-is-professional" className="font-medium cursor-pointer">
                        Eu também sou profissional de saúde
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Marque esta opção se você, como administrador, também atende pacientes.
                        Caso contrário, profissionais poderão ser cadastrados depois em Configurações.
                      </p>
                    </div>
                  </div>
                </div>

                {isAdminProfessional && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Nome completo *</Label>
                      <Input
                        placeholder="Dr. João Silva"
                        value={professional.fullName}
                        onChange={e => setProfessional(p => ({ ...p, fullName: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Conselho profissional *</Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={professional.registrationType}
                          onChange={e => setProfessional(p => ({ ...p, registrationType: e.target.value }))}
                        >
                          {registrationTypes.map(rt => (
                            <option key={rt.value} value={rt.value}>{rt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Número do registro *</Label>
                        <Input
                          placeholder="12345"
                          value={professional.registrationNumber}
                          onChange={e => setProfessional(p => ({ ...p, registrationNumber: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!isAdminProfessional && (
                  <div className="text-center py-6 text-muted-foreground">
                    <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Você poderá cadastrar profissionais de saúde posteriormente<br />na seção <strong>Profissionais</strong> do sistema.</p>
                  </div>
                )}
              </>
            )}

            {/* Step 3 - Specialties */}
            {step === 2 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Selecione as especialidades que sua clínica oferece ou adicione novas.
                </p>
                <div className="space-y-2">
                  {specialties.map((spec, idx) => {
                    const isDefault = idx < defaultSpecialties.length && spec.name === defaultSpecialties[idx]?.name;
                    return (
                      <div key={idx} className="flex items-center gap-3 rounded-lg border p-3">
                        <Checkbox
                          checked={spec.selected}
                          onCheckedChange={() => toggleSpecialty(idx)}
                        />
                        {isDefault ? (
                          <span className="flex-1 text-sm font-medium">{spec.name}</span>
                        ) : (
                          <Input
                            className="flex-1 h-8"
                            placeholder="Nome da especialidade"
                            value={spec.name}
                            onChange={e => {
                              const updated = [...specialties];
                              updated[idx].name = e.target.value;
                              setSpecialties(updated);
                            }}
                          />
                        )}
                        <select
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                          value={spec.category}
                          onChange={e => {
                            const updated = [...specialties];
                            updated[idx].category = e.target.value;
                            setSpecialties(updated);
                          }}
                        >
                          <option value="health">Saúde</option>
                          <option value="aesthetic">Estética</option>
                          <option value="veterinary">Veterinária</option>
                          <option value="occupational">Ocupacional</option>
                        </select>
                        {!isDefault && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSpecialty(idx)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addCustomSpecialty}>
                  + Adicionar especialidade
                </Button>
              </>
            )}

            {/* Step 4 - Modules */}
            {step === 3 && (
              <div className="space-y-3">
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
                      onCheckedChange={() => toggleModule(mod.key)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(s => s + 1)}>
                  Próximo <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Concluir configuração
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
