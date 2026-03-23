import { z } from "zod";

export const requestSubscriptionSchema = z.object({
  planName: z.enum(["essential", "professional", "super", "custom", "beta_trial", "beta_partner"]),
  planType: z.enum(["mensal", "semestral", "anual"]),
  paymentMethod: z.enum(["pix", "boleto"]),
});

