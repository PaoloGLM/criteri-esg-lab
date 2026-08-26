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
 * Determina la llengua inicial de la web.
 *
 * Decisió editorial de Paolo (CONTEXT decisió 12, 14): l'idioma per defecte
 * de la web és **castellà** ('es'), perquè la majoria de clients potencials
 * són castellanoparlants. La web en català és opcional (toggle al header).
 *
 * Ordre de preferència:
 * 1. Si l'usuari ja ha triat una llengua (localStorage), respectem la seva elecció.
 * 2. Si no, default a "es".
 *
 * NOTA: no fem servir navigator.language perquè la decisió és de negoci,
 * no tècnica. Si algú té el navegador en anglès o francès, també veurà ES.
 * L'usuari pot canviar manualment a CAT amb el toggle del header.
 *
 * NOTA SSR: aquesta funció corre al client (dins useEffect) per evitar
 * inconsistències d'hidratació. El primer render fa servir "es".
 */
function detectInitialLang(): Language {
  if (typeof window === "undefined") return "es";
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "ca" || stored === "es") return stored;
  } catch {
    // localStorage pot estar bloquejat (mode privat), seguim
  }
  return "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Primer render: "es" (default de la web, decisió editorial).
  // Evita mismatch d'hidratació perquè coincideix amb el render del servidor.
  const [lang, setLang] = useState<Language>("es");

  // Després del muntatge, respectem la preferència guardada si n'hi ha.
  useEffect(() => {
    const detected = detectInitialLang();
    if (detected !== "es") {
      setLang(detected);
    }
  }, []);

  // A6: mantenir <html lang> sincronitzat amb l'idioma triat (a11y + SEO).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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
      // Fallback: lang -> es -> ca -> key
      return entry[lang] ?? entry.es ?? key;
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
