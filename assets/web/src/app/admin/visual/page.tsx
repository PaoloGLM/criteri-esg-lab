"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Block, BlockType, validateBlocks } from "@/lib/blocks";

/**
 * /admin/visual — Editor visual ("simulador") tipus WordPress/Elementor.
 *
 * Carrega la pàgina REAL (p.ex. la landing) en un iframe amb ?edit=1,
 * que activa el runtime d'edició dins la zona CMS de la pàgina:
 * clic per seleccionar, vèrtex per estirar la mida (lliure, no presets),
 * arrossegar per reordenar, escriure sobre la pàgina. Inspector contextual
 * per a camps que no caben in-place (URL imatge, alt, peu, CTA href...).
 *
 * Protocol postMessage { source: "criteri-cms" }:
 *  iframe → pare:  ready | change { blocks, lang } | select { id } |
 *                  texts-ready { lang } | texts-change { id, lang, html }
 *  pare → iframe:  set-blocks { blocks, lang } | set-lang { lang } |
 *                  texts-set { texts: {ca,es} } | add-block { type } |
 *                  move { dir } | remove {} | deselect {}
 */

type Lang = "ca" | "es";
type Status = "draft" | "published" | "archived";

const CMS_MSG = "criteri-cms";

const PAGES: { slug: string; label: string }[] = [
  { slug: "home", label: "Inici (landing)" },
  { slug: "qui-som", label: "Qui som" },
  { slug: "que-fem", label: "Què fem" },
];

