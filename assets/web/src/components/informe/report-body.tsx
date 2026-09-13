"use client";

import { useState } from "react";
import {
  formatDate,
  getTypeLabel,
  getScopeLabel,
  getGradeColor,
  isFreeAccess,
  type Report,
  type ReportBlock,
} from "@/lib/reports";
import { SemaforoPopup } from "@/components/sections/semaforo-popup";

/**
 * Cos de l'informe: fitxa tècnica + 8 blocs + peu.
 *
 * Render IDÈNTIC al de la pàgina pública `/informes/[slug]`. S'ha extret
 * per poder-lo reutilitzar a la previsualització del panell /admin sense
 * duplicar estils ni lògica de disseny (si un canvi visual s'aplica aquí,
 * aplica als dos llocs).
 *
 * A diferència de la pàgina pública, aquest component NO inclou el Header,
 * el Footer, els diàlegs d'auth ni el paywall — només el cos editorial.
 * El cridant (pàgina pública o admin) decideix el xassís que l'envolta.
 */

export function ReportBody({
  report,
  content,
  lang,
}: {
  report: Report;
  content: ReportBlock;
  lang: "ca" | "es";
}) {
  const [popupOpen, setPopupOpen] = useState(false);

  const isProbeReport = report.slug === "revisio-esrs-maig-2026";
  const isFree = isFreeAccess(report.date);
  const showFreeBadge = isProbeReport || isFree;

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-rule px-6 py-4 lg:px-8" style={{ background: "var(--c-clar)" }}>
        <div className="mx-auto max-w-7xl flex justify-between items-baseline">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#4A5F53" }}>
            <a href="/informes" style={{ color: "#3F6653" }}>Biblioteca</a>
            <span style={{ color: "var(--c-separador)", margin: "0 12px" }}>/</span>
            <a href="/informes" style={{ color: "#3F6653" }}>Informes</a>
            <span style={{ color: "var(--c-separador)", margin: "0 12px" }}>/</span>
            <span style={{ color: "var(--c-fosc)" }}>{report.title}</span>
          </p>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#3F6653" }}>5 min · 8 bloques</span>
        </div>
      </div>

      {/* Layout: sidebar + main */}
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* SIDEBAR */}
        <aside className="sticky top-[70px] hidden h-[calc(100vh-70px)] flex-col gap-8 overflow-y-auto p-10 lg:flex" style={{ background: "var(--c-clar)", borderRight: "1px solid var(--c-separador)" }}>
          <div className="flex flex-col gap-2.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{lang === "ca" ? "Índex de l'informe" : "Índice del informe"}</p>
            <nav className="flex flex-col">
              {[
                { num: "01", name: lang === "ca" ? "Semàfor metodològic" : "Semáforo metodológico" },
                { num: "02", name: lang === "ca" ? "5 dades clau" : "5 datos clave" },
                { num: "03", name: lang === "ca" ? "Resum executiu" : "Resumen ejecutivo" },
                { num: "04", name: lang === "ca" ? "Implicacions" : "Implicaciones" },
                { num: "05", name: lang === "ca" ? "Més enllà del Checkbox" : "Más allá del Checkbox" },
                { num: "06", name: lang === "ca" ? "Connexions" : "Conexiones" },
                { num: "07", name: lang === "ca" ? "Accions recomanades" : "Acciones recomendadas" },
                { num: "08", name: "Cross-reference" },
              ].map((item) => (
                <a key={item.num} href={`#bloc-${item.num}`} className="grid grid-cols-[24px_1fr] gap-2.5 items-baseline py-2 border-b" style={{ borderBottomColor: "rgba(201,184,154,0.5)", textDecoration: "none" }}>
                  <span className="font-mono text-[10px] font-medium" style={{ color: "#4A5F53" }}>{item.num}</span>
                  <span className="font-serif text-[13px] font-medium text-primary">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Mini semàfor */}
          {content?.semafor && (
            <div className="p-4 flex flex-col gap-2" style={{ background: "var(--c-fosc)", color: "var(--c-clar)" }}>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] font-semibold" style={{ color: "var(--c-salvia-light)" }}>{lang === "ca" ? "Semàfor" : "Semáforo"}</p>
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif text-4xl font-normal" style={{ color: getGradeColor(content.semafor.grade), letterSpacing: "-0.04em" }}>{content.semafor.grade}</span>
                <span className="font-serif text-sm italic" style={{ color: "var(--c-clar)" }}>{content.semafor.gradeLabel}</span>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] font-medium" style={{ color: "#4A5F53" }}>{lang === "ca" ? "Lectura · 5 min" : "Lectura · 5 min"}</p>
            <div className="h-1 overflow-hidden" style={{ background: "rgba(201,184,154,0.3)" }}>
              <div className="h-full" style={{ background: "var(--c-salvia)", width: "40%" }} />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="p-8 lg:p-12" style={{ background: "var(--c-clar)" }}>
          {/* Header de l'informe (fitxa tècnica) */}
          <header className="border-b border-primary pb-6 mb-10" id="fitxa">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "rgba(92,58,30,0.12)", color: "var(--c-tinta)" }}>{getTypeLabel(report.type)}</span>
              {showFreeBadge ? (
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }}>{lang === "ca" ? "Gratis" : "Gratis"}</span>
              ) : (
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "var(--c-salvia)", color: "white" }}>Premium</span>
              )}
            </div>
            <h1 className="mb-4 font-serif text-4xl font-medium leading-tight text-primary" style={{ letterSpacing: "-0.022em" }}>{report.title}</h1>
            <div className="flex flex-wrap gap-8 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#4A5F53" }}>
              <span><strong className="text-primary">{report.institution}</strong></span>
              <span>{formatDate(report.date, lang)}</span>
              <span>{report.pages} {lang === "ca" ? "pàg" : "pág"}</span>
              <span>{getScopeLabel(report.scope)}</span>
            </div>
          </header>

          <div className="space-y-0">
            {/* Semàfor — Bloc 1 (dark, full-width) amb explicacions + link popup */}
            <section id="bloc-1" className="scroll-mt-20" style={{ background: "var(--c-fosc)", color: "var(--c-clar)", margin: "0 -32px", padding: "48px 32px" }}>
              <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--c-salvia-light)" }}>{lang === "ca" ? "Bloc 01 · Semàfor metodològic" : "Bloque 01 · Semáforo metodológico"}</p>
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-[100px] font-normal leading-none" style={{ color: getGradeColor(content.semafor.grade), letterSpacing: "-0.04em" }}>{content.semafor.grade}</span>
                    <span className="font-serif text-2xl italic" style={{ color: "var(--c-clar)" }}>{content.semafor.gradeLabel}</span>
                  </div>
                  <button onClick={() => setPopupOpen(true)} className="self-start font-mono text-[10px] uppercase tracking-[0.14em] font-semibold mt-2" style={{ color: "var(--c-salvia-light)", borderBottom: "1px solid var(--c-salvia)", paddingBottom: "3px" }}>
                    {lang === "ca" ? "Com es valora el semàfor? →" : "¿Cómo se valora el semáforo? →"}
                  </button>
                </div>
                <div className="flex flex-col gap-0">
                  {content.semafor.indicators.map((ind) => (
                    <div key={ind.name} className="flex flex-col gap-1 py-3 border-b" style={{ borderBottomColor: "rgba(217,165,116,0.2)" }}>
                      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                        <span className="font-serif text-base font-medium" style={{ color: "var(--c-clar)" }}>{ind.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full" style={{ background: "#5C8A5C", opacity: ind.status === "verd" ? 1 : 0.3 }} />
                            <span className="w-3 h-3 rounded-full" style={{ background: "var(--c-daurat)", opacity: ind.status === "groc" ? 1 : 0.3 }} />
                            <span className="w-3 h-3 rounded-full" style={{ background: "#A0522D", opacity: ind.status === "vermell" ? 1 : 0.3 }} />
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.14em] font-semibold" style={{ color: ind.status === "verd" ? "#5C8A5C" : ind.status === "groc" ? "var(--c-daurat)" : "#A0522D" }}>{ind.label}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--c-clar-65)" }}>{ind.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bloc 2 — 5 dades clau */}
            <section id="bloc-2" className="scroll-mt-20 py-8 border-b" style={{ borderColor: "var(--c-separador)" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--c-salvia)" }}>{lang === "ca" ? "Bloc 02 · 5 dades clau" : "Bloque 02 · 5 datos clave"}</p>
              <h2 className="mb-6 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "El que diu l'informe, en xifres" : "Lo que dice el informe, en cifras"}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.dadesClau.map((d, i) => (
                  <div key={i} className="grid grid-cols-[24px_1fr] gap-3 items-baseline py-3 border-b" style={{ borderBottomColor: "rgba(201,184,154,0.5)" }}>
                    <span className="font-mono text-[11px] font-semibold" style={{ color: "var(--c-salvia)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-primary"><strong className="font-serif text-lg font-semibold" style={{ color: "var(--c-tinta)" }}>{d.value}</strong> {d.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 3 — Resum executiu */}
            <section id="bloc-3" className="scroll-mt-20" style={{ background: "#AAC9B6", margin: "0 -32px", padding: "40px 32px", borderTop: "1px solid #26312B", borderBottom: "1px solid #26312B" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#26312B" }}>{lang === "ca" ? "Bloc 03 · Resum executiu" : "Bloque 03 · Resumen ejecutivo"}</p>
              <h2 className="mb-4 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "Què diu en llenguatge clar" : "Qué dice en lenguaje claro"}</h2>
              <p className="font-serif text-base leading-relaxed text-primary">{content.resumExecutiu}</p>
            </section>

            {/* Bloc 4 — Implicacions + Més enllà */}
            <section id="bloc-4" className="scroll-mt-20 py-8 border-b" style={{ borderColor: "var(--c-separador)" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--c-salvia)" }}>{lang === "ca" ? "Bloc 04 · Implicacions" : "Bloque 04 · Implicaciones"}</p>
              <h2 className="mb-6 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "Per a empreses, reguladors, ciutadans" : "Para empresas, reguladores, ciudadanos"}</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-2 pt-4 border-t-2" style={{ borderTopColor: "var(--c-tinta)" }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "var(--c-tinta)" }}>{lang === "ca" ? "Empreses" : "Empresas"}</span>
                  <p className="text-sm leading-relaxed text-primary">{content.implicacions.empreses}</p>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t-2" style={{ borderTopColor: "var(--c-salvia)" }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "var(--c-salvia)" }}>{lang === "ca" ? "Reguladors" : "Reguladores"}</span>
                  <p className="text-sm leading-relaxed text-primary">{content.implicacions.reguladors}</p>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t-2" style={{ borderTopColor: "var(--c-salvia-light)" }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#8A6D2B" }}>{lang === "ca" ? "Ciutadans" : "Ciudadanos"}</span>
                  <p className="text-sm leading-relaxed text-primary">{content.implicacions.ciutadans}</p>
                </div>
              </div>
            </section>

            {/* Bloc 5 — Més enllà del Checkbox (dark, secció pròpia) */}
            <section id="bloc-5" className="scroll-mt-20" style={{ background: "var(--c-fosc)", color: "var(--c-clar)", margin: "0 -32px", padding: "48px 32px", borderTop: "1px solid var(--c-salvia)" }}>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--c-salvia-light)" }}>{lang === "ca" ? "Bloc 05 · Més enllà del Checkbox" : "Bloque 05 · Más allá del Checkbox"}</p>
              <p className="font-serif text-xl italic leading-relaxed" style={{ color: "var(--c-clar)" }}>{content.mesEnllaCheckbox.criteri}</p>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "rgba(245,239,230,0.75)" }}>{content.mesEnllaCheckbox.body}</p>
            </section>

            {/* Bloc 6 — Connexions */}
            <section id="bloc-6" className="scroll-mt-20 py-8 border-b" style={{ borderColor: "var(--c-separador)" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--c-salvia)" }}>{lang === "ca" ? "Bloc 06 · Connexions" : "Bloque 06 · Conexiones"}</p>
              <h2 className="mb-4 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "Relacions amb altres informes" : "Relaciones con otros informes"}</h2>
              <div className="space-y-3">
                {content.connexions.map((c, i) => (
                  <div key={i} className="border p-4" style={{ borderColor: "var(--c-separador)", background: "white" }}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-2 py-0.5" style={{ background: c.type.includes("Contrad") ? "rgba(160,82,45,0.15)" : c.type.includes("Complement") ? "rgba(92,138,92,0.15)" : "rgba(184,115,51,0.12)", color: c.type.includes("Contrad") ? "#A0522D" : c.type.includes("Complement") ? "#4A6B3A" : "#3F6653" }}>{c.type}</span>
                      <span className="font-serif text-sm font-semibold text-primary">{c.target}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--c-tinta)" }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 7 — Accions recomanades (destacat) */}
            <section id="bloc-7" className="scroll-mt-20" style={{ background: "rgba(184,115,51,0.06)", margin: "0 -32px", padding: "48px 32px", borderTop: "1px solid var(--c-salvia)", borderBottom: "1px solid var(--c-salvia)" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--c-salvia)" }}>{lang === "ca" ? "Bloc 07 · Accions recomanades ⭐" : "Bloque 07 · Acciones recomendadas ⭐"}</p>
              <h2 className="mb-6 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "3 accions operatives per aquesta setmana" : "3 acciones operativas para esta semana"}</h2>
              <div className="grid gap-8 sm:grid-cols-3">
                {content.accions.map((a) => (
                  <div key={a.num} className="flex flex-col gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-serif text-xl font-semibold text-white" style={{ background: "var(--c-salvia)" }}>{a.num}</div>
                    <p className="text-sm font-medium leading-relaxed text-primary">{a.desc || a.title}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 8 — Cross-reference */}
            <section id="bloc-8" className="scroll-mt-20 py-8">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--c-salvia)" }}>{lang === "ca" ? "Bloc 08 · Cross-reference ⭐" : "Bloque 08 · Cross-reference ⭐"}</p>
              <h2 className="mb-4 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "Com t'afecta segons les teves certificacions" : "Cómo te afecta según tus certificaciones"}</h2>
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3" style={{ background: "var(--c-tinta)", color: "var(--c-clar)" }}>{lang === "ca" ? "Certificació" : "Certificación"}</th>
                    <th className="text-left font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3" style={{ background: "var(--c-tinta)", color: "var(--c-clar)" }}>{lang === "ca" ? "Com t'afecta" : "Cómo te afecta"}</th>
                    <th className="text-left font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3" style={{ background: "var(--c-tinta)", color: "var(--c-clar)" }}>{lang === "ca" ? "Impacte" : "Impacto"}</th>
                  </tr>
                </thead>
                <tbody>
                  {content.crossRefs.map((cr, i) => (
                    <tr key={i} className="border-b" style={{ borderBottomColor: "var(--c-separador)" }}>
                      <td className="p-3.5"><span className="font-serif text-[15px] font-semibold text-primary">{cr.framework}</span></td>
                      <td className="p-3.5 text-sm leading-relaxed" style={{ color: "var(--c-fosc)" }}>{cr.criterion}</td>
                      <td className="p-3.5"><span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1" style={{ background: cr.impact === "Alto" || cr.impact === "Alt" ? "rgba(160,82,45,0.15)" : cr.impact === "Medio" || cr.impact === "Mitjà" ? "rgba(201,169,97,0.18)" : "rgba(139,115,85,0.1)", color: cr.impact === "Alto" || cr.impact === "Alt" ? "#A0522D" : cr.impact === "Medio" || cr.impact === "Mitjà" ? "#8A6D2B" : "#4A5F53" }}>{cr.impact}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t flex justify-between items-baseline" style={{ borderTopColor: "var(--c-fosc)" }}>
              <p className="font-serif text-sm italic" style={{ color: "var(--c-tinta)" }}>
                {lang === "ca"
                  ? report.pages > 0
                    ? `5 minuts de lectura. 8 blocs que canvien el teu criteri sobre un informe de ${report.pages} pàgines.`
                    : "5 minuts de lectura. 8 blocs que canvien el teu criteri sobre la font original."
                  : report.pages > 0
                    ? `5 minutos de lectura. 8 bloques que cambian tu criterio sobre un informe de ${report.pages} páginas.`
                    : "5 minutos de lectura. 8 bloques que cambian tu criterio sobre la fuente original."}
              </p>
              {report.url ? (
                <button onClick={() => window.open(report.url, "_blank")} className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#3F6653", borderBottom: "1px solid var(--c-salvia)", paddingBottom: "4px" }}>{lang === "ca" ? "Accés a la font original →" : "Acceso a la fuente original →"}</button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <SemaforoPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </>
  );
}
