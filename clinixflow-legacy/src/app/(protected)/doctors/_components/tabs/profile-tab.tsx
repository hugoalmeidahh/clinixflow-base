"use client";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
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

import { type DoctorFormData } from "../types";

interface ProfileTabProps {
  form: UseFormReturn<DoctorFormData>;
}

export function ProfileTab({ form }: ProfileTabProps) {
  const t = useTranslations("doctors.profile");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("title")}</h3>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("label")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="clinic_admin">
                    {t("roles.clinic_admin")}
                  </SelectItem>
                  <SelectItem value="clinic_gestor">
                    {t("roles.clinic_gestor")}
                  </SelectItem>
                  <SelectItem value="clinic_recepcionist">
                    {t("roles.clinic_recepcionist")}
                  </SelectItem>
                  <SelectItem value="doctor">
                    {t("roles.doctor")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t("description")}
                {form.watch("role") === "doctor" && (
                  <span className="block mt-1 text-amber-600 dark:text-amber-400">
                    {t("doctorWarning")}
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
