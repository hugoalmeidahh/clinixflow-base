import { z } from "zod";

export const updateUserProfileSchema = z.object({
  // Campos básicos
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),

  // Campos de endereço
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),

  // Campos de documentos
  cpf: z.string().trim().optional(),
  rg: z.string().trim().optional(),
  insuranceCard: z.string().trim().optional(),

  // Campos de contato
  phoneNumber: z.string().trim().optional(),
  responsiblePhone: z.string().trim().optional(),

  // Campos de responsáveis
  motherName: z.string().trim().optional(),
  fatherName: z.string().trim().optional(),

  // Campo de convênio
  insurance: z
    .enum([
      "unimed",
      "amil",
      "sulamerica",
      "bradesco_saude",
      "porto_seguro",
      "allianz",
      "hapvida",
      "cassems",
      "santa_casa_saude",
      "particular",
      "outros",
    ])
    .optional(),
});
