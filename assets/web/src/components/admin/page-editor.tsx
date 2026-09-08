"use client";

import { useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Block, BlockType, IMAGE_WIDTHS, newBlockId, sanitizeHtml, validateBlocks } from "@/lib/blocks";

/**
 * page-editor.tsx — Editor de pàgines amb blocs (fase 3, experiència tipus WordPress).
 *
 * · Llista vertical de blocs (text / imatge / CTA) per pàgina i idioma.
 * · Reordre amb fletxes ↑↓ (drag&drop arriba després), afegeix/esborra blocs.
 * · Imatge: mida en presets 25/50/75/100%, focal point X/Y, alt i peu.
 * · CTA: text, enllaç, estil solid/outline, nota.
 * · Desa a la taula `pages` (content_ca/content_es = { blocks: [...] })
 *   amb status draft/published. Publicat = visible a la web (FreeBlocks).
 *
 * Legacy: si la pàgina té HTML per seccions ({sections}), s'importa com a
 * blocs de text en obrir l'editor (sense perdre res).
 */

const COLORS = {
  bg: "#f4f3ef",
  card: "#ffffff",
  ink: "#1f2937",
  muted: "#6b7280",
  salvia: "#7a9471",
  border: "#e5e3dd",
  danger: "#b91c1c",
  ok: "#166534",
};

type Lang = "ca" | "es";
type Status = "draft" | "published" | "archived";

const PAGES = [
  { slug: "qui-som", label: "Qui som" },
  { slug: "que-fem", label: "Què fem" },
];

const TYPE_LABEL: Record<BlockType, string> = { text: "Text", image: "Imatge", cta: "CTA" };
const TYPE_ICON: Record<BlockType, string> = { text: "¶", image: "🖼", cta: "→" };

function input(v: unknown, onChange: (v: string) => void, placeholder = "", type = "text") {
  return (
    <input
      type={type}
      value={typeof v === "string" || typeof v === "number" ? String(v) : ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "8px 10px",
        borderRadius: 6,
        border: `1px solid ${COLORS.border}`,
        fontSize: 14,
        background: COLORS.card,
      }}
    />
  );
}

