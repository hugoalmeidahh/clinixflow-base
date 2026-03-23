import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { Users, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import type { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

const Patients = () => {
  const { t } = useTranslation();
  const { tenantId } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", cpf: "", dateOfBirth: "", gender: "" });

  const fetchPatients = async () => {
    if (!tenantId) return;
    let query = supabase.from("patients").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
    if (search) query = query.or(`full_name.ilike.%${search}%,record_number.ilike.%${search}%`);
    const { data } = await query;
    setPatients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, [tenantId, search]);

  const handleCreate = async () => {
    if (!tenantId || !form.fullName) return;
    setSaving(true);
    const { error } = await supabase.from("patients").insert({
      tenant_id: tenantId, full_name: form.fullName,
      phone: form.phone || null, email: form.email || null,
      cpf: form.cpf || null, date_of_birth: form.dateOfBirth || null,
      gender: form.gender || null, record_number: "",
    });
    if (error) toast.error(error.message);
    else {
      toast.success(t("patients.patient_registered"));
      setDialogOpen(false);
      setForm({ fullName: "", phone: "", email: "", cpf: "", dateOfBirth: "", gender: "" });
      fetchPatients();
    }
    setSaving(false);
  };

  const calculateAge = (dob: string | null) => {
    if (!dob) return "—";
    const years = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return `${years} ${t("common.years")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">{t("patients.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("patients.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> {t("patients.new_patient")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-heading">{t("patients.register_patient")}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("patients.full_name")} *</Label>
                <Input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("patients.cpf")}</Label>
                  <Input value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: e.target.value }))} placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label>{t("patients.date_of_birth")}</Label>
                  <Input type="date" value={form.dateOfBirth} onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("common.phone")}</Label>
                  <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label>{t("common.email")}</Label>
                  <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("patients.gender")}</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                  <option value="">{t("common.select")}</option>
                  <option value="M">{t("patients.gender_m")}</option>
                  <option value="F">{t("patients.gender_f")}</option>
                  <option value="O">{t("patients.gender_o")}</option>
                </select>
              </div>
              <Button onClick={handleCreate} disabled={saving || !form.fullName} className="w-full">
                {saving ? t("common.saving") : t("common.register")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t("patients.search_placeholder")} className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : patients.length === 0 ? (
            <EmptyState icon={Users} title={t("patients.no_patients")} description={t("patients.no_patients_desc")} actionLabel={`+ ${t("patients.new_patient")}`} onAction={() => setDialogOpen(true)} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("patients.record")}</TableHead>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead>{t("patients.age")}</TableHead>
                  <TableHead>{t("common.phone")}</TableHead>
                  <TableHead>{t("patients.care_type")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/30" onClick={() => navigate(`/patients/${patient.id}`)}>
                    <TableCell className="font-mono text-sm">#{patient.record_number}</TableCell>
                    <TableCell className="font-medium">{patient.full_name}</TableCell>
                    <TableCell>{calculateAge(patient.date_of_birth)}</TableCell>
                    <TableCell>{patient.phone || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge variant={patient.care_type === "ONGOING_TREATMENT" ? "confirmed" : "info"} label={patient.care_type === "ONGOING_TREATMENT" ? t("patients.ongoing_treatment") : t("patients.single_session")} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={patient.is_active ? "active" : "inactive"} label={patient.is_active ? t("common.active") : t("common.inactive")} />
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

export default Patients;
