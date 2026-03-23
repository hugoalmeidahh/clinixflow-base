import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { doctorsTable } from "@/src/db/schema";
import { utcTimeToLocal } from "@/src/lib/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  // Verificar se os campos deprecated existem (podem ser null após migration 0020)
  // Se não existirem, usar valores padrão
  const fromWeekDay = doctor.availableFromWeekDay ?? 1; // Segunda-feira padrão
  const toWeekDay = doctor.availableToWeekDay ?? 7; // Domingo padrão
  const fromTime = doctor.availableFromTime ?? "08:00:00"; // 08:00 padrão
  const toTime = doctor.availableToTime ?? "18:00:00"; // 18:00 padrão

  // Converter horários UTC para local
  const localFromTime = utcTimeToLocal(fromTime);
  const localToTime = utcTimeToLocal(toTime);

  const from = dayjs()
    .tz("America/Sao_Paulo") // Usar fuso horário do Brasil
    .day(fromWeekDay)
    .set("hour", Number(localFromTime.split(":")[0]))
    .set("minute", Number(localFromTime.split(":")[1]))
    .set("second", Number(localFromTime.split(":")[2] || 0));

  const to = dayjs()
    .tz("America/Sao_Paulo") // Usar fuso horário do Brasil
    .day(toWeekDay)
    .set("hour", Number(localToTime.split(":")[0]))
    .set("minute", Number(localToTime.split(":")[1]))
    .set("second", Number(localToTime.split(":")[2] || 0));

  return { from, to };
};
