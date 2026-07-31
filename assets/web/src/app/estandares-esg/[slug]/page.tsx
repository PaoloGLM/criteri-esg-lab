"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Lock, ArrowRight, Crown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TYPE_CONFIG } from "@/lib/standards-data";
import { STANDARDS_DETAIL } from "@/lib/standards-details";

export default function EstandarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] ?? "" : "";
  const { lang } = useLanguage();
  const { user, plan } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pillarFilter, setPillarFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  const effectiveDetail = STANDARDS_DETAIL[slug];

  const isPremium = user && plan === "premium";
  const isPremiumContent = effectiveDetail?.access === "premium";

  // Detecta si aquest estàndard té camps enriquits (pillar/action/deadline)
  const hasEnrichedRows = !!effectiveDetail?.xrefRows?.some(r => r.pillar || r.actionCa || r.deadline);

  // Pilars únics per al filtre
  const pillars = useMemo(() => {
    if (!effectiveDetail) return [];
    const set = new Set<string>();
    effectiveDetail.xrefRows.forEach(r => { if (r.pillar) set.add(r.pillar); });
    return Array.from(set);
  }, [effectiveDetail]);

  // Files filtrades + ordenades
  const sortedRows = useMemo(() => {
    if (!effectiveDetail) return [];
    let rows = [...effectiveDetail.xrefRows];
    // Filtre per pilar
    if (pillarFilter !== "all") {
      rows = rows.filter(r => r.pillar === pillarFilter);
    }
    // Filtre per impacte
    if (impactFilter !== "all") {
      rows = rows.filter(r => r.impact === impactFilter);
    }
    // Sort
    if (!sortBy) return rows;
    rows.sort((a, b) => {
      let aVal = "", bVal = "";
      if (sortBy === "report") { aVal = a.reportTitle; bVal = b.reportTitle; }
      else if (sortBy === "date") { aVal = a.date; bVal = b.date; }
      else if (sortBy === "criterion") { aVal = tr(a.criterionCa, a.criterionEs); bVal = tr(b.criterionCa, b.criterionEs); }
      else if (sortBy === "impact") { aVal = a.impact; bVal = b.impact; }
      else if (sortBy === "pillar") { aVal = a.pillar || ""; bVal = b.pillar || ""; }
      else if (sortBy === "deadline") { aVal = a.deadline || ""; bVal = b.deadline || ""; }
      if (sortDir === "asc") return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });
    return rows;
  }, [effectiveDetail, sortBy, sortDir, lang, pillarFilter, impactFilter]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  // Count per pilar (per mostrar al xip)
  const pillarCounts = useMemo(() => {
    if (!effectiveDetail) return {} as Record<string, number>;
    const counts: Record<string, number> = {};
    effectiveDetail.xrefRows.forEach(r => {
      if (r.pillar) counts[r.pillar] = (counts[r.pillar] || 0) + 1;
    });
    return counts;
  }, [effectiveDetail]);

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

        {/* Cross-reference — versió enriquida (B Corp pilot) */}
        <section className="py-12">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            {/* Capçalera de la secció */}
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-semibold text-primary mb-1">
                {tr("Informes amb cross-reference", "Informes con cross-reference")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {hasEnrichedRows
                  ? tr(
                      `Cada informe està analitzat pel seu impacte en ${effectiveDetail.name}. Clica sobre el títol per llegir l'informe complet.`,
                      `Cada informe está analizado por su impacto en ${effectiveDetail.name}. Haz clic sobre el título para leer el informe completo.`
                    )
                  : tr(
                      `Informes recents que afecten ${effectiveDetail.name}. Clica sobre el títol per llegir l'informe complet.`,
                      `Informes recientes que afectan a ${effectiveDetail.name}. Haz clic sobre el título para leer el informe completo.`
                    )}
              </p>
            </div>

            {/* Filtres */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep font-semibold">
                {tr("Filtrar:", "Filtrar:")}
              </span>
              {/* Filtre per pilar (només si n'hi ha) */}
              {hasEnrichedRows && pillars.length > 0 && (
                <button
                  onClick={() => setPillarFilter("all")}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-3 py-1.5 border"
                  style={{
                    background: pillarFilter === "all" ? "#2C1810" : "white",
                    color: pillarFilter === "all" ? "#F5EFE6" : "#5C3A1E",
                    borderColor: pillarFilter === "all" ? "#2C1810" : "#C9B89A",
                  }}
                >
                  {tr("Tots els pilars", "Todos los pilares")} ({effectiveDetail.xrefRows.length})
                </button>
              )}
              {hasEnrichedRows && pillars.map(p => (
                <button
                  key={p}
                  onClick={() => setPillarFilter(p)}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-3 py-1.5 border"
                  style={{
                    background: pillarFilter === p ? "#2C1810" : "white",
                    color: pillarFilter === p ? "#F5EFE6" : "#5C3A1E",
                    borderColor: pillarFilter === p ? "#2C1810" : "#C9B89A",
                  }}
                >
                  {p} ({pillarCounts[p] || 0})
                </button>
              ))}
              {/* Filtre per impacte */}
              <select
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value)}
                className="rounded-md border border-rule bg-card px-3.5 py-2 text-sm text-foreground cursor-pointer"
              >
                <option value="all">{tr("Tots els impactes", "Todos los impactes")}</option>
                <option value="high">{tr("Alt", "Alto")}</option>
                <option value="med">{tr("Mitjà", "Medio")}</option>
              </select>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                {sortedRows.length} {tr("de", "de")} {effectiveDetail.xrefRows.length} {tr("informes", "informes")}
              </span>
            </div>

            {/* Taula enriquida (amb pilar/acció/termini) — només B Corp pilot */}
            {hasEnrichedRows ? (
              <div className="overflow-hidden rounded-lg border border-rule bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {[
                          { key: "report", label: tr("Informe", "Informe"), width: "20%" },
                          { key: "pillar", label: tr("Pilar", "Pilar"), width: "11%" },
                          { key: "criterion", label: tr("Què afecta", "Qué afecta"), width: "30%" },
                          { key: "action", label: tr("Què has de fer", "Qué debes hacer"), width: "24%" },
                          { key: "deadline", label: tr("Termini", "Plazo"), width: "8%" },
                          { key: "impact", label: tr("Impacte", "Impacto"), width: "7%" },
                        ].map((col) => (
                          <th
                            key={col.key}
                            onClick={() => col.key !== "action" && handleSort(col.key)}
                            className={`border-b border-rule bg-secondary/30 px-3 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-accent-deep ${col.key !== "action" ? "cursor-pointer select-none hover:bg-secondary/50" : ""}`}
                            style={{ width: col.width, position: "relative", paddingRight: "20px" }}
                          >
                            {col.label}
                            {col.key !== "action" && (
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-40">
                                {sortBy === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRows.map((row, i) => {
                        const isLocked = showLocked && i >= 3;
                        return (
                          <tr key={i} className={`border-b border-rule/40 transition-colors hover:bg-secondary/20 ${isLocked ? "opacity-50" : ""}`}>
                            {/* Informe (link si hi ha reportSlug) */}
                            <td className="px-3 py-3.5 align-top">
                              {row.reportSlug ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); router.push(`/informes/${row.reportSlug}`); }}
                                  className="font-serif text-sm font-semibold text-primary hover:text-accent-deep transition-colors text-left flex items-start gap-1 group"
                                >
                                  <span>{row.reportTitle}</span>
                                  <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ) : (
                                <span className="font-serif text-sm font-semibold text-primary">{row.reportTitle}</span>
                              )}
                              <div className="mt-1 font-mono text-[10px] text-muted-foreground whitespace-nowrap">{row.date}</div>
                            </td>
                            {/* Pilar */}
                            <td className="px-3 py-3.5 align-top">
                              {row.pillar && (
                                <div>
                                  <span className="inline-block rounded px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider bg-[#5C3A1E]/10 text-[#5C3A1E]">
                                    {row.pillar}
                                  </span>
                                  {row.subArea && (
                                    <div className="mt-1 font-mono text-[9px] text-muted-foreground">{row.subArea}</div>
                                  )}
                                </div>
                              )}
                            </td>
                            {/* Criteri */}
                            <td className="px-3 py-3.5 align-top text-xs leading-relaxed text-foreground/80">
                              {tr(row.criterionCa, row.criterionEs)}
                            </td>
                            {/* Acció */}
                            <td className="px-3 py-3.5 align-top">
                              {(row.actionCa || row.actionEs) && (
                                <div className="rounded-md bg-[#B87333]/8 border-l-2 border-[#B87333] pl-3 pr-2 py-2">
                                  <p className="text-xs leading-relaxed text-foreground">{tr(row.actionCa || "", row.actionEs || "")}</p>
                                </div>
                              )}
                            </td>
                            {/* Termini */}
                            <td className="px-3 py-3.5 align-top">
                              {row.deadline && (
                                <span className="font-mono text-[10px] text-accent-deep font-semibold whitespace-nowrap">
                                  {row.deadline}
                                </span>
                              )}
                            </td>
                            {/* Impacte */}
                            <td className="px-3 py-3.5 align-top">
                              <span className={`inline-block rounded px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
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
              </div>
            ) : (
              /* Taula simple (altres 15 estàndards — sense camps enriquits) */
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
                        <tr key={i} className={`border-b border-rule/40 transition-colors hover:bg-secondary/20 ${isLocked ? "opacity-50" : ""}`}>
                          <td className="px-4 py-3.5 align-top">
                            {row.reportSlug ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); router.push(`/informes/${row.reportSlug}`); }}
                                className="font-serif text-sm font-semibold text-primary hover:text-accent-deep transition-colors text-left flex items-start gap-1 group"
                              >
                                <span>{row.reportTitle}</span>
                                <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ) : (
                              <span className="font-serif text-sm font-semibold text-primary">{row.reportTitle}</span>
                            )}
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
            )}

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

        {/* NOTA: Secció 'Accions recomanades' eliminada de la UI.
            El model d'accions genèriques per estàndard queda recolzat a les dades
            (camp `actions` a standards-details.ts) però no es mostra.
            El nou model integra l'acció concreta dins de cada cross-reference.
            Veure TASQUES.md — 'Accions recomanades' com a futura eina autònoma. */}
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
