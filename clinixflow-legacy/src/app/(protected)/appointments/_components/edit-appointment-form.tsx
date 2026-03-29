"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { getAvailableTimes } from "@/src/actions/get-available-times";
import { getDoctorSpecialties } from "@/src/actions/get-doctor-specialties";
import { rescheduleAppointment } from "@/src/actions/reschedule-appointment";
import { updateAppointment } from "@/src/actions/update-appointment";
import { appointmentsTable, doctorsTable } from "@/src/db/schema";
import { utcToLocal } from "@/src/lib/date-utils";

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    doctorId: z.string().min(1, {
      message: t("errorDoctorRequired"),
    }),
    doctorSpecialtyId: z.string().min(1, {
      message: t("errorSpecialtyRequired"),
    }),
    appointmentPrice: z.number().min(1, {
      message: t("errorPriceRequired"),
    }),
    date: z.date({
      message: t("errorDateRequired"),
    }),
    time: z.string().min(1, {
      message: t("errorTimeRequired"),
    }),
    durationInMinutes: z.number().min(30).max(200),
    reposicao: z.boolean().optional(),
    atendimentoAvaliacao: z.boolean().optional(),
    isReschedule: z.boolean().optional(), // Se true, cria novo agendamento e marca original como reagendado
  });

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
  } | null;
  doctor: {
    id: string;
    name: string;
  } | null;
};

