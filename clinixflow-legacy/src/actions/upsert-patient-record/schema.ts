import { z } from "zod";

export const upsertPatientRecordSchema = z.object({
  id: z.number().optional(),
  patientId: z.string().uuid({
    message: "Paciente é obrigatório.",
  }),
  doctorId: z.string().uuid({
    message: "Médico é obrigatório.",
  }),
  appointmentId: z.string().uuid({
    message: "Consulta é obrigatória.",
  }),
  firstConsultation: z.boolean(),
  avaliationContent: z.string().trim().optional(),
  content: z.string().trim().min(1, {
    message: "Relatório é obrigatório.",
  }),
}).superRefine((data, ctx) => {
  // Se for primeira consulta, avaliação é obrigatória
  if (data.firstConsultation && (!data.avaliationContent || data.avaliationContent.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Avaliação é obrigatória para primeira consulta.",
      path: ["avaliationContent"],
    });
  }
});
