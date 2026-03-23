"use client";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserTimezone } from "@/src/hooks/use-timezone";

import { type DoctorFormData } from "../types";

const getDayLabels = (t: (key: string) => string) => [
  { value: 1, label: t("monday"), short: t("mondayShort") },
  { value: 2, label: t("tuesday"), short: t("tuesdayShort") },
  { value: 3, label: t("wednesday"), short: t("wednesdayShort") },
  { value: 4, label: t("thursday"), short: t("thursdayShort") },
  { value: 5, label: t("friday"), short: t("fridayShort") },
  { value: 6, label: t("saturday"), short: t("saturdayShort") },
  { value: 7, label: t("sunday"), short: t("sundayShort") },
];

interface ProfessionalTabProps {
  form: UseFormReturn<DoctorFormData>;
}

export function ProfessionalTab({ form }: ProfessionalTabProps) {
  const t = useTranslations("doctors.professional");
  const tCommon = useTranslations("doctors");
  const { userTimezone, isDetected } = useUserTimezone();
  const dayLabels = getDayLabels(tCommon);

  return (
    <div className="space-y-6">
      {/* Compensação do Profissional */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("compensationTitle")}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="compensationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("compensationTypeLabel")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("compensationTypePlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">{t("compensationTypes.percentage")}</SelectItem>
                    <SelectItem value="fixed">{t("compensationTypes.fixed")}</SelectItem>
                    <SelectItem value="percentage_plus_fixed">{t("compensationTypes.percentage_plus_fixed")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {(form.watch("compensationType") === "percentage" ||
            form.watch("compensationType") === "percentage_plus_fixed") && (
            <FormField
              control={form.control}
              name="compensationPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("percentageLabel")}</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      placeholder={t("percentagePlaceholder")}
                      decimalScale={0}
                      allowNegative={false}
                      value={field.value ?? ""}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue ?? undefined);
                      }}
                      suffix="%"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(form.watch("compensationType") === "fixed" ||
            form.watch("compensationType") === "percentage_plus_fixed") && (
            <FormField
              control={form.control}
              name="compensationFixedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fixedAmountLabel")}</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      placeholder={t("fixedAmountPlaceholder")}
                      decimalScale={2}
                      fixedDecimalScale
                      decimalSeparator=","
                      thousandSeparator="."
                      prefix="R$ "
                      allowNegative={false}
                      value={field.value ?? ""}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue ?? undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>

      {/* Disponibilidade */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("availabilityTitle")}</h3>
          {isDetected && (
            <div className="text-muted-foreground text-xs">
              {t("timezone", { timezone: userTimezone })}
            </div>
          )}
        </div>
        <FormDescription className="text-sm">
          {t("availabilityDescription")}
        </FormDescription>
        <div className="space-y-2">
          {dayLabels.map((day) => {
            // Encontrar o índice correto no array de disponibilidade baseado no dayOfWeek
            const availabilityArray = form.watch("availability") || [];
            const dayIndex = availabilityArray.findIndex(
              (avail) => avail?.dayOfWeek === day.value
            );
            
            // Se não encontrar, usar o índice baseado no dayOfWeek (dayOfWeek - 1)
            const index = dayIndex >= 0 ? dayIndex : day.value - 1;

            return (
              <FormField
                key={day.value}
                control={form.control}
                name={`availability.${index}.isAvailable`}
                render={({ field }) => {
                  const dayAvailability = form.watch(`availability.${index}`);
                  const isAvailable = field.value === true;

                return (
                  <div className="flex items-center gap-2 sm:gap-4 rounded-lg border p-2 sm:p-4">
                    <FormItem className="flex flex-row items-center space-x-2 sm:space-x-3 space-y-0 flex-shrink-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === true}
                          onCheckedChange={(checked) => {
                            const newValue = checked === true;
                            field.onChange(newValue);
                            // Se desmarcar, limpar horários
                            if (!newValue) {
                              form.setValue(`availability.${index}.startTime`, undefined);
                              form.setValue(`availability.${index}.endTime`, undefined);
                            } else {
                              // Se marcar, definir horários padrão se não existirem
                              if (!dayAvailability?.startTime) {
                                form.setValue(`availability.${index}.startTime`, "08:00");
                              }
                              if (!dayAvailability?.endTime) {
                                form.setValue(`availability.${index}.endTime`, "18:00");
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel 
                        className="font-normal cursor-pointer min-w-[80px] sm:min-w-[120px] text-sm sm:text-base"
                        onClick={(e) => {
                          e.preventDefault();
                          const newValue = !(field.value === true);
                          field.onChange(newValue);
                          if (!newValue) {
                            form.setValue(`availability.${index}.startTime`, undefined);
                            form.setValue(`availability.${index}.endTime`, undefined);
                          } else {
                            if (!dayAvailability?.startTime) {
                              form.setValue(`availability.${index}.startTime`, "08:00");
                            }
                            if (!dayAvailability?.endTime) {
                              form.setValue(`availability.${index}.endTime`, "18:00");
                            }
                          }
                        }}
                      >
                        <span className="hidden sm:inline">{day.label}</span>
                        <span className="sm:hidden">{day.short}</span>
                      </FormLabel>
                    </FormItem>
                    {isAvailable && (
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <span className="text-muted-foreground text-xs sm:text-sm hidden sm:inline">→</span>
                        <FormField
                          control={form.control}
                          name={`availability.${index}.startTime`}
                          render={({ field: timeField }) => (
                            <FormItem className="flex-1 min-w-0">
                              <FormControl>
                                <Input
                                  type="time"
                                  {...timeField}
                                  value={timeField.value || ""}
                                  className="text-xs sm:text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span className="text-muted-foreground text-xs sm:text-sm">-</span>
                        <FormField
                          control={form.control}
                          name={`availability.${index}.endTime`}
                          render={({ field: timeField }) => (
                            <FormItem className="flex-1 min-w-0">
                              <FormControl>
                                <Input
                                  type="time"
                                  {...timeField}
                                  value={timeField.value || ""}
                                  className="text-xs sm:text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              }}
              />
            );
          })}
        </div>
        <FormField
          control={form.control}
          name="availability"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
