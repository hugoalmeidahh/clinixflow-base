import { z } from "zod";

export const approvePaymentSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  plan: z.string().min(1, "Plano é obrigatório"),
  planType: z.enum(["mensal", "trimestral", "semestral", "anual"], {
    errorMap: () => ({ message: "Tipo de plano inválido" }),
  }),
  notes: z.string().optional(),
});
