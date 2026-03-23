"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { upsertPatientRecord } from "@/src/actions/upsert-patient-record";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";
import { maskPatientRecordContent } from "@/src/lib/patient-record-utils";

type Appointment = typeof appointmentsTable.$inferSelect;
type PatientRecord = typeof patientRecordsTable.$inferSelect;

const evolutionSchema = z.object({
  firstConsultation: z.boolean(),
  avaliationContent: z.string().optional(),
  content: z.string().trim().min(1, {
    message: "Evolução é obrigatória.",
  }),
}).superRefine((data, ctx) => {
  // Se for primeira consulta, avaliação é obrigatória
  if (data.firstConsultation && (!data.avaliationContent || !data.avaliationContent.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Avaliação é obrigatória para primeira consulta.",
      path: ["avaliationContent"],
    });
  }
});

interface PatientRecordEvolutionFormProps {
  appointment: Appointment | null;
  patientId: string;
  doctorId?: string; // Opcional para owners
  clinicId: string;
  existingRecord?: PatientRecord | null;
  shouldShowAvaliation?: boolean; // Se deve mostrar o campo de avaliação
  onSuccess?: () => void;
}

export function PatientRecordEvolutionForm({
  appointment,
  patientId,
  doctorId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clinicId: _clinicId,
  existingRecord,
  shouldShowAvaliation = true, // Por padrão, mostrar avaliação
  onSuccess,
}: PatientRecordEvolutionFormProps) {
  const router = useRouter();

  // Aplicar máscara no existingRecord se não for o responsável
  const maskedRecord = existingRecord
    ? maskPatientRecordContent(existingRecord, doctorId)
    : null;

  const form = useForm<z.infer<typeof evolutionSchema>>({
    resolver: zodResolver(evolutionSchema),
    defaultValues: {
      firstConsultation: maskedRecord?.firstConsultation ?? (shouldShowAvaliation ? false : false),
      avaliationContent: maskedRecord?.avaliationContent ?? "",
      content: maskedRecord?.content ?? "",
    },
  });

  const upsertRecordAction = useAction(upsertPatientRecord, {
    onSuccess: () => {
      toast.success("Evolução salva com sucesso!");
      form.reset();
      router.refresh();
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao salvar evolução.");
    },
  });

  const onSubmit = (values: z.infer<typeof evolutionSchema>) => {
    if (!appointment) {
      toast.error("Agendamento não encontrado.");
      return;
    }

    // Usar doctorId do agendamento se não foi fornecido (para owners)
    const finalDoctorId = doctorId || appointment.doctorId;
    
    if (!finalDoctorId) {
      toast.error("Profissional não identificado.");
      return;
    }

    // Verificar se já existe evolução e não pode editar
    if (existingRecord && (!existingRecord.canEdit || !isOwner)) {
      toast.error("Esta evolução não pode ser editada. Solicite autorização da gestão.");
      return;
    }

    // Verificar se está tentando editar conteúdo mascarado
    if (isContentMasked) {
      toast.error("Você não tem permissão para visualizar ou editar esta evolução.");
      return;
    }

    upsertRecordAction.execute({
      id: existingRecord?.id,
      patientId,
      doctorId: finalDoctorId,
      appointmentId: appointment.id,
      firstConsultation: values.firstConsultation,
      avaliationContent: values.firstConsultation ? values.avaliationContent : undefined,
      content: values.content,
    });
  };

  if (!appointment) {
    return null;
  }

  // Verificar se o conteúdo está mascarado (não é o responsável)
  const isContentMasked = maskedRecord?.content === "**********" || maskedRecord?.avaliationContent === "**********";
  
  // Verificar se pode editar (só se for o responsável E tiver permissão E não estiver mascarado)
  const isOwner = existingRecord && doctorId && existingRecord.doctorId === doctorId;
  const canEdit = !existingRecord || (existingRecord.canEdit && isOwner && !isContentMasked);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Evolução do Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {shouldShowAvaliation && (
              <>
                <FormField
                  control={form.control}
                  name="firstConsultation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                          }}
                          disabled={!!existingRecord || !canEdit}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Primeira Consulta (Avaliação)</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Marque se esta é a primeira consulta do paciente com este profissional
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("firstConsultation") && (
                  <FormField
                    control={form.control}
                    name="avaliationContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avaliação Inicial</FormLabel>
                        <FormControl>
                          {isContentMasked || maskedRecord?.avaliationContent === "**********" ? (
                            <div className="min-h-[144px] rounded-md border border-input bg-muted px-3 py-2 text-muted-foreground flex items-center">
                              **********
                            </div>
                          ) : (
                            <Textarea
                              {...field}
                              placeholder="Descreva a avaliação inicial do paciente..."
                              rows={6}
                              disabled={!canEdit}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("firstConsultation") ? "Evolução" : "Evolução do Atendimento"}
                  </FormLabel>
                  <FormControl>
                    {isContentMasked || maskedRecord?.content === "**********" ? (
                      <div className="min-h-[192px] rounded-md border border-input bg-muted px-3 py-2 text-muted-foreground flex items-center">
                        **********
                      </div>
                    ) : (
                      <Textarea
                        {...field}
                        placeholder="Descreva a evolução do atendimento..."
                        rows={8}
                        disabled={!canEdit}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!canEdit && existingRecord && (
              <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                <strong>Atenção:</strong> Esta evolução não pode ser editada. Para editar,
                solicite autorização da gestão.
              </div>
            )}

            {canEdit && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={upsertRecordAction.isPending}
                >
                  Limpar
                </Button>
                <Button type="submit" disabled={upsertRecordAction.isPending}>
                  {upsertRecordAction.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Evolução"
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

