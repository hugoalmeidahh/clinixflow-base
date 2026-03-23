"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
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
import { cn } from "@/lib/utils";
import { doctorsTable, patientsTable } from "@/src/db/schema";

const filterSchema = z.object({
  date: z.date().optional(),
  doctorId: z.string().optional(),
  patientId: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface AppointmentsFiltersProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  onFiltersChange: (filters: FilterFormData) => void;
  initialFilters?: FilterFormData;
  compact?: boolean; // Se true, não mostra o card e o título
  hideDoctorFilter?: boolean; // Se true, não mostra o filtro de médico (para agenda do profissional)
}

const AppointmentsFilters = ({
  patients,
  doctors,
  onFiltersChange,
  initialFilters,
  compact = false,
  hideDoctorFilter = false,
}: AppointmentsFiltersProps) => {
  const t = useTranslations("appointments");
  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialFilters ? {
      ...initialFilters,
      doctorId: initialFilters.doctorId || "all",
      patientId: initialFilters.patientId || "all",
    } : {
      date: undefined,
      doctorId: "all",
      patientId: "all",
    },
  });

  const onSubmit = (data: FilterFormData) => {
    // Converter "all" para string vazia para manter compatibilidade
    const processedData = {
      ...data,
      doctorId: data.doctorId === "all" ? "" : data.doctorId,
      patientId: data.patientId === "all" ? "" : data.patientId,
    };
    onFiltersChange(processedData);
  };

  const handleReset = () => {
    form.reset({
      date: undefined,
      doctorId: "all",
      patientId: "all",
    });
    onFiltersChange({
      date: undefined,
      doctorId: "",
      patientId: "",
    });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!compact && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h3 className="text-sm font-medium">{t("filters")}</h3>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs">{t("date")}</FormLabel>
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
                          <span>{t("selectADate")}</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {!hideDoctorFilter && (
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{t("professional")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("allProfessionals")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">{t("allProfessionals")}</SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t("patient")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("allPatients")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">{t("allPatients")}</SelectItem>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
            {t("applyFilters")}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleReset}>
            {t("clear")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentsFilters; 