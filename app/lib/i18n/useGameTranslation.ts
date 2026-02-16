import { useCallback } from "react";
import en from "./translations/en.json";
import pt from "./translations/pt.json";
import es from "./translations/es.json";

type Language = "en" | "pt" | "es";

const translations = {
  en,
  pt,
  es,
};

export function useGameTranslation(language: string = "en") {
  const lang = (language.toLowerCase() as Language) || "en";
  const langTranslations = translations[lang] || translations.en;

  const t = useCallback(
    (key: string, defaultValue?: string) => {
      const keys = key.split(".");
      let value: any = langTranslations;

      for (const k of keys) {
        value = value?.[k];
      }

      return typeof value === "string" ? value : defaultValue || key;
    },
    [langTranslations],
  );

  return { t, language: lang };
}
