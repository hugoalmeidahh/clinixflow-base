"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentsTabProps {
  form: UseFormReturn<{
    name: string;
    email?: string;
    phoneNumber?: string;
    sex?: "male" | "female";
    birthDate: string;
    motherName?: string;
    fatherName?: string;
    responsibleName?: string;
    responsibleContact?: string;
    susCard?: string;
    susRegion?: string;
    insurancePlan?: string;
    insuranceId?: string;
    insurance?:
      | "unimed"
      | "amil"
      | "sulamerica"
      | "bradesco_saude"
      | "porto_seguro"
      | "allianz"
      | "hapvida"
      | "cassems"
      | "santa_casa_saude"
      | "particular"
      | "outros";
    insuranceCard?: string;
    rg?: string;
    cpf: string;
    zipCode?: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  }>;
}

export function DocumentsTab({ form }: DocumentsTabProps) {
  return (
    <div className="space-y-6">
      {/* Documentos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Documentos</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="###.###.###-##"
                    mask="_"
                    placeholder="000.000.000-00"
                    value={field.value}
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
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG</FormLabel>
                <FormControl>
                  <Input placeholder="00.000.000-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* SUS */}
      {/* TODO: Descomentar após aplicar migration 0021_add_sus_and_insurance_plan_fields.sql */}
      {/* <div className="space-y-4">
        <h3 className="text-lg font-semibold">SUS</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="susCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do CRA</FormLabel>
                <FormControl>
                  <Input placeholder="Número do Cartão Nacional de Saúde" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="susRegion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Região de Atendimento</FormLabel>
                <FormControl>
                  <Input placeholder="Região de atendimento SUS" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div> */}

      {/* Convênio */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Convênio</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="insurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seleciona convênio</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o convênio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="unimed">Unimed</SelectItem>
                    <SelectItem value="amil">Amil</SelectItem>
                    <SelectItem value="sulamerica">SulAmérica</SelectItem>
                    <SelectItem value="bradesco_saude">
                      Bradesco Saúde
                    </SelectItem>
                    <SelectItem value="porto_seguro">Porto Seguro</SelectItem>
                    <SelectItem value="allianz">Allianz</SelectItem>
                    <SelectItem value="hapvida">Hapvida</SelectItem>
                    <SelectItem value="cassems">Cassems</SelectItem>
                    <SelectItem value="santa_casa_saude">
                      Santa Casa Saúde
                    </SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insuranceCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da carteirinha</FormLabel>
                <FormControl>
                  <Input placeholder="Número da carteirinha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insurancePlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do plano" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

