"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations, type Language, type TranslationKey } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LANG_STORAGE_KEY = "criteri-lang";

/**
 * Determina la llengua inicial:
 * 1. Si l'usuari ja ha triat una llengua (localStorage), respectem la seva elecció.
 * 2. Si no, mirem la preferència del navegador (navigator.language).
 * 3. Si no es pot determinar, default a "ca" (coherent amb <html lang="ca">).
 *
 * NOTA: aquesta funció corre al client (dins useEffect) per evitar
 * inconsistències SSR/hidratació. El primer render fa servir "ca".
 */
function detectInitialLang(): Language {
  if (typeof window === "undefined") return "ca";
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "ca" || stored === "es") return stored;
  } catch {
    // localStorage pot estar bloquejat (mode privat), seguim
  }
  const nav = window.navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("es")) return "es";
  return "ca";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Primer render: "ca" (coherent amb <html lang="ca"> i amb el primer
  // render del servidor, evitant mismatch d'hidratació).
  const [lang, setLang] = useState<Language>("ca");

  // Després del muntatge, sobreescriu amb la preferència detectada.
  useEffect(() => {
    const detected = detectInitialLang();
    if (detected !== "ca") {
      setLang(detected);
    }
  }, []);

  const handleSetLang = useCallback((newLang: Language) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LANG_STORAGE_KEY, newLang);
      } catch {
        // localStorage bloquejat, no crític
      }
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] ?? entry.ca ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
