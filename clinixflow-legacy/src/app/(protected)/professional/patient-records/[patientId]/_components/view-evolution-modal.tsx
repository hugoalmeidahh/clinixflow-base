"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { patientRecordsTable } from "@/src/db/schema";
import { formatLocalDateTime } from "@/src/lib/date-utils";

type PatientRecord = typeof patientRecordsTable.$inferSelect & {
  appointment?: {
    id: string;
    date: Date | string;
  } | null;
  doctor?: {
    id: string;
    name: string;
    specialty?: string | null;
  } | null;
};

interface ViewEvolutionModalProps {
  record: PatientRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewEvolutionModal({
  record,
  open,
  onOpenChange,
}: ViewEvolutionModalProps) {
  if (!record) return null;

  const appointmentDate = record.appointment?.date
    ? formatLocalDateTime(record.appointment.date, "DD/MM/YYYY [às] HH:mm")
    : formatLocalDateTime(record.createdAt, "DD/MM/YYYY [às] HH:mm");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record.firstConsultation ? "Avaliação" : "Evolução"} -{" "}
            {appointmentDate}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {record.doctor && (
            <div className="text-muted-foreground text-sm">
              Profissional: <strong>{record.doctor.name}</strong>
              {record.doctor.specialty && ` - ${record.doctor.specialty}`}
            </div>
          )}

          {record.firstConsultation && record.avaliationContent && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Avaliação Inicial</h4>
              <div className="max-h-[200px] overflow-y-auto rounded-md border p-4">
                <div className="text-sm whitespace-pre-wrap">
                  {record.avaliationContent}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {record.firstConsultation ? "Observações" : "Evolução"}
            </h4>
            <div className="max-h-[300px] overflow-y-auto rounded-md border p-4">
              <div className="text-sm whitespace-pre-wrap">
                {record.content}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
