"use client";

import { useMemo, useState } from "react";
import { adminApi, type AdminInforme } from "@/lib/admin-api";
import { getReportContent } from "@/lib/reports-content";
import type { ReportBlock } from "@/lib/reports";

/**
 * Editor d'informes del panell /admin (fase 2).
 *
 * Disseny: els camps que en Paolo edita sovint (títol, data, resum, textos
 * dels blocs) són camps de formulari normals. Les estructures complexes
 * (semàfor, taules de connexions/accions) queden com a JSON validat.
 *
 * Preompliment: si la fila de la BD encara no té contingut (content_* null,
 * cas del seed inicial), es parteix del contingut estàtic de
 * reports-content.ts — així el primer "Desa" migra el contingut real a la BD.
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

type LangTab = "ca" | "es";

interface ContentFields {
  resumExecutiu: string;
  empreses: string;
  reguladors: string;
  ciutadans: string;
  criteri: string;
  body: string;
  complexJson: string; // semafor + dadesClau + connexions + accions + crossRefs
}

const EMPTY_FIELDS: ContentFields = {
  resumExecutiu: "",
  empreses: "",
  reguladors: "",
  ciutadans: "",
  criteri: "",
  body: "",
  complexJson: "{}",
};

/** Esquelet mínim quan no hi ha contingut estàtic ni de BD. */
function skeleton(): ReportBlock {
  return {
    semafor: { grade: "B", gradeLabel: "Robust", indicators: [] },
    dadesClau: [],
    resumExecutiu: "",
    implicacions: { empreses: "", reguladors: "", ciutadans: "" },
    mesEnllaCheckbox: { criteri: "", body: "" },
    connexions: [],
    accions: [],
    crossRefs: [],
  };
}

function fieldsFromBlock(block: ReportBlock | null | undefined): ContentFields {
  if (!block) return { ...EMPTY_FIELDS };
  const rest = {
    semafor: block.semafor,
    dadesClau: block.dadesClau,
    connexions: block.connexions,
    accions: block.accions,
    crossRefs: block.crossRefs,
  };
  return {
    resumExecutiu: block.resumExecutiu ?? "",
    empreses: block.implicacions?.empreses ?? "",
    reguladors: block.implicacions?.reguladors ?? "",
    ciutadans: block.implicacions?.ciutadans ?? "",
    criteri: block.mesEnllaCheckbox?.criteri ?? "",
    body: block.mesEnllaCheckbox?.body ?? "",
    complexJson: JSON.stringify(rest, null, 2),
  };
}

function blockFromFields(f: ContentFields): ReportBlock | null {
  let rest: Record<string, unknown>;
  try {
    rest = JSON.parse(f.complexJson) as Record<string, unknown>;
  } catch {
    return null; // el cridant mostra l'error de JSON
  }
  return {
    ...(rest as unknown as ReportBlock),
    resumExecutiu: f.resumExecutiu,
    implicacions: { empreses: f.empreses, reguladors: f.reguladors, ciutadans: f.ciutadans },
    mesEnllaCheckbox: { criteri: f.criteri, body: f.body },
  };
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 6,
  border: `1px solid ${COLORS.border}`,
  fontSize: 15,
  background: "#fff",
  color: COLORS.ink,
};
const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: COLORS.muted,
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};
const field2: React.CSSProperties = { flex: 1, minWidth: 160 };

export function InformeEditor({
  informe,
  creating,
  busy,
  onClose,
}: {
  informe: AdminInforme | null; // null en mode creació
  creating: boolean;
  busy: boolean;
  onClose: (saved: boolean) => void;
}) {
  const isNew = creating || informe === null;

  // ── Camps bàsics ──
  const [slug, setSlug] = useState(informe?.slug ?? "");
  const [title, setTitle] = useState(informe?.title ?? "");
  const [institution, setInstitution] = useState(informe?.institution ?? "");
  const [date, setDate] = useState(informe?.date ?? new Date().toISOString().slice(0, 10));
  const [pages, setPages] = useState(String(informe?.pages ?? 0));
  const [type, setType] = useState(informe?.type ?? "official");
  const [scope, setScope] = useState(informe?.scope ?? "EU");
  const [status, setStatus] = useState(informe?.status ?? "draft");
  const [summary, setSummary] = useState(informe?.summary ?? "");
  const [url, setUrl] = useState(informe?.url ?? "");
  const [tagsText, setTagsText] = useState((informe?.tags ?? []).join(", "));
  const [certsText, setCertsText] = useState((informe?.certifications ?? []).join(", "));

  // ── Contingut per idioma (preomplert des de BD o estàtic) ──
  const initial = useMemo((): Record<LangTab, ContentFields> => {
    const fromDb = (lang: LangTab) =>
      (lang === "ca" ? informe?.content_ca : informe?.content_es) as ReportBlock | null;
    const fromStatic = (lang: LangTab) =>
      informe ? (getReportContent(informe.slug, lang) ?? null) : null;
    const pick = (lang: LangTab): ReportBlock | null =>
      fromDb(lang) ?? fromStatic(lang) ?? skeleton();
    return { ca: fieldsFromBlock(pick("ca")), es: fieldsFromBlock(pick("es")) };
  }, [informe]);

  const [ca, setCa] = useState<ContentFields>(initial.ca);
  const [es, setEs] = useState<ContentFields>(initial.es);
  const [langTab, setLangTab] = useState<LangTab>("ca");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fields = langTab === "ca" ? ca : es;
  const setFields = (patch: Partial<ContentFields>) =>
    langTab === "ca" ? setCa({ ...ca, ...patch }) : setEs({ ...es, ...patch });

  const save = async () => {
    setError(null);
    const blockCa = blockFromFields(ca);
    const blockEs = blockFromFields(es);
    if (!blockCa || !blockEs) {
      setError("El JSON dels blocs complexos té un error de sintaxi (revisa la pestanya activa).");
      return;
    }
    if (!title.trim() || !institution.trim() || !date.trim()) {
      setError("Títol, institució i data són obligatoris.");
      return;
    }
    if (isNew && !/^[a-z0-9-]{3,80}$/.test(slug.trim())) {
      setError("El slug només pot tenir minúscules, números i guions (3-80 caràcters).");
      return;
    }
    const payload = {
      title: title.trim(),
      institution: institution.trim(),
      date,
      pages: Number(pages) || 0,
      type,
      scope,
      status,
      summary,
      url,
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      certifications: certsText.split(",").map((t) => t.trim()).filter(Boolean),
      content_ca: blockCa,
      content_es: blockEs,
    };
    setSaving(true);
    try {
      if (isNew) {
        await adminApi.reports.create({ slug: slug.trim(), ...payload });
      } else {
        await adminApi.reports.update(informe!.slug, payload);
      }
      onClose(true);
    } catch (e) {
      const err = e as { error?: string };
      setError(err.error || "No s'ha pogut desar.");
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,27,24,.55)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px 12px",
        overflowY: "auto",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? "Crea informe" : "Edita informe"}
    >
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          maxWidth: 860,
          width: "100%",
          padding: "26px 30px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 22, color: COLORS.ink }}>
            {isNew ? "Crea un informe nou" : `Edita: ${informe!.slug}`}
          </h2>
          <button onClick={() => onClose(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: COLORS.muted }} aria-label="Tanca">✕</button>
        </div>

        {error && (
          <div style={{ border: `1px solid ${COLORS.danger}`, background: "#fef2f2", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 14, color: COLORS.danger }}>
            {error}
          </div>
        )}

        {/* ── Dades bàsiques ── */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {isNew && (
            <div style={field2}>
              <label style={label}>Identificador (slug)</label>
              <input style={input} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ex: cnmv-circular-març-2026" />
            </div>
          )}
          <div style={{ flex: 2, minWidth: 260 }}>
            <label style={label}>Títol</label>
            <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={field2}>
            <label style={label}>Institució</label>
            <input style={input} value={institution} onChange={(e) => setInstitution(e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <div style={field2}>
            <label style={label}>Data (YYYY-MM-DD)</label>
            <input style={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={{ ...field2, maxWidth: 110 }}>
            <label style={label}>Pàgines</label>
            <input style={input} type="number" min={0} value={pages} onChange={(e) => setPages(e.target.value)} />
          </div>
          <div style={field2}>
            <label style={label}>Tipus</label>
            <select style={input} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="regulatory">regulatory</option>
              <option value="framework">framework</option>
              <option value="rating">rating</option>
              <option value="industry">industry</option>
              <option value="official">official</option>
            </select>
          </div>
          <div style={field2}>
            <label style={label}>Àmbit</label>
            <select style={input} value={scope} onChange={(e) => setScope(e.target.value)}>
              <option value="CAT">CAT</option>
              <option value="ES">ES</option>
              <option value="EU">EU</option>
              <option value="GLOBAL">GLOBAL</option>
            </select>
          </div>
          <div style={field2}>
            <label style={label}>Estat</label>
            <select style={input} value={status} onChange={(e) => setStatus(e.target.value as AdminInforme["status"])}>
              <option value="draft">esborrany</option>
              <option value="validated">validat</option>
              <option value="published">publicat</option>
              <option value="archived">arxivat</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={label}>Resum (card de la biblioteca)</label>
          <textarea style={{ ...input, minHeight: 60, resize: "vertical" }} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <div style={field2}>
            <label style={label}>URL original</label>
            <input style={input} value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div style={field2}>
            <label style={label}>Tags (separats per comes)</label>
            <input style={input} value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </div>
          <div style={field2}>
            <label style={label}>Certificacions (separades per comes)</label>
            <input style={input} value={certsText} onChange={(e) => setCertsText(e.target.value)} />
          </div>
        </div>

        {/* ── Contingut ── */}
        <div style={{ display: "flex", gap: 8, margin: "20px 0 12px" }}>
          {(["ca", "es"] as LangTab[]).map((l) => (
            <button
              key={l}
              onClick={() => setLangTab(l)}
              style={{
                padding: "7px 16px",
                borderRadius: 6,
                border: `1px solid ${COLORS.border}`,
                background: langTab === l ? COLORS.salvia : "transparent",
                color: langTab === l ? "#fff" : COLORS.ink,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {l === "ca" ? "Català" : "Castellà"}
            </button>
          ))}
          <span style={{ fontSize: 12.5, color: COLORS.muted, alignSelf: "center" }}>
            {informe && (langTab === "ca" ? !informe.content_ca : !informe.content_es)
              ? "· preomplert del codi estàtic: es desarà a la BD"
              : ""}
          </span>
        </div>

        <label style={label}>Resum executiu</label>
        <textarea style={{ ...input, minHeight: 90, resize: "vertical" }} value={fields.resumExecutiu} onChange={(e) => setFields({ resumExecutiu: e.target.value })} />

        <div style={{ marginTop: 12 }}>
          <label style={label}>Implicacions (3 textboxes)</label>
          <textarea style={{ ...input, minHeight: 60, resize: "vertical", marginBottom: 8 }} placeholder="Per a les empreses…" value={fields.empreses} onChange={(e) => setFields({ empreses: e.target.value })} />
          <textarea style={{ ...input, minHeight: 60, resize: "vertical", marginBottom: 8 }} placeholder="Per als reguladors…" value={fields.reguladors} onChange={(e) => setFields({ reguladors: e.target.value })} />
          <textarea style={{ ...input, minHeight: 60, resize: "vertical" }} placeholder="Per als ciutadans…" value={fields.ciutadans} onChange={(e) => setFields({ ciutadans: e.target.value })} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={label}>Més enllà del Checkbox</label>
          <input style={{ ...input, marginBottom: 8 }} placeholder="Criteri" value={fields.criteri} onChange={(e) => setFields({ criteri: e.target.value })} />
          <textarea style={{ ...input, minHeight: 60, resize: "vertical" }} placeholder="Cos del text" value={fields.body} onChange={(e) => setFields({ body: e.target.value })} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={label}>Blocs complexos (JSON: semafor, dadesClau, connexions, accions, crossRefs)</label>
          <textarea
            style={{ ...input, minHeight: 160, resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
            value={fields.complexJson}
            spellCheck={false}
            onChange={(e) => setFields({ complexJson: e.target.value })}
          />
          <p style={{ fontSize: 12.5, color: COLORS.muted, marginTop: 4 }}>
            Ha de ser JSON vàlid — si no, no es podrà desar.
          </p>
        </div>

        {/* ── Accions ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button
            onClick={() => onClose(false)}
            style={{ background: "transparent", border: `1px solid ${COLORS.border}`, padding: "10px 18px", borderRadius: 8, fontSize: 14, cursor: "pointer", color: COLORS.ink }}
          >
            Cancel·la
          </button>
          <button
            onClick={save}
            disabled={saving || busy}
            style={{ background: COLORS.salvia, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Desant…" : "Desa"}
          </button>
        </div>
      </div>
    </div>
  );
}