export default function VisualEditorPage() {
  const [slug, setSlug] = useState("home");
  const [lang, setLang] = useState<Lang>("ca");
  const [status, setStatus] = useState<Status | null>(null);
  const [blocksByLang, setBlocksByLang] = useState<Record<Lang, Block[]>>({ ca: [], es: [] });
  const [textsByLang, setTextsByLang] = useState<Record<Lang, Record<string, string>>>({ ca: {}, es: {} });
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState<Record<Lang, boolean>>({ ca: false, es: false });
  const [banner, setBanner] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const latest = useRef<Record<Lang, Block[]>>({ ca: [], es: [] });
  const latestTexts = useRef<Record<Lang, Record<string, string>>>({ ca: {}, es: {} });

  const blocks = blocksByLang[lang];
  const selBlock = blocks.find((b) => b.id === selected) ?? null;
  const iframeSrc = `/${slug === "home" ? "" : slug}?edit=1`;

  // ── Carrega la pàgina ──────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setBanner(null);
    setSelected(null);
    adminApi.pages
      .get(slug)
      .then(({ page }) => {
        if (!alive) return;
        const load = (content: unknown): Block[] => {
          if (!content || typeof content !== "object") return [];
          const arr = (content as { blocks?: unknown }).blocks;
          if (!Array.isArray(arr)) return [];
          return arr.filter(
            (b): b is Block => !!b && typeof b === "object" && typeof (b as Block).id === "string"
          );
        };
        const next = { ca: load(page.content_ca), es: load(page.content_es) };
        latest.current = next;
        setBlocksByLang(next);
        // Texts estàtics desats (content_*.texts) per a l'edició in-place
        const loadTexts = (content: unknown): Record<string, string> => {
          if (!content || typeof content !== "object") return {};
          const t = (content as { texts?: unknown }).texts;
          if (!t || typeof t !== "object") return {};
          const out: Record<string, string> = {};
          for (const [k, v] of Object.entries(t as Record<string, unknown>)) {
            if (typeof v === "string" && v.trim()) out[k] = v;
          }
          return out;
        };
        const nextTexts = { ca: loadTexts(page.content_ca), es: loadTexts(page.content_es) };
        latestTexts.current = nextTexts;
        setTextsByLang(nextTexts);
        setStatus((page.status as Status) ?? "draft");
        // Si l'iframe ja havia enviat "ready" (carrera: ready abans que acabés
        // la càrrega), rebia blocs buits — reenviem ara el contingut desat.
        post({ action: "set-blocks", blocks: next[lang], lang });
        // Reenvia l'idioma ara que la pàgina realment ha carregat: si l'usuari
        // va canviar de llengua abans de la càrrega, l'iframe podia haver quedat
        // desincronitzat (panell CA + pàgina ES).
        post({ action: "set-lang", lang });
      })
      .catch((e) => alive && setBanner({ type: "error", msg: (e as { error?: string }).error || "Error carregant la pàgina" }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  // Quan canvia l'idioma, sincronitza l'iframe
  useEffect(() => {
    post({ action: "set-lang", lang });
  }, [lang]);

  const post = useCallback((msg: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage({ source: CMS_MSG, ...msg }, window.location.origin);
  }, []);

  // ── Missatges de l'iframe ──────────────────────────────────────────
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data as { source?: string; action?: string; blocks?: unknown; lang?: Lang; id?: string | null; html?: unknown; texts?: unknown };
      if (m?.source !== CMS_MSG || !m.action) return;
      switch (m.action) {
        case "ready":
          post({ action: "set-blocks", blocks: latest.current[lang], lang });
          break;
        case "texts-ready":
          // El runtime de texts ha muntat dins l'iframe: envia els overrides
          // desats (ambdós idiomes) + re-sincronitza l'idioma del panell.
          post({ action: "texts-set", texts: latestTexts.current, lang });
          post({ action: "set-lang", lang });
          break;
        case "texts-change":
          if ((m.lang === "ca" || m.lang === "es") && typeof m.id === "string" && typeof m.html === "string") {
            const l = m.lang;
            const next = { ...latestTexts.current[l], [m.id]: m.html };
            latestTexts.current = { ...latestTexts.current, [l]: next };
            setTextsByLang((s) => ({ ...s, [l]: next }));
            setDirty((d) => ({ ...d, [l]: true }));
          }
          break;
        case "change":
          if (Array.isArray(m.blocks) && (m.lang === "ca" || m.lang === "es")) {
            const l = m.lang;
            latest.current = { ...latest.current, [l]: m.blocks as Block[] };
            setBlocksByLang((s) => ({ ...s, [l]: m.blocks as Block[] }));
            setDirty((d) => ({ ...d, [l]: true }));
          }
          break;
        case "select":
          setSelected(typeof m.id === "string" ? m.id : null);
          break;
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [lang, post]);

  // ── Accions cap a l'iframe ─────────────────────────────────────────
  const addBlock = (type: BlockType) => post({ action: "add-block", type });
  const move = (dir: -1 | 1) => post({ action: "move", dir });
  const remove = () => {
    if (selected && confirm("Esborrar el bloc seleccionat?")) {
      post({ action: "remove" });
      setSelected(null);
    }
  };

  // Inspector: actualitzar camps del bloc seleccionat
  const patchSelected = (patch: Record<string, unknown>) => {
    if (!selected) return;
    const bs = blocks.map((b) => (b.id === selected ? { ...b, data: { ...b.data, ...patch } } : b));
    latest.current = { ...latest.current, [lang]: bs };
    setBlocksByLang((s) => ({ ...s, [lang]: bs }));
    setDirty((d) => ({ ...d, [lang]: true }));
    post({ action: "set-blocks", blocks: bs, lang });
  };

  const save = async (newStatus?: Status) => {
    const v = validateBlocks(blocks);
    if (!v.ok) {
      setBanner({ type: "error", msg: v.error ?? "Contingut invàlid" });
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      // Save combinat: blocs + texts in-place a la mateixa fila `pages`.
      body[`content_${lang}`] = {
        blocks,
        texts: latestTexts.current[lang] ?? {},
      };
      body.status = newStatus ?? status ?? "draft";
      await adminApi.pages.put(slug, body);
      setDirty((d) => ({ ...d, [lang]: false }));
      if (newStatus) setStatus(newStatus);
      setBanner({
        type: "ok",
        msg: newStatus === "published" ? "Publicat — ja és visible a la web" : "Canvis desats",
      });
    } catch (e) {
      setBanner({ type: "error", msg: (e as { error?: string }).error || "Error desant" });
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full rounded-md border px-3 py-2 text-sm";
  const inpStyle = { borderColor: "var(--rule, #e5e3dd)", background: "#fff" };
  const lbl = "mb-1 block text-xs font-medium";
  const lblStyle = { color: "var(--ink-muted, #6b7280)" };
  const btnGhost = "rounded-lg border px-3 py-1.5 text-sm";

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg, #f4f3ef)" }}>
      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--rule, #e5e3dd)", background: "#fff" }}>
        <a href="/admin" className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>← Admin</a>
        <select value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-md border px-3 py-2 text-sm" style={inpStyle}>
          {PAGES.map((p) => (
            <option key={p.slug} value={p.slug}>{p.label}</option>
          ))}
        </select>
        {(["ca", "es"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} className={btnGhost}
            style={lang === l ? { background: "var(--salvia, #7a9471)", color: "#fff", borderColor: "var(--salvia, #7a9471)" } : { borderColor: "var(--rule, #e5e3dd)" }}>
            {l.toUpperCase()}{dirty[l] ? " •" : ""}
          </button>
        ))}
        <div className="flex-1" />
        <select value={status ?? "draft"} onChange={(e) => setStatus(e.target.value as Status)} className="rounded-md border px-3 py-2 text-sm" style={inpStyle}>
          <option value="draft">Esborrany</option>
          <option value="published">Publicat</option>
        </select>
        <button onClick={() => save()} disabled={saving || loading} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>💾 Desa</button>
        <button onClick={() => save("published")} disabled={saving || loading}
          className="rounded-lg px-4 py-1.5 text-sm font-medium text-white" style={{ background: "var(--salvia, #7a9471)" }}>
          Publica
        </button>
      </div>

      {banner && (
        <div className="px-4 py-2 text-sm"
          style={{ background: banner.type === "ok" ? "#f0fdf4" : "#fef2f2", color: banner.type === "ok" ? "#166534" : "#b91c1c" }}>
          {banner.msg}
        </div>
      )}

      {/* Cos: iframe de la pàgina real + inspector */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="Editor visual"
            className="h-[calc(100vh-140px)] w-full rounded-xl border bg-white shadow-sm"
            style={{ borderColor: "var(--rule, #e5e3dd)" }}
          />
        </div>

        {/* Barra lateral: afegir blocs + inspector del bloc seleccionat */}
        <div className="w-72 shrink-0 space-y-4 overflow-y-auto border-l p-4" style={{ borderColor: "var(--rule, #e5e3dd)", background: "#fff" }}>
          <div>
            <p className={lbl} style={lblStyle}>Afegeix un bloc</p>
            <div className="flex gap-2">
              <button onClick={() => addBlock("text")} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>¶ Text</button>
              <button onClick={() => addBlock("image")} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>🖼 Imatge</button>
              <button onClick={() => addBlock("cta")} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>→ CTA</button>
            </div>
          </div>

          {selected && selBlock && (
            <div className="space-y-3 rounded-lg border p-3" style={{ borderColor: "var(--rule, #e5e3dd)" }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: "var(--ink, #1f2937)" }}>
                  {selBlock.type === "text" ? "Bloc de text" : selBlock.type === "image" ? "Imatge" : "Botó CTA"}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => move(-1)} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }} title="Puja">↑</button>
                  <button onClick={() => move(1)} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }} title="Baixa">↓</button>
                  <button onClick={remove} className={btnGhost} style={{ color: "#b91c1c", borderColor: "#b91c1c" }} title="Esborra">✕</button>
                </div>
              </div>

              {selBlock.type === "image" && (
                <>
                  <div>
                    <label className={lbl} style={lblStyle}>URL de la imatge</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.url ?? "")}
                      onChange={(e) => patchSelected({ url: e.target.value })} placeholder="https://…" />
                  </div>
                  <div>
                    <label className={lbl} style={lblStyle}>Text alternatiu</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.alt ?? "")}
                      onChange={(e) => patchSelected({ alt: e.target.value })} placeholder="Descripció breu" />
                  </div>
                  <div>
                    <label className={lbl} style={lblStyle}>Peu de foto</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.caption ?? "")}
                      onChange={(e) => patchSelected({ caption: e.target.value })} />
                  </div>
                  <p className="text-xs" style={lblStyle}>Mida: estira el vèrtex ● de la imatge. Alineació: botons sota la imatge.</p>
                </>
              )}

              {selBlock.type === "cta" && (
                <>
                  <div>
                    <label className={lbl} style={lblStyle}>Text del botó</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.label ?? "")}
                      onChange={(e) => patchSelected({ label: e.target.value })} />
                  </div>
                  <div>
                    <label className={lbl} style={lblStyle}>Enllaç</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.href ?? "")}
                      onChange={(e) => patchSelected({ href: e.target.value })} placeholder="https://… o /informes" />
                  </div>
                  <div>
                    <label className={lbl} style={lblStyle}>Nota sota el botó</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.note ?? "")}
                      onChange={(e) => patchSelected({ note: e.target.value })} />
                  </div>
                </>
              )}

              {selBlock.type === "text" && (
                <p className="text-xs" style={lblStyle}>Clica sobre el text i escriu directament a la pàgina.</p>
              )}
            </div>
          )}

          {!selected && (
            <p className="text-xs" style={lblStyle}>
              Clica qualsevol bloc de la pàgina per editar-lo. Arrossega la nansa ⠿ per moure&apos;l.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
