"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { SemaforoPopup } from "@/components/sections/semaforo-popup";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { reports, formatDate, isFreeAccess, getTypeLabel } from "@/lib/reports";

export default function InformesPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { user, plan } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [certFilter, setCertFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [visibleCount, setVisibleCount] = useState(6);

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };
  const handleOpenReport = (slug: string) => router.push(`/informes/${slug}`);

  const certFilters = ["all", "GRI", "EcoVadis", "B Corp", "MSCI ESG", "CDP", "SGE 21", "CSRD"];

  const filteredReports = useMemo(() => {
    let result = reports.filter(r => {
      if (certFilter !== "all" && !r.certifications.includes(certFilter)) return false;
      return true;
    });
    if (sortBy === "date") result = [...result].sort((a, b) => b.date.localeCompare(a.date));
    return result;
  }, [certFilter, sortBy]);

  const featuredReport = filteredReports[0];
  const otherReports = filteredReports.slice(1, visibleCount + 1);
  const isPremium = !!user && plan === "premium";

  const getTypeColor = (type: string) => {
    if (type === "regulatory") return { bg: "rgba(92,58,30,0.12)", color: "#5C3A1E" };
    if (type === "framework") return { bg: "rgba(184,115,51,0.12)", color: "#B87333" };
    return { bg: "rgba(232,201,154,0.25)", color: "#8A6D2B" };
  };

  const getGradeColor = (grade?: string) => {
    if (grade === "A" || grade === "B") return "#5C8A5C";
    if (grade === "C") return "#C9A961";
    return "#A0522D";
  };

  const renderMiniSemafor = (report: typeof reports[0]) => {
    const content = report.content_es || report.content_ca;
    if (!content?.semafor) return null;
    const { grade, gradeLabel, indicators } = content.semafor;
    return (
      <div className="flex items-center gap-3 py-2.5" style={{ borderTop: "1px solid #C9B89A", borderBottom: "1px solid #C9B89A" }}>
        <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>Sem.</span>
        <span className="font-serif text-lg font-semibold" style={{ color: "#B87333" }}>{grade}</span>
        <span className="font-serif text-xs italic" style={{ color: "#5C3A1E" }}>{gradeLabel}</span>
        <div className="ml-auto flex gap-1">
          {indicators.map((ind, i) => (
            <span key={i} className="inline-block w-2 h-2 rounded-full" style={{ background: ind.status === "verd" ? "#5C8A5C" : ind.status === "groc" ? "#C9A961" : "#A0522D", opacity: 0.4 }} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5EFE6" }}>
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* PAGE HEADER */}
        <section className="border-b" style={{ background: "#F5EFE6", borderColor: "#2C1810" }}>
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>Biblioteca · Informes procesados</p>
            </div>
            <h1 className="mb-3 font-serif text-5xl font-medium tracking-tight text-primary">Todos los <em className="italic" style={{ color: "#5C3A1E" }}>informes Criteri</em>.</h1>
            <p className="max-w-2xl font-serif text-lg italic" style={{ color: "#5C3A1E" }}>Filtrados por certificación, ordenados por relevancia. Cada informe con semáforo metodológico, 8 bloques y cross-reference con tus estándares.</p>
          </div>
        </section>

        {/* CONTROLS */}
        <section className="border-b" style={{ background: "#F5EFE6", borderColor: "#C9B89A" }}>
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#8B7355" }}>Filtrar por certificación:</span>
              {certFilters.map(cert => (
                <button key={cert} onClick={() => setCertFilter(cert)} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] font-medium transition-colors"
                  style={{ background: certFilter === cert ? "#2C1810" : "white", color: certFilter === cert ? "#F5EFE6" : "#5C3A1E", border: "1px solid #C9B89A" }}>
                  {cert === "all" ? "Todos" : cert}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] border" style={{ background: "white", color: "#5C3A1E", borderColor: "#C9B89A" }}>
              <option value="date">Orden: Más recientes primero</option>
              <option value="semafor">Orden: Mejor semáforo primero</option>
            </select>
          </div>
        </section>

        {/* GRID */}
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {/* CARD DESTACADA */}
            {featuredReport && (
              <article className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 border" style={{ background: "white", borderColor: "#C9B89A" }}>
                <div className="p-8 flex flex-col gap-4">
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ background: "rgba(184,115,51,0.1)", color: "#B87333", border: "1px solid #B87333" }}>Último publicado</span>
                    <span className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ background: getTypeColor(featuredReport.type).bg, color: getTypeColor(featuredReport.type).color }}>{getTypeLabel(featuredReport.type)}</span>
                    <span className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }}>{isFreeAccess(featuredReport.date) ? "Gratis" : "Premium"}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-medium leading-tight text-primary" style={{ letterSpacing: "-0.015em" }}>{featuredReport.title}</h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}><strong style={{ color: "#2C1810" }}>{featuredReport.institution}</strong> · {formatDate(featuredReport.date, lang)} · {featuredReport.pages} pág</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>{featuredReport.summary}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {featuredReport.certifications.map(cert => <span key={cert} className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] font-semibold border" style={{ background: "white", borderColor: "#B87333", color: "#5C3A1E" }}>{cert}</span>)}
                  </div>
                  <button onClick={() => handleOpenReport(featuredReport.slug)} className="self-start mt-2 font-sans text-[13px] font-semibold" style={{ color: "#B87333", borderBottom: "1px solid #B87333", paddingBottom: "4px" }}>Leer informe completo →</button>
                </div>
                {/* Mini semafor dark */}
                {featuredReport.content_es?.semafor && (
                  <button onClick={() => setPopupOpen(true)} className="flex flex-col gap-3 p-6 justify-center" style={{ background: "#2C1810", color: "#F5EFE6" }}>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#D9A574" }}>Semáforo</span>
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-5xl font-normal" style={{ color: "#B87333", letterSpacing: "-0.04em" }}>{featuredReport.content_es.semafor.grade}</span>
                      <span className="font-serif text-base italic" style={{ color: "#F5EFE6" }}>{featuredReport.content_es.semafor.gradeLabel}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {featuredReport.content_es.semafor.indicators.map((ind, i) => (
                        <div key={i} className="grid grid-cols-[80px_1fr] gap-2 items-center py-1" style={{ borderBottom: "1px solid rgba(217,165,116,0.15)" }}>
                          <span className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: "rgba(245,239,230,0.6)" }}>{ind.name}</span>
                          <div className="flex gap-1">
                            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#5C8A5C", opacity: ind.status === "verd" ? 1 : 0.3 }} />
                            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#C9A961", opacity: ind.status === "groc" ? 1 : 0.3 }} />
                            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#A0522D", opacity: ind.status === "vermell" ? 1 : 0.3 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.16px]" style={{ color: "#D9A574", textDecoration: "underline" }}>¿Cómo se calcula?</span>
                  </button>
                )}
              </article>
            )}

            {/* CARDS NORMALS */}
            {otherReports.map((report) => {
              const content = report.content_es || report.content_ca;
              const tc = getTypeColor(report.type);
              return (
                <article key={report.slug} className="border p-6 flex flex-col gap-3 cursor-pointer transition-all hover:shadow-md" style={{ background: "white", borderColor: "#C9B89A" }} onClick={() => handleOpenReport(report.slug)}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ background: tc.bg, color: tc.color }}>{getTypeLabel(report.type)}</span>
                      <span className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ background: isFreeAccess(report.date) ? "rgba(92,138,92,0.12)" : "#B87333", color: isFreeAccess(report.date) ? "#4A6B3A" : "white" }}>{isFreeAccess(report.date) ? "Gratis" : "Premium"}</span>
                    </div>
                    <span className="font-mono text-[9px]" style={{ color: "#8B7355" }}>{report.slug.slice(-2)}</span>
                  </div>
                  <h3 className="font-serif text-base font-medium leading-tight text-primary" style={{ letterSpacing: "-0.008em" }}>{report.title}</h3>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.14px]" style={{ color: "#8B7355" }}><strong style={{ color: "#2C1810" }}>{report.institution}</strong> · {formatDate(report.date, lang)} · {report.pages} pág</p>
                  {renderMiniSemafor(report)}
                  <p className="text-xs leading-relaxed" style={{ color: "#5C3A1E" }}>{report.summary}</p>
                  <div className="flex gap-1 flex-wrap mt-auto">
                    {report.certifications.slice(0, 4).map(cert => <span key={cert} className="px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] font-semibold" style={{ background: "rgba(184,115,51,0.08)", color: "#5C3A1E" }}>{cert}</span>)}
                  </div>
                </article>
              );
            })}
          </div>

          {/* LOAD MORE */}
          {visibleCount < filteredReports.length - 1 && (
            <div className="mt-10 pt-10 flex flex-col items-center gap-3" style={{ borderTop: "1px solid #C9B89A" }}>
              <button onClick={() => setVisibleCount(c => c + 6)} className="px-9 py-3.5 font-sans text-[13px] font-semibold transition-colors" style={{ color: "#2C1810", border: "1px solid #2C1810", background: "transparent" }} onMouseEnter={e => { e.currentTarget.style.background = "#2C1810"; e.currentTarget.style.color = "#F5EFE6"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2C1810"; }}>Cargar más informes</button>
              <p className="font-mono text-[10px] uppercase tracking-[0.16px]" style={{ color: "#8B7355" }}>Mostrando {Math.min(visibleCount + 1, filteredReports.length)} de {filteredReports.length} informes</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
      <SemaforoPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </div>
  );
}
