"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
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
          <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-6 lg:px-8">
            <p className="eyebrow justify-center">404 · {tr("Estàndard no trobat", "Estándar no encontrado")}</p>
            <h1 className="mb-6 font-serif text-4xl font-medium text-primary">
              {tr("Aquest estàndard no existeix.", "Este estándar no existe.")}
            </h1>
            <Button asChild>
              <a href="/estandares-esg">{tr("Tornar als estàndards", "Volver a los estándares")}</a>
            </Button>
          </div>
        </main>
        <FooterV1 />
      </div>
    );
  }

  const cfg = TYPE_CONFIG[effectiveDetail.type];
  const showLocked = isPremiumContent && !isPremium;

  const filterChipClass = (active: boolean) =>
    `rounded-full border px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-150 ${
      active
        ? "border-primary bg-primary text-background"
        : "border-black/25 bg-transparent text-[#4A5F53] hover:border-accent hover:text-accent"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={() => setAuthOpen(true)} />
      <main className="flex-1">
        {/* ══════════ HERO ══════════ */}
        <section className="border-b" style={{ background: "#F2F5F1", borderColor: "#D8E2DA" }}>
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 lg:px-8 lg:pt-14">
            {/* Breadcrumb mono */}
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "#4A5F53" }}>
              <a href="/estandares-esg" className="transition-colors hover:text-accent" style={{ color: "#3F6653" }}>
                ← {tr("Estàndards ESG", "Estándares ESG")}
              </a>
              <span className="mx-2.5 opacity-50">/</span>
              <span style={{ color: "#141B18" }}>{effectiveDetail.name}</span>
            </p>

            <div className="mt-9 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                {/* Eyebrow tipus */}
                <p className="eyebrow">{tr(cfg.labelCa, cfg.labelEs)}</p>

                {/* Nom gran serif */}
                <h1 className="font-serif text-[clamp(2.4rem,4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.012em] text-primary">
                  {effectiveDetail.name}
                </h1>

                {/* Emissor mono + badge accés */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: "#4A5F53" }}>
                    {tr(effectiveDetail.issuerCa, effectiveDetail.issuerEs)}
                  </p>
                  {effectiveDetail.access === "free" ? (
                    <span className="rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ background: "rgba(170,201,182,0.28)", color: "#26312B" }}>
                      {tr("Gratis", "Gratis")}
                    </span>
                  ) : (
                    <span className="rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ background: "#26312B", color: "#AAC9B6" }}>
                      Premium
                    </span>
                  )}
                </div>

                {/* Descripció completa */}
                <p className="mt-6 max-w-[68ch] leading-relaxed" style={{ color: "#4A5F53", fontSize: "1.02rem", textWrap: "pretty" }}>
                  {tr(effectiveDetail.descCa, effectiveDetail.descEs)}
                </p>

                {/* Mini meta */}
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "#4A5F53" }}>
                  <b style={{ color: "#5E8772", fontWeight: 600 }}>{effectiveDetail.count}</b>{" "}
                  {tr("informes creuats amb aquest estàndard", "informes cruzados con este estándar")}
                </p>
              </div>

              {/* Logo */}
              <figure className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: "rgba(38,49,43,0.12)" }} aria-hidden="true">
                <div className="h-[5px] w-full" style={{ background: cfg.borderColor }} />
                <div className="flex h-[130px] w-full min-w-[240px] items-center justify-center px-8">
                  <Image
                    src={effectiveDetail.logo}
                    alt={`Logo ${effectiveDetail.name}`}
                    width={220}
                    height={100}
                    className="max-h-24 w-auto object-contain"
                    unoptimized
                  />
                </div>
              </figure>
            </div>
          </div>
        </section>

        {/* ══════════ CROSS-REFERENCE ══════════ */}
        <section className="pb-20 pt-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Capçalera de la secció */}
            <p className="eyebrow">Cross-reference</p>
            <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
              <h2 className="sec-title" style={{ marginBottom: 0 }}>
                {tr("Informes amb cross-reference", "Informes con cross-reference")}
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "#4A5F53" }}>
                <b className="font-serif text-xl font-medium normal-case" style={{ color: "#5E8772" }}>{sortedRows.length}</b>
                {" "}{tr("de", "de")} {effectiveDetail.xrefRows.length} {tr("informes", "informes")}
              </p>
            </div>
            <p className="sec-body mb-8">
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

            {/* Filtres */}
            <div className="mb-7 flex flex-wrap items-center gap-2.5">
              {/* Filtre per pilar (només si n'hi ha) */}
              {hasEnrichedRows && pillars.length > 0 && (
                <>
                  <button onClick={() => setPillarFilter("all")} className={filterChipClass(pillarFilter === "all")}>
                    {tr("Tots els pilars", "Todos los pilares")} ({effectiveDetail.xrefRows.length})
                  </button>
                  {pillars.map(p => (
                    <button key={p} onClick={() => setPillarFilter(p)} className={filterChipClass(pillarFilter === p)}>
                      {p} ({pillarCounts[p] || 0})
                    </button>
                  ))}
                </>
              )}
              {/* Filtre per impacte */}
              <select
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value)}
                className={`cursor-pointer appearance-none rounded-full bg-white px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] outline-none transition-shadow focus:border-accent focus:shadow-[0_0_0_3px_rgba(94,135,114,0.14)] ${pillars.length > 0 ? "" : "ml-auto"}`}
                style={{ borderColor: "rgba(38,49,43,0.28)", borderWidth: "1px", borderStyle: "solid", color: "#26312B" }}
              >
                <option value="all">{tr("Tots els impactes", "Todos los impactos")}</option>
                <option value="high">{tr("Alt", "Alto")}</option>
                <option value="med">{tr("Mitjà", "Medio")}</option>
              </select>
            </div>

            {/* Taula enriquida (amb pilar/acció/termini) — només B Corp pilot */}
            {hasEnrichedRows ? (
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: "rgba(38,49,43,0.12)" }}>
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
                            className={`border-b px-3 py-3.5 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${col.key !== "action" ? "cursor-pointer select-none transition-colors hover:text-accent" : ""}`}
                            style={{ width: col.width, position: "relative", paddingRight: "20px", borderBottomColor: "rgba(38,49,43,0.18)", color: "#3F6653" }}
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
                          <tr key={i} className={`transition-colors hover:bg-secondary/30 ${isLocked ? "opacity-50" : ""}`} style={{ borderBottom: i < sortedRows.length - 1 ? "1px solid rgba(38,49,43,0.07)" : "none" }}>
                            {/* Informe (link si hi ha reportSlug) */}
                            <td className="px-3 py-3.5 align-top">
                              {row.reportSlug ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); router.push(`/informes/${row.reportSlug}`); }}
                                  className="group flex items-start gap-1 text-left font-serif text-sm font-semibold text-primary transition-colors hover:text-[#3F6653]"
                                  style={{ color: "#26312B" }}
                                >
                                  <span>{row.reportTitle}</span>
                                  <ExternalLink className="mt-1 h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                              ) : (
                                <span className="font-serif text-sm font-semibold" style={{ color: "#26312B" }}>{row.reportTitle}</span>
                              )}
                              <div className="mt-1 whitespace-nowrap font-mono text-[10px]" style={{ color: "#4A5F53" }}>{row.date}</div>
                            </td>
                            {/* Pilar */}
                            <td className="px-3 py-3.5 align-top">
                              {row.pillar && (
                                <div>
                                  <span className="inline-block rounded px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ background: "rgba(20,27,24,0.08)", color: "#141B18" }}>
                                    {row.pillar}
                                  </span>
                                  {row.subArea && (
                                    <div className="mt-1 font-mono text-[9px]" style={{ color: "#4A5F53" }}>{row.subArea}</div>
                                  )}
                                </div>
                              )}
                            </td>
                            {/* Criteri */}
                            <td className="px-3 py-3.5 align-top text-xs leading-relaxed" style={{ color: "rgba(38,49,43,0.82)" }}>
                              {tr(row.criterionCa, row.criterionEs)}
                            </td>
                            {/* Acció */}
                            <td className="px-3 py-3.5 align-top">
                              {(row.actionCa || row.actionEs) && (
                                <div className="border-l-2 pl-3 pr-2 py-2" style={{ borderColor: "#5E8772", background: "rgba(94,135,114,0.06)" }}>
                                  <p className="text-xs leading-relaxed" style={{ color: "#26312B" }}>{tr(row.actionCa || "", row.actionEs || "")}</p>
                                </div>
                              )}
                            </td>
                            {/* Termini */}
                            <td className="px-3 py-3.5 align-top">
                              {row.deadline && (
                                <span className="whitespace-nowrap font-mono text-[10px] font-semibold" style={{ color: "#3F6653" }}>
                                  {row.deadline}
                                </span>
                              )}
                            </td>
                            {/* Impacte */}
                            <td className="px-3 py-3.5 align-top">
                              <span
                                className="inline-block rounded px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]"
                                style={
                                  row.impact === "high"
                                    ? { background: "rgba(160,82,45,0.12)", color: "#A0522D" }
                                    : { background: "rgba(201,169,97,0.15)", color: "#8A6D2B" }
                                }
                              >
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
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: "rgba(38,49,43,0.12)" }}>
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
                          className="cursor-pointer select-none border-b px-4 py-3.5 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-accent"
                          style={{ width: col.width, position: "relative", paddingRight: "28px", borderBottomColor: "rgba(38,49,43,0.18)", color: "#3F6653" }}
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
                        <tr key={i} className={`transition-colors hover:bg-secondary/30 ${isLocked ? "opacity-50" : ""}`} style={{ borderBottom: i < sortedRows.length - 1 ? "1px solid rgba(38,49,43,0.07)" : "none" }}>
                          <td className="px-4 py-3.5 align-top">
                            {row.reportSlug ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); router.push(`/informes/${row.reportSlug}`); }}
                                className="group flex items-start gap-1 text-left font-serif text-sm font-semibold transition-colors hover:text-[#3F6653]"
                                style={{ color: "#26312B" }}
                              >
                                <span>{row.reportTitle}</span>
                                <ExternalLink className="mt-1 h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                              </button>
                            ) : (
                              <span className="font-serif text-sm font-semibold" style={{ color: "#26312B" }}>{row.reportTitle}</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 align-top">
                            <span className="whitespace-nowrap font-mono text-[11px]" style={{ color: "#4A5F53" }}>{row.date}</span>
                          </td>
                          <td className="px-4 py-3.5 align-top text-xs leading-relaxed" style={{ color: "rgba(38,49,43,0.82)" }}>
                            {tr(row.criterionCa, row.criterionEs)}
                          </td>
                          <td className="px-4 py-3.5 align-top">
                            <span
                              className="inline-block rounded px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]"
                              style={
                                row.impact === "high"
                                  ? { background: "rgba(160,82,45,0.12)", color: "#A0522D" }
                                  : { background: "rgba(201,169,97,0.15)", color: "#8A6D2B" }
                              }
                            >
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
              <div className="mt-6 rounded-lg border border-dashed bg-white p-8 text-center" style={{ borderColor: "rgba(74,95,83,0.4)" }}>
                <Lock className="mx-auto mb-3 h-6 w-6" style={{ color: "#5E8772" }} />
                <p className="mb-2 font-serif text-xl font-medium text-primary">
                  {tr("Contingut Premium", "Contenido Premium")}
                </p>
                <p className="mx-auto mb-5 max-w-[52ch] text-sm" style={{ color: "#4A5F53" }}>
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
      <FooterV1 />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="register" />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => setAuthOpen(true)}
      />
    </div>
  );
}
