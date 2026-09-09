/**
 * blocks.ts — Registre de blocs del CMS (fase 3).
 *
 * Arquitectura tipus Gutenberg/Payload: dades estructurades en JSON,
 * NO HTML serialitzat. Cada tipus de bloc té un esquema validat.
 * El contingut d'una pàgina és { blocks: [...] } (nou) o { sections: {...} } (legacy HTML).
 *
 * Compatibilitat: la mateixa taula `pages` (content_ca/content_es) guarda
 * qualsevol de les dues formes — el renderer decideix.
 */

export type BlockType = "text" | "image" | "cta";

export interface Block {
  id: string;
  type: BlockType;
  data: Record<string, unknown>;
}

export const IMAGE_WIDTHS = [25, 50, 75, 100] as const;

const BLOCK_TYPES: BlockType[] = ["text", "image", "cta"];
const MAX_BLOCKS = 100;
const MAX_TEXT_HTML = 100_000; // 100KB per bloc de text
const MAX_JSON = 400_000; // 400KB total per idioma

export function newBlockId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function isStr(v: unknown): v is string {
  return typeof v === "string";
}

/** Sanitització mínima: sense <script>, sense atributs d'event (on*), sense javascript:. */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

/** Valida i retorna el llistat de blocs, o un missatge d'error. */
export function validateBlocks(json: unknown): { ok: boolean; error?: string; blocks?: Block[] } {
  if (!Array.isArray(json)) return { ok: false, error: "blocks ha de ser una llista" };
  if (json.length > MAX_BLOCKS) return { ok: false, error: `Màxim ${MAX_BLOCKS} blocs` };

  const blocks: Block[] = [];
  for (let i = 0; i < json.length; i++) {
    const raw = json[i] as Record<string, unknown>;
    const where = `bloc ${i + 1}`;
    if (!raw || typeof raw !== "object") return { ok: false, error: `${where}: ha de ser un objecte` };
    if (!BLOCK_TYPES.includes(raw.type as BlockType))
      return { ok: false, error: `${where}: tipus desconegut '${String(raw.type)}'` };
    if (!isStr(raw.id) || raw.id.length > 64)
      return { ok: false, error: `${where}: 'id' manca o és massa llarg` };
    const data = raw.data;
    if (!data || typeof data !== "object" || Array.isArray(data))
      return { ok: false, error: `${where}: 'data' manca` };

    const d = data as Record<string, unknown>;
    if (raw.type === "text") {
      if (!isStr(d.html)) return { ok: false, error: `${where} (text): cal 'html'` };
      if (d.html.length > MAX_TEXT_HTML) return { ok: false, error: `${where} (text): massa gran` };
    } else if (raw.type === "image") {
      if (!isStr(d.url) || !/^https?:\/\//.test(d.url))
        return { ok: false, error: `${where} (imatge): cal 'url' http(s)` };
      if (d.url.length > 2000) return { ok: false, error: `${where} (imatge): url massa llarga` };
      if (d.alt !== undefined && !isStr(d.alt)) return { ok: false, error: `${where} (imatge): 'alt' ha de ser text` };
      // Amplada LLUIRE (editor visual): qualsevol enter 10-100 (sense presets)
      if (d.widthPct !== undefined && (typeof d.widthPct !== "number" || d.widthPct < 10 || d.widthPct > 100))
        return { ok: false, error: `${where} (imatge): widthPct ha de ser un número 10-100` };
      if (d.align !== undefined && !["left", "center", "right"].includes(d.align as string))
        return { ok: false, error: `${where} (imatge): align ha de ser left|center|right` };
      const fx = d.focalX, fy = d.focalY;
      if (fx !== undefined && (typeof fx !== "number" || fx < 0 || fx > 100))
        return { ok: false, error: `${where} (imatge): focalX 0-100` };
      if (fy !== undefined && (typeof fy !== "number" || fy < 0 || fy > 100))
        return { ok: false, error: `${where} (imatge): focalY 0-100` };
      if (d.caption !== undefined && !isStr(d.caption))
        return { ok: false, error: `${where} (imatge): 'caption' ha de ser text` };
    } else if (raw.type === "cta") {
      if (!isStr(d.label) || !d.label.trim()) return { ok: false, error: `${where} (cta): cal 'label'` };
      if (!isStr(d.href) || !/^https?:\/\//.test(d.href))
        return { ok: false, error: `${where} (cta): cal 'href' http(s)` };
      if (d.style !== undefined && !["solid", "outline"].includes(d.style as string))
        return { ok: false, error: `${where} (cta): style ha de ser solid|outline` };
      if (d.note !== undefined && !isStr(d.note)) return { ok: false, error: `${where} (cta): 'note' ha de ser text` };
    }
    blocks.push({ id: raw.id as string, type: raw.type as BlockType, data: data as Record<string, unknown> });
  }
  return { ok: true, blocks };
}

/**
 * Valida el contingut d'un idioma: accepta el format nou {blocks:[...]}
 * o el legacy {sections:{id:html}}. Retorna null si és vàlid.
 */
export function validateContent(json: unknown): string | null {
  if (json === null || json === undefined) return null; // camp opcional
  if (typeof json !== "object" || Array.isArray(json)) return "El contingut ha de ser un objecte";
  if (JSON.stringify(json).length > MAX_JSON) return "El contingut és massa gran (màx 400KB)";

  const obj = json as { sections?: unknown; blocks?: unknown; texts?: unknown; styles?: unknown; order?: unknown; hidden?: unknown; images?: unknown; figures?: unknown };
  const hasSections = obj.sections !== undefined;
  const hasBlocks = obj.blocks !== undefined;
  const hasTexts = obj.texts !== undefined;
  const hasStyles = obj.styles !== undefined;
  const hasOrder = obj.order !== undefined;
  const hasHidden = obj.hidden !== undefined;
  const hasImages = obj.images !== undefined;
  const hasFigures = obj.figures !== undefined;
  if (!hasSections && !hasBlocks && !hasTexts && !hasStyles && !hasOrder && !hasHidden && !hasImages && !hasFigures)
    return "Cal 'blocks' (blocs), 'sections' (HTML per seccions) o 'texts' (HTML per texts)";

  if (hasSections) {
    const sections = obj.sections;
    if (!sections || typeof sections !== "object" || Array.isArray(sections))
      return "sections ha de ser un objecte";
    for (const [k, v] of Object.entries(sections as Record<string, unknown>)) {
      if (typeof v !== "string") return `La secció '${k}' ha de contenir HTML (string)`;
      if (v.length > 200_000) return `La secció '${k}' és massa gran (màx 200KB)`;
    }
  }
  if (hasBlocks) {
    const r = validateBlocks(obj.blocks);
    if (!r.ok) return r.error ?? "Error de validació dels blocs";
  }
  if (hasTexts) {
    const texts = obj.texts;
    if (!texts || typeof texts !== "object" || Array.isArray(texts))
      return "texts ha de ser un objecte";
    for (const [k, v] of Object.entries(texts as Record<string, unknown>)) {
      if (typeof v !== "string") return `El text '${k}' ha de contenir HTML (string)`;
      if (v.length > 200_000) return `El text '${k}' és massa gran (màx 200KB)`;
    }
  }
  if (hasStyles) {
    const st = obj.styles;
    if (!st || typeof st !== "object" || Array.isArray(st))
      return "styles ha de ser un objecte";
    for (const [k, v] of Object.entries(st as Record<string, unknown>)) {
      if (!v || typeof v !== "object" || Array.isArray(v))
        return `L'estil '${k}' ha de ser un objecte`;
      const s = v as Record<string, unknown>;
      if (s.font !== undefined && !["serif", "sans", "mono"].includes(s.font as string))
        return `L'estil '${k}' té una tipografia invàlida (serif|sans|mono)`;
      if (
        s.sizePct !== undefined &&
        (typeof s.sizePct !== "number" || s.sizePct < 50 || s.sizePct > 200)
      )
        return `L'estil '${k}' té una mida fora de rang (50-200%)`;
      if (
        s.color !== undefined &&
        (typeof s.color !== "string" || s.color.length > 60 || /[;{}<>]/.test(s.color))
      )
        return `L'estil '${k}' té un color invàlid`;
    }
  }
  if (hasOrder) {
    const o = obj.order;
    if (!o || typeof o !== "object" || Array.isArray(o)) return "order ha de ser un objecte";
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (!Array.isArray(v)) return `L'ordre '${k}' ha de ser una llista`;
      if (v.some((x) => typeof x !== "string")) return `L'ordre '${k}' només pot contenir text`;
    }
  }
  if (hasHidden) {
    // Elements amagats des de l'editor: mapa id → true.
    const h = obj.hidden;
    if (!h || typeof h !== "object" || Array.isArray(h)) return "hidden ha de ser un objecte";
    for (const [k, v] of Object.entries(h as Record<string, unknown>)) {
      if (v !== true) return `L'element ocult '${k}' només pot valer true`;
      if (k.length > 120) return `La clau oculta '${k}' és massa llarga`;
    }
  }
  if (hasImages) {
    // Imatges de seccions dissenyades: mapa id → { url, alt?, widthPct? }.
    const im = obj.images;
    if (!im || typeof im !== "object" || Array.isArray(im)) return "images ha de ser un objecte";
    for (const [k, v] of Object.entries(im as Record<string, unknown>)) {
      if (!v || typeof v !== "object" || Array.isArray(v)) return `La imatge '${k}' ha de ser un objecte`;
      const g = v as Record<string, unknown>;
      if (typeof g.url !== "string" || !g.url) return `La imatge '${k}' cal 'url'`;
      if (g.url.length > 500) return `La URL de '${k}' és massa llarga`;
      if (/[<>"'`]/.test(g.url)) return `La URL de '${k}' té caràcters no permesos`;
      if (g.alt !== undefined && typeof g.alt !== "string") return `La imatge '${k}' té un alt no textual`;
      if (g.widthPct !== undefined && (typeof g.widthPct !== "number" || g.widthPct < 20 || g.widthPct > 100))
        return `La imatge '${k}' té una amplada fora de rang (20-100%)`;
    }
  }
  if (hasFigures) {
    // Figures SVG de seccions dissenyades: mapa id → { widthPct?, mt? }.
    const fg = obj.figures;
    if (!fg || typeof fg !== "object" || Array.isArray(fg)) return "figures ha de ser un objecte";
    for (const [k, v] of Object.entries(fg as Record<string, unknown>)) {
      if (!v || typeof v !== "object" || Array.isArray(v)) return `La figura '${k}' ha de ser un objecte`;
      const g = v as Record<string, unknown>;
      if (g.widthPct !== undefined && (typeof g.widthPct !== "number" || g.widthPct < 40 || g.widthPct > 160))
        return `La figura '${k}' té una amplada fora de rang (40-160%)`;
      if (g.mt !== undefined && (typeof g.mt !== "number" || g.mt < 0 || g.mt > 200))
        return `La figura '${k}' té un espai fora de rang (0-200px)`;
    }
  }
  return null;
}
