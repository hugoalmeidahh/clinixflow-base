"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { confirmAppointment } from "@/src/actions/confirm-appointment";
import { appointmentsTable } from "@/src/db/schema";
import { formatLocalDateTime } from "@/src/lib/date-utils";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    sex?: "male" | "female";
  } | null;
  doctor: {
    id: string;
    name: string;
    specialty?: string | null;
  } | null;
};

interface ConfirmationDialogProps {
  appointment: AppointmentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ConfirmationDialog = ({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: ConfirmationDialogProps) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  const confirmAppointmentAction = useAction(confirmAppointment, {
    onSuccess: () => {
      toast.success("Confirmação de comparecimento atualizada com sucesso!");
      onOpenChange(false);
      setConfirmed(null);
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao confirmar comparecimento.");
    },
  });

  const handleConfirm = (willAttend: boolean) => {
    if (!appointment) return;
    setConfirmed(willAttend);
    confirmAppointmentAction.execute({
      appointmentId: appointment.id,
      confirmed: willAttend,
    });
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Comparecimento</DialogTitle>
          <DialogDescription>
            O paciente <strong>{appointment.patient?.name}</strong> vai comparecer ao
            atendimento?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Data e Hora:</span>{" "}
                {formatLocalDateTime(appointment.date, "DD/MM/YYYY [às] HH:mm")}
              </div>
              <div>
                <span className="font-medium">Profissional:</span>{" "}
                {appointment.doctor?.name}
              </div>
              <div>
                <span className="font-medium">Paciente:</span>{" "}
                {appointment.patient?.name}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={confirmAppointmentAction.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleConfirm(false)}
            disabled={confirmAppointmentAction.isPending || confirmed === false}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Não vai comparecer
          </Button>
          <Button
            onClick={() => handleConfirm(true)}
            disabled={confirmAppointmentAction.isPending || confirmed === true}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Vai comparecer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;

