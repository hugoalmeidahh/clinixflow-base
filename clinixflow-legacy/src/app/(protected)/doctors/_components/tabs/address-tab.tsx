"use client";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { PatternFormat } from "react-number-format";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { type DoctorFormData } from "../types";

interface AddressTabProps {
  form: UseFormReturn<DoctorFormData>;
}

export function AddressTab({ form }: AddressTabProps) {
  const t = useTranslations("doctors.address");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("title")}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("zipCode")}</FormLabel>
              <FormControl>
                <PatternFormat
                  format="#####-###"
                  mask="_"
                  placeholder={t("zipCodePlaceholder")}
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value.value);
                  }}
                  customInput={Input}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Input placeholder={t("addressPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("number")}</FormLabel>
              <FormControl>
                <Input placeholder={t("numberPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("complement")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("complementPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("neighborhood")}</FormLabel>
              <FormControl>
                <Input placeholder={t("neighborhoodPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("city")}</FormLabel>
              <FormControl>
                <Input placeholder={t("cityPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("state")}</FormLabel>
              <FormControl>
                <Input placeholder={t("statePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
