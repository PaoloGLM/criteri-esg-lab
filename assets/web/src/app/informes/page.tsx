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
  getScopeLabel,
  getTypeLabel,
  formatDate,
  isFreeAccess,
  getGradeColor,
  type Report,
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
        {/* PAGE HEADER */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>
                {lang === "ca" ? "Biblioteca · Informes processats" : "Biblioteca · Informes procesados"}
              </p>
            </div>
            <h1 className="mb-4 font-serif text-5xl font-medium leading-tight tracking-tight text-primary">
              {lang === "ca" ? "Tots els " : "Todos los "}<em className="italic" style={{ color: "#141B18" }}>{lang === "ca" ? "informes Criteri" : "informes Criteri"}</em>.
            </h1>
            <p className="max-w-2xl font-serif text-lg italic" style={{ color: "#141B18" }}>
              {lang === "ca"
                ? "Filtrats per certificació, ordenats per rellevància. Cada informe amb semàfor metodològic, 8 blocs i cross-reference amb els teus estàndards."
                : "Filtrados por certificación, ordenados por relevancia. Cada informe con semáforo metodológico, 8 bloques y cross-reference con tus estándares."}
            </p>
          </div>
        </section>

        {/* CONTROLS */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#4A5F53" }}>
                {lang === "ca" ? "Filtrar per certificació:" : "Filtrar por certificación:"}
              </span>
              {certFilters.map((cert) => (
                <button
                  key={cert}
                  onClick={() => { setCertFilter(cert); setVisibleCount(7); }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] font-medium px-3 py-1.5 border"
                  style={{
                    background: certFilter === cert ? "#26312B" : "white",
                    color: certFilter === cert ? "#F2F5F1" : "#141B18",
                    borderColor: certFilter === cert ? "#26312B" : "#D8E2DA",
                  }}
                >
                  {cert === "all" ? (lang === "ca" ? "Tots" : "Todos") : cert}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="py-10" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* CARD DESTACADA */}
            {featuredReport && (
              <article
                className="mb-6 grid cursor-pointer grid-cols-1 border lg:grid-cols-[1.4fr_1fr]"
                style={{ borderColor: "#D8E2DA", background: "white" }}
                onClick={() => handleOpenReport(featuredReport.slug)}
              >
                <div className="flex flex-col gap-4 p-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "rgba(184,115,51,0.1)", color: "#5E8772", border: "1px solid #5E8772" }}>
                      {lang === "ca" ? "Últim publicat" : "Último publicado"}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: typeColors[featuredReport.type]?.bg, color: typeColors[featuredReport.type]?.text }}>
                      {getTypeLabel(featuredReport.type)}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }}>
                      {lang === "ca" ? "Gratis" : "Gratis"}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl font-medium leading-tight text-primary" style={{ letterSpacing: "-0.018em" }}>
                    {featuredReport.title}
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#4A5F53" }}>
                    <strong className="text-primary">{featuredReport.institution}</strong> · {formatDate(featuredReport.date, lang)} · {featuredReport.pages} {lang === "ca" ? "pàg" : "pág"}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#141B18" }}>{featuredReport.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {featuredReport.certifications.map((cert) => (
                      <span key={cert} className="font-mono text-[9px] uppercase tracking-[0.12em] font-semibold px-2 py-1 border" style={{ borderColor: "#5E8772", color: "#141B18", background: "white" }}>{cert}</span>
                    ))}
                  </div>
                  <button className="self-start font-sans text-[13px] font-semibold" style={{ color: "#5E8772", borderBottom: "1px solid #5E8772", paddingBottom: "4px" }}>
                    {lang === "ca" ? "Llegir informe complet →" : "Leer informe completo →"}
                  </button>
                </div>
                {/* Mini semàfor */}
                <div
                  className="flex flex-col justify-center gap-3 p-6"
                  style={{ background: "#26312B", color: "#F2F5F1" }}
                  onClick={(e) => { e.stopPropagation(); setPopupOpen(true); }}
                >
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#AAC9B6" }}>{lang === "ca" ? "Semàfor" : "Semáforo"}</p>
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
                      <div key={i} className="grid grid-cols-[80px_1fr] items-center gap-2 py-1" style={{ borderBottom: "1px solid rgba(217,165,116,0.15)" }}>
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: "rgba(245,239,230,0.6)" }}>{ind.name}</span>
                        <div className="flex gap-1">
                          <span className="inline-block w-2 h-2 rounded-full" style={{ background: dotColors.verd, opacity: ind.status === "verd" ? 1 : 0.3 }} />
                          <span className="inline-block w-2 h-2 rounded-full" style={{ background: dotColors.groc, opacity: ind.status === "groc" ? 1 : 0.3 }} />
                          <span className="inline-block w-2 h-2 rounded-full" style={{ background: dotColors.vermell, opacity: ind.status === "vermell" ? 1 : 0.3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            )}

            {/* NORMAL CARDS */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleReports.slice(1).map((report) => {
                const semafor = getSemaforo(report.slug);
                const tc = typeColors[report.type] || typeColors.regulatory;
                return (
                  <article
                    key={report.slug}
                    className="flex cursor-pointer flex-col gap-3 border p-6"
                    style={{ borderColor: "#D8E2DA", background: "white" }}
                    onClick={() => handleOpenReport(report.slug)}
                  >
                    <div className="flex justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5" style={{ background: tc.bg, color: tc.text }}>{getTypeLabel(report.type)}</span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5" style={{ background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }}>Gratis</span>
                      </div>
                      <span className="font-mono text-[9px]" style={{ color: "#4A5F53" }}>{formatDate(report.date, lang)}</span>
                    </div>
                    <h3 className="font-serif text-lg font-medium leading-tight text-primary" style={{ letterSpacing: "-0.008em" }}>{report.title}</h3>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: "#4A5F53" }}>
                      <strong className="text-primary">{report.institution}</strong> · {report.pages} {lang === "ca" ? "pàg" : "pág"}
                    </p>
                    {/* Mini semàfor inline */}
                    <div className="flex items-center gap-2.5 border-y py-2" style={{ borderColor: "#D8E2DA" }}>
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#3F6653" }}>{lang === "ca" ? "Sem." : "Sem."}</span>
                      <span className="font-serif text-lg font-bold" style={{ color: getGradeColor(semafor?.grade) }}>{semafor?.grade || "B"}</span>
                      <span className="font-serif text-xs italic" style={{ color: "#141B18" }}>{semafor?.gradeLabel || (lang === "ca" ? "Robust" : "Robusto")}</span>
                      <div className="ml-auto flex gap-1">
                        {(semafor?.indicators || []).slice(0, 5).map((ind, i) => (
                          <span key={i} className="inline-block w-2 h-2 rounded-full" style={{ background: dotColors[ind.status] || dotColors.groc, opacity: 0.8 }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#141B18" }}>{report.summary}</p>
                    <div className="mt-auto flex flex-wrap gap-1">
                      {report.certifications.slice(0, 4).map((cert) => (
                        <span key={cert} className="font-mono text-[8px] uppercase tracking-[0.1em] font-semibold px-1.5 py-0.5" style={{ background: "rgba(184,115,51,0.08)", color: "#141B18" }}>{cert}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* LOAD MORE */}
            {visibleCount < filteredReports.length && (
              <div className="mt-8 flex flex-col items-center gap-3 border-t pt-8" style={{ borderColor: "#D8E2DA" }}>
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="px-9 py-3.5 text-sm font-semibold border"
                  style={{ background: "transparent", color: "#26312B", borderColor: "#26312B" }}
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
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
      <SemaforoPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </div>
  );
}
