import { z } from "zod";

export const markPaymentStatusSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  notes: z.string().optional(),
});
