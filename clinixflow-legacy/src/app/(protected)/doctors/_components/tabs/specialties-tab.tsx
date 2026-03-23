"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFieldArray,UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSpecialties } from "@/src/actions/get-specialties";

import { type DoctorFormData } from "../types";

interface SpecialtiesTabProps {
  form: UseFormReturn<DoctorFormData>;
  isRequired?: boolean;
}

export function SpecialtiesTab({ form, isRequired = false }: SpecialtiesTabProps) {
  const t = useTranslations("doctors.specialties");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specialties",
  });

  // Buscar especialidades do banco de dados
  const { data: specialties, isLoading: isLoadingSpecialties } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => getSpecialties(true), // Apenas especialidades ativas
  });

  const addSpecialty = () => {
    append({
      specialty: "",
      classNumberType: "",
      classNumberRegister: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{t("title")}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSpecialty}
          className="flex-shrink-0"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("addButton")}</span>
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          <p>{t("noSpecialties")}</p>
          <p className="text-sm">
            {isRequired
              ? t("requiredWarning")
              : t("optionalWarning")}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border p-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end">
              <FormField
                control={form.control}
                name={`specialties.${index}.specialty`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("specialtyLabel")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Preencher automaticamente o conselho ao selecionar a especialidade
                        const selectedSpecialty = specialties?.find(
                          (s) => s.name === value
                        );
                        if (selectedSpecialty?.councilCode) {
                          form.setValue(
                            `specialties.${index}.classNumberType`,
                            selectedSpecialty.councilCode,
                            { shouldValidate: true, shouldDirty: true }
                          );
                        } else {
                          // Limpar o conselho se não houver código associado
                          form.setValue(
                            `specialties.${index}.classNumberType`,
                            "",
                            { shouldValidate: true, shouldDirty: true }
                          );
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("specialtyPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t("title")}</SelectLabel>
                          {isLoadingSpecialties ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              {t("loadingSpecialties")}
                            </div>
                          ) : specialties && specialties.length > 0 ? (
                            specialties.map((specialty) => (
                              <SelectItem
                                key={specialty.id}
                                value={specialty.name}
                              >
                                {specialty.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              {t("noSpecialtiesAvailable")}
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`specialties.${index}.classNumberType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("councilLabel")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("councilPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CRM">CRM</SelectItem>
                        <SelectItem value="CRO">CRO</SelectItem>
                        <SelectItem value="CRF">CRF</SelectItem>
                        <SelectItem value="CRN">CRN</SelectItem>
                        <SelectItem value="CRP">CRP</SelectItem>
                        <SelectItem value="CREFITO">CREFITO</SelectItem>
                        <SelectItem value="CRAS">CRAS</SelectItem>
                        <SelectItem value="CRFa">CRFa</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`specialties.${index}.classNumberRegister`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classNumberLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("classNumberPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-10"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
