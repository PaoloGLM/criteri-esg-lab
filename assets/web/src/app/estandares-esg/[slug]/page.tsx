"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Lock, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TYPE_CONFIG } from "@/lib/standards-data";
import { STANDARDS_DETAIL } from "@/lib/standards-details";

export default function EstandarDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] ?? "" : "";
  const { lang } = useLanguage();
  const { user, plan } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  const effectiveDetail = STANDARDS_DETAIL[slug];

  const isPremium = user && plan === "premium";
  const isPremiumContent = effectiveDetail?.access === "premium";

  // Ordenar files
  const sortedRows = useMemo(() => {
    if (!effectiveDetail) return [];
    const rows = [...effectiveDetail.xrefRows];
    if (!sortBy) return rows;
    rows.sort((a, b) => {
      let aVal = "", bVal = "";
      if (sortBy === "report") { aVal = a.reportTitle; bVal = b.reportTitle; }
      else if (sortBy === "date") { aVal = a.date; bVal = b.date; }
      else if (sortBy === "criterion") { aVal = tr(a.criterionCa, a.criterionEs); bVal = tr(b.criterionCa, b.criterionEs); }
      else if (sortBy === "impact") { aVal = a.impact; bVal = b.impact; }
      if (sortDir === "asc") return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });
    return rows;
  }, [effectiveDetail, sortBy, sortDir, lang]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  if (!effectiveDetail) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={() => setAuthOpen(true)} />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="eyebrow mb-3">404 — ESTÀNDARD NO TROBAT</p>
            <h1 className="mb-4 font-serif text-3xl font-semibold text-primary">
              {tr("Aquest estàndard no existeix.", "Este estándar no existe.")}
            </h1>
            <Button asChild>
              <a href="/estandares-esg">{tr("Tornar als estàndards", "Volver a los estándares")}</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cfg = TYPE_CONFIG[effectiveDetail.type];
  const showLocked = isPremiumContent && !isPremium;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={() => setAuthOpen(true)} />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <a href="/estandares-esg" className="text-accent-deep hover:underline">{tr("Estàndards ESG", "Estándares ESG")}</a> &gt; {effectiveDetail.name}
            </p>
            <div className="flex items-start gap-8">
              {/* Logo GRAN */}
              <div
                className="flex h-32 w-64 flex-shrink-0 items-center justify-center rounded-xl bg-white p-4 shadow-sm"
                style={{ border: `1px solid ${cfg.borderColor}` }}
              >
                <Image
                  src={effectiveDetail.logo}
                  alt={`Logo ${effectiveDetail.name}`}
                  width={240}
                  height={110}
                  className="max-h-24 w-auto object-contain"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
                  {effectiveDetail.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="inline-block rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider" style={{ background: cfg.badgeBg, color: cfg.badgeColor }}>
                    {tr(cfg.labelCa, cfg.labelEs)}
                  </span>
                  {"  "}{tr(effectiveDetail.issuerCa, effectiveDetail.issuerEs)}
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/75">
                  {tr(effectiveDetail.descCa, effectiveDetail.descEs)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-reference table */}
        <section className="py-12">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            {/* Filtres */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep font-semibold">
                {tr("Filtrar:", "Filtrar:")}
              </span>
              <select className="rounded-md border border-rule bg-card px-3.5 py-2 text-sm text-foreground cursor-pointer">
                <option>{tr("Tots els mesos", "Todos los meses")}</option>
                <option>Gener 2026</option>
                <option>Febrer 2026</option>
                <option>Març 2026</option>
                <option>Abril 2026</option>
                <option>Maig 2026</option>
              </select>
              <select className="rounded-md border border-rule bg-card px-3.5 py-2 text-sm text-foreground cursor-pointer">
                <option>{tr("Tots els impactes", "Todos los impactes")}</option>
                <option>{tr("Alt", "Alto")}</option>
                <option>{tr("Mitjà", "Medio")}</option>
                <option>{tr("Baix", "Bajo")}</option>
              </select>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                {effectiveDetail.xrefRows.length} {tr("informes amb cross-reference a", "informes con cross-reference a")} {effectiveDetail.name}
              </span>
            </div>

            {/* Taula */}
            <div className="overflow-hidden rounded-lg border border-rule bg-card shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {[
                      { key: "report", label: tr("Informe", "Informe"), width: "28%" },
                      { key: "date", label: tr("Data", "Fecha"), width: "10%" },
                      { key: "criterion", label: tr(`Criteri afectat (${effectiveDetail.name})`, `Criterio afectado (${effectiveDetail.name})`), width: "47%" },
                      { key: "impact", label: tr("Impacte", "Impacto"), width: "15%" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="cursor-pointer select-none border-b border-rule bg-secondary/30 px-4 py-3.5 text-left font-mono text-[9px] uppercase tracking-widest text-accent-deep transition-colors hover:bg-secondary/50"
                        style={{ width: col.width, position: "relative", paddingRight: "28px" }}
                      >
                        {col.label}
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-40">
                          {sortBy === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row, i) => {
                    const isLocked = showLocked && i >= 3;
                    return (
                      <tr key={i} className={`border-b border-rule/40 transition-colors hover:bg-secondary/20 ${isLocked ? "relative" : ""}`}>
                        <td className="px-4 py-3.5 align-top">
                          <span className="font-serif text-sm font-semibold text-primary">{row.reportTitle}</span>
                        </td>
                        <td className="px-4 py-3.5 align-top">
                          <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">{row.date}</span>
                        </td>
                        <td className="px-4 py-3.5 align-top text-xs leading-relaxed text-foreground/80">
                          {tr(row.criterionCa, row.criterionEs)}
                        </td>
                        <td className="px-4 py-3.5 align-top">
                          <span className={`inline-block rounded px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                            row.impact === "high" ? "bg-[#A0522D]/12 text-[#A0522D]" : "bg-[#C9A961]/15 text-[#8A6D2B]"
                          }`}>
                            {row.impact === "high" ? tr("Alt", "Alto") : tr("Mitjà", "Medio")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Lock overlay per no-Premium */}
            {showLocked && (
              <div className="mt-6 rounded-lg border border-accent bg-accent-soft/15 p-6 text-center">
                <Lock className="mx-auto mb-3 h-6 w-6 text-accent" />
                <p className="mb-2 font-serif text-lg font-semibold text-primary">
                  {tr("Contingut Premium", "Contenido Premium")}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  {tr(
                    `Estàs veient les 3 primeres files. Fes-te Premium per veure tots els ${effectiveDetail.xrefRows.length} informes amb cross-reference a ${effectiveDetail.name}.`,
                    `Estás viendo las 3 primeras filas. Hazte Premium para ver todos los ${effectiveDetail.xrefRows.length} informes con cross-reference a ${effectiveDetail.name}.`
                  )}
                </p>
                <Button onClick={() => setPreusOpen(true)}>
                  <Crown className="mr-2 h-4 w-4" />
                  {tr("Fes-te Premium", "Hazte Premium")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Accions recomanades */}
        <section className="border-t border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-primary">
              {tr(`Accions recomanades relacionades amb ${effectiveDetail.name}`, `Acciones recomendadas relacionadas con ${effectiveDetail.name}`)}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {effectiveDetail.actions.map((action) => (
                <div key={action.num} className="flex gap-3 rounded-md border border-rule bg-card p-4">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold text-accent-foreground">
                    {action.num}
                  </span>
                  <div>
                    <p className="text-sm leading-relaxed text-foreground">{tr(action.textCa, action.textEs)}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">{tr(action.sourceCa, action.sourceEs)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="register" />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => setAuthOpen(true)}
      />
    </div>
  );
}
