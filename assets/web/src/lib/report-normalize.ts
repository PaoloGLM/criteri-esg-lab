import type { ReportBlock, SemaforIndicator, SemaforStatus } from "@/lib/reports";

/**
 * Normalització del JSON ReportBlock que genera el pipeline.
 *
 * El destil·lat (pas 2) genera els 8 blocs en un esquema PRÒXIM al `ReportBlock`
 * de la web, però amb claus que canvien segons l'idioma (el model de vegades
 * barreja CA i ES): `mesEnllaCheckbox`/`masAllaCheckbox`, `implicacions`/
 * `implicaciones`, `connexions`/`conexiones`, `accions`/`acciones`,
 * `effort`/`esfuerzo`, `impact`/`impacto`, `criterion`/`criterio`, i valors
 * d'impacte en minúscules. Aquesta funció el mapeja a l'esquema canònic que
 * espera la web, tolerant qualsevol de les dues variants. Si un camp no hi és,
 * s'omple amb un valor mínim honest (mai s'inventa contingut).
 */

const asStr = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

const asArr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function normStatus(v: unknown): SemaforStatus {
  const s = asStr(v).toLowerCase();
  if (s === "verd" || s === "verde" || s === "green") return "verd";
  if (s === "groc" || s === "amarillo" || s === "groc" || s === "yellow") return "groc";
  if (s === "vermell" || s === "rojo" || s === "red") return "vermell";
  return "groc"; // valor segur per defecte (mai vermell/verd assumits)
}

function normImpact(v: unknown): string {
  const s = asStr(v).trim();
  const low = s.toLowerCase();
  // Normalitzem al format que la web ja fa servir per pintar el crossRef
  if (["alt", "alto", "alta", "high"].includes(low)) return "Alt";
  if (["mitjà", "mitja", "medio", "media", "medium"].includes(low)) return "Mitjà";
  if (["baix", "baixa", "bajo", "baja", "low"].includes(low)) return "Baix";
  // Ja capitalitzat / qualsevol altra cosa → es deixa tal qual
  return s || "Mitjà";
}

function firstDefined(...vals: unknown[]): unknown {
  for (const v of vals) {
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
}

export function normalizeReportBlock(raw: unknown): ReportBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  // ── semafor ──
  const semaforRaw = (r.semafor ?? {}) as Record<string, unknown>;
  const indicatorsRaw = asArr<Record<string, unknown>>(semaforRaw.indicators);
  const indicators: SemaforIndicator[] = indicatorsRaw.map((ind) => ({
    name: asStr(firstDefined(ind.name, ind.nombre)),
    status: normStatus(firstDefined(ind.status, ind.estado)),
    label: asStr(firstDefined(ind.label, ind.etiqueta)),
    note: asStr(firstDefined(ind.note, ind.nota)),
  }));

  // ── dadesClau ──
  const dadesRaw = asArr<Record<string, unknown>>(
    firstDefined(r.dadesClau, r.datosClave, r.dades_clau)
  );
  const dadesClau = dadesRaw.map((d) => ({
    value: asStr(firstDefined(d.value, d.valor)),
    label: asStr(firstDefined(d.label, d.etiqueta)),
    page: firstDefined(d.page, d.pagina) !== undefined ? asStr(firstDefined(d.page, d.pagina)) : undefined,
  }));

  // ── implicacions ──
  const implRaw = (firstDefined(r.implicacions, r.implicaciones) ?? {}) as Record<string, unknown>;
  const implicacions = {
    empreses: asStr(firstDefined(implRaw.empreses, implRaw.empresas)),
    reguladors: asStr(firstDefined(implRaw.reguladors, implRaw.reguladores, implRaw.reguladores_)),
    ciutadans: asStr(firstDefined(implRaw.ciutadans, implRaw.ciudadanos)),
  };

  // ── mesEnllaCheckbox ──
  const mesRaw = (firstDefined(r.mesEnllaCheckbox, r.masAllaCheckbox, r.masAlla) ?? {}) as Record<string, unknown>;
  const mesEnllaCheckbox = {
    criteri: asStr(firstDefined(mesRaw.criteri, mesRaw.criterio)),
    body: asStr(mesRaw.body),
  };

  // ── connexions ──
  const connRaw = asArr<Record<string, unknown>>(
    firstDefined(r.connexions, r.conexiones)
  );
  const connexions = connRaw.map((c) => ({
    type: asStr(firstDefined(c.type, c.tipo)),
    target: asStr(firstDefined(c.target, c.objetivo)),
    desc: asStr(firstDefined(c.desc, c.descripcion, c.descripcio)),
  }));

  // ── accions ──
  const accRaw = asArr<Record<string, unknown>>(
    firstDefined(r.accions, r.acciones)
  );
  const accions = accRaw.map((a) => ({
    num: asStr(firstDefined(a.num, a.numero), "01"),
    title: asStr(firstDefined(a.title, a.titulo)),
    desc: asStr(firstDefined(a.desc, a.descripcion, a.descripcio)),
    effort: asStr(firstDefined(a.effort, a.esfuerzo)),
    impact: asStr(firstDefined(a.impact, a.impacto)),
  }));

  // ── crossRefs ──
  const crRaw = asArr<Record<string, unknown>>(
    firstDefined(r.crossRefs, r.crossrefs, r.cross_references)
  );
  const crossRefs = crRaw.map((c) => ({
    framework: asStr(firstDefined(c.framework, c.marc)),
    criterion: asStr(firstDefined(c.criterion, c.criterio)),
    impact: normImpact(firstDefined(c.impact, c.impacto)),
  }));

  return {
    semafor: {
      grade: (asStr(semaforRaw.grade, "B").toUpperCase() as ReportBlock["semafor"]["grade"]) || "B",
      gradeLabel: asStr(firstDefined(semaforRaw.gradeLabel, semaforRaw.grade_label, semaforRaw.gradeLabel_)),
      indicators,
    },
    dadesClau,
    resumExecutiu: asStr(firstDefined(r.resumExecutiu, r.resumenEjecutivo, r.resum)),
    implicacions,
    mesEnllaCheckbox,
    connexions,
    accions,
    crossRefs,
  };
}
