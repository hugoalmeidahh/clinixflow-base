"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon, Loader2, Repeat } from "lucide-react";
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
import { GridSelect, GridSelectOption } from "@/components/ui/grid-select";
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
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { addAppointment } from "@/src/actions/add-appointment";
import { addMultipleAppointments } from "@/src/actions/add-multiple-appointments";
import { getAvailableTimes } from "@/src/actions/get-available-times";
import { getDoctorSpecialties } from "@/src/actions/get-doctor-specialties";
import { doctorsTable, patientsTable } from "@/src/db/schema";

const createFormSchema = (t: (key: string) => string) =>
  z
    .object({
      patientId: z.string().min(1, {
        message: t("errorPatientRequired"),
      }),
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
      repeatAppointment: z.boolean().optional(),
      repeatDaysOfWeek: z.array(z.number()).optional(),
      repeatUntilDate: z.date().optional(),
      reposicao: z.boolean().optional(),
      atendimentoAvaliacao: z.boolean().optional(),
      guideNumber: z.string().optional(),
    })
    .refine(
      (data) => {
        // Se repeatAppointment for true, repeatDaysOfWeek e repeatUntilDate são obrigatórios
        if (data.repeatAppointment) {
          return (
            data.repeatDaysOfWeek &&
            data.repeatDaysOfWeek.length > 0 &&
            data.repeatUntilDate
          );
        }
        return true;
      },
      {
        message: t("repeatDescription"),
        path: ["repeatDaysOfWeek"],
      },
    );

interface AddAppointmentFormProps {
  isOpen: boolean;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  onSuccess?: () => void;
  initialDate?: Date;
  initialTime?: string;
}

