"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Font de dades de les pàgines estàtiques (Fase 3 CMS).
 *
 * Estratègia idèntica a reports-source.ts: BD primer + fallback estàtic.
 * - La web renderitza SEMPRE el contingut estàtic de la font de codi.
 * - Si la BD té una secció amb HTML guardat (via panell /admin), aquest HTML
 *   substitueix el text estàtic d'aquella secció.
 * - Si la BD falla o la taula no existeix, res es trenca (fallback).
 *
 * Model de dades (taula public.pages):
 *   slug        → 'qui-som', 'que-fem', ...
 *   content_ca  → { sections: { [sectionId]: html } }
 *   content_es  → { sections: { [sectionId]: html } }
 *   status      → 'draft' | 'published' | 'archived'
 */

export interface PageSections {
  sections: Record<string, string>;
}

export type PageSectionsByLang = {
  ca: Record<string, string> | null;
  es: Record<string, string> | null;
};

function extractSections(json: unknown): Record<string, string> | null {
  if (!json || typeof json !== "object") return null;
  const obj = json as { sections?: unknown };
  if (!obj.sections || typeof obj.sections !== "object") return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj.sections as Record<string, unknown>)) {
    if (typeof v === "string" && v.trim()) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Mapa de seccions editades { sectionId → html } per a una pàgina, CA i ES.
 * null = res guardat a la BD (la pàgina fa servir el 100% estàtic).
 */
export function usePageSections(slug: string): {
  overrides: PageSectionsByLang;
  loading: boolean;
} {
  const [overrides, setOverrides] = useState<PageSectionsByLang>({
    ca: null,
    es: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("pages")
          .select("content_ca, content_es, status")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (!alive) return;
        if (error || !data) {
          setOverrides({ ca: null, es: null });
        } else {
          setOverrides({
            ca: extractSections(data.content_ca),
            es: extractSections(data.content_es),
          });
        }
      } catch {
        if (alive) setOverrides({ ca: null, es: null });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  return { overrides, loading };
}

/** HTML guardat per a una secció, o undefined si no n'hi ha (fallback estàtic). */
export function sectionOverride(
  overrides: PageSectionsByLang,
  lang: "ca" | "es",
  sectionId: string
): string | undefined {
  return overrides[lang]?.[sectionId];
}
