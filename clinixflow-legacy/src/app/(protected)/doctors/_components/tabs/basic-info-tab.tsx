"use client";

import { UseFormReturn } from "react-hook-form";
import { NumericFormat } from "react-number-format";

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type DoctorFormData } from "../types";

interface BasicInfoTabProps {
  form: UseFormReturn<DoctorFormData>;
}

export function BasicInfoTab({
  form,
}: BasicInfoTabProps) {

  return (
    <div className="space-y-6">
      {/* Avatar Upload - Comentado temporariamente */}
      {/* <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24 border-2 border-dashed border-blue-500">
          <AvatarImage src={avatarPreview || undefined} alt="Avatar preview" />
          <AvatarFallback className="text-lg">
            {form.watch("name") ? (
              getUserInitials(form.watch("name"))
            ) : (
              <User className="h-8 w-8" />
            )}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Selecionar Avatar</span>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarSelect}
            className="hidden"
          />

          <p className="text-muted-foreground text-center text-xs">
            PNG, JPG ou WEBP até 5MB
          </p>
        </div>
      </div> */}

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Compensação do Profissional */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Compensação do Profissional</h3>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="compensationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de compensação</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de compensação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor fixo</SelectItem>
                    <SelectItem value="percentage_plus_fixed">Porcentagem + Valor fixo</SelectItem>
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
                  <FormLabel>Porcentagem (%)</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      placeholder="0"
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
                  <FormLabel>Valor fixo por atendimento</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      placeholder="0,00"
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

    </div>
  );
}

