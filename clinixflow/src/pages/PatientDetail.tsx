import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/StatusBadge";
import ClinicalTimeline from "@/components/patients/ClinicalTimeline";
import PatientInfoTab from "@/components/patients/PatientInfoTab";
import PatientAppointmentsTab from "@/components/patients/PatientAppointmentsTab";
import PatientInsuranceTab from "@/components/patients/PatientInsuranceTab";
import AddressTab from "@/components/shared/AddressTab";
import EmptyState from "@/components/EmptyState";
import { toast } from "@/components/ui/sonner";
import PrescriptionList from "@/components/clinical/PrescriptionList";
import InsuranceGuideList from "@/components/clinical/InsuranceGuideList";
import {
  ArrowLeft, User, Calendar, FileText, MapPin, ShieldCheck,
  AlertTriangle, ClipboardList, FileSignature, ScrollText,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenantId } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [conventions, setConventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "", cpf: "", date_of_birth: "", gender: "",
    phone: "", email: "",
    guardian_name: "", guardian_cpf: "", guardian_phone: "", guardian_relationship: "",
    guardian_email: "",
    allergy_alerts: "", general_observations: "",
    needs_guardian: false,
  });

  useEffect(() => {
    if (!id || !tenantId) return;
    const fetch = async () => {
      const [patientRes, aptsRes, profsRes, convsRes] = await Promise.all([
        supabase.from("patients").select("*").eq("id", id).eq("tenant_id", tenantId).single(),
        supabase.from("appointments")
          .select("*, professionals!inner(full_name), specialties!inner(name)")
          .eq("patient_id", id).eq("tenant_id", tenantId)
          .order("scheduled_at", { ascending: false }).limit(50),
        supabase.from("professionals").select("id, full_name, user_id").eq("tenant_id", tenantId).eq("is_active", true),
        supabase.from("conventions").select("id, name").eq("tenant_id", tenantId).eq("is_active", true),
      ]);

      if (patientRes.data) {
        setPatient(patientRes.data);
        const p = patientRes.data;
        // Determine if needs_guardian flag should be on (has guardian data but not minor)
        const age = p.date_of_birth ? Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;
        const isMinor = age !== null && age < 18;
        const hasGuardianData = !!(p.guardian_name || p.guardian_phone);
        
        setForm({
          full_name: p.full_name || "",
          cpf: p.cpf || "",
          date_of_birth: p.date_of_birth || "",
          gender: p.gender || "",
          phone: p.phone || "",
          email: p.email || "",
          guardian_name: p.guardian_name || "",
          guardian_cpf: p.guardian_cpf || "",
          guardian_phone: p.guardian_phone || "",
          guardian_relationship: p.guardian_relationship || "",
          guardian_email: p.guardian_email || "",
          allergy_alerts: p.allergy_alerts || "",
          general_observations: p.general_observations || "",
          needs_guardian: !isMinor && hasGuardianData,
        });
      }
      setAppointments(aptsRes.data || []);
      setProfessionals(profsRes.data || []);
      setConventions(convsRes.data || []);
      setLoading(false);
    };
    fetch();
  }, [id, tenantId]);

  const handleSave = async () => {
    if (!id || !tenantId) return;
    setSaving(true);
    const { error } = await supabase.from("patients").update({
      full_name: form.full_name,
      cpf: form.cpf || null,
      date_of_birth: form.date_of_birth || null,
      gender: form.gender || null,
      phone: form.phone || null,
      email: form.email || null,
      guardian_name: form.guardian_name || null,
      guardian_cpf: form.guardian_cpf || null,
      guardian_phone: form.guardian_phone || null,
      guardian_relationship: form.guardian_relationship || null,
      guardian_email: form.guardian_email || null,
      allergy_alerts: form.allergy_alerts || null,
      general_observations: form.general_observations || null,
    }).eq("id", id).eq("tenant_id", tenantId);

    if (error) toast.error(error.message);
    else {
      toast.success("Paciente atualizado!");
      setEditing(false);
    }
    setSaving(false);
  };

  const calculateAge = (dob: string | null) => {
    if (!dob) return null;
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Paciente não encontrado.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      </div>
    );
  }

  const age = calculateAge(patient.date_of_birth);
  const isMinor = age !== null && age < 18;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-heading font-bold">{patient.full_name}</h1>
            <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
              #{patient.record_number}
            </span>
            <StatusBadge
              variant={patient.is_active ? "active" : "inactive"}
              label={patient.is_active ? "Ativo" : "Inativo"}
            />
            <StatusBadge
              variant={patient.care_type === "ONGOING_TREATMENT" ? "confirmed" : "info"}
              label={patient.care_type === "ONGOING_TREATMENT" ? "Tratamento" : "Avulso"}
            />
            {patient.allergy_alerts && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-2.5 py-0.5 text-xs font-semibold">
                <AlertTriangle className="h-3 w-3" /> Alergias
              </span>
            )}
          </div>
          {age !== null && (
            <p className="text-sm text-muted-foreground mt-1">
              {age} anos · {patient.gender === "M" ? "Masculino" : patient.gender === "F" ? "Feminino" : patient.gender || "—"}
            </p>
          )}
        </div>
      </div>

      {/* Allergy alert */}
      {patient.allergy_alerts && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Alertas de Alergia</p>
            <p className="text-sm text-destructive/80">{patient.allergy_alerts}</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="info">
        <TabsList className="justify-start w-full flex-wrap">
          <TabsTrigger value="info"><User className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Dados Pessoais</span></TabsTrigger>
          <TabsTrigger value="address"><MapPin className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Endereço</span></TabsTrigger>
          <TabsTrigger value="insurance"><ShieldCheck className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Cobertura</span></TabsTrigger>
          <TabsTrigger value="schedule"><Calendar className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Agendamentos</span></TabsTrigger>
          <TabsTrigger value="evolutions"><ClipboardList className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Evoluções</span></TabsTrigger>
          <TabsTrigger value="prescriptions"><FileSignature className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Prescrições</span></TabsTrigger>
          <TabsTrigger value="guides"><ScrollText className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Guias</span></TabsTrigger>
          <TabsTrigger value="documents"><FileText className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Documentos</span></TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <PatientInfoTab
            form={form}
            setForm={setForm}
            editing={editing}
            setEditing={setEditing}
            saving={saving}
            onSave={handleSave}
            isMinor={isMinor}
          />
        </TabsContent>

        <TabsContent value="address">
          {patient && tenantId && (
            <AddressTab
              address={patient.address}
              entityId={patient.id}
              table="patients"
              tenantId={tenantId}
            />
          )}
        </TabsContent>

        <TabsContent value="insurance">
          {patient && tenantId && (
            <PatientInsuranceTab patient={patient} tenantId={tenantId} />
          )}
        </TabsContent>

        <TabsContent value="schedule">
          <PatientAppointmentsTab appointments={appointments} />
        </TabsContent>

        <TabsContent value="evolutions">
          {patient && tenantId && (
            <ClinicalTimeline patientId={patient.id} tenantId={tenantId} />
          )}
        </TabsContent>

        <TabsContent value="prescriptions">
          {patient && (
            <div className="mt-2">
              <PrescriptionList patientId={patient.id} professionals={professionals} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides">
          {patient && (
            <div className="mt-2">
              <InsuranceGuideList patientId={patient.id} conventions={conventions} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <div className="mt-2">
            <EmptyState
              icon={FileText}
              title="Nenhum documento"
              description="Documentos do paciente aparecerão aqui."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
