"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { SemaforoPopup } from "@/components/sections/semaforo-popup";
import { useLanguage } from "@/components/language-provider";
import {
  reports,
  isFreeAccess,
  formatDate,
  type Report,
} from "@/lib/reports";

export default function InformesPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(7);
  const [certFilter, setCertFilter] = useState("all");

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleOpenReport = (slug: string) => {
    router.push(`/informes/${slug}`);
  };

  const certOptions = ["all", "GRI", "EcoVadis", "B Corp", "MSCI ESG", "CDP", "SGE 21", "CSRD"];

  const filteredReports = reports.filter((r) => {
    if (certFilter !== "all" && !r.certifications.includes(certFilter)) return false;
    return true;
  });

  const featuredReport = filteredReports[0];
  const otherReports = filteredReports.slice(1, visibleCount);

  const getTypeColor = (type: string) => {
    if (type === "regulatory") return { bg: "rgba(92,58,30,0.12)", color: "#5C3A1E" };
    if (type === "framework") return { bg: "rgba(184,115,51,0.12)", color: "#B87333" };
    return { bg: "rgba(232,201,154,0.25)", color: "#8A6D2B" };
  };

  const renderMiniSemafor = (report: Report, compact = false) => {
    const content = lang === "ca" ? report.content_ca : report.content_es;
    if (!content?.semafor) return null;
    const { grade, gradeLabel } = content.semafor;
    const gradeColor = grade === "A" || grade === "B" ? "#5C8A5C" : grade === "C" ? "#C9A961" : "#A0522D";
    return (
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={(e) => { e.stopPropagation(); setPopupOpen(true); }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>
          {lang === "ca" ? "Sem." : "Sem."}
        </span>
        <span className="font-serif font-semibold text-lg" style={{ color: "#B87333", letterSpacing: "-0.02em" }}>
          {grade}
        </span>
        <span className="font-serif italic text-xs" style={{ color: "#5C3A1E" }}>
          {gradeLabel}
        </span>
        {!compact && content.semafor.indicators && (
          <div className="ml-auto flex gap-1">
            {content.semafor.indicators.map((ind, i) => (
              <span
                key={i}
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: ind.status === "verd" ? "#5C8A5C" : ind.status === "groc" ? "#C9A961" : "#A0522D",
                  opacity: 0.4,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* PAGE HEADER */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                {lang === "ca" ? "Biblioteca · Informes processats" : "Biblioteca · Informes procesados"}
              </p>
            </div>
            <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight text-primary">
              {lang === "ca" ? "Tots els " : "Todos los "}<em className="italic" style={{ color: "#5C3A1E" }}>{lang === "ca" ? "informes Criteri" : "informes Criteri"}</em>.
            </h1>
            <p className="mt-4 max-w-2xl font-serif text-lg italic" style={{ color: "#5C3A1E" }}>
              {lang === "ca"
                ? "Filtrats per certificació, ordenats per rellevància. Cada informe amb semàfor metodològic, 8 blocs i cross-reference amb els teus estàndards."
                : "Filtrados por certificación, ordenados por relevancia. Cada informe con semáforo metodológico, 8 bloques y cross-reference con tus estándares."}
            </p>
          </div>
        </section>

        {/* CONTROLS */}
        <section className="border-b border-rule py-6" style={{ background: "#F5EFE6", borderColor: "#C9B89A" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#8B7355" }}>
                {lang === "ca" ? "Filtrar per certificació:" : "Filtrar por certificación:"}
              </span>
              {certOptions.map((cert) => (
                <button
                  key={cert}
                  onClick={() => { setCertFilter(cert); setVisibleCount(7); }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] font-medium px-3 py-1.5 border transition-colors"
                  style={{
                    background: certFilter === cert ? "#2C1810" : "white",
                    color: certFilter === cert ? "#F5EFE6" : "#5C3A1E",
                    borderColor: certFilter === cert ? "#2C1810" : "#C9B89A",
                  }}
                >
                  {cert === "all" ? (lang === "ca" ? "Tots" : "Todos") : cert}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="py-10" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {/* CARD DESTACADA */}
              {featuredReport && (
                <article
                  className="grid grid-cols-1 cursor-pointer sm:col-span-2 lg:col-span-3 lg:grid-cols-[1.4fr_1fr] border"
                  style={{ borderColor: "#C9B89A", background: "white" }}
                  onClick={() => handleOpenReport(featuredReport.slug)}
                >
                  <div className="flex flex-col gap-4 p-8">
                    <div className="flex flex-wrap gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "rgba(184,115,51,0.1)", color: "#B87333", border: "1px solid #B87333" }}>
                        {lang === "ca" ? "Últim publicat" : "Último publicado"}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={getTypeColor(featuredReport.type)}>
                        {featuredReport.type === "regulatory" ? (lang === "ca" ? "Regulació" : "Regulación") : featuredReport.type === "framework" ? "Framework" : "Rating"}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }}>
                        {isFreeAccess(featuredReport.date) || featuredReport.slug === "revisio-esrs-maig-2026" ? (lang === "ca" ? "Gratis" : "Gratis") : "Premium"}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl font-medium leading-tight text-primary" style={{ letterSpacing: "-0.012em" }}>
                      {featuredReport.title}
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] font-medium" style={{ color: "#8B7355" }}>
                      <strong className="text-primary">{featuredReport.institution}</strong> · {formatDate(featuredReport.date, lang)} · {featuredReport.pages} {lang === "ca" ? "pàg" : "pág"}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
                      {featuredReport.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {featuredReport.certifications.map((cert) => (
                        <span key={cert} className="font-mono text-[9px] uppercase tracking-[0.12em] font-semibold px-2 py-0.5 border" style={{ borderColor: "#B87333", color: "#5C3A1E", background: "white" }}>
                          {cert}
                        </span>
                      ))}
                    </div>
                    <button className="mt-2 self-start text-sm font-semibold" style={{ color: "#B87333", borderBottom: "1px solid #B87333", paddingBottom: "2px" }}>
                      {lang === "ca" ? "Llegir informe complet →" : "Leer informe completo →"}
                    </button>
                  </div>
                  {/* Mini semàfor dark */}
                  <div className="flex flex-col justify-center gap-3 p-8" style={{ background: "#2C1810", color: "#F5EFE6" }}>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#D9A574" }}>
                      {lang === "ca" ? "Semàfor" : "Semáforo"}
                    </p>
                    {featuredReport && renderMiniSemafor(featuredReport, true)}
                    <button
                      className="mt-2 self-start font-mono text-[9px] uppercase tracking-[0.16em] font-semibold underline"
                      style={{ color: "#D9A574" }}
                      onClick={(e) => { e.stopPropagation(); setPopupOpen(true); }}
                    >
                      {lang === "ca" ? "¿Com es calcula?" : "¿Cómo se calcula?"}
                    </button>
                  </div>
                </article>
              )}

              {/* CARDS NORMALS */}
              {otherReports.map((report) => {
                const tc = getTypeColor(report.type);
                return (
                  <article
                    key={report.slug}
                    className="flex cursor-pointer flex-col gap-3.5 border p-6 transition-all hover:shadow-md"
                    style={{ borderColor: "#C9B89A", background: "white" }}
                    onClick={() => handleOpenReport(report.slug)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5" style={tc}>
                          {report.type === "regulatory" ? (lang === "ca" ? "Regulació" : "Regulación") : report.type === "framework" ? "Framework" : "Rating"}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5" style={{ background: isFreeAccess(report.date) ? "rgba(92,138,92,0.12)" : "#B87333", color: isFreeAccess(report.date) ? "#4A6B3A" : "white" }}>
                          {isFreeAccess(report.date) ? (lang === "ca" ? "Gratis" : "Gratis") : "Premium"}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg font-medium leading-tight text-primary" style={{ letterSpacing: "-0.008em" }}>
                      {report.title}
                    </h3>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] font-medium" style={{ color: "#8B7355" }}>
                      <strong className="text-primary">{report.institution}</strong> · {formatDate(report.date, lang)} · {report.pages} {lang === "ca" ? "pàg" : "pág"}
                    </p>
                    <div className="flex items-center gap-2.5 border-t border-b py-2.5" style={{ borderColor: "#C9B89A" }}>
                      {renderMiniSemafor(report, true)}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#5C3A1E" }}>
                      {report.summary}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1">
                      {report.certifications.slice(0, 4).map((cert) => (
                        <span key={cert} className="font-mono text-[8px] uppercase tracking-[0.1em] font-semibold px-1.5 py-0.5" style={{ background: "rgba(184,115,51,0.08)", color: "#5C3A1E" }}>
                          {cert}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* LOAD MORE */}
            {visibleCount < filteredReports.length && (
              <div className="mt-8 flex flex-col items-center gap-3 border-t pt-10" style={{ borderColor: "#C9B89A" }}>
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="px-9 py-3.5 text-sm font-semibold transition-colors"
                  style={{ background: "transparent", color: "#2C1810", border: "1px solid #2C1810" }}
                >
                  {lang === "ca" ? "Carregar més informes" : "Cargar más informes"}
                </button>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] font-medium" style={{ color: "#8B7355" }}>
                  {lang === "ca" ? `Mostrant ${Math.min(visibleCount, filteredReports.length)} de ${filteredReports.length} informes` : `Mostrando ${Math.min(visibleCount, filteredReports.length)} de ${filteredReports.length} informes`}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
      <SemaforoPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </div>
  );
}
