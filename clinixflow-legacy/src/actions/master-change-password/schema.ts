import { z } from "zod";

export const masterChangePasswordSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  newPassword: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(100, "A senha deve ter no máximo 100 caracteres"),
});
