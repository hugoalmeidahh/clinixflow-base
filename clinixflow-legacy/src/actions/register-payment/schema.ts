import { z } from "zod";

export const registerPaymentSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  plan: z.string().min(1, "Plano é obrigatório"),
  paymentPeriod: z.enum(
    ["diario", "mensal", "trimestral", "semestral", "anual"],
    {
      errorMap: () => ({ message: "Período de pagamento inválido" }),
    },
  ),
  paymentDate: z.string().optional(), // ISO string da data do pagamento
  notes: z.string().optional(),
});
