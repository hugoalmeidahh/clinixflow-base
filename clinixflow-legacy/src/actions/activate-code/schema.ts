import { z } from "zod";

export const activateCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(20, "Código muito longo")
    .transform((val) => val.toUpperCase().trim()),
});