export function PageEditor() {
  const [slug, setSlug] = useState("qui-som");
  const [lang, setLang] = useState<Lang>("ca");
  const [status, setStatus] = useState<Status | null>(null);
  const [blocksByLang, setBlocksByLang] = useState<Record<Lang, Block[]>>({ ca: [], es: [] });
  const [openId, setOpenId] = useState<string | null>(null);
  const [dirty, setDirty] = useState<Record<Lang, boolean>>({ ca: false, es: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const imported = useRef<Record<string, boolean>>({});

  // ── Càrrega de la pàgina ──
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setBanner(null);
    adminApi.pages
      .get(slug)
      .then(({ page }) => {
        if (!alive) return;
        const load = (content: unknown): Block[] => {
          if (!content || typeof content !== "object") return [];
          const obj = content as { blocks?: unknown; sections?: unknown };
          if (Array.isArray(obj.blocks)) {
            return obj.blocks.filter(
              (b): b is Block =>
                !!b && typeof b === "object" && typeof (b as Block).id === "string" && (b as Block).type in TYPE_LABEL
            );
          }
          // Legacy: seccions HTML → blocs de text
          if (obj.sections && typeof obj.sections === "object" && !imported.current[slug]) {
            const secs = obj.sections as Record<string, string>;
            imported.current[slug] = true;
            return Object.entries(secs).map(([id, html]) => ({
              id: newBlockId(),
              type: "text" as BlockType,
              data: { html, origin: `secció:${id}` },
            }));
          }
          return [];
        };
        setBlocksByLang({ ca: load(page.content_ca), es: load(page.content_es) });
        setStatus((page.status as Status) ?? "draft");
      })
      .catch((e) => alive && setBanner({ type: "error", msg: e.error || "Error carregant la pàgina" }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  const blocks = blocksByLang[lang];

  const mutate = (fn: (bs: Block[]) => Block[]) => {
    setBlocksByLang((s) => ({ ...s, [lang]: fn(s[lang]) }));
    setDirty((d) => ({ ...d, [lang]: true }));
  };

  const move = (idx: number, dir: -1 | 1) =>
    mutate((bs) => {
      const j = idx + dir;
      if (j < 0 || j >= bs.length) return bs;
      const copy = [...bs];
      [copy[idx], copy[j]] = [copy[j], copy[idx]];
      return copy;
    });

  const updateData = (id: string, patch: Record<string, unknown>) =>
    mutate((bs) => bs.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...patch } } : b)));

  const addBlock = (type: BlockType) =>
    mutate((bs) => {
      const nb: Block =
        type === "text"
          ? { id: newBlockId(), type, data: { html: "<p>Escriu aquí…</p>" } }
          : type === "image"
            ? { id: newBlockId(), type, data: { url: "", alt: "", widthPct: 100, focalX: 50, focalY: 50, caption: "" } }
            : { id: newBlockId(), type, data: { label: "", href: "https://", style: "solid", note: "" } };
      setOpenId(nb.id);
      return [...bs, nb];
    });

  const save = async (newStatus?: Status) => {
    const other = lang === "ca" ? "es" : "ca";
    const v = validateBlocks(blocks);
    if (!v.ok) {
      setBanner({ type: "error", msg: v.error || "Contingut invàlid" });
      return;
    }
    // Higiene: neteja HTML de blocs de text abans de desar
    const clean = blocks.map((b) =>
      b.type === "text" ? { ...b, data: { ...b.data, html: sanitizeHtml(String(b.data.html || "")) } } : b
    );
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      body[`content_${lang}`] = { blocks: clean };
      if (other !== lang && blocksByLang[other].length && !dirty[other]) {
        // no toquem l'altre idioma si no s'ha editat
      }
      const st = newStatus ?? status ?? "draft";
      body.status = st;
      await adminApi.pages.put(slug, body);
      setBlocksByLang((s) => ({ ...s, [lang]: clean }));
      setDirty((d) => ({ ...d, [lang]: false }));
      if (newStatus) setStatus(newStatus);
      setBanner({
        type: "ok",
        msg: newStatus === "published" ? "Pàgina publicada — ja és visible a la web" : "Canvis desats",
      });
    } catch (e) {
      const err = e as { error?: string };
      setBanner({ type: "error", msg: err.error || "Error desant" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      {/* Barra superior: pàgina + idioma + estat + accions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <select value={slug} onChange={(e) => setSlug(e.target.value)} style={sel}>
          {PAGES.map((p) => (
            <option key={p.slug} value={p.slug}>{p.label}</option>
          ))}
        </select>
        {(["ca", "es"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ ...tabBtn, ...(lang === l ? { background: COLORS.salvia, color: "#fff" } : {}) }}>
            {l.toUpperCase()}{dirty[l] ? " •" : ""}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <select value={status ?? "draft"} onChange={(e) => setStatus(e.target.value as Status)} style={sel}>
          <option value="draft">Esborrany</option>
          <option value="published">Publicat</option>
        </select>
        <button onClick={() => save()} style={btnGhostS} disabled={saving || loading}>💾 Desa</button>
        <button onClick={() => save("published")} style={btnPrimaryS} disabled={saving || loading}>Publica</button>
      </div>

      {banner && (
        <div style={{ ...note, borderColor: banner.type === "ok" ? COLORS.ok : COLORS.danger, background: banner.type === "ok" ? "#f0fdf4" : "#fef2f2" }}>
          {banner.msg}
          <button onClick={() => setBanner(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: COLORS.muted }}>✕</button>
        </div>
      )}

      <p style={{ color: COLORS.muted, fontSize: 14, margin: "10px 0" }}>
        Els blocs es mostren a la web en aquest ordre, sota el contingut fix de la pàgina. Clica un bloc per editar-lo.
      </p>

      {/* Llista de blocs */}
      {loading ? (
        <p style={{ color: COLORS.muted }}>Carregant…</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {blocks.map((b, i) => {
            const open = openId === b.id;
            return (
              <div key={b.id} style={{ ...card, borderLeft: `4px solid ${COLORS.salvia}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{TYPE_ICON[b.type]}</span>
                  <strong style={{ color: COLORS.ink }}>{TYPE_LABEL[b.type]}</strong>
                  {typeof b.data.origin === "string" && <span style={{ color: COLORS.muted, fontSize: 12 }}>· importat de {b.data.origin}</span>}
                  <div style={{ flex: 1 }} />
                  <button onClick={() => move(i, -1)} disabled={i === 0} style={btnIcon} title="Puja">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} style={btnIcon} title="Baixa">↓</button>
                  <button onClick={() => setOpenId(open ? null : b.id)} style={btnIcon} title="Edita">✎</button>
                  <button onClick={() => confirm("Esborrar aquest bloc?") && mutate((bs) => bs.filter((x) => x.id !== b.id))} style={{ ...btnIcon, color: COLORS.danger }} title="Esborra">✕</button>
                </div>

                {/* Preview tancat */}
                {!open && (
                  <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {b.type === "text" && String(b.data.html || "").replace(/<[^>]+>/g, " ").slice(0, 110)}
                    {b.type === "image" && String(b.data.url || "(sense URL)")}
                    {b.type === "cta" && `${b.data.label || "(sense text)"} → ${b.data.href || ""}`}
                  </div>
                )}

                {/* Formulari obert */}
                {open && (
                  <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                    {b.type === "text" && (
                      <textarea
                        value={String(b.data.html || "")}
                        onChange={(e) => updateData(b.id, { html: e.target.value })}
                        rows={7}
                        style={{ width: "100%", fontFamily: "monospace", fontSize: 13, padding: 10, borderRadius: 6, border: `1px solid ${COLORS.border}` }}
                      />
                    )}
                    {b.type === "image" && (
                      <>
                        <label style={lbl}>URL de la imatge</label>
                        {input(b.data.url, (v) => updateData(b.id, { url: v }), "https://…")}
                        <label style={lbl}>Text alternatiu (accessibilitat)</label>
                        {input(b.data.alt, (v) => updateData(b.id, { alt: v }), "Descripció breu")}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                          <div>
                            <label style={lbl}>Mida</label>
                            <select value={String(b.data.widthPct ?? 100)} onChange={(e) => updateData(b.id, { widthPct: Number(e.target.value) })} style={sel}>
                              {IMAGE_WIDTHS.map((w) => (
                                <option key={w} value={w}>{w}%</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={lbl}>Focus horitzontal</label>
                            {input(b.data.focalX, (v) => updateData(b.id, { focalX: Number(v) || 0 }), "50", "number")}
                          </div>
                          <div>
                            <label style={lbl}>Focus vertical</label>
                            {input(b.data.focalY, (v) => updateData(b.id, { focalY: Number(v) || 0 }), "50", "number")}
                          </div>
                        </div>
                        <label style={lbl}>Peu de foto</label>
                        {input(b.data.caption, (v) => updateData(b.id, { caption: v }), "Opcional")}
                      </>
                    )}
                    {b.type === "cta" && (
                      <>
                        <label style={lbl}>Text del botó</label>
                        {input(b.data.label, (v) => updateData(b.id, { label: v }), "Ex: Demana una demo")}
                        <label style={lbl}>Enllaç</label>
                        {input(b.data.href, (v) => updateData(b.id, { href: v }), "https://… o /informes")}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                          <div>
                            <label style={lbl}>Estil</label>
                            <select value={String(b.data.style ?? "solid")} onChange={(e) => updateData(b.id, { style: e.target.value })} style={sel}>
                              <option value="solid">Ple (salvia)</option>
                              <option value="outline">Contorn</option>
                            </select>
                          </div>
                          <div>
                            <label style={lbl}>Nota sota el botó</label>
                            {input(b.data.note, (v) => updateData(b.id, { note: v }), "Opcional")}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {blocks.length === 0 && (
            <div style={note}>Encara no hi ha blocs per a {lang.toUpperCase()}. Afegeix-ne amb els botons de sota.</div>
          )}
        </div>
      )}

      {/* Afegir blocs */}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button onClick={() => addBlock("text")} style={btnGhostS} disabled={loading}>+ Text</button>
        <button onClick={() => addBlock("image")} style={btnGhostS} disabled={loading}>+ Imatge</button>
        <button onClick={() => addBlock("cta")} style={btnGhostS} disabled={loading}>+ CTA</button>
      </div>
    </section>
  );
}

// ── Estils (mateixa paleta que /admin) ──
const sel: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: `1px solid ${COLORS.border}`,
  fontSize: 15,
  background: COLORS.card,
};
const tabBtn: React.CSSProperties = {
  padding: "8px 18px",
  borderRadius: 8,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.card,
  cursor: "pointer",
  fontSize: 14,
  color: COLORS.ink,
};
const card: React.CSSProperties = {
  background: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  padding: "14px 18px",
  fontSize: 15,
};
const note: React.CSSProperties = {
  border: `1px solid ${COLORS.border}`,
  borderLeft: `4px solid ${COLORS.salvia}`,
  background: COLORS.card,
  borderRadius: 8,
  padding: "12px 16px",
  fontSize: 14,
  margin: "12px 0",
};
const lbl: React.CSSProperties = { fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 4 };
const btnIcon: React.CSSProperties = {
  background: "transparent",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  width: 32,
  height: 32,
  cursor: "pointer",
  color: COLORS.ink,
  fontSize: 14,
};
const btnPrimaryS: React.CSSProperties = {
  background: COLORS.salvia,
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
};
const btnGhostS: React.CSSProperties = {
  background: "transparent",
  border: `1px solid ${COLORS.border}`,
  padding: "8px 14px",
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
  color: COLORS.ink,
};
