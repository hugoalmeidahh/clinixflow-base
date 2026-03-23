"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getPatientRecordByAppointment } from "@/src/actions/get-patient-record-by-appointment";
import { upsertPatientRecord } from "@/src/actions/upsert-patient-record";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";
import { formatLocalDateTime } from "@/src/lib/date-utils";
import { maskPatientRecordContent } from "@/src/lib/patient-record-utils";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient?: {
    id: string;
    name: string;
  } | null;
  doctor?: {
    id: string;
    name: string;
    specialty?: string | null;
  } | null;
};
type PatientRecord = typeof patientRecordsTable.$inferSelect;

const evolutionSchema = z
  .object({
    appointmentId: z.string().min(1, "Agendamento é obrigatório"),
    firstConsultation: z.boolean().optional(),
    avaliationContent: z.string().optional(),
    content: z.string().trim().min(1, {
      message: "Evolução é obrigatória.",
    }),
  })
  .superRefine((data, ctx) => {
    // Se for primeira consulta, avaliação é obrigatória
    if (
      data.firstConsultation &&
      (!data.avaliationContent || !data.avaliationContent.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Avaliação é obrigatória para primeira consulta.",
        path: ["avaliationContent"],
      });
    }
  });

interface EvolutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointments: Appointment[]; // Lista de agendamentos disponíveis (quando aberto da tela de prontuário)
  selectedAppointment?: Appointment | null; // Agendamento pré-selecionado (quando aberto da tela de agendamento)
  lockedAppointment?: boolean; // Se true, não permite alterar o agendamento
  existingRecordId?: string | null; // ID do registro existente para edição
  onSuccess?: () => void;
}

