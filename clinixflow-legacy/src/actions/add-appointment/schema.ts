import { z } from "zod";

export const addAppointmentSchema = z.object({
  patientId: z.string().uuid({
    message: "Paciente é obrigatório.",
  }),
  doctorId: z.string().uuid({
    message: "Médico é obrigatório.",
  }),
  doctorSpecialtyId: z.string().uuid({
    message: "Especialidade é obrigatória.",
  }),
  date: z.date({
    message: "Data é obrigatória.",
  }),
  time: z.string().min(1, {
    message: "Horário é obrigatório.",
  }),
  appointmentPriceInCents: z.number().min(1, {
    message: "Valor da consulta é obrigatório.",
  }),
  durationInMinutes: z.number().min(30).max(200).default(30), // 30min a 200min (máximo 4 sessões), padrão 30min
  reposicao: z.boolean().default(false),
  atendimentoAvaliacao: z.boolean().default(false),
  guideNumber: z.string().optional(),
});