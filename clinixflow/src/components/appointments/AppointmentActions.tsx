import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  CheckCircle, XCircle, AlertTriangle, RotateCcw, Ban, Loader2,
  MoreHorizontal, UserCheck, UserX, ShieldAlert, RefreshCw
} from "lucide-react";

type ActionType = "confirm" | "attended" | "absence" | "justified" | "cancel" | "reschedule" | "replacement" | null;

interface AppointmentActionsProps {
  appointment: any;
  onActionComplete: () => void;
  /** "menu" = dropdown with ... button (list view), "popover" = wraps children as clickable trigger */
  mode?: "menu" | "popover";
  children?: React.ReactNode;
}

const AppointmentActions = ({ appointment, onActionComplete, mode = "menu", children }: AppointmentActionsProps) => {
  const { user } = useAuth();
  const [action, setAction] = useState<ActionType>(null);
  const [reason, setReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const status = appointment.status;
  const canConfirm = status === "SCHEDULED";
  const canAttend = status === "SCHEDULED" || status === "CONFIRMED";
  const canAbsence = status === "SCHEDULED" || status === "CONFIRMED";
  const canCancel = status === "SCHEDULED" || status === "CONFIRMED";
  const canReschedule = status === "SCHEDULED" || status === "CONFIRMED";
  const canReplacement = status === "ABSENCE" || status === "JUSTIFIED_ABSENCE" || status === "CANCELLED";

  const handleAction = async () => {
    setLoading(true);
    try {
      if (action === "confirm") {
        await supabase.from("appointments").update({
          status: "CONFIRMED",
          confirmed_at: new Date().toISOString(),
        }).eq("id", appointment.id);
        toast.success("Agendamento confirmado!");
      }

      if (action === "attended") {
        await supabase.from("appointments").update({
          status: "ATTENDED",
          attended_at: new Date().toISOString(),
        }).eq("id", appointment.id);
        await supabase.from("clinical_events").insert({
          tenant_id: appointment.tenant_id,
          patient_id: appointment.patient_id,
          appointment_id: appointment.id,
          event_type: "ATTENDED",
          performed_by: user!.id,
          performed_at: new Date().toISOString(),
          content: "Presença registrada",
        });
        toast.success("Presença registrada!");
      }

      if (action === "absence") {
        await supabase.from("appointments").update({
          status: "ABSENCE",
        }).eq("id", appointment.id);
        await supabase.from("clinical_events").insert({
          tenant_id: appointment.tenant_id,
          patient_id: appointment.patient_id,
          appointment_id: appointment.id,
          event_type: "ABSENCE",
          performed_by: user!.id,
          performed_at: new Date().toISOString(),
          content: "Ausência registrada",
        });
        toast.success("Ausência registrada.");
      }

      if (action === "justified") {
        await supabase.from("appointments").update({
          status: "JUSTIFIED_ABSENCE",
          absence_reason: reason,
          absence_justified: true,
        }).eq("id", appointment.id);
        await supabase.from("clinical_events").insert({
          tenant_id: appointment.tenant_id,
          patient_id: appointment.patient_id,
          appointment_id: appointment.id,
          event_type: "JUSTIFIED_ABSENCE",
          performed_by: user!.id,
          performed_at: new Date().toISOString(),
          content: `Falta justificada: ${reason}`,
        });
        toast.success("Falta justificada registrada.");
      }

      if (action === "cancel") {
        await supabase.from("appointments").update({
          status: "CANCELLED",
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
          cancelled_by: user!.id,
        }).eq("id", appointment.id);
        toast.success("Agendamento cancelado. Horário liberado.");
      }

      if (action === "reschedule") {
        if (!rescheduleDate || !rescheduleTime) {
          toast.error("Informe data e horário.");
          setLoading(false);
          return;
        }
        await supabase.from("appointments").update({
          status: "RESCHEDULED",
        }).eq("id", appointment.id);
        const scheduledAt = new Date(`${rescheduleDate}T${rescheduleTime}`).toISOString();
        await supabase.from("appointments").insert({
          tenant_id: appointment.tenant_id,
          patient_id: appointment.patient_id,
          professional_id: appointment.professional_id,
          specialty_id: appointment.specialty_id,
          scheduled_at: scheduledAt,
          duration_min: appointment.duration_min,
          original_appointment_id: appointment.id,
          code: "",
        });
        toast.success("Agendamento reagendado!");
      }

      if (action === "replacement") {
        if (!rescheduleDate || !rescheduleTime) {
          toast.error("Informe data e horário da reposição.");
          setLoading(false);
          return;
        }
        const scheduledAt = new Date(`${rescheduleDate}T${rescheduleTime}`).toISOString();
        await supabase.from("appointments").insert({
          tenant_id: appointment.tenant_id,
          patient_id: appointment.patient_id,
          professional_id: appointment.professional_id,
          specialty_id: appointment.specialty_id,
          scheduled_at: scheduledAt,
          duration_min: appointment.duration_min,
          original_appointment_id: appointment.id,
          appointment_type: appointment.appointment_type,
          code: "",
          notes: `Reposição do agendamento ${appointment.code}`,
        });
        toast.success("Agendamento de reposição criado!");
      }

      setAction(null);
      setReason("");
      setRescheduleDate("");
      setRescheduleTime("");
      setPopoverOpen(false);
      onActionComplete();
    } catch (err: any) {
      toast.error(err.message || "Erro ao realizar ação.");
    } finally {
      setLoading(false);
    }
  };

  const hasActions = canConfirm || canAttend || canAbsence || canCancel || canReschedule || canReplacement;
  if (!hasActions && mode === "menu") return null;

  const menuItems = (
    <>
      {canConfirm && (
        <DropdownMenuItem onClick={() => { setAction("confirm"); setPopoverOpen(false); }}>
          <CheckCircle className="h-4 w-4 mr-2 text-badge-confirmed" />
          Confirmar Presença
        </DropdownMenuItem>
      )}
      {canAttend && (
        <DropdownMenuItem onClick={() => { setAction("attended"); setPopoverOpen(false); }}>
          <UserCheck className="h-4 w-4 mr-2 text-badge-attended" />
          Compareceu
        </DropdownMenuItem>
      )}
      {canAbsence && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setAction("absence"); setPopoverOpen(false); }}>
            <UserX className="h-4 w-4 mr-2 text-badge-absent" />
            Falta Sem Justificativa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setAction("justified"); setPopoverOpen(false); }}>
            <ShieldAlert className="h-4 w-4 mr-2 text-badge-justified" />
            Falta com Justificativa
          </DropdownMenuItem>
        </>
      )}
      {canReschedule && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setAction("reschedule"); setPopoverOpen(false); }}>
            <RotateCcw className="h-4 w-4 mr-2 text-badge-rescheduled" />
            Reagendar
          </DropdownMenuItem>
        </>
      )}
      {canCancel && (
        <DropdownMenuItem onClick={() => { setAction("cancel"); setPopoverOpen(false); }} className="text-destructive focus:text-destructive">
          <Ban className="h-4 w-4 mr-2" />
          Cancelar
        </DropdownMenuItem>
      )}
      {canReplacement && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setAction("replacement"); setPopoverOpen(false); }}>
            <RefreshCw className="h-4 w-4 mr-2 text-primary" />
            Agendar Reposição
          </DropdownMenuItem>
        </>
      )}
    </>
  );

  return (
    <>
      {mode === "menu" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {menuItems}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            {children}
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1" align="start" side="right">
            <div className="flex flex-col">
              {canConfirm && (
                <button className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left" onClick={() => { setAction("confirm"); setPopoverOpen(false); }}>
                  <CheckCircle className="h-4 w-4 text-badge-confirmed" /> Confirmar Presença
                </button>
              )}
              {canAttend && (
                <button className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left" onClick={() => { setAction("attended"); setPopoverOpen(false); }}>
                  <UserCheck className="h-4 w-4 text-badge-attended" /> Compareceu
                </button>
              )}
              {canAbsence && (
                <>
                  <div className="my-1 h-px bg-border" />
                  <button className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left" onClick={() => { setAction("absence"); setPopoverOpen(false); }}>
                    <UserX className="h-4 w-4 text-badge-absent" /> Falta Sem Justificativa
                  </button>
                  <button className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left" onClick={() => { setAction("justified"); setPopoverOpen(false); }}>
                    <ShieldAlert className="h-4 w-4 text-badge-justified" /> Falta com Justificativa
                  </button>
                </>
              )}
              {canReschedule && (
                <>
                  <div className="my-1 h-px bg-border" />
                  <button className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left" onClick={() => { setAction("reschedule"); setPopoverOpen(false); }}>
                    <RotateCcw className="h-4 w-4 text-badge-rescheduled" /> Reagendar
                  </button>
                </>
              )}
              {canCancel && (
                <button className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left text-destructive" onClick={() => { setAction("cancel"); setPopoverOpen(false); }}>
                  <Ban className="h-4 w-4" /> Cancelar
                </button>
              )}
              {canReplacement && (
                <>
                  <div className="my-1 h-px bg-border" />
                  <button className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left" onClick={() => { setAction("replacement"); setPopoverOpen(false); }}>
                    <RefreshCw className="h-4 w-4 text-primary" /> Agendar Reposição
                  </button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Confirm Dialog */}
      <Dialog open={action === "confirm"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Agendamento</DialogTitle>
            <DialogDescription>Confirmar a presença do paciente para esta consulta?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Voltar</Button>
            <Button onClick={handleAction} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attended Dialog */}
      <Dialog open={action === "attended"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Presença</DialogTitle>
            <DialogDescription>Confirmar que o paciente compareceu à consulta?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Voltar</Button>
            <Button onClick={handleAction} disabled={loading} className="bg-badge-attended hover:bg-badge-attended/90">
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Registrar Presença
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Absence Dialog */}
      <Dialog open={action === "absence"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Ausência</DialogTitle>
            <DialogDescription>Registrar que o paciente não compareceu?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Voltar</Button>
            <Button onClick={handleAction} disabled={loading} variant="destructive">
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Registrar Ausência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Justified Absence Dialog */}
      <Dialog open={action === "justified"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Falta Justificada</DialogTitle>
            <DialogDescription>Informe o motivo da justificativa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Justificativa *</Label>
            <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Motivo da falta justificada" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Voltar</Button>
            <Button onClick={handleAction} disabled={loading || !reason}>
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={action === "cancel"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Cancelar Agendamento</DialogTitle>
            <DialogDescription>Esta ação libera o horário para novos agendamentos. Informe o motivo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Motivo do cancelamento *</Label>
            <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Motivo do cancelamento" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Voltar</Button>
            <Button onClick={handleAction} disabled={loading || !reason} variant="destructive">
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Cancelar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={action === "reschedule"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reagendar Consulta</DialogTitle>
            <DialogDescription>O agendamento original será marcado como reagendado e um novo será criado.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nova data *</Label>
              <Input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Novo horário *</Label>
              <Input type="time" value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Voltar</Button>
            <Button onClick={handleAction} disabled={loading || !rescheduleDate || !rescheduleTime}>
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Reagendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replacement Dialog */}
      <Dialog open={action === "replacement"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Agendar Reposição
            </DialogTitle>
            <DialogDescription>
              Criar um agendamento de reposição para <strong>{appointment.patients?.full_name}</strong> com{" "}
              <strong>{appointment.professionals?.full_name}</strong> ({appointment.duration_min}min).
              O novo agendamento será vinculado ao original ({appointment.code}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data da reposição *</Label>
              <Input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Horário *</Label>
              <Input type="time" value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Voltar</Button>
            <Button onClick={handleAction} disabled={loading || !rescheduleDate || !rescheduleTime}>
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Criar Reposição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentActions;
