"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { SemaforoPopup } from "@/components/sections/semaforo-popup";
import { useLanguage } from "@/components/language-provider";
import {
  reports,
  getTypeLabel,
  formatDate,
  isFreeAccess,
  getGradeColor,
} from "@/lib/reports";
import { getReportContent } from "@/lib/reports-content";

export default function InformesPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(7);
  const [certFilter, setCertFilter] = useState<string>("all");

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleOpenReport = (slug: string) => {
    router.push(`/informes/${slug}`);
  };

  const certFilters = ["all", "GRI", "EcoVadis", "B Corp", "MSCI ESG", "CDP", "SGE 21", "CSRD"];

  const filteredReports = useMemo(() => {
    if (certFilter === "all") return reports;
    return reports.filter((r) => r.certifications.some((c) => c.includes(certFilter)));
  }, [certFilter]);

  const visibleReports = filteredReports.slice(0, visibleCount);
  const featuredReport = filteredReports[0];

  const getSemaforo = (slug: string) => {
    const content = getReportContent(slug, lang);
    return content?.semafor;
  };

  const typeColors: Record<string, { bg: string; text: string }> = {
    regulatory: { bg: "rgba(92,58,30,0.12)", text: "#141B18" },
    framework: { bg: "rgba(184,115,51,0.12)", text: "#5E8772" },
    rating: { bg: "rgba(184,115,51,0.12)", text: "#5E8772" },
    official: { bg: "rgba(92,58,30,0.12)", text: "#141B18" },
    industry: { bg: "rgba(232,201,154,0.25)", text: "#8A6D2B" },
  };

  const dotColors: Record<string, string> = {
    verd: "#5C8A5C",
    groc: "#C9A961",
    vermell: "#A0522D",
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* ═══ PAGE HERO (mantingut) + HEROFOOT amb filtres pills ═══ */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8 lg:pb-14 lg:pt-20">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>
                {lang === "ca" ? "Biblioteca · Informes processats" : "Biblioteca · Informes procesados"}
              </p>
            </div>
            <h1 className="mb-4 font-serif text-5xl font-medium leading-tight tracking-tight text-primary">
              {lang === "ca" ? "Estalvia temps, només " : "Ahorra tiempo, solo "}
              <em className="hl not-italic" style={{ fontStyle: "italic" }}>{lang === "ca" ? "5 min" : "5 min"}</em>.
            </h1>
            <p className="mb-4 max-w-2xl font-sans text-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              {lang === "ca"
                ? <>Un director de sostenibilitat dedica de mitjana el <strong className="font-medium" style={{ color: "var(--ink)" }}>60% del seu temps</strong> a recopilar informació. Criteri ESG centralitza tota aquesta informació i la sintetitza en 8 blocs, perquè el temps d&apos;anàlisi es converteixi en temps de decisió.</>
                : <>Un director de sostenibilidad dedica de media el <strong className="font-medium" style={{ color: "var(--ink)" }}>60% de su tiempo</strong> a recopilar información. Criteri ESG centraliza toda esa información y la sintetiza en 8 bloques, para que el tiempo de análisis se convierta en tiempo de decisión.</>}
            </p>

            {/* HEROFOOT: filtres pills mono + wordcount dashed */}
            <div className="mt-9 flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-wrap gap-2.5" role="group" aria-label={lang === "ca" ? "Filtres per certificació" : "Filtros por certificación"}>
                {certFilters.map((cert) => {
                  const active = certFilter === cert;
                  return (
                    <button
                      key={cert}
                      onClick={() => { setCertFilter(cert); setVisibleCount(7); }}
                      className={`rounded-full border px-3.5 py-[7px] font-mono text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-150 ${
                        active
                          ? "border-accent bg-accent text-white"
                          : "border-black/20 bg-white text-[#4A5F53] hover:border-accent hover:text-primary"
                      }`}
                    >
                      {cert === "all" ? (lang === "ca" ? "Tots" : "Todos") : cert}
                    </button>
                  );
                })}
              </div>
              <div
                className="hidden whitespace-nowrap rounded-md border border-dashed px-4 py-2.5 font-mono text-[11px] tracking-[0.05em] md:block"
                style={{ borderColor: "rgba(74,95,83,0.4)", color: "#4A5F53" }}
              >
                {lang === "ca"
                  ? <>FORMAT ÚNIC · <b style={{ color: "#26312B", fontWeight: 600 }}>8 BLOCS · MÀX. 1.100 PARAULES</b></>
                  : <>FORMATO ÚNICO · <b style={{ color: "#26312B", fontWeight: 600 }}>8 BLOQUES · MÁX. 1.100 PALABRAS</b></>}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ GRAELLA D'INFORMES ═══ */}
        <section className="border-b border-rule py-10" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* CARD DESTACADA */}
            {featuredReport && (
              <article
                className="mb-6 grid cursor-pointer grid-cols-1 border transition-all duration-150 hover:shadow-[0_12px_30px_rgba(38,49,43,0.1)] lg:grid-cols-[1.4fr_1fr]"
                style={{ borderColor: "rgba(38,49,43,0.12)", background: "white" }}
                onClick={() => handleOpenReport(featuredReport.slug)}
              >
                {/* Banda semàfor a dalt */}
                <div className="col-span-full h-1 w-full" style={{ background: getGradeColor(getSemaforo(featuredReport.slug)?.grade) }} />
                <div className="flex flex-col gap-4 p-8">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5E8772" }}>
                    {featuredReport.institution}
                  </p>
                  <h2 className="font-serif text-3xl font-medium leading-tight text-primary" style={{ letterSpacing: "-0.018em" }}>
                    {featuredReport.title}
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#4A5F53" }}>
                    {formatDate(featuredReport.date, lang)} · {featuredReport.pages} {lang === "ca" ? "pàg" : "pág"} · 5 min
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#141B18" }}>{featuredReport.summary}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: typeColors[featuredReport.type]?.bg, color: typeColors[featuredReport.type]?.text }}>
                      {getTypeLabel(featuredReport.type)}
                    </span>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1 rounded-full ${
                        isFreeAccess(featuredReport.date)
                          ? ""
                          : "border"
                      }`}
                      style={
                        isFreeAccess(featuredReport.date)
                          ? { background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }
                          : { borderColor: "rgba(38,49,43,0.28)", color: "#26312B" }
                      }
                    >
                      {isFreeAccess(featuredReport.date) ? (lang === "ca" ? "Gratis" : "Gratis") : "Premium"}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold rounded-full px-2.5 py-1" style={{ background: "rgba(245,227,129,0.35)", color: "#141B18" }}>
                      {lang === "ca" ? "Últim publicat" : "Último publicado"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {featuredReport.certifications.map((cert) => (
                      <span key={cert} className="rounded-full font-mono text-[9px] uppercase tracking-[0.12em] font-semibold px-2 py-1 border" style={{ borderColor: "rgba(94,135,114,0.45)", color: "#141B18", background: "white" }}>{cert}</span>
                    ))}
                  </div>
                  <button className="self-start font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors hover:text-primary" style={{ color: "#5E8772" }}>
                    {lang === "ca" ? "Llegir informe →" : "Leer informe →"}
                  </button>
                </div>
                {/* Mini semàfor */}
                <div
                  className="semafor m-6 flex flex-col justify-center gap-3 lg:ml-0"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => { e.stopPropagation(); setPopupOpen(true); }}
                >
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] font-semibold flex items-center justify-between" style={{ color: "#AAC9B6" }}>
                    <span>{lang === "ca" ? "Semàfor metodològic" : "Semáforo metodológico"}</span>
                    <span aria-hidden="true">⌕</span>
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-5xl font-normal" style={{ color: getGradeColor(getSemaforo(featuredReport.slug)?.grade), letterSpacing: "-0.04em" }}>
                      {getSemaforo(featuredReport.slug)?.grade || "B"}
                    </span>
                    <span className="font-serif text-lg italic" style={{ color: "#F2F5F1" }}>
                      {getSemaforo(featuredReport.slug)?.gradeLabel || (lang === "ca" ? "Robust" : "Robusto")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {(getSemaforo(featuredReport.slug)?.indicators || []).slice(0, 5).map((ind, i) => (
                      <div key={i} className="grid grid-cols-[110px_1fr] items-center gap-2 py-1.5" style={{ borderTop: "1px solid rgba(242,245,241,0.12)" }}>
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: "rgba(242,245,241,0.7)" }}>{ind.name}</span>
                        <div className="flex gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full" style={{ background: dotColors.verd, opacity: ind.status === "verd" ? 1 : 0.25 }} />
                          <span className="inline-block w-2 h-2 rounded-full" style={{ background: dotColors.groc, opacity: ind.status === "groc" ? 1 : 0.25 }} />
                          <span className="inline-block w-2 h-2 rounded-full" style={{ background: dotColors.vermell, opacity: ind.status === "vermell" ? 1 : 0.25 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            )}

            {/* TARGETES ESTÀNDARD (estil rcard del mockup) */}
            <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 xl:grid-cols-3">
              {visibleReports.slice(1).map((report) => {
                const semafor = getSemaforo(report.slug);
                const grade = semafor?.grade || "B";
                const free = isFreeAccess(report.date);
                return (
                  <article
                    key={report.slug}
                    className="group flex cursor-pointer flex-col overflow-hidden border bg-white transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(38,49,43,0.12)]"
                    style={{ borderColor: "rgba(38,49,43,0.12)" }}
                    onClick={() => handleOpenReport(report.slug)}
                  >
                    {/* Banda semàfor segons nota */}
                    <div className="h-1 w-full flex-none" style={{ background: getGradeColor(grade) }} />

                    <div className="flex flex-1 flex-col p-6">
                      {/* Institució */}
                      <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5E8772" }}>
                        {report.institution}
                      </p>
                      {/* Títol */}
                      <h3 className="mb-2.5 font-serif text-xl font-medium leading-snug text-primary" style={{ letterSpacing: "-0.01em" }}>
                        {report.title}
                      </h3>
                      {/* Resum */}
                      <p className="mb-4 flex-1 text-[13px] leading-relaxed" style={{ color: "#4A5F53" }}>
                        {report.summary}
                      </p>
                      {/* Certificacions afectades */}
                      <div className="mb-3.5 flex flex-wrap gap-1.5">
                        {report.certifications.slice(0, 4).map((cert) => (
                          <span key={cert} className="rounded-full px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.1em]" style={{ background: "rgba(94,135,114,0.09)", color: "#141B18" }}>
                            {cert}
                          </span>
                        ))}
                      </div>
                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 border-t pt-3 font-mono text-[9.5px] uppercase tracking-[0.07em]" style={{ borderColor: "rgba(38,49,43,0.1)", color: "#4A5F53" }}>
                        <span>{formatDate(report.date, lang)}</span>
                        <span>{report.pages} {lang === "ca" ? "pàg" : "pág"}</span>
                        <span>5 min</span>
                        <span className="ml-auto">{getTypeLabel(report.type)}</span>
                      </div>
                      {/* Peu: semàfor mini + accés */}
                      <div className="mt-3.5 flex items-center justify-between gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setPopupOpen(true); }}
                          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                          aria-label={lang === "ca" ? "Com funciona el semàfor metodològic" : "Cómo funciona el semáforo metodológico"}
                        >
                          <span className="font-serif text-[1.1rem] font-medium leading-none" style={{ color: getGradeColor(grade) }}>
                            {grade}
                          </span>
                          <span className="flex gap-[5px]">
                            {(semafor?.indicators || []).slice(0, 5).map((ind, i) => (
                              <span key={i} className="inline-block h-2 w-2 rounded-full" style={{ background: dotColors[ind.status] || dotColors.groc }} />
                            ))}
                          </span>
                        </button>
                        {free ? (
                          <span className="rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }}>
                            {lang === "ca" ? "Gratis" : "Gratis"}
                          </span>
                        ) : (
                          <span className="rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ borderColor: "rgba(38,49,43,0.28)", color: "#26312B" }}>
                            Premium
                          </span>
                        )}
                      </div>
                      {/* CTA */}
                      <span className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors group-hover:text-primary" style={{ color: "#5E8772" }}>
                        {lang === "ca" ? "Llegir informe →" : "Leer informe →"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* LOAD MORE */}
            {visibleCount < filteredReports.length && (
              <div className="mt-8 flex flex-col items-center gap-3 border-t pt-8" style={{ borderColor: "rgba(38,49,43,0.12)" }}>
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="btn-v1 btn-v1-ghost"
                >
                  {lang === "ca" ? "Carregar més informes" : "Cargar más informes"}
                </button>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#4A5F53" }}>
                  {lang === "ca" ? `Mostrant ${visibleCount} de ${filteredReports.length} informes` : `Mostrando ${visibleCount} de ${filteredReports.length} informes`}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ═══ STATS BAND (v1.css) ═══ */}
        <div className="statband">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="statband-inner">
              <div className="stat">
                <div className="n">180<small>+</small></div>
                <div className="t">{lang === "ca" ? "Fonts monitoritzades" : "Fuentes monitorizadas"}</div>
              </div>
              <div className="stat">
                <div className="n">16</div>
                <div className="t">{lang === "ca" ? "Estàndards en creuament" : "Estándares en cruce"}</div>
              </div>
              <div className="stat">
                <div className="n">8</div>
                <div className="t">{lang === "ca" ? "Blocs per informe" : "Bloques por informe"}</div>
              </div>
              <div className="stat">
                <div className="n">5<small>&nbsp;min</small></div>
                <div className="t">{lang === "ca" ? "De lectura, com a màxim" : "De lectura, como máximo"}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
      <SemaforoPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </div>
  );
}