const AddAppointmentForm = ({
  patients,
  doctors,
  onSuccess,
  isOpen,
  initialDate,
  initialTime,
}: AddAppointmentFormProps) => {
  const t = useTranslations("appointments");
  const formSchema = createFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      doctorSpecialtyId: "",
      appointmentPrice: 0,
      date: initialDate,
      time: initialTime || "",
      durationInMinutes: 40,
      repeatAppointment: false,
      repeatDaysOfWeek: [],
      repeatUntilDate: undefined,
      reposicao: false,
      atendimentoAvaliacao: false,
      guideNumber: "",
    },
  });

  const selectedDoctorId = form.watch("doctorId");
  const selectedPatientId = form.watch("patientId");
  const selectedDate = form.watch("date");

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

  // O preço da consulta agora é definido manualmente ou via preços de convênio
  // Não há mais preço padrão do profissional

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        doctorSpecialtyId: "",
        appointmentPrice: 0,
        date: initialDate,
        time: initialTime || "",
        durationInMinutes: 40,
        repeatAppointment: false,
        repeatDaysOfWeek: [],
        repeatUntilDate: undefined,
        reposicao: false,
        atendimentoAvaliacao: false,
        guideNumber: "",
      });
    }
  }, [isOpen, form, initialDate, initialTime]);

  // Resetar especialidade quando mudar o profissional
  useEffect(() => {
    if (selectedDoctorId) {
      form.setValue("doctorSpecialtyId", "");
    }
  }, [selectedDoctorId, form]);

  // Pré-selecionar primeira especialidade quando especialidades forem carregadas
  useEffect(() => {
    if (selectedDoctorId && doctorSpecialties && doctorSpecialties.length > 0) {
      const currentSpecialtyId = form.getValues("doctorSpecialtyId");
      // Se não há especialidade selecionada ou a selecionada não existe mais na lista
      if (
        !currentSpecialtyId ||
        !doctorSpecialties.some((s) => s.id === currentSpecialtyId)
      ) {
        const firstSpecialty = doctorSpecialties.find(
          (specialty) => specialty.id && specialty.id.trim() !== "",
        );
        if (firstSpecialty?.id) {
          form.setValue("doctorSpecialtyId", firstSpecialty.id);
        }
      }
    }
  }, [selectedDoctorId, doctorSpecialties, form]);

  const createAppointmentAction = useAction(addAppointment, {
    onSuccess: () => {
      toast.success(t("successCreated"));
      onSuccess?.();
    },
    onError: () => {
      toast.error(t("errorCreating"));
    },
  });

  const createMultipleAppointmentsAction = useAction(addMultipleAppointments, {
    onSuccess: ({ data }) => {
      if (data?.createdCount) {
        toast.success(
          `${data.createdCount} agendamento(s) criado(s) com sucesso.`,
        );
        if (data.errors && data.errors.length > 0) {
          toast.warning(
            `${data.errors.length} agendamento(s) não puderam ser criados.`,
          );
        }
        onSuccess?.();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || t("errorCreatingMultiple"));
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (
      values.repeatAppointment &&
      values.repeatDaysOfWeek &&
      values.repeatDaysOfWeek.length > 0 &&
      values.repeatUntilDate
    ) {
      // Criar múltiplos agendamentos
      const appointmentsToCreate = [];
      const startDate = dayjs(values.date);
      const endDate = dayjs(values.repeatUntilDate);

      // Incluir o dia inicial se estiver nos dias selecionados
      const startDayOfWeek = startDate.day() === 0 ? 7 : startDate.day();
      if (values.repeatDaysOfWeek.includes(startDayOfWeek)) {
        appointmentsToCreate.push({
          patientId: values.patientId,
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

      // Gerar datas para os próximos dias até a data final
      let currentDate = startDate.add(1, "day");
      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, "day")
      ) {
        const dayOfWeek = currentDate.day() === 0 ? 7 : currentDate.day();
        if (values.repeatDaysOfWeek.includes(dayOfWeek)) {
          appointmentsToCreate.push({
            patientId: values.patientId,
            doctorId: values.doctorId,
            doctorSpecialtyId: values.doctorSpecialtyId,
            date: currentDate.toDate(),
            time: values.time,
            appointmentPriceInCents: values.appointmentPrice * 100,
            durationInMinutes: values.durationInMinutes,
            reposicao: values.reposicao ?? false,
            atendimentoAvaliacao: values.atendimentoAvaliacao ?? false,
          });
        }
        currentDate = currentDate.add(1, "day");
      }

      // Criar múltiplos agendamentos de uma vez
      createMultipleAppointmentsAction.execute({
        appointments: appointmentsToCreate,
      });
    } else {
      // Criar agendamento único
      createAppointmentAction.execute({
        ...values,
        appointmentPriceInCents: values.appointmentPrice * 100,
        doctorSpecialtyId: values.doctorSpecialtyId,
        reposicao: values.reposicao ?? false,
        atendimentoAvaliacao: values.atendimentoAvaliacao ?? false,
        guideNumber: values.guideNumber || undefined,
      });
    }
  };

  const selectedSpecialtyId = form.watch("doctorSpecialtyId");
  const repeatAppointment = form.watch("repeatAppointment");
  const isDateTimeEnabled =
    selectedPatientId && selectedDoctorId && selectedSpecialtyId;

  // Dias da semana (1=Segunda, 2=Terça, ..., 7=Domingo)
  const weekDays = [
    { value: 1, label: t("monday") },
    { value: 2, label: t("tuesday") },
    { value: 3, label: t("wednesday") },
    { value: 4, label: t("thursday") },
    { value: 5, label: t("friday") },
    { value: 6, label: t("saturday") },
    { value: 7, label: t("sunday") },
  ];

  return (
    <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
      <SheetHeader>
        <SheetTitle>Novo agendamento</SheetTitle>
        <SheetDescription>
          Crie um novo agendamento para sua clínica.
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <Form {...form}>
          <form
            id="appointment-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pb-4"
          >
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => {
                const patientOptions: GridSelectOption<
                  typeof patientsTable.$inferSelect
                >[] = patients.map((patient) => ({
                  value: patient.id,
                  label: patient.name,
                  data: patient,
                }));

                return (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <FormControl>
                      <GridSelect
                        options={patientOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("selectPatient")}
                        searchPlaceholder={t("searchPatientPlaceholder")}
                        emptyMessage={t("noPatientFound")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => {
                const doctorOptions: GridSelectOption<
                  typeof doctorsTable.$inferSelect
                >[] = doctors.map((doctor) => ({
                  value: doctor.id,
                  label: doctor.name,
                  data: doctor,
                }));

                return (
                  <FormItem>
                    <FormLabel>Profissional</FormLabel>
                    <FormControl>
                      <GridSelect
                        options={doctorOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("selectDoctor")}
                        searchPlaceholder={t("searchDoctorPlaceholder")}
                        emptyMessage={t("noDoctorFound")}
                        getDisplayValue={(value) => {
                          const doctor = doctors.find((d) => d.id === value);
                          return doctor ? doctor.name : "";
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
                        disabled={(date) => {
                          // Permitir o dia atual e futuros
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const selectedDate = new Date(date);
                          selectedDate.setHours(0, 0, 0, 0);
                          // Desabilitar apenas datas passadas (antes de hoje)
                          // A validação de disponibilidade será feita ao buscar horários
                          return selectedDate < today;
                        }}
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
                    defaultValue={field.value}
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
                    defaultValue={String(field.value || 40)}
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
              name="guideNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Guia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 123456789"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repeatAppointment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      <Repeat className="h-4 w-4" />
                      Repetir agendamento
                    </FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Repetir este horário em outros dias da semana até uma data
                      específica
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {repeatAppointment && (
              <>
                <FormField
                  control={form.control}
                  name="repeatDaysOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dias da semana</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {weekDays.map((day) => (
                          <div
                            key={day.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`day-${day.value}`}
                              checked={field.value?.includes(day.value)}
                              onCheckedChange={(checked) => {
                                const currentDays = field.value || [];
                                if (checked) {
                                  field.onChange([...currentDays, day.value]);
                                } else {
                                  field.onChange(
                                    currentDays.filter((d) => d !== day.value),
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={`day-${day.value}`}
                              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {day.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repeatUntilDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Repetir até</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione a data final</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const dateToCheck = new Date(date);
                              dateToCheck.setHours(0, 0, 0, 0);
                              // Desabilitar datas passadas ou antes da data inicial do agendamento
                              if (selectedDate) {
                                const appointmentStartDate = new Date(
                                  selectedDate,
                                );
                                appointmentStartDate.setHours(0, 0, 0, 0);
                                return (
                                  dateToCheck < today ||
                                  dateToCheck < appointmentStartDate
                                );
                              }
                              return dateToCheck < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </form>
        </Form>
      </div>
      <SheetFooter className="border-t px-4 py-3 sm:px-6">
        <Button
          type="submit"
          form="appointment-form"
          className="w-full"
          disabled={
            createAppointmentAction.isPending ||
            createMultipleAppointmentsAction.isPending
          }
        >
          {createAppointmentAction.isPending ||
          createMultipleAppointmentsAction.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            t("createAppointment")
          )}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default AddAppointmentForm;
