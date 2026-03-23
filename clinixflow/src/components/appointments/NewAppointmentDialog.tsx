import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { AlertTriangle, CalendarPlus, Repeat, Clock } from "lucide-react";
import { format, addDays, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConflictInfo {
  conflict_type: string;
  conflicting_appointment_id: string;
  conflicting_patient_name: string;
  conflicting_professional_name: string;
  conflicting_start: string;
  conflicting_end: string;
}

export interface AppointmentPrefill {
  date?: string;
  time?: string;
  professionalId?: string;
}

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  patients: any[];
  professionals: any[];
  specialtiesList: any[];
  prefill?: AppointmentPrefill | null;
}

const DURATION_OPTIONS = [
  { value: "20", label: "20 min" },
  { value: "30", label: "30 min" },
  { value: "40", label: "40 min" },
  { value: "50", label: "50 min" },
  { value: "60", label: "60 min (1h)" },
  { value: "2x20", label: "2x 20 min (Dobradinha)" },
  { value: "2x30", label: "2x 30 min (Dobradinha)" },
  { value: "2x40", label: "2x 40 min (Dobradinha)" },
  { value: "2x50", label: "2x 50 min (Dobradinha)" },
];

const WEEKDAYS = [
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

interface AvailabilitySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const NewAppointmentDialog = ({
  open,
  onOpenChange,
  onCreated,
  patients,
  professionals,
  specialtiesList,
  prefill,
}: NewAppointmentDialogProps) => {
  const { tenantId } = useAuth();

  const [form, setForm] = useState({
    patientId: "",
    professionalId: "",
    specialtyId: "",
    date: "",
    time: "",
    duration: "30",
    notes: "",
  });

  const [isSingleSession, setIsSingleSession] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [recurringUntil, setRecurringUntil] = useState("");

  const [saving, setSaving] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictContext, setConflictContext] = useState("");

  // Availability state
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [availabilityWarning, setAvailabilityWarning] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ patientId: "", professionalId: "", specialtyId: "", date: "", time: "", duration: "30", notes: "" });
    setIsSingleSession(true);
    setIsRecurring(false);
    setRecurringDays([]);
    setRecurringUntil("");
    setConflicts([]);
    setShowConflictDialog(false);
    setAvailability([]);
    setAvailabilityWarning(null);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    } else if (prefill) {
      setForm(prev => ({
        ...prev,
        date: prefill.date || prev.date,
        time: prefill.time || prev.time,
        professionalId: prefill.professionalId || prev.professionalId,
      }));
    }
  }, [open, prefill]);

  // Fetch professional availability when professional changes
  useEffect(() => {
    if (!form.professionalId) {
      setAvailability([]);
      setAvailabilityWarning(null);
      return;
    }
    const fetchAvail = async () => {
      const { data } = await supabase
        .from("professional_availability")
        .select("day_of_week, start_time, end_time")
        .eq("professional_id", form.professionalId)
        .eq("is_active", true);
      setAvailability(data || []);
    };
    fetchAvail();
  }, [form.professionalId]);

  // Validate availability when date/time/duration changes
  useEffect(() => {
    if (!form.date || !form.time || availability.length === 0) {
      setAvailabilityWarning(null);
      return;
    }
    const selectedDate = new Date(`${form.date}T${form.time}`);
    const dayOfWeek = selectedDate.getDay();
    const slotsForDay = availability.filter(a => a.day_of_week === dayOfWeek);

    if (slotsForDay.length === 0) {
      setAvailabilityWarning(`⚠️ O profissional não atende às ${DAY_NAMES[dayOfWeek]}s.`);
      return;
    }

    const timeStr = form.time;
    const { minutes } = parseDuration(form.duration);
    const [h, m] = timeStr.split(":").map(Number);
    const startMin = h * 60 + m;
    const endMin = startMin + minutes;

    const isWithinSlot = slotsForDay.some(slot => {
      const [sh, sm] = slot.start_time.split(":").map(Number);
      const [eh, em] = slot.end_time.split(":").map(Number);
      const slotStart = sh * 60 + sm;
      const slotEnd = eh * 60 + em;
      return startMin >= slotStart && endMin <= slotEnd;
    });

    if (!isWithinSlot) {
      const availStr = slotsForDay.map(s => `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`).join(", ");
      setAvailabilityWarning(`⚠️ Horário fora da disponibilidade do profissional (${DAY_NAMES[dayOfWeek]}: ${availStr}).`);
    } else {
      setAvailabilityWarning(null);
    }
  }, [form.date, form.time, form.duration, availability]);

  const handleSpecialtyChange = (specId: string) => {
    const spec = specialtiesList.find((s: any) => s.id === specId);
    setForm((p) => ({
      ...p,
      specialtyId: specId,
      duration: spec?.default_duration_min?.toString() || "30",
    }));
  };

  const parseDuration = (dur: string): { count: number; minutes: number } => {
    if (dur.startsWith("2x")) {
      return { count: 2, minutes: parseInt(dur.replace("2x", "")) };
    }
    return { count: 1, minutes: parseInt(dur) };
  };

  const checkConflicts = async (
    scheduledAt: string,
    durationMin: number,
    label: string
  ): Promise<ConflictInfo[]> => {
    if (!tenantId) return [];
    const { data, error } = await supabase.rpc("check_appointment_conflicts", {
      p_tenant_id: tenantId,
      p_professional_id: form.professionalId,
      p_patient_id: form.patientId,
      p_scheduled_at: scheduledAt,
      p_duration_min: durationMin,
    });
    if (error) {
      console.error("Conflict check error:", error);
      return [];
    }
    return (data as ConflictInfo[]) || [];
  };

  const createSingleAppointment = async (
    scheduledAt: string,
    durationMin: number,
    recurrenceGroupId?: string
  ): Promise<{ error?: string; conflict_type?: string }> => {
    const { data, error } = await supabase.rpc("book_appointment", {
      p_tenant_id: tenantId!,
      p_patient_id: form.patientId,
      p_professional_id: form.professionalId,
      p_specialty_id: form.specialtyId,
      p_scheduled_at: scheduledAt,
      p_duration_min: durationMin,
      p_notes: form.notes || null,
      p_recurrence_group_id: recurrenceGroupId || null,
      p_skip_conflict_check: true,
    });
    if (error) return { error: error.message };
    const result = data as any;
    if (result?.error) return { error: result.error, conflict_type: result.conflict_type };
    return {};
  };

  const handleCreate = async () => {
    if (!tenantId || !form.patientId || !form.professionalId || !form.specialtyId || !form.date || !form.time) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setSaving(true);
    const { count, minutes } = parseDuration(form.duration);
    const baseTime = new Date(`${form.date}T${form.time}`);

    const appointmentsToCreate: { scheduledAt: string; durationMin: number; label: string }[] = [];

    const addSlots = (date: Date, label: string) => {
      for (let i = 0; i < count; i++) {
        const slotTime = new Date(date.getTime() + i * minutes * 60000);
        appointmentsToCreate.push({
          scheduledAt: slotTime.toISOString(),
          durationMin: minutes,
          label: `${label}${count > 1 ? ` (Sessão ${i + 1})` : ""}`,
        });
      }
    };

    addSlots(baseTime, format(baseTime, "dd/MM HH:mm"));

    if (isRecurring && recurringDays.length > 0 && recurringUntil) {
      const untilDate = parseISO(recurringUntil);
      let cursor = addDays(parseISO(form.date), 1);

      while (isBefore(cursor, addDays(untilDate, 1))) {
        const dayOfWeek = cursor.getDay();
        if (recurringDays.includes(dayOfWeek)) {
          const recurDate = new Date(cursor);
          recurDate.setHours(baseTime.getHours(), baseTime.getMinutes(), 0, 0);
          addSlots(recurDate, format(recurDate, "dd/MM HH:mm"));
        }
        cursor = addDays(cursor, 1);
      }
    }

    const allConflicts: ConflictInfo[] = [];
    for (const apt of appointmentsToCreate) {
      const c = await checkConflicts(apt.scheduledAt, apt.durationMin, apt.label);
      allConflicts.push(...c);
    }

    if (allConflicts.length > 0) {
      const unique = allConflicts.filter(
        (c, i, arr) => arr.findIndex((x) => x.conflicting_appointment_id === c.conflicting_appointment_id) === i
      );
      setConflicts(unique);
      setConflictContext(
        appointmentsToCreate.length > 1
          ? `Foram encontrados conflitos em ${unique.length} horário(s) ao tentar criar ${appointmentsToCreate.length} agendamento(s).`
          : "Não é possível criar este agendamento pois existe conflito de horários."
      );
      setShowConflictDialog(true);
      setSaving(false);
      return;
    }

    const recurrenceGroupId = appointmentsToCreate.length > 1 ? crypto.randomUUID() : undefined;
    const errors: string[] = [];

    for (const apt of appointmentsToCreate) {
      const result = await createSingleAppointment(apt.scheduledAt, apt.durationMin, recurrenceGroupId);
      if (result.error) errors.push(`${apt.label}: ${result.error}`);
    }

    if (errors.length > 0) {
      toast.error(errors.length === 1 ? errors[0] : `Erro em ${errors.length} agendamento(s): ${errors[0]}`);
    } else {
      toast.success(
        appointmentsToCreate.length > 1
          ? `${appointmentsToCreate.length} agendamentos criados com sucesso!`
          : "Agendamento criado!"
      );
      onOpenChange(false);
      onCreated();
    }
    setSaving(false);
  };

  const toggleRecurringDay = (day: number) => {
    setRecurringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              Novo Agendamento
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Patient */}
            <div className="space-y-2">
              <Label>Paciente *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.patientId}
                onChange={(e) => setForm((p) => ({ ...p, patientId: e.target.value }))}
              >
                <option value="">Selecionar paciente</option>
                {patients.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    #{p.record_number} — {p.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Professional + Specialty */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Profissional *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.professionalId}
                  onChange={(e) => setForm((p) => ({ ...p, professionalId: e.target.value }))}
                >
                  <option value="">Selecionar</option>
                  {professionals.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Especialidade *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.specialtyId}
                  onChange={(e) => handleSpecialtyChange(e.target.value)}
                >
                  <option value="">Selecionar</option>
                  {specialtiesList.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Professional availability info */}
            {form.professionalId && availability.length > 0 && (
              <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1 font-medium text-sm text-foreground">
                  <Clock className="h-3.5 w-3.5" /> Disponibilidade do profissional:
                </div>
                {availability.map((a, i) => (
                  <div key={i}>{DAY_NAMES[a.day_of_week]}: {a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</div>
                ))}
              </div>
            )}

            {/* Date, Time, Duration */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário *</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Duração</Label>
                <Select value={form.duration} onValueChange={(v) => setForm((p) => ({ ...p, duration: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Availability warning */}
            {availabilityWarning && (
              <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-700 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{availabilityWarning}</span>
              </div>
            )}

            {/* Dobradinha info */}
            {form.duration.startsWith("2x") && (
              <div className="rounded-md border border-accent bg-accent/10 p-3 text-sm text-muted-foreground">
                <strong>Dobradinha:</strong> Serão criados 2 agendamentos consecutivos de{" "}
                {form.duration.replace("2x", "")} min cada.
                {form.time && (
                  <>
                    {" "}
                    ({form.time} — {formatEndTime(form.time, parseInt(form.duration.replace("2x", "")))} e{" "}
                    {formatEndTime(form.time, parseInt(form.duration.replace("2x", "")))} —{" "}
                    {formatEndTime(form.time, parseInt(form.duration.replace("2x", "")) * 2)})
                  </>
                )}
              </div>
            )}

            {/* Single session checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="singleSession"
                checked={isSingleSession}
                onCheckedChange={(c) => {
                  setIsSingleSession(!!c);
                  if (c) setIsRecurring(false);
                }}
              />
              <Label htmlFor="singleSession" className="cursor-pointer text-sm font-normal">
                Atendimento avulso (sessão única)
              </Label>
            </div>

            {/* Recurring */}
            {!isSingleSession && (
              <div className="space-y-3 rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="recurring"
                    checked={isRecurring}
                    onCheckedChange={(c) => setIsRecurring(!!c)}
                  />
                  <Label htmlFor="recurring" className="cursor-pointer text-sm font-normal flex items-center gap-1">
                    <Repeat className="h-4 w-4" />
                    Repetir este horário em outros dias
                  </Label>
                </div>

                {isRecurring && (
                  <div className="space-y-3 pl-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Dias da semana</Label>
                      <div className="flex flex-wrap gap-2">
                        {WEEKDAYS.map((d) => (
                          <Button
                            key={d.value}
                            type="button"
                            size="sm"
                            variant={recurringDays.includes(d.value) ? "default" : "outline"}
                            className="h-8 w-12 text-xs"
                            onClick={() => toggleRecurringDay(d.value)}
                          >
                            {d.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Repetir até</Label>
                      <Input
                        type="date"
                        value={recurringUntil}
                        onChange={(e) => setRecurringUntil(e.target.value)}
                        min={form.date}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Observações opcionais"
              />
            </div>

            <Button onClick={handleCreate} disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Criar Agendamento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conflict Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Conflito de Horários
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{conflictContext}</p>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {conflicts.map((c) => (
                <div
                  key={c.conflicting_appointment_id}
                  className="rounded-md border p-3 text-sm space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {c.conflict_type === "PROFESSIONAL" ? "🩺 Profissional ocupado" : "👤 Paciente ocupado"}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    <strong>{c.conflict_type === "PROFESSIONAL" ? c.conflicting_patient_name : c.conflicting_professional_name}</strong>
                    {" — "}
                    {format(new Date(c.conflicting_start), "dd/MM HH:mm")} às{" "}
                    {format(new Date(c.conflicting_end), "HH:mm")}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowConflictDialog(false)}
            >
              Voltar e ajustar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

function formatEndTime(time: string, addMinutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m + addMinutes;
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export default NewAppointmentDialog;
