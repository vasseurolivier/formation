"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useState, useMemo } from "react";
import fr from "@/lib/translations/fr.json";
import en from "@/lib/translations/en.json";
import zh from "@/lib/translations/zh.json";

export type Language = "fr" | "en" | "zh";

type Translations = Record<string, any>;

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  translations: Translations;
  t: (key: string) => string;
}

const translationsMap: Record<Language, Translations> = { fr, en, zh };

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  const translations = useMemo(
    () => translationsMap[language] || en,
    [language]
  );
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }
    return typeof result === 'string' ? result : key;
  };

  const value = useMemo(
    () => ({ language, setLanguage, translations, t }),
    [language, translations, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
