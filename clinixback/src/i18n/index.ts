import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "pt-BR": { translation: ptBR },
      en: { translation: en },
    },
    lng: undefined,
    fallbackLng: "pt-BR",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
      convertDetectedLanguage: (lng: string) => {
        if (["pt-BR", "pt", "en"].includes(lng)) {
          return lng.startsWith("pt") ? "pt-BR" : lng;
        }
        return "pt-BR";
      },
    },
  });

export default i18n;

export const supportedLanguages = [
  { code: "pt-BR", label: "Portugues", flag: "BR" },
  { code: "en", label: "English", flag: "US" },
];
