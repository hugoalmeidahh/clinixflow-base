import { z } from "zod";

export const confirmPaymentSchema = z.object({
  paymentRequestId: z.string().uuid(),
  notes: z.string().optional(),
});

