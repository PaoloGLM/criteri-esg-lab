/**
 * figures-store.ts — Estat dels ajustos de les FIGURES SVG (HeroChart,
 * XrefDiagram...), sense React perquè el puguin consumir el runtime,
 * el provider públic (CmsTexts) i el panell sense cycles d'import.
 *
 * Model de dades (taula pages, content_ca.figures — compartit CA/ES):
 *
 *   { [figureId]: {
 *       widthPct?: number,       // amplada del contenidor (40–160%)
 *       mt?: number, mb?: number, // espai abans/després del contenidor (0–200px)
 *       parts?: {                // ajustos per ELEMENT del gràfic (SVG)
 *         [partKey]: { mt?: number, mb?: number }  // -100..200px
 *       },
 *   } }
 *
 *  · parts[k].mt > 0 → l'element baixa (més distància amb el de dalt)
 *  · parts[k].mb > 0 → l'element puja (més distància amb el de sota)
 *  · Neteja vertical = translateY(mt - mb) sobre l'element SVG.
 *
 * Absència d'estil = la figura es mostra exactament igual que el codi.
 */

export interface FigurePartStyle {
  mt?: number;
  mb?: number;
}

export interface FigureStyle {
  widthPct?: number;
  mt?: number;
  mb?: number;
  parts?: Record<string, FigurePartStyle>;
}

export type FiguresMap = Record<string, FigureStyle>;

/** Comprova si un estil té algun efecte (sinó l'entrada sobra). */
function styleHasEffect(s: FigureStyle): boolean {
  return (
    typeof s.widthPct === "number" ||
    typeof s.mt === "number" ||
    typeof s.mb === "number" ||
    (s.parts !== undefined && Object.keys(s.parts).length > 0)
  );
}

let figures: FiguresMap = {};
const subs = new Set<() => void>();

function emit() {
  subs.forEach((f) => f());
}

export const figuresStore = {
  get(id: string): FigureStyle | null {
    return figures[id] ?? null;
  },
  /** Reemplaça tot el mapa (el panell mana via figures-set). */
  setAll(next: FiguresMap | null) {
    figures = next && typeof next === "object" ? next : {};
    emit();
  },
  /** Una figura ajustada (null = torna a la mida del codi). */
  setOne(id: string, style: FigureStyle | null) {
    const next = { ...figures };
    if (style && styleHasEffect(style)) {
      next[id] = style;
    } else {
      delete next[id];
    }
    figures = next;
    emit();
  },
  snapshot(): FiguresMap {
    return figures;
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

const clampPart = (v: unknown): number | undefined => {
  if (typeof v !== "number" || !Number.isFinite(v)) return undefined;
  return Math.max(-100, Math.min(200, Math.round(v)));
};

/** Extreu i valida content_ca.figures vingut de la BD. */
export function pickFigures(json: unknown): FiguresMap {
  const out: FiguresMap = {};
  if (!json || typeof json !== "object") return out;
  const fg = (json as { figures?: unknown }).figures;
  if (!fg || typeof fg !== "object" || Array.isArray(fg)) return out;
  for (const [k, v] of Object.entries(fg as Record<string, unknown>)) {
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    const s = v as Record<string, unknown>;
    const entry: FigureStyle = {};
    if (typeof s.widthPct === "number" && Number.isFinite(s.widthPct))
      entry.widthPct = Math.max(40, Math.min(160, s.widthPct));
    if (typeof s.mt === "number" && Number.isFinite(s.mt) && s.mt >= 0)
      entry.mt = Math.min(200, s.mt);
    if (typeof s.mb === "number" && Number.isFinite(s.mb) && s.mb >= 0)
      entry.mb = Math.min(200, s.mb);
    if (s.parts && typeof s.parts === "object" && !Array.isArray(s.parts)) {
      const parts: Record<string, FigurePartStyle> = {};
      for (const [pk, pv] of Object.entries(s.parts as Record<string, unknown>)) {
        if (!pv || typeof pv !== "object" || Array.isArray(pv)) continue;
        const ps = pv as Record<string, unknown>;
        const entryPart: FigurePartStyle = {};
        const pmt = clampPart(ps.mt);
        const pmb = clampPart(ps.mb);
        if (pmt !== undefined) entryPart.mt = pmt;
        if (pmb !== undefined) entryPart.mb = pmb;
        if (entryPart.mt !== undefined || entryPart.mb !== undefined) parts[pk] = entryPart;
      }
      if (Object.keys(parts).length > 0) entry.parts = parts;
    }
    if (styleHasEffect(entry)) out[k] = entry;
  }
  return out;
}
