import { serviceClient } from "@/lib/admin-auth";

/**
 * Tema del site editable des de /admin → pestanya Disseny.
 * Es guarda a Supabase Storage (bucket "media", fitxer theme.json) i s'injecta
 * com a CSS variables al <head> des del layout (server component, revalidate 60s).
 *
 * Els valors per defecte reprodueixen EXACTAMENT el disseny aprovat actual:
 * fins que algú no editi el tema, la web no canvia visualment res.
 */

export interface SiteTheme {
  colors: {
    fosc: string;
    clar: string;
    salvia: string;
    salviaLight: string;
    daurat: string;
    separador: string;
    tinta: string;
  };
  fonts: {
    serif: string;
    mono: string;
    sans: string;
  };
}

/** Per defecte = disseny aprovat (colors) + stacks Tailwind originals (fonts). */
export const THEME_DEFAULTS: SiteTheme = {
  colors: {
    fosc: "#26312B",
    clar: "#F2F5F1",
    salvia: "#5E8772",
    salviaLight: "#AAC9B6",
    daurat: "#C9A961",
    separador: "#D8E2DA",
    tinta: "#141B18",
  },
  fonts: {
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
};

/** Neteja valors per injecció segura al <style>: només caràcters de declaració CSS. */
export function sanitizeCssValue(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9#(),\s.'"%_-]/g, "")
    .trim()
    .slice(0, 200);
}

/** Merge tolerant: només accepta strings no buits per claus conegudes. */
export function mergeTheme(base: SiteTheme, patch?: Partial<SiteTheme> | null): SiteTheme {
  const out: SiteTheme = { colors: { ...base.colors }, fonts: { ...base.fonts } };
  if (patch?.colors) {
    for (const k of Object.keys(base.colors) as (keyof SiteTheme["colors"])[]) {
      const v = patch.colors[k];
      if (typeof v === "string" && v.trim()) out.colors[k] = sanitizeCssValue(v);
    }
  }
  if (patch?.fonts) {
    for (const k of Object.keys(base.fonts) as (keyof SiteTheme["fonts"])[]) {
      const v = patch.fonts[k];
      if (typeof v === "string" && v.trim()) out.fonts[k] = sanitizeCssValue(v);
    }
  }
  return out;
}

/** Llegeix theme.json de Storage. MAI llença: fallback als valors per defecte. */
export async function readTheme(): Promise<SiteTheme> {
  try {
    const { data } = await serviceClient().storage.from("media").download("theme.json");
    if (data) return mergeTheme(THEME_DEFAULTS, JSON.parse(await data.text()));
  } catch {
    /* sense clau de servei (build) o sense fitxer encara: per defecte */
  }
  return THEME_DEFAULTS;
}

/** Converteix el tema en bloc CSS :root amb les variables del lloc. */
export function themeToCss(theme: SiteTheme): string {
  const { colors: c, fonts: f } = theme;
  return [
    // html:root (= major especificitat que el :root de globals.css): el tema
    // injectat guanya independentment de l'ordre de càrrega dels fulls.
    "html:root{",
    `--c-fosc:${c.fosc};`,
    `--c-clar:${c.clar};`,
    `--c-salvia:${c.salvia};`,
    `--c-salvia-light:${c.salviaLight};`,
    `--c-daurat:${c.daurat};`,
    `--c-separador:${c.separador};`,
    `--c-tinta:${c.tinta};`,
    `--c-clar-65:color-mix(in srgb, ${c.clar} 65%, transparent);`,
    `--c-clar-55:color-mix(in srgb, ${c.clar} 55%, transparent);`,
    `--font-serif:${f.serif};`,
    `--font-mono:${f.mono};`,
    `--font-sans:${f.sans};`,
    "}",
  ].join("");
}
