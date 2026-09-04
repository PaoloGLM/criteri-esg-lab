import { supabase } from "@/lib/supabase";
import type { Report } from "@/lib/reports";
import { reports as staticReports } from "@/lib/reports";

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
