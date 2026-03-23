import { z } from "zod";

export const updateOwnerAccessSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  plan: z.string().min(1, "Plano é obrigatório"),
  days: z.number().int().min(1, "Dias deve ser maior que 0"),
  notes: z.string().optional(),
});
