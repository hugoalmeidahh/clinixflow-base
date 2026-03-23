import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

// Função para detectar o fuso horário do usuário
export const getUserTimezone = (): string => {
  if (typeof window !== "undefined") {
    // Tentar pegar do localStorage primeiro
    const savedTimezone = localStorage.getItem("userTimezone");
    if (savedTimezone) {
      return savedTimezone;
    }

    // Se não tiver salvo, detectar
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.warn("Erro ao detectar fuso horário:", error);
    }
  }
  // Fallback para servidor - usar fuso horário do Brasil
  return "America/Sao_Paulo";
};

// Função para converter horário local para UTC
export const localTimeToUTC = (time: string): string => {
  const userTimezone = getUserTimezone();

  // Criar uma data com o horário local
  const [hours, minutes, seconds = "00"] = time.split(":");
  const localDate = dayjs()
    .tz(userTimezone)
    .set("hour", parseInt(hours))
    .set("minute", parseInt(minutes))
    .set("second", parseInt(seconds));

  // Converter para UTC
  const utcDate = localDate.utc();

  return utcDate.format("HH:mm:ss");
};

// Função para converter horário UTC para local
export const utcTimeToLocal = (time: string | null | undefined): string => {
  if (!time) {
    // Se não houver horário, retornar horário padrão
    return "08:00:00";
  }

  const userTimezone = getUserTimezone();

  // Criar uma data UTC
  const [hours, minutes, seconds = "00"] = time.split(":");
  const utcDate = dayjs
    .utc()
    .set("hour", parseInt(hours))
    .set("minute", parseInt(minutes))
    .set("second", parseInt(seconds));

  // Converter para fuso horário local
  const localDate = utcDate.tz(userTimezone);

  return localDate.format("HH:mm:ss");
};

// Função para formatar horário para exibição
export const formatTimeForDisplay = (time: string): string => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

// Função para validar formato de horário
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return timeRegex.test(time);
};
