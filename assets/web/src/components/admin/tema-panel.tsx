"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

/**
 * Pestanya "Disseny" del panell /admin: colors i tipografies del site.
 * Guarda el tema a Supabase Storage (media/theme.json); el layout llegeix
 * aquest fitxer cada 60s i injecta les CSS variables — la web sencera
 * (informes inclosos) canvia de color/tipografia sense tocar codi.
 */

const COLOR_FIELDS: { key: string; ca: string; es: string; hint: string }[] = [
  { key: "fosc", ca: "Fosc (text i blocs dark)", es: "Oscuro", hint: "#26312B" },
  { key: "clar", ca: "Clar (fons)", es: "Claro", hint: "#F2F5F1" },
  { key: "salvia", ca: "Salvia (accent i CTA)", es: "Salvia", hint: "#5E8772" },
  { key: "salviaLight", ca: "Salvia clar (etiquetes sobre fosc)", es: "Salvia claro", hint: "#AAC9B6" },
  { key: "daurat", ca: "Daurat (detalls premium)", es: "Dorado", hint: "#C9A961" },
  { key: "separador", ca: "Separadors", es: "Separadores", hint: "#D8E2DA" },
  { key: "tinta", ca: "Tinta (text principal)", es: "Tinta", hint: "#141B18" },
];

const FONT_FIELDS: { key: string; ca: string; es: string; hint: string }[] = [
  { key: "serif", ca: "Serif (títols i frases destacades)", es: "Serif", hint: 'ui-serif, Georgia, serif' },
  { key: "mono", ca: "Mono (etiquetes Bloc 01 ·)", es: "Mono", hint: 'ui-monospace, Menlo, monospace' },
  { key: "sans", ca: "Sans (cos de text)", es: "Sans", hint: 'system-ui, sans-serif' },
];

export interface ThemeState {
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

export function TemaPanel({ lang }: { lang: "ca" | "es" }) {
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);
  const [theme, setTheme] = useState<ThemeState | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((r) => r.json())
      .then((t) => setTheme({ colors: { ...t.colors }, fonts: { ...t.fonts } }))
      .catch(() => setMsg(tr("No s'ha pogut carregar el tema", "No se pudo cargar el tema")));
  }, []);

  if (!theme) return <p className="text-sm opacity-70">…</p>;

  const set = (group: "colors" | "fonts", key: string, value: string) => {
    setTheme((prev) => prev && { ...prev, [group]: { ...prev[group], [key]: value } });
    setDirty(true);
    setMsg(null);
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const saved = await adminApi.theme.put({ colors: theme.colors, fonts: theme.fonts });
      setTheme({ colors: { ...saved.colors }, fonts: { ...saved.fonts } });
      setDirty(false);
      setMsg(tr(
        "Tema guardat. Els visitants el veuran en aproximadament 1 minut.",
        "Tema guardado. Los visitantes lo verán en aproximadamente 1 minuto."
      ));
    } catch (e: unknown) {
      const err = e as { error?: string };
      setMsg(err.error || tr("Error en guardar", "Error al guardar"));
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setSaving(true);
    setMsg(null);
    try {
      // PUT amb els valors per defecte = tornar al disseny aprovat
      const r = await fetch("/api/admin/theme");
      const defaults = await r.json();
      const saved = await adminApi.theme.put({ colors: defaults.colors, fonts: defaults.fonts });
      setTheme({ colors: { ...saved.colors }, fonts: { ...saved.fonts } });
      setDirty(false);
      setMsg(tr("Tema restaurat als valors originals.", "Tema restaurado a los valores originales."));
    } catch {
      setMsg(tr("Error en restaurar", "Error al restaurar"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed opacity-70">
        {tr(
          "Canvia els colors i les tipografies de TOTA la web (informes inclosos). Els canvis es veuen en ~1 minut arreu. Pots tornar sempre al disseny original amb «Restaurar».",
          "Cambia los colores y tipografías de TODA la web (informes incluidos). Los cambios se ven en ~1 minuto. Siempre puedes volver al diseño original con «Restaurar»."
        )}
      </p>

      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">
        {tr("Colors", "Colores")}
      </h3>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COLOR_FIELDS.map((f) => (
          <label key={f.key} className="flex items-center gap-3 rounded border px-3 py-2" style={{ borderColor: "var(--border)" }}>
            <input
              type="color"
              value={theme.colors[f.key]?.startsWith("#") ? theme.colors[f.key] : f.hint}
              onChange={(e) => set("colors", f.key, e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label={lang === "ca" ? f.ca : f.es}
            />
            <span className="flex-1 text-[13px] leading-tight">{lang === "ca" ? f.ca : f.es}</span>
            <code className="text-[11px] opacity-50">{theme.colors[f.key] || f.hint}</code>
          </label>
        ))}
      </div>

      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">
        {tr("Tipografies", "Tipografías")}
      </h3>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {FONT_FIELDS.map((f) => (
          <label key={f.key} className="rounded border px-3 py-2" style={{ borderColor: "var(--border)" }}>
            <span className="mb-1 block text-[13px]">{lang === "ca" ? f.ca : f.es}</span>
            <input
              type="text"
              value={theme.fonts[f.key] ?? ""}
              placeholder={f.hint}
              onChange={(e) => set("fonts", f.key, e.target.value)}
              className="w-full rounded bg-transparent px-2 py-1 text-[12px] outline-none"
              style={{ border: "1px solid var(--border)" }}
            />
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || !dirty}
          className="rounded px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
          style={{ background: "var(--accent)" }}
        >
          {saving ? tr("Guardant…", "Guardando…") : tr("Guardar tema", "Guardar tema")}
        </button>
        <button
          onClick={reset}
          disabled={saving}
          className="rounded border px-4 py-2 text-sm disabled:opacity-40"
          style={{ borderColor: "var(--border)" }}
        >
          {tr("Restaurar original", "Restaurar original")}
        </button>
        {msg && <span className="text-[13px] opacity-80">{msg}</span>}
      </div>
    </section>
  );
}
