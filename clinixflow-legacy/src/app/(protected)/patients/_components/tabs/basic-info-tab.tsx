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

interface BasicInfoTabProps {
  form: UseFormReturn<{
    name: string;
    email: string;
    phoneNumber: string;
    sex: "male" | "female";
    birthDate: string;
    motherName: string;
    fatherName: string;
    responsibleName: string;
    responsibleContact: string;
    accompaniantName?: string;
    accompaniantRelationship?: string;
    insurance:
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
    insuranceCard: string;
    rg: string;
    cpf: string;
    zipCode: string;
    address: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  }>;
}

export function BasicInfoTab({ form }: BasicInfoTabProps) {
  const birthDate = form.watch("birthDate");
  
  // Calcular se paciente é menor de 18 anos
  let isUnder18 = false;
  if (birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    isUnder18 = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
  }

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Básicas</h3>
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
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Informações dos Responsáveis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Responsáveis</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="motherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Mãe</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo da mãe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Pai</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo do pai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsibleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Responsável</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do responsável legal"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsibleContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato do Responsável</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    mask="_"
                    placeholder="(11) 99999-9999"
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
        </div>
      </div>

      {/* Informações do Acompanhante */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Acompanhante</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="accompaniantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nome do Acompanhante
                  {isUnder18 && <span className="text-destructive"> *</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={isUnder18 ? "Nome do acompanhante (obrigatório)" : "Nome do acompanhante (opcional)"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accompaniantRelationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Grau de Parentesco
                  {isUnder18 && <span className="text-destructive"> *</span>}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value && field.value.trim() !== "" ? field.value : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isUnder18 ? "Selecione o grau de parentesco (obrigatório)" : "Selecione o grau de parentesco"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Mãe">Mãe</SelectItem>
                    <SelectItem value="Pai">Pai</SelectItem>
                    <SelectItem value="Avó">Avó</SelectItem>
                    <SelectItem value="Avô">Avô</SelectItem>
                    <SelectItem value="Tia">Tia</SelectItem>
                    <SelectItem value="Tio">Tio</SelectItem>
                    <SelectItem value="Irmã">Irmã</SelectItem>
                    <SelectItem value="Irmão">Irmão</SelectItem>
                    <SelectItem value="Cuidador(a)">Cuidador(a)</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

