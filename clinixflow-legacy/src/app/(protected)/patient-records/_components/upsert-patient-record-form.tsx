"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { upsertPatientRecord } from "@/src/actions/upsert-patient-record";
import { patientRecordsTable } from "@/src/db/schema";

const formSchema = z.object({
  patientId: z.string().uuid({
    message: "Paciente é obrigatório.",
  }),
  doctorId: z.string().uuid({
    message: "Médico é obrigatório.",
  }),
  appointmentId: z.string().uuid({
    message: "Consulta é obrigatória.",
  }),
  firstConsultation: z.boolean(),
  avaliationContent: z.string().trim().min(1, {
    message: "Avaliação é obrigatória.",
  }),
  content: z.string().trim().min(1, {
    message: "Relatório é obrigatório.",
  }),
});

interface UpsertPatientRecordFormProps {
  isOpen: boolean;
  patientRecord?: typeof patientRecordsTable.$inferSelect;
  onSuccess?: () => void;
}

export function UpsertPatientRecordForm({
  isOpen,
  patientRecord,
  onSuccess,
}: UpsertPatientRecordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: patientRecord?.patientId || "",
      doctorId: patientRecord?.doctorId || "",
      appointmentId: patientRecord?.appointmentId || "",
      firstConsultation: patientRecord?.firstConsultation || false,
      avaliationContent: patientRecord?.avaliationContent || "",
      content: patientRecord?.content || "",
    },
  });

  const { execute, reset } = useAction(upsertPatientRecord, {
    onSuccess: () => {
      toast.success("Prontuário salvo com sucesso!");
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao salvar prontuário");
    },
  });

  const isLoading = useAction(upsertPatientRecord).isPending;

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* TODO: Carregar pacientes da clínica */}
                    <SelectItem value="patient-1">João Silva</SelectItem>
                    <SelectItem value="patient-2">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* TODO: Carregar médicos da clínica */}
                    <SelectItem value="doctor-1">Dr. Carlos</SelectItem>
                    <SelectItem value="doctor-2">Dra. Ana</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consulta</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a consulta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* TODO: Carregar consultas do paciente/médico */}
                    <SelectItem value="appointment-1">Consulta 01/01/2024</SelectItem>
                    <SelectItem value="appointment-2">Consulta 15/01/2024</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstConsultation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Primeira Consulta</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Marque se esta é a primeira consulta do paciente
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="avaliationContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avaliação Médica</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva a avaliação realizada..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relatório Médico</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o relatório completo da consulta..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Prontuário"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 