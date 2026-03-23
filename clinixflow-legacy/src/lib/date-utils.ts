import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

// Timezone padrão do sistema (Brasil)
const DEFAULT_TIMEZONE = "America/Sao_Paulo";

/**
 * Cria uma data/hora no timezone local a partir de uma data (YYYY-MM-DD) e horário (HH:mm:ss)
 * e converte para UTC para salvar no banco
 */
export function createLocalDateTime(dateString: string, timeString: string): Date {
  const [hours, minutes, seconds = "00"] = timeString.split(":");
  
  // Criar data/hora no timezone local (Brasil)
  const localDateTime = dayjs.tz(
    `${dateString} ${hours}:${minutes}:${seconds}`,
    DEFAULT_TIMEZONE
  );
  
  // Converter para UTC antes de salvar no banco
  return localDateTime.utc().toDate();
}

/**
 * Converte uma data UTC do banco para o timezone local para exibição
 */
export function utcToLocal(utcDate: Date | string): dayjs.Dayjs {
  return dayjs(utcDate).utc().tz(DEFAULT_TIMEZONE);
}

/**
 * Formata uma data UTC para exibição no formato local
 */
export function formatLocalDateTime(utcDate: Date | string, format = "DD/MM/YYYY HH:mm"): string {
  return utcToLocal(utcDate).format(format);
}

/**
 * Extrai apenas a data (YYYY-MM-DD) de uma data no timezone local
 * Importante: converte para o timezone local antes de extrair a data
 */
export function extractDateOnly(date: Date | string): string {
  // Se a data vier em UTC, converter para local primeiro
  // Isso garante que pegamos a data correta (ex: 31/12/2025 00:00 local, não 31/12/2025 03:00 UTC)
  const localDate = dayjs(date).utc().tz(DEFAULT_TIMEZONE);
  return localDate.format("YYYY-MM-DD");
}

/**
 * Verifica se uma data está no mesmo dia (ignorando timezone)
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  return extractDateOnly(date1) === extractDateOnly(date2);
}

