"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { adminApi, type AdminInforme, type AdminError } from "@/lib/admin-api";
import { ReportBody } from "@/components/informe/report-body";
import { useLanguage } from "@/components/language-provider";
import type { Report, ReportBlock } from "@/lib/reports";

/**
 * Previsualització + edició d'un informe (draft o publicat) des del backoffice.
 *
 * Objectiu: que en Paolo vegi l'informe EXACTAMENT com es veurà publicat
 * (mateix component ReportBody que la pàgina pública) i pugui corregir els
 * textos i enllaços abans de prémer «Publicar».
 *
 * Editor "progressiu" (opció 3): camps de text pla per a TOTS els textos
 * editables de l'informe (títol, resum, fitxa, els 8 blocs, la URL de la
 * font). Sense negretes ni colors — el disseny queda fixat per la Roser.
 */

const COLORS = {
  bg: "#F2F5F1",
  card: "#FBFBF9",
  border: "#D8E2DA",
  ink: "#141B18",
  muted: "#5C6B62",
  salvia: "#5E8772",
  danger: "#A0522D",
  warn: "#8A6D2B",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  borderRadius: 6,
  border: `1px solid ${COLORS.border}`,
  fontSize: 14,
  background: "#fff",
  color: COLORS.ink,
};
const label: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.muted,
  marginBottom: 3,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
const ta: React.CSSProperties = { ...input, minHeight: 70, resize: "vertical" };

function toReport(r: AdminInforme): Report {
  return {
    slug: r.slug,
    title: r.title,
    institution: r.institution,
    date: r.date,
    pages: r.pages,
    type: r.type as Report["type"],
    scope: r.scope as Report["scope"],
    tags: r.tags,
    certifications: r.certifications,
    summary: r.summary,
    url: r.url,
  };
}

