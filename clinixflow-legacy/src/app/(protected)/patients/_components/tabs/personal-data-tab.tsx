"use client";

import { UseFormReturn } from "react-hook-form";
import { PatternFormat } from "react-number-format";

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

interface PersonalDataTabProps {
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
    accompaniantName?: string;
    accompaniantRelationship?: string;
    showResponsible?: boolean;
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

export function PersonalDataTab({ form }: PersonalDataTabProps) {
  const birthDate = form.watch("birthDate");
  const showResponsible = form.watch("showResponsible");
  
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

  // Se for menor de 18, mostrar campos de responsável automaticamente
  const shouldShowResponsible = showResponsible || isUnder18;

  return (
    <div className="space-y-6">
      {/* Dados Pessoais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dados pessoais</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
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
                <FormLabel>Gênero</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
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

      {/* Checkbox para Responsável/Acompanhante */}
      {!isUnder18 && (
        <FormField
          control={form.control}
          name="showResponsible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer" onClick={() => field.onChange(!field.value)}>
                  Informar Responsável / Acompanhante
                </FormLabel>
                <FormDescription>
                  Marque esta opção se deseja cadastrar informações de responsável ou acompanhante.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      )}

      {/* Responsável / Acompanhante */}
      {shouldShowResponsible && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Responsável / Acompanhante</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="accompaniantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome responsável / acompanhante
                    {isUnder18 && <span className="text-destructive"> *</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isUnder18 ? "Nome (obrigatório)" : "Nome do responsável/acompanhante"}
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
                    Parentesco
                    {isUnder18 && <span className="text-destructive"> *</span>}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value && field.value.trim() !== "" ? field.value : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isUnder18 ? "Selecione (obrigatório)" : "Selecione o parentesco"} />
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
            <FormField
              control={form.control}
              name="responsibleContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato</FormLabel>
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
      )}

      {/* Filiação */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Filiação</h3>
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
        </div>
      </div>
    </div>
  );
}
