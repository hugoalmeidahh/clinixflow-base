import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { format as fnsFormat, parseISO, type Locale } from "date-fns";
import { ptBR } from "date-fns/locale";
import { es } from "date-fns/locale";

const localeMap: Record<string, Locale | undefined> = {
  "pt-BR": ptBR,
  es: es,
  en: undefined,
};

const dateFormats: Record<string, Record<string, string>> = {
  "pt-BR": {
    short: "dd/MM/yyyy",
    long: "EEEE, dd 'de' MMMM 'de' yyyy",
    monthYear: "MMMM 'de' yyyy",
    dayMonth: "dd/MM",
    dayMonthYear: "dd/MM/yyyy",
    dayMonthTime: "dd/MM HH:mm",
    weekdayDayMonth: "EEEE, dd 'de' MMMM",
    datetime: "dd/MM/yyyy HH:mm",
    time: "HH:mm",
    weekRange: "dd/MM",
    weekRangeEnd: "dd/MM/yyyy",
  },
  en: {
    short: "MM/dd/yyyy",
    long: "EEEE, MMMM d, yyyy",
    monthYear: "MMMM yyyy",
    dayMonth: "MM/dd",
    dayMonthYear: "MM/dd/yyyy",
    dayMonthTime: "MM/dd h:mm a",
    weekdayDayMonth: "EEEE, MMMM d",
    datetime: "MM/dd/yyyy h:mm a",
    time: "h:mm a",
    weekRange: "MM/dd",
    weekRangeEnd: "MM/dd/yyyy",
  },
  es: {
    short: "dd/MM/yyyy",
    long: "EEEE, d 'de' MMMM 'de' yyyy",
    monthYear: "MMMM 'de' yyyy",
    dayMonth: "dd/MM",
    dayMonthYear: "dd/MM/yyyy",
    dayMonthTime: "dd/MM HH:mm",
    weekdayDayMonth: "EEEE, d 'de' MMMM",
    datetime: "dd/MM/yyyy HH:mm",
    time: "HH:mm",
    weekRange: "dd/MM",
    weekRangeEnd: "dd/MM/yyyy",
  },
};

type DateFormatType = keyof (typeof dateFormats)["pt-BR"];

export const useDateFormatter = () => {
  const { i18n } = useTranslation();
  const lng = i18n.language || "pt-BR";
  const locale = localeMap[lng] || localeMap["pt-BR"];
  const formats = dateFormats[lng] || dateFormats["pt-BR"];

  const formatDate = useCallback(
    (date: Date | string, type: DateFormatType = "short") => {
      const d = typeof date === "string" ? parseISO(date) : date;
      return fnsFormat(d, formats[type], { locale });
    },
    [lng]
  );

  const formatCustom = useCallback(
    (date: Date | string, pattern: string) => {
      const d = typeof date === "string" ? parseISO(date) : date;
      return fnsFormat(d, pattern, { locale });
    },
    [lng]
  );

  const formatCurrency = useCallback(
    (value: number) => {
      return new Intl.NumberFormat(lng === "pt-BR" ? "pt-BR" : lng === "es" ? "es-ES" : "en-US", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    },
    [lng]
  );

  return { formatDate, formatCustom, formatCurrency, locale, formats, lng };
};
