"use client";

/**
 * text-styles.tsx — Tokens d'estil per als texts editables (EditableText).
 *
 * L'usuari només pot escollir entre els tokens propis de la marca:
 *  · Tipografia: les 3 famílies del web (serif Newsreader, sans DM Sans, mono JetBrains)
 *  · Mida: percentatge sobre la mida BASE del rol del text (mai px lliures),
 *    amb rang limitat per no trencar la jerarquia tipogràfica
 *  · Color: únicament variables CSS de la paleta terra-coure (PALETA-COLORS.md)
 *
 * Model de dades (taula pages, content_*.styles — compartit CA/ES):
 *   { [textId]: { font?: "serif"|"sans"|"mono", sizePct?: number, color?: string } }
 * Absència d'estil = el text es mostra exactament igual que el codi.
 */

export type StyleFont = "serif" | "sans" | "mono";

/** Rol tipogràfic del text: fixa la mida base sobre la qual aplica sizePct. */
export type StyleEl = "h1" | "h2" | "body" | "eyebrow" | "quote" | "button";

export interface TextStyle {
  font?: StyleFont;
  sizePct?: number;
  color?: string;
  /** Marge superior en px (0–200): "juntar" o "separar" l'element del de dalt. */
  mt?: number;
  /** Marge inferior en px (0–200): "juntar" o "separar" l'element del de sota. */
  mb?: number;
}

export type TextStylesMap = Record<string, TextStyle>;

/** Piles de font equivalents a globals.css (fallbacks inclosos). */
export const FONT_STACKS: Record<StyleFont, string> = {
  serif: "var(--font-serif, var(--font-newsreader)), Georgia, serif",
  sans: "var(--font-sans, var(--font-dm-sans)), system-ui, sans-serif",
  mono: "var(--font-mono, var(--font-jetbrains)), 'Courier New', monospace",
};

/** Mida base (rem) de cada rol, segons globals.css / tailwind config. */
export const BASE_FONT: Record<StyleEl, number> = {
  h1: 3.0,      // text-5xl mòbil / més a desktop: base prudent per al clamp
  h2: 1.875,    // sec-title mòbil
  body: 1.0625, // sec-body
  eyebrow: 0.7,
  quote: 1.625, // blockquote .principle
  button: 0.9375,
};

/** Rang de mida per rol (percentatges): prou lliure sense trencar la jerarquia. */
export const SCALE_RANGE: Record<StyleEl, [number, number]> = {
  h1: [70, 140],
  h2: [70, 145],
  body: [75, 160],
  eyebrow: [85, 175],
  quote: [70, 150],
  button: [85, 155],
};

/** Colors permesos: únicament tokens de la paleta (mai hex lliures). */
export const TEXT_COLORS: { label: string; value: string; swatch: string }[] = [
  { label: "Tinta (fosc)", value: "var(--ink-deep)", swatch: "var(--c-tinta, #141B18)" },
  { label: "Verd fosc", value: "var(--ink)", swatch: "var(--c-fosc, #26312B)" },
  { label: "Salvia", value: "var(--accent)", swatch: "var(--c-salvia, #5E8772)" },
  { label: "Salvia clar", value: "var(--verd-clar)", swatch: "var(--c-salvia-light, #AAC9B6)" },
  { label: "Daurat", value: "var(--highlight)", swatch: "var(--c-daurat, #C9A961)" },
  { label: "Groc lluminós", value: "#F5E381", swatch: "#F5E381" },
  { label: "Clar (per fons fosc)", value: "var(--bg)", swatch: "var(--c-clar, #F2F5F1)" },
  { label: "Gris suau", value: "var(--ink-soft)", swatch: "color-mix(in srgb, var(--c-salvia) 55%, var(--c-tinta))" },
];

const VALID_COLORS = new Set(TEXT_COLORS.map((c) => c.value));

export function isValidTextColor(color: unknown): color is string {
  return typeof color === "string" && VALID_COLORS.has(color);
}

/** Converteix un estil desat en CSS React, fusionat amb l'estil base del node. */
export function styleToCss(style: TextStyle, el?: StyleEl): React.CSSProperties {
  const css: React.CSSProperties = {};
  if (style.font) css.fontFamily = FONT_STACKS[style.font];
  if (style.color) css.color = style.color;
  if (typeof style.mt === "number" && Number.isFinite(style.mt) && style.mt >= 0) {
    css.marginTop = `${Math.min(200, Math.round(style.mt))}px`;
  }
  if (typeof style.mb === "number" && Number.isFinite(style.mb) && style.mb >= 0) {
    css.marginBottom = `${Math.min(200, Math.round(style.mb))}px`;
  }
  if (
    typeof style.sizePct === "number" &&
    el &&
    Number.isFinite(style.sizePct) &&
    Math.round(style.sizePct) !== 100 // 100% = la mida del codi (identitat)
  ) {
    const base = getRootFontPx() * BASE_FONT[el];
    const px = Math.round(base * (style.sizePct / 100) * 10) / 10;
    css.fontSize = `${px}px`;
  }
  return css;
}

/** font-size arrel efectiva (16px per defecte; respecta zoom d'accessibilitat). */
export function getRootFontPx(): number {
  if (typeof window === "undefined" || !document?.documentElement) return 16;
  const fs = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(fs) && fs > 0 ? fs : 16;
}