export default function AdminInformePage() {
  const { user, loading } = useAuth();
  const { lang } = useLanguage();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [informe, setInforme] = useState<AdminInforme | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ t: "ok" | "error"; m: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // Edició local (per idioma actiu)
  const [viewLang, setViewLang] = useState<"ca" | "es">("ca");
  const [title, setTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [date, setDate] = useState("");
  const [pages, setPages] = useState("0");
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [block, setBlock] = useState<ReportBlock | null>(null);

  useEffect(() => {
    if (loading || !user || !slug) return;
    adminApi
      .reports.get(slug)
      .then((r) => setInforme(r.report))
      .catch((e: AdminError) => setErr(e.error || "No s'ha pogut carregar"));
  }, [loading, user, slug]);

  // En carregar (o canviar d'idioma), sincronitza els camps amb el bloc actiu
  useEffect(() => {
    if (!informe) return;
    setTitle(informe.title);
    setInstitution(informe.institution);
    setDate(informe.date);
    setPages(String(informe.pages));
    setUrl(informe.url);
    setSummary(informe.summary);
    const src = viewLang === "ca" ? informe.content_ca : informe.content_es;
    setBlock((src as ReportBlock) ?? null);
  }, [informe, viewLang]);

  const report = useMemo(() => (informe ? toReport(informe) : null), [informe]);

  const setField = (patch: Partial<ReportBlock>) =>
    setBlock((b) => (b ? { ...b, ...patch } : b));

  const saveContent = async () => {
    if (!informe || !block) return;
    setBusy(true);
    setBanner(null);
    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        institution: institution.trim(),
        date,
        pages: Number(pages) || 0,
        url,
        summary,
      };
      if (viewLang === "ca") payload.content_ca = block;
      else payload.content_es = block;
      await adminApi.reports.update(slug, payload);
      setInforme((prev) =>
        prev
          ? {
              ...prev,
              title: title.trim(),
              institution: institution.trim(),
              date,
              pages: Number(pages) || 0,
              url,
              summary,
              content_ca: viewLang === "ca" ? (block as unknown as Record<string, unknown>) : prev.content_ca,
              content_es: viewLang === "es" ? (block as unknown as Record<string, unknown>) : prev.content_es,
            }
          : prev
      );
      setBanner({ t: "ok", m: "Desat correctament." });
    } catch (e) {
      setBanner({ t: "error", m: (e as AdminError).error || "Error desant" });
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!informe) return;
    if (!confirm(`Publicar "${informe.title}"? Serà visible a la biblioteca pública.`)) return;
    setBusy(true);
    setBanner(null);
    try {
      await adminApi.reports.update(slug, { status: "published" });
      setInforme((prev) => (prev ? { ...prev, status: "published" } : prev));
      setBanner({ t: "ok", m: "Publicat. Ja és visible a /informes." });
    } catch (e) {
      setBanner({ t: "error", m: (e as AdminError).error || "Error publicant" });
    } finally {
      setBusy(false);
    }
  };

  const unpublish = async () => {
    if (!informe) return;
    setBusy(true);
    setBanner(null);
    try {
      await adminApi.reports.update(slug, { status: "draft" });
      setInforme((prev) => (prev ? { ...prev, status: "draft" } : prev));
      setBanner({ t: "ok", m: "Revertit a esborrany." });
    } catch (e) {
      setBanner({ t: "error", m: (e as AdminError).error || "Error revertint" });
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <Shell>
        <p style={{ color: COLORS.muted }}>Cal iniciar sessió per accedir al backoffice.</p>
      </Shell>
    );
  }
  if (err) {
    return (
      <Shell>
        <p style={{ color: COLORS.danger }}>{err}</p>
      </Shell>
    );
  }
  if (!informe || !report || !block) {
    return (
      <Shell>
        <p style={{ color: COLORS.muted }}>Carregant informe…</p>
      </Shell>
    );
  }

  const statusPill = {
    draft: { c: COLORS.warn, t: "Esborrany" },
    validated: { c: "#166534", t: "Validat" },
    published: { c: "#166534", t: "Publicat" },
    archived: { c: COLORS.muted, t: "Arxivat" },
  }[informe.status] ?? { c: COLORS.muted, t: informe.status };

  return (
    <Shell>
      {/* Capçalera */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <a href="/admin" style={{ fontSize: 13, color: COLORS.salvia, textDecoration: "none" }}>← Panell</a>
          <h1 style={{ margin: "6px 0 4px", fontSize: 22, color: COLORS.ink }}>
            {informe.title || slug}
          </h1>
          <span style={{ fontSize: 12, color: COLORS.muted }}>
            {informe.institution} · {informe.date} ·{" "}
            <span style={{ padding: "2px 8px", borderRadius: 20, background: statusPill.c, color: "#fff", fontSize: 11, fontWeight: 700 }}>
              {statusPill.t}
            </span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveContent} disabled={busy} style={btnPrimary}>
            {busy ? "Desant…" : "Desa"}
          </button>
          {informe.status !== "published" ? (
            <button onClick={publish} disabled={busy} style={{ ...btnPrimary, background: COLORS.danger }}>
              Publicar →
            </button>
          ) : (
            <button onClick={unpublish} disabled={busy} style={btnGhost}>
              Revertir a esborrany
            </button>
          )}
        </div>
      </div>

      {banner && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, border: `1px solid ${banner.t === "ok" ? "#166534" : COLORS.danger}`, background: banner.t === "ok" ? "#f0fdf4" : "#fef2f2", color: banner.t === "ok" ? "#166534" : COLORS.danger, fontSize: 14 }}>
          {banner.m}
        </div>
      )}

      {/* Selector d'idioma */}
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        {(["ca", "es"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setViewLang(l)}
            style={{
              padding: "7px 16px",
              borderRadius: 6,
              border: `1px solid ${COLORS.border}`,
              background: viewLang === l ? COLORS.salvia : "transparent",
              color: viewLang === l ? "#fff" : COLORS.ink,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {l === "ca" ? "Català" : "Castellà"}
          </button>
        ))}
      </div>

      {/* Layout: previsualització (esquerra) + editor (dreta) */}
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16, alignItems: "start" }}>
        {/* Previsualització */}
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
          <div style={{ padding: "8px 14px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
            Previsualització ({viewLang === "ca" ? "català" : "castellà"})
          </div>
          <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <ReportBody report={report} content={block} lang={viewLang} />
          </div>
        </div>

        {/* Editor */}
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18, background: COLORS.card }}>
          <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 12 }}>
            Editor — textos i enllaços
          </p>

          <div style={{ marginBottom: 10 }}>
            <label style={label}>Títol</label>
            <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Institució</label>
            <input style={input} value={institution} onChange={(e) => setInstitution(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Data</label>
              <input style={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div style={{ flex: 0.6 }}>
              <label style={label}>Pàgines</label>
              <input style={input} type="number" min={0} value={pages} onChange={(e) => setPages(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={label}>URL de la font original</label>
            <input style={input} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Resum (card biblioteca)</label>
            <textarea style={ta} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "14px 0" }} />

          {/* ── Bloc 1: semàfor ── */}
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Semàfor — nota</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...input, maxWidth: 60 }} value={block.semafor.grade} onChange={(e) => setField({ semafor: { ...block.semafor, grade: e.target.value.toUpperCase() as ReportBlock["semafor"]["grade"] } })} />
              <input style={input} value={block.semafor.gradeLabel} onChange={(e) => setField({ semafor: { ...block.semafor, gradeLabel: e.target.value } })} />
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={label}>Semàfor — indicadors (nom | nota)</label>
            {block.semafor.indicators.map((ind, i) => (
              <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 8, marginBottom: 6, background: "#fff" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <input style={{ ...input, flex: 1 }} value={ind.name} onChange={(e) => setField({ semafor: { ...block.semafor, indicators: block.semafor.indicators.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) } })} />
                  <select
                    style={{ ...input, maxWidth: 90 }}
                    value={ind.status}
                    onChange={(e) => setField({ semafor: { ...block.semafor, indicators: block.semafor.indicators.map((x, j) => (j === i ? { ...x, status: e.target.value as ReportBlock["semafor"]["indicators"][number]["status"] } : x)) } })}
                  >
                    <option value="verd">verd</option>
                    <option value="groc">groc</option>
                    <option value="vermell">vermell</option>
                  </select>
                </div>
                <textarea style={{ ...ta, minHeight: 46 }} value={ind.note} onChange={(e) => setField({ semafor: { ...block.semafor, indicators: block.semafor.indicators.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)) } })} />
              </div>
            ))}
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "14px 0" }} />

          {/* ── Bloc 2: dades clau ── */}
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Dades clau (valor | descripció)</label>
            {block.dadesClau.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                <input style={{ ...input, flex: 0.5 }} value={d.value} onChange={(e) => setField({ dadesClau: block.dadesClau.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
                <input style={{ ...input, flex: 1 }} value={d.label} onChange={(e) => setField({ dadesClau: block.dadesClau.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={label}>Resum executiu</label>
            <textarea style={{ ...ta, minHeight: 120 }} value={block.resumExecutiu} onChange={(e) => setField({ resumExecutiu: e.target.value })} />
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "14px 0" }} />

          {/* ── Bloc 4: implicacions ── */}
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Implicacions — Empreses</label>
            <textarea style={ta} value={block.implicacions.empreses} onChange={(e) => setField({ implicacions: { ...block.implicacions, empreses: e.target.value } })} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Implicacions — Reguladors</label>
            <textarea style={ta} value={block.implicacions.reguladors} onChange={(e) => setField({ implicacions: { ...block.implicacions, reguladors: e.target.value } })} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Implicacions — Ciutadans</label>
            <textarea style={ta} value={block.implicacions.ciutadans} onChange={(e) => setField({ implicacions: { ...block.implicacions, ciutadans: e.target.value } })} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={label}>Més enllà del Checkbox — criteri</label>
            <input style={input} value={block.mesEnllaCheckbox.criteri} onChange={(e) => setField({ mesEnllaCheckbox: { ...block.mesEnllaCheckbox, criteri: e.target.value } })} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Més enllà del Checkbox — text</label>
            <textarea style={ta} value={block.mesEnllaCheckbox.body} onChange={(e) => setField({ mesEnllaCheckbox: { ...block.mesEnllaCheckbox, body: e.target.value } })} />
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "14px 0" }} />

          {/* ── Bloc 6: connexions ── */}
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Connexions (tipus | títol | descripció)</label>
            {block.connexions.map((c, i) => (
              <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 8, marginBottom: 6, background: "#fff" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <input style={{ ...input, flex: 0.6 }} value={c.type} onChange={(e) => setField({ connexions: block.connexions.map((x, j) => (j === i ? { ...x, type: e.target.value } : x)) })} />
                  <input style={{ ...input, flex: 1 }} value={c.target} onChange={(e) => setField({ connexions: block.connexions.map((x, j) => (j === i ? { ...x, target: e.target.value } : x)) })} />
                </div>
                <textarea style={{ ...ta, minHeight: 46 }} value={c.desc} onChange={(e) => setField({ connexions: block.connexions.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)) })} />
              </div>
            ))}
          </div>

          {/* ── Bloc 7: accions ── */}
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Accions recomanades (títol | descripció)</label>
            {block.accions.map((a, i) => (
              <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 8, marginBottom: 6, background: "#fff" }}>
                <input style={{ ...input, marginBottom: 4 }} value={a.title} onChange={(e) => setField({ accions: block.accions.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} />
                <textarea style={{ ...ta, minHeight: 46 }} value={a.desc} onChange={(e) => setField({ accions: block.accions.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)) })} />
              </div>
            ))}
          </div>

          {/* ── Bloc 8: cross-refs ── */}
          <div style={{ marginBottom: 10 }}>
            <label style={label}>Cross-reference (framework | criteri | impacte)</label>
            {block.crossRefs.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                <input style={{ ...input, flex: 1 }} value={c.framework} onChange={(e) => setField({ crossRefs: block.crossRefs.map((x, j) => (j === i ? { ...x, framework: e.target.value } : x)) })} />
                <input style={{ ...input, flex: 1.4 }} value={c.criterion} onChange={(e) => setField({ crossRefs: block.crossRefs.map((x, j) => (j === i ? { ...x, criterion: e.target.value } : x)) })} />
                <input style={{ ...input, flex: 0.5 }} value={c.impact} onChange={(e) => setField({ crossRefs: block.crossRefs.map((x, j) => (j === i ? { ...x, impact: e.target.value } : x)) })} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, padding: "28px 32px", color: COLORS.ink }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  background: COLORS.salvia,
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};
const btnGhost: React.CSSProperties = {
  background: "transparent",
  border: `1px solid ${COLORS.border}`,
  padding: "10px 20px",
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
  color: COLORS.ink,
};
