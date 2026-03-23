"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { patientsTable } from "@/src/db/schema";

const formSchema = z.object({
  guideNumber: z.string().min(1, { message: "Número da guia é obrigatório." }),
  patientId: z.string().min(1, { message: "Paciente é obrigatório." }),
  insuranceProviderId: z.string().optional(),
  totalSessions: z.number().min(1, { message: "Total de sessões deve ser pelo menos 1." }),
  sessionValueInCents: z.number().min(0),
  issueDate: z.date({ required_error: "Data de emissão é obrigatória." }),
  expiryDate: z.date().optional(),
});

interface AddGuideFormProps {
  isOpen: boolean;
  patients: (typeof patientsTable.$inferSelect)[];
  onSuccess?: () => void;
}

export function AddGuideForm({ patients, onSuccess }: AddGuideFormProps) {
  const t = useTranslations("guides");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guideNumber: "",
      patientId: "",
      insuranceProviderId: "",
      totalSessions: 10,
      sessionValueInCents: 0,
      issueDate: new Date(),
      expiryDate: undefined,
    },
  });

  const onSubmit = async () => {
    setIsPending(true);
    try {
      // TODO: implement server action for creating guides
      toast.success("Guia criada com sucesso!");
      onSuccess?.();
    } catch {
      toast.error("Erro ao criar guia.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-xl">
      <SheetHeader>
        <SheetTitle>{t("addGuide")}</SheetTitle>
        <SheetDescription>
          Preencha os dados da guia de autorização.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
          <FormField
            control={form.control}
            name="guideNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("guideNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  <FormLabel>{t("patient")}</FormLabel>
                  <FormControl>
                    <GridSelect
                      options={patientOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Selecione o paciente"
                      searchPlaceholder="Buscar paciente..."
                      emptyMessage="Nenhum paciente encontrado"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="totalSessions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("totalSessions")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionValueInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sessionValue")}</FormLabel>
                <NumericFormat
                  value={field.value / 100}
                  onValueChange={(values) => {
                    field.onChange(Math.round((values.floatValue || 0) * 100));
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  thousandSeparator="."
                  prefix="R$ "
                  allowNegative={false}
                  customInput={Input}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("issueDate")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP", { locale: ptBR })
                          : "Selecione uma data"}
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("expiryDate")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP", { locale: ptBR })
                          : "Selecione uma data"}
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
                <FormMessage />
              </FormItem>
            )}
          />

          <SheetFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                t("addGuide")
              )}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
}
