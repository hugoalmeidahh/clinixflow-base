import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "pt-BR": { translation: ptBR },
      en: { translation: en },
      es: { translation: es },
    },
    lng: undefined,
    fallbackLng: "pt-BR",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
      convertDetectedLanguage: (lng: string) => {
        if (["pt-BR", "pt", "en", "es"].includes(lng)) {
          return lng.startsWith("pt") ? "pt-BR" : lng;
        }
        return "pt-BR";
      },
    },
  });

export default i18n;

export const supportedLanguages = [
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export const getDateLocale = (lng: string) => {
  switch (lng) {
    case "en": return undefined; // date-fns default
    case "es": return import("date-fns/locale/es").then(m => m.es);
    default: return import("date-fns/locale/pt-BR").then(m => m.ptBR);
  }
};

export const getDateFormat = (lng: string, type: "short" | "long" | "datetime" | "time" = "short") => {
  const formats: Record<string, Record<string, string>> = {
    "pt-BR": { short: "dd/MM/yyyy", long: "dd 'de' MMMM 'de' yyyy", datetime: "dd/MM/yyyy HH:mm", time: "HH:mm" },
    en: { short: "MM/dd/yyyy", long: "MMMM d, yyyy", datetime: "MM/dd/yyyy h:mm a", time: "h:mm a" },
    es: { short: "dd/MM/yyyy", long: "d 'de' MMMM 'de' yyyy", datetime: "dd/MM/yyyy HH:mm", time: "HH:mm" },
  };
  return formats[lng]?.[type] || formats["pt-BR"][type];
};
