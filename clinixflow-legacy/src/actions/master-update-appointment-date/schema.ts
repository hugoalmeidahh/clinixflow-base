import { z } from "zod";

export const masterUpdateAppointmentDateSchema = z.object({
  appointmentId: z.string().uuid(),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
});
