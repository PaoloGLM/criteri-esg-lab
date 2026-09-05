import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Report, ReportBlock } from "@/lib/reports";
import { reports as staticReports } from "@/lib/reports";
import { getReportContent } from "@/lib/reports-content";

/**
 * Font de dades d'informes amb fallback.
 *
 * Estratègia zero-risc:
 * 1. Intenta llegir els informes PUBLISHED de la taula `informes` (Supabase).
 * 2. Si la taula no existeix, no hi ha connexió, o és buida → fallback
 *    transparent al catàleg estàtic (reports.ts) que sempre funciona.
 * 3. El resultat resultant és sempre una llista vàlida; la web no es trencarà mai.
 *
 * Quan la DB tingui informes (via /admin), la web els servirà d'allí.
 * L'etiqueta `source` permet depurar d'on venen les dades.
 */

export interface ReportsResult {
  reports: Report[];
  source: "database" | "static-fallback";
}

/** Converteix una fila de la taula informes al tipus Report del frontend. */
function rowToReport(row: Record<string, unknown>): Report | null {
  if (!row.slug || !row.title) return null;
  return {
    slug: String(row.slug),
    title: String(row.title),
    institution: String(row.institution || ""),
    date: String(row.date || ""),
    pages: Number(row.pages) || 0,
    type: (row.type as Report["type"]) || "official",
    scope: (row.scope as Report["scope"]) || "EU",
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    certifications: Array.isArray(row.certifications) ? row.certifications.map(String) : [],
    summary: String(row.summary || ""),
    url: String(row.url || ""),
    // Els blocs complets (content_ca/content_es) es mantenen a reports-content.ts
    // de moment; quan es migrin completament, s'ompliran des de la DB.
  };
}

export async function getPublishedReports(): Promise<ReportsResult> {
  // Si Supabase no està configurat (ex: preview sense env), fallback directe
  if (typeof window !== "undefined") {
    // Client-side: usem el client públic
    try {
      const { data, error } = await supabase
        .from("informes")
        .select(
          "slug, title, institution, date, pages, type, scope, tags, certifications, summary, url, status"
        )
        .eq("status", "published")
        .order("date", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(rowToReport).filter((r): r is Report => r !== null);
        if (mapped.length > 0) return { reports: mapped, source: "database" };
      }
    } catch {
      /* fallback */
    }
    return { reports: staticReports, source: "static-fallback" };
  }

  // Server-side: mateixa lògica (el client supabase funciona en ambdós)
  try {
    const { data, error } = await supabase
      .from("informes")
      .select(
        "slug, title, institution, date, pages, type, scope, tags, certifications, summary, url, status"
      )
      .eq("status", "published")
      .order("date", { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped = data.map(rowToReport).filter((r): r is Report => r !== null);
      if (mapped.length > 0) return { reports: mapped, source: "database" };
    }
  } catch {
    /* fallback */
  }

  return { reports: staticReports, source: "static-fallback" };
}

// ── Hooks de client ──────────────────────────────────────────────────

/**
 * Hook per a pàgines de client: retorna el catàleg de la BD (published)
 * amb fallback instantani al catàleg estàtic mentre carrega i si la BD falla.
 */
export function useReports(): {
  reports: Report[];
  source: "database" | "static-fallback" | "loading";
} {
  const [reports, setReports] = useState<Report[]>(staticReports);
  const [source, setSource] = useState<"database" | "static-fallback" | "loading">("loading");

  useEffect(() => {
    let cancelled = false;
    getPublishedReports().then((r) => {
      if (!cancelled) {
        setReports(r.reports);
        setSource(r.source);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { reports, source };
}

/**
 * Contingut (blocs) d'un informe per slug i idioma:
 * 1. Render instantani amb el contingut estàtic si existeix.
 * 2. Si la BD té contingut per aquest slug (ex: editat des de /admin),
 *    el substitueix quan arriba.
 */
export function useReportContent(
  slug: string,
  lang: "ca" | "es"
): ReportBlock | undefined {
  // L'estàtic es deriva en render (sense setState síncron a l'efecte)
  const staticBlock = getReportContent(slug, lang);
  const [dbBlock, setDbBlock] = useState<ReportBlock | undefined>(undefined);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("informes")
          .select("content_ca, content_es")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();
        if (cancelled || error) return;
        const block = lang === "ca" ? data?.content_ca : data?.content_es;
        if (block && typeof block === "object") {
          setDbBlock(block as ReportBlock);
          setLoadedSlug(slug);
        }
      } catch {
        /* silenciós: ja tenim l'estàtic */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, lang]);

  // Si la BD té contingut per aquest slug, guanya; si no, l'estàtic
  return loadedSlug === slug && dbBlock ? dbBlock : staticBlock;
}

/**
 * Mapa slug → semàfor de cada informe publicat, per a la biblioteca.
 * 1. Instantani: construït del contingut estàtic.
 * 2. Substituït pel de la BD (una sola query amb extracció JSON) quan arriba.
 */
export function useSemaforMap(
  lang: "ca" | "es"
): Record<string, ReportBlock["semafor"]> {
  const [map, setMap] = useState<Record<string, ReportBlock["semafor"]>>(() => {
    const initial: Record<string, ReportBlock["semafor"]> = {};
    for (const r of staticReports) {
      const s = getReportContent(r.slug, lang)?.semafor;
      if (s) initial[r.slug] = s;
    }
    return initial;
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("informes")
          .select(
            "slug, semafor_ca:content_ca->semafor, semafor_es:content_es->semafor"
          )
          .eq("status", "published");
        if (cancelled || error || !data || data.length === 0) return;
        const next: Record<string, ReportBlock["semafor"]> = {};
        for (const row of data) {
          const s = (lang === "ca" ? row.semafor_ca : row.semafor_es) as
            | ReportBlock["semafor"]
            | null
            | undefined;
          if (s && typeof s === "object" && "grade" in s) next[row.slug] = s;
        }
        if (Object.keys(next).length > 0) setMap(next);
      } catch {
        /* silenciós: ja tenim l'estàtic */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return map;
}
