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

interface ContactsTabProps {
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

export function ContactsTab({ form }: ContactsTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="exemplo@email.com"
                  {...field}
                />
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
              <FormLabel>Telefone</FormLabel>
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
  );
}