interface EditAppointmentFormProps {
  isOpen: boolean;
  appointment: AppointmentWithRelations | null;
  doctors: (typeof doctorsTable.$inferSelect)[];
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditAppointmentForm = ({
  appointment,
  doctors,
  onSuccess,
  isOpen,
  onOpenChange,
}: EditAppointmentFormProps) => {
  const t = useTranslations("appointments");
  const formSchema = createFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorId: "",
      doctorSpecialtyId: "",
      appointmentPrice: 0,
      date: undefined,
      time: "",
      durationInMinutes: 40,
      reposicao: false,
      atendimentoAvaliacao: false,
      isReschedule: false,
    },
  });

  const selectedDoctorId = form.watch("doctorId");
  const selectedDate = form.watch("date");
  const isReschedule = form.watch("isReschedule");

  const { data: availableTimes } = useQuery({
    queryKey: ["available-times", selectedDate, selectedDoctorId],
    queryFn: () =>
      getAvailableTimes({
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        doctorId: selectedDoctorId,
      }),
    enabled: !!selectedDate && !!selectedDoctorId,
  });

  const { data: doctorSpecialties } = useQuery({
    queryKey: ["doctor-specialties", selectedDoctorId],
    queryFn: () => getDoctorSpecialties(selectedDoctorId),
    enabled: !!selectedDoctorId,
  });

  // Preencher formulário quando o agendamento mudar
  useEffect(() => {
    if (appointment && isOpen) {
      const localDate = utcToLocal(appointment.date);
      form.reset({
        doctorId: appointment.doctorId || "",
        doctorSpecialtyId: appointment.doctorSpecialtyId || "",
        appointmentPrice: (appointment.appointmentPriceInCents || 0) / 100,
        date: localDate.toDate(),
        time: localDate.format("HH:mm"),
        durationInMinutes: appointment.durationInMinutes || 40,
        reposicao: appointment.reposicao || false,
        atendimentoAvaliacao: appointment.atendimentoAvaliacao || false,
        isReschedule: false,
      });
    }
  }, [appointment, isOpen, form]);

  // Resetar especialidade quando mudar o profissional (apenas se for diferente do original)
  useEffect(() => {
    if (
      selectedDoctorId &&
      appointment &&
      selectedDoctorId !== appointment.doctorId
    ) {
      form.setValue("doctorSpecialtyId", "");
    }
  }, [selectedDoctorId, appointment, form]);

  // Pré-selecionar primeira especialidade quando especialidades forem carregadas
  // Mas apenas se não houver uma especialidade válida já selecionada
  useEffect(() => {
    if (selectedDoctorId && doctorSpecialties && doctorSpecialties.length > 0) {
      const currentSpecialtyId = form.getValues("doctorSpecialtyId");
      // Só auto-selecionar se não houver valor atual OU se o valor atual não existir nas opções
      const isCurrentValid =
        currentSpecialtyId &&
        doctorSpecialties.some((s) => s.id === currentSpecialtyId);
      if (!isCurrentValid) {
        const firstSpecialty = doctorSpecialties.find(
          (specialty) => specialty.id && specialty.id.trim() !== "",
        );
        if (firstSpecialty?.id) {
          form.setValue("doctorSpecialtyId", firstSpecialty.id);
        }
      }
    }
  }, [selectedDoctorId, doctorSpecialties, form]);

  const updateAppointmentAction = useAction(updateAppointment, {
    onSuccess: () => {
      toast.success("Agendamento atualizado com sucesso.");
      onOpenChange?.(false);
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao atualizar agendamento.");
    },
  });

  const rescheduleAppointmentAction = useAction(rescheduleAppointment, {
    onSuccess: () => {
      toast.success("Agendamento reagendado com sucesso.");
      onOpenChange?.(false);
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao reagendar agendamento.");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!appointment) return;

    if (isReschedule) {
      // Reagendar: criar novo agendamento e marcar original como reagendado
      rescheduleAppointmentAction.execute({
        originalAppointmentId: appointment.id,
        doctorId: values.doctorId,
        doctorSpecialtyId: values.doctorSpecialtyId,
        date: values.date,
        time: values.time,
        appointmentPriceInCents: values.appointmentPrice * 100,
        durationInMinutes: values.durationInMinutes,
        reposicao: values.reposicao ?? false,
        atendimentoAvaliacao: values.atendimentoAvaliacao ?? false,
      });
    } else {
      // Editar: atualizar agendamento existente
      updateAppointmentAction.execute({
        appointmentId: appointment.id,
        doctorId: values.doctorId,
        doctorSpecialtyId: values.doctorSpecialtyId,
        date: values.date,
        time: values.time,
        appointmentPriceInCents: values.appointmentPrice * 100,
        durationInMinutes: values.durationInMinutes,
        reposicao: values.reposicao ?? false,
        atendimentoAvaliacao: values.atendimentoAvaliacao ?? false,
      });
    }
  };

  const selectedSpecialtyId = form.watch("doctorSpecialtyId");
  const isDateTimeEnabled = selectedDoctorId && selectedSpecialtyId;

  if (!appointment) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>
            {isReschedule ? t("rescheduleAppointment") : t("editAppointment")}
          </SheetTitle>
          <SheetDescription>
            {isReschedule
              ? "Criar um novo agendamento e liberar o slot original."
              : "Ajustar horário e informações do agendamento."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <Form {...form}>
          <form id="edit-appointment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-4">
            <div className="text-sm font-medium">
              Paciente: {appointment.patient?.name || "-"}
            </div>

            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissional</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("selectDoctor")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedDoctorId &&
              doctorSpecialties &&
              doctorSpecialties.length > 0 && (
                <FormField
                  control={form.control}
                  name="doctorSpecialtyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("selectSpecialty")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctorSpecialties
                            .filter(
                              (specialty) =>
                                specialty.id && specialty.id.trim() !== "",
                            )
                            .map((specialty) => (
                              <SelectItem
                                key={specialty.id}
                                value={specialty.id}
                              >
                                {specialty.specialty} -{" "}
                                {specialty.classNumberType}{" "}
                                {specialty.classNumberRegister}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            <FormField
              control={form.control}
              name="appointmentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da consulta</FormLabel>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    allowNegative={false}
                    disabled={!selectedDoctorId}
                    customInput={Input}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={!isDateTimeEnabled}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={() => false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!isDateTimeEnabled || !selectedDate}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("selectTime")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimes?.data &&
                      availableTimes.data.length > 0 ? (
                        availableTimes.data.map((time) => (
                          <SelectItem
                            key={time.value}
                            value={time.value}
                            disabled={!time.available}
                          >
                            {time.label} {!time.available && "(Indisponível)"}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-muted-foreground px-2 py-1.5 text-sm">
                          Nenhum horário disponível para este dia
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationInMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração do atendimento</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value || 40)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("selectDuration")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="40">40 minutos</SelectItem>
                      <SelectItem value="50">50 minutos</SelectItem>
                      <SelectItem value="60">60 minutos (2x 30min)</SelectItem>
                      <SelectItem value="80">80 minutos (2x 40min)</SelectItem>
                      <SelectItem value="100">
                        100 minutos (2x 50min)
                      </SelectItem>
                      <SelectItem value="90">90 minutos (3x 30min)</SelectItem>
                      <SelectItem value="120">
                        120 minutos (3x 40min ou 4x 30min)
                      </SelectItem>
                      <SelectItem value="150">
                        150 minutos (3x 50min)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reposicao"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Reposição</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="atendimentoAvaliacao"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>1. Atendimento / Avaliação</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isReschedule"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Reagendar (criar novo e liberar slot original)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

          </form>
        </Form>
        </div>
        <SheetFooter className="border-t px-4 py-3 sm:px-6">
              <Button
                type="submit"
                form="edit-appointment-form"
                className="w-full"
                disabled={
                  updateAppointmentAction.isPending ||
                  rescheduleAppointmentAction.isPending
                }
              >
                {updateAppointmentAction.isPending ||
                rescheduleAppointmentAction.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isReschedule ? t("rescheduling") : t("updating")}
                  </>
                ) : isReschedule ? (
                  t("reschedule")
                ) : (
                  t("saveChanges")
                )}
              </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditAppointmentForm;