export function EvolutionModal({
  open,
  onOpenChange,
  patientId,
  doctorId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clinicId: _clinicId,
  appointments,
  selectedAppointment,
  lockedAppointment = false,
  existingRecordId,
  onSuccess,
}: EvolutionModalProps) {
  const router = useRouter();
  const [existingRecord, setExistingRecord] = useState<PatientRecord | null>(
    null,
  );
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(selectedAppointment?.id || null);
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);

  const getRecordAction = useAction(getPatientRecordByAppointment, {
    onSuccess: ({ data }) => {
      setExistingRecord(data ?? null);
      setIsLoadingRecord(false);
    },
    onError: () => {
      setExistingRecord(null);
      setIsLoadingRecord(false);
    },
  });

  // Buscar agendamento selecionado
  const currentAppointment = selectedAppointmentId
    ? appointments.find((a) => a.id === selectedAppointmentId) ||
      selectedAppointment
    : selectedAppointment;

  // Detectar se é primeira consulta (atendimentoAvaliacao no agendamento)
  const isFirstConsultationAppointment =
    currentAppointment?.atendimentoAvaliacao === true;

  const form = useForm<z.infer<typeof evolutionSchema>>({
    resolver: zodResolver(evolutionSchema),
    defaultValues: {
      appointmentId: selectedAppointment?.id || "",
      firstConsultation: false,
      avaliationContent: "",
      content: "",
    },
  });

  // Carregar registro existente quando o agendamento muda ou quando o modal abre
  useEffect(() => {
    if (open && selectedAppointmentId) {
      setIsLoadingRecord(true);
      getRecordAction.execute({ appointmentId: selectedAppointmentId });
    } else if (open && existingRecordId) {
      setIsLoadingRecord(true);
      // TODO: buscar por ID se necessário
      setIsLoadingRecord(false);
    } else {
      setExistingRecord(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedAppointmentId, existingRecordId]);

  // Atualizar formulário quando o registro existente é carregado
  useEffect(() => {
    if (existingRecord) {
      const maskedRecord = maskPatientRecordContent(existingRecord, doctorId);
      form.reset({
        appointmentId:
          existingRecord.appointmentId || selectedAppointmentId || "",
        firstConsultation: maskedRecord?.firstConsultation ?? false,
        avaliationContent: maskedRecord?.avaliationContent ?? "",
        content: maskedRecord?.content ?? "",
      });
    } else if (currentAppointment) {
      form.reset({
        appointmentId: currentAppointment.id,
        firstConsultation: isFirstConsultationAppointment,
        avaliationContent: "",
        content: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingRecord, currentAppointment]);

  // Atualizar selectedAppointmentId quando selectedAppointment muda
  useEffect(() => {
    if (selectedAppointment?.id) {
      setSelectedAppointmentId(selectedAppointment.id);
      form.setValue("appointmentId", selectedAppointment.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppointment]);

  const upsertRecordAction = useAction(upsertPatientRecord, {
    onSuccess: () => {
      toast.success("Evolução salva com sucesso!");
      form.reset();
      setExistingRecord(null);
      onOpenChange(false);
      router.refresh();
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao salvar evolução.");
    },
  });

  const onSubmit = (values: z.infer<typeof evolutionSchema>) => {
    const appointment =
      appointments.find((a) => a.id === values.appointmentId) ||
      currentAppointment;

    if (!appointment) {
      toast.error("Agendamento não encontrado.");
      return;
    }

    // Verificar se o conteúdo está mascarado
    const maskedRecord = existingRecord
      ? maskPatientRecordContent(existingRecord, doctorId)
      : null;
    const isContentMasked =
      maskedRecord?.content === "**********" ||
      maskedRecord?.avaliationContent === "**********";

    if (isContentMasked) {
      toast.error(
        "Você não tem permissão para visualizar ou editar esta evolução.",
      );
      return;
    }

    // Verificar se pode editar
    const isOwner = existingRecord && existingRecord.doctorId === doctorId;
    const canEdit =
      !existingRecord ||
      (existingRecord.canEdit && isOwner && !isContentMasked);

    if (!canEdit && existingRecord) {
      toast.error(
        "Esta evolução não pode ser editada. Solicite autorização da gestão.",
      );
      return;
    }

    upsertRecordAction.execute({
      id: existingRecord?.id,
      patientId,
      doctorId,
      appointmentId: appointment.id,
      firstConsultation: values.firstConsultation ?? false,
      avaliationContent: values.firstConsultation
        ? values.avaliationContent
        : undefined,
      content: values.content,
    });
  };

  // Filtrar apenas agendamentos com presença confirmada e sem evolução
  const availableAppointments = appointments.filter((apt) => {
    return apt.attended === true;
  });

  const maskedRecord = existingRecord
    ? maskPatientRecordContent(existingRecord, doctorId)
    : null;
  const isContentMasked =
    maskedRecord?.content === "**********" ||
    maskedRecord?.avaliationContent === "**********";
  const isOwner = existingRecord && existingRecord.doctorId === doctorId;
  const canEdit =
    !existingRecord || (existingRecord.canEdit && isOwner && !isContentMasked);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-lg"
      >
        <SheetHeader className="border-b px-4 py-4 sm:px-6">
          <SheetTitle>
            {existingRecord ? "Editar Evolução" : "Nova Evolução"}
          </SheetTitle>
          <SheetDescription>
            {existingRecord
              ? "Edite as informações da evolução do atendimento"
              : "Preencha a evolução do atendimento realizado"}
          </SheetDescription>
        </SheetHeader>

        {isLoadingRecord ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form
              id="evolution-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
                {/* Seleção de agendamento (apenas se não estiver travado) */}
                {!lockedAppointment && availableAppointments.length > 0 && (
                  <FormField
                    control={form.control}
                    name="appointmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agendamento</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedAppointmentId(value);
                            setIsLoadingRecord(true);
                            getRecordAction.execute({ appointmentId: value });
                          }}
                          value={field.value}
                          disabled={!!existingRecord}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um agendamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableAppointments.map((apt) => (
                              <SelectItem key={apt.id} value={apt.id}>
                                {new Date(apt.date).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}{" "}
                                - {apt.doctor?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Informações do agendamento selecionado */}
                {currentAppointment && (
                  <div className="bg-muted/50 rounded-lg border p-3 sm:p-4">
                    <div className="space-y-1.5 text-sm">
                      <div>
                        <span className="text-muted-foreground">Data/Hora:</span>{" "}
                        <span className="font-medium">
                          {formatLocalDateTime(
                            currentAppointment.date,
                            "DD/MM/YYYY [às] HH:mm",
                          )}
                        </span>
                      </div>
                      {currentAppointment.doctor && (
                        <div>
                          <span className="text-muted-foreground">Profissional:</span>{" "}
                          <span className="font-medium">
                            {currentAppointment.doctor.name}
                          </span>
                        </div>
                      )}
                      {currentAppointment.doctor?.specialty && (
                        <div>
                          <span className="text-muted-foreground">Especialidade:</span>{" "}
                          <span className="font-medium">
                            {currentAppointment.doctor.specialty}
                          </span>
                        </div>
                      )}
                      {currentAppointment.patient && (
                        <div>
                          <span className="text-muted-foreground">Paciente:</span>{" "}
                          <span className="font-medium">
                            {currentAppointment.patient.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Primeira consulta - só mostra se o agendamento é de avaliação */}
                {isFirstConsultationAppointment && (
                  <FormField
                    control={form.control}
                    name="firstConsultation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-y-0 space-x-3 rounded-md border p-3 sm:p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value ?? false}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                            }}
                            disabled={!!existingRecord || !canEdit}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Primeira Consulta (Avaliação)</FormLabel>
                          <p className="text-muted-foreground text-xs">
                            Marque se esta é a primeira consulta do paciente com
                            este profissional
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {/* Avaliação (se primeira consulta) */}
                {form.watch("firstConsultation") && (
                  <FormField
                    control={form.control}
                    name="avaliationContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avaliação Inicial</FormLabel>
                        <FormControl>
                          {isContentMasked ? (
                            <div className="border-input bg-muted text-muted-foreground flex min-h-[120px] items-center rounded-md border px-3 py-2">
                              **********
                            </div>
                          ) : (
                            <Textarea
                              {...field}
                              placeholder="Descreva a avaliação inicial do paciente..."
                              rows={5}
                              disabled={!canEdit}
                              className="resize-none"
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Evolução */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("firstConsultation")
                          ? "Evolução"
                          : "Evolução do Atendimento"}
                      </FormLabel>
                      <FormControl>
                        {isContentMasked ? (
                          <div className="border-input bg-muted text-muted-foreground flex min-h-[160px] items-center rounded-md border px-3 py-2">
                            **********
                          </div>
                        ) : (
                          <Textarea
                            {...field}
                            placeholder="Descreva a evolução do atendimento..."
                            rows={7}
                            disabled={!canEdit}
                            className="resize-none"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!canEdit && existingRecord && (
                  <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-3 text-sm text-yellow-800 sm:p-4 dark:bg-yellow-950 dark:text-yellow-200">
                    <strong>Atenção:</strong> Esta evolução não pode ser editada.
                    Para editar, solicite autorização da gestão.
                  </div>
                )}
              </div>

              <SheetFooter className="border-t px-4 py-3 sm:px-6">
                <div className="flex w-full gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={upsertRecordAction.isPending}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  {canEdit && (
                    <Button
                      type="submit"
                      form="evolution-form"
                      disabled={upsertRecordAction.isPending}
                      className="flex-1"
                    >
                      {upsertRecordAction.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Evolução"
                      )}
                    </Button>
                  )}
                </div>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
