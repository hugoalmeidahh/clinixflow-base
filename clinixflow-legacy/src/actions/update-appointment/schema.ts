import { z } from "zod";

export const updateAppointmentSchema = z.object({
  appointmentId: z.string().uuid({
    message: "ID do agendamento é obrigatório.",
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
  durationInMinutes: z.number().min(30).max(200).default(30),
  reposicao: z.boolean().default(false),
  atendimentoAvaliacao: z.boolean().default(false),
});
