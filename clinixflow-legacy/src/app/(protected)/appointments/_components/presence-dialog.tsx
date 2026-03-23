"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { markAppointmentAttendance } from "@/src/actions/mark-appointment-attendance";
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

interface PresenceDialogProps {
  appointment: AppointmentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ATTENDANCE_JUSTIFICATION_OPTIONS = [
  { value: "none", translationKey: "noJustification" },
  { value: "personal", translationKey: "justifiedPersonal" },
  { value: "health", translationKey: "justifiedHealth" },
] as const;

const PresenceDialog = ({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: PresenceDialogProps) => {
  const t = useTranslations("appointments");
  const [showJustificationFields, setShowJustificationFields] = useState(false);
  const [justification, setJustification] = useState<string>("none");
  const [customJustification, setCustomJustification] = useState<string>("");
  const [lastActionType, setLastActionType] = useState<
    "presence" | "absence" | "justified" | null
  >(null);

  const markAttendanceAction = useAction(markAppointmentAttendance, {
    onSuccess: () => {
      // Mostrar toast baseado no tipo de ação
      if (lastActionType === "presence") {
        toast.success(t("presenceConfirmed"));
      } else if (lastActionType === "justified") {
        toast.success(t("justifiedAbsenceRegistered"));
      } else if (lastActionType === "absence") {
        toast.success(t("absenceRegistered"));
      } else {
        toast.success(t("recordUpdated"));
      }

      onOpenChange(false);
      setShowJustificationFields(false);
      setJustification("none");
      setCustomJustification("");
      setLastActionType(null);
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || t("errorRegisteringPresence"));
    },
  });

  const handleMarkAbsence = () => {
    if (!appointment) return;
    // Marca como falta SEM justificativa (vermelho)
    setLastActionType("absence");
    markAttendanceAction.execute({
      appointmentId: appointment.id,
      attended: false,
      attendanceJustification: null,
    });
  };

  const handleShowJustification = () => {
    // Mostra campos de justificativa
    setShowJustificationFields(true);
  };

  const handleJustify = () => {
    if (!appointment) return;

    // Processar justificativa
    let finalJustification: string | null = null;

    if (justification === "personal") {
      finalJustification = t("personalProblems");
    } else if (justification === "health") {
      finalJustification = t("healthProblems");
    } else if (justification === "custom" && customJustification.trim()) {
      finalJustification = customJustification.trim();
    }

    // Se não tem justificativa válida, mostrar erro
    if (!finalJustification) {
      toast.error(t("pleaseSelectJustification"));
      return;
    }

    // Salvar falta COM justificativa (laranja)
    setLastActionType("justified");
    markAttendanceAction.execute({
      appointmentId: appointment.id,
      attended: false,
      attendanceJustification: finalJustification,
    });
  };

  const handleMarkPresence = () => {
    if (!appointment) return;
    // Se compareceu, não precisa de justificativa
    setLastActionType("presence");
    markAttendanceAction.execute({
      appointmentId: appointment.id,
      attended: true,
      attendanceJustification: null,
    });
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("registerPresence")}</DialogTitle>
          <DialogDescription>
            {t.rich("confirmPatientAttendance", {
              patientName: appointment.patient?.name || "",
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">{t("dateAndTime")}:</span>{" "}
                {formatLocalDateTime(appointment.date, "DD/MM/YYYY [às] HH:mm")}
              </div>
              <div>
                <span className="font-medium">{t("professional")}:</span>{" "}
                {appointment.doctor?.name}
              </div>
              <div>
                <span className="font-medium">{t("patient")}:</span>{" "}
                {appointment.patient?.name}
              </div>
            </div>
          </div>

          {showJustificationFields && (
            <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
              <div className="text-sm font-medium text-orange-900 dark:text-orange-100">
                {t("absenceJustification")}
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                {t("provideJustification")}
              </p>
              <Select value={justification} onValueChange={setJustification}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectJustification")} />
                </SelectTrigger>
                <SelectContent>
                  {ATTENDANCE_JUSTIFICATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.translationKey)}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">{t("otherJustification")}</SelectItem>
                </SelectContent>
              </Select>
              {justification === "custom" && (
                <Textarea
                  placeholder={t("describeJustification")}
                  value={customJustification}
                  onChange={(e) => setCustomJustification(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              )}
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setShowJustificationFields(false);
              setJustification("none");
              setCustomJustification("");
            }}
            disabled={markAttendanceAction.isPending}
          >
            {t("cancel")}
          </Button>

          {showJustificationFields ? (
            // Se está mostrando campos de justificativa, mostrar botão para salvar
            <Button
              variant="default"
              onClick={handleJustify}
              disabled={markAttendanceAction.isPending}
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              {markAttendanceAction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  {t("saveJustification")}
                </>
              )}
            </Button>
          ) : (
            // Se não está mostrando justificativa, mostrar botões de ação
            <>
              <Button
                variant="destructive"
                onClick={handleMarkAbsence}
                disabled={markAttendanceAction.isPending}
              >
                {markAttendanceAction.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    {t("absence")}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleShowJustification}
                disabled={markAttendanceAction.isPending}
                className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
              >
                {t("justify")}
              </Button>
              <Button
                onClick={handleMarkPresence}
                disabled={markAttendanceAction.isPending}
                className="bg-yellow-600 text-white hover:bg-yellow-700"
              >
                {markAttendanceAction.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t("attended")}
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PresenceDialog;
