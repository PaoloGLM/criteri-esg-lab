"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Lock, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

type StandarType = "reg" | "fw" | "cert";

interface StandarDetail {
  slug: string;
  name: string;
  type: StandarType;
  issuerCa: string;
  issuerEs: string;
  descCa: string;
  descEs: string;
  icon: string;
  xrefRows: {
    reportTitle: string;
    date: string;
    criterionCa: string;
    criterionEs: string;
    impact: "high" | "med";
  }[];
  actions: {
    num: string;
    textCa: string;
    textEs: string;
    sourceCa: string;
    sourceEs: string;
  }[];
}

const TYPE_CONFIG: Record<StandarType, { color: string; bg: string; borderColor: string; labelCa: string; labelEs: string }> = {
  reg: { color: "#5C3A1E", bg: "rgba(92,58,30,0.15)", borderColor: "#5C3A1E", labelCa: "Regulació", labelEs: "Regulación" },
  fw: { color: "#B87333", bg: "rgba(184,115,51,0.12)", borderColor: "#B87333", labelCa: "Framework", labelEs: "Framework" },
  cert: { color: "#8A6D2B", bg: "rgba(232,201,154,0.25)", borderColor: "#E8C99A", labelCa: "Certificació", labelEs: "Certificación" },
};

const STANDARDS_DETAIL: Record<string, StandarDetail> = {
  "b-corp": {
    slug: "b-corp",
    name: "B Corp",
    type: "cert",
    issuerCa: "B Lab · Empreses amb propòsit",
    issuerEs: "B Lab · Empresas con propósito",
    descCa: "B Corp avalua l'impacte positiu d'una empresa en els seus treballadors, comunitat i medi ambient. Requiereix un score mínim de 80/200 en el B Impact Assessment. La certificació inclou 5 àrees: gobernança, treballadors, comunitat, entorn i clients.",
    descEs: "B Corp evalúa el impacto positivo de una empresa en sus trabajadores, comunidad y medio ambiente. Requiere un score mínimo de 80/200 en el B Impact Assessment. La certificación incluye 5 áreas: gobernanza, trabajadores, comunidad, entorno y clientes.",
    icon: "🌱",
    xrefRows: [
      { reportTitle: "Revisió dels ESRS: simplificació del CSRD", date: "6 may 2026",
        criterionCa: "La simplificació de datapoints pot facilitar el procés de certificació B Corp en reduir la càrrega de reporting paral·lel",
        criterionEs: "La simplificación de datapoints puede facilitar el proceso de certificación B Corp al reducir la carga de reporting paralelo",
        impact: "med" },
      { reportTitle: "EFRAG Sustainability Reporting Work Programme 2026", date: "12 feb 2026",
        criterionCa: "Convergència ESRS-GRI: les empreses B Corp que ja reporten amb GRI tindran menys treball duplicat en ESRS",
        criterionEs: "Convergencia ESRS-GRI: las empresas B Corp que ya reportan con GRI tendrán menos trabajo duplicado en ESRS",
        impact: "high" },
      { reportTitle: "CSDDD Omnibus I: esmenes finals", date: "15 mar 2026",
        criterionCa: "El deure de diligència en drets humans reforça el pilar 'Comunitat' del B Impact Assessment",
        criterionEs: "El deber de diligencia en derechos humanos refuerza el pilar 'Comunidad' del B Impact Assessment",
        impact: "high" },
      { reportTitle: "B Corp New Standards 2026", date: "22 abr 2026",
        criterionCa: "Nous performance requirements: alineació amb CSRD. Les empreses B Corp han de verificar compatibilitat amb reporting ESRS",
        criterionEs: "Nuevos performance requirements: alineación con CSRD. Las empresas B Corp deben verificar compatibilidad con reporting ESRS",
        impact: "high" },
      { reportTitle: "EU Taxonomy Delegated Act 2026", date: "28 mar 2026",
        criterionCa: "Activitats alineades amb Taxonomia UE poden comptar com a evidència per al pilar 'Entorn' de B Corp",
        criterionEs: "Actividades alineadas con Taxonomía UE pueden contar como evidencia para el pilar 'Entorno' de B Corp",
        impact: "med" },
    ],
    actions: [
      { num: "1", textCa: "Auditar la compatibilitat entre els nous B Corp Performance Requirements i el reporting ESRS vigent abans del proper cicle de certificació",
        textEs: "Auditar la compatibilidad entre los nuevos B Corp Performance Requirements y el reporting ESRS vigente antes del próximo ciclo de certificación",
        sourceCa: "Font: B Corp New Standards 2026", sourceEs: "Fuente: B Corp New Standards 2026" },
      { num: "2", textCa: "Aprofitar la convergència ESRS-GRI per reduir treball duplicat en el B Impact Assessment",
        textEs: "Aprovechar la convergencia ESRS-GRI para reducir trabajo duplicado en el B Impact Assessment",
        sourceCa: "Font: EFRAG Work Programme 2026", sourceEs: "Fuente: EFRAG Work Programme 2026" },
      { num: "3", textCa: "Documentar el deure de diligència en drets humans com a evidència per al pilar 'Comunitat' de B Corp",
        textEs: "Documentar el deber de diligencia en derechos humanos como evidencia para el pilar 'Comunidad' de B Corp",
        sourceCa: "Font: CSDDD Omnibus I", sourceEs: "Fuente: CSDDD Omnibus I" },
      { num: "4", textCa: "Mapejar activitats alineades amb Taxonomia UE com a evidència per al pilar 'Entorn' del B Impact Assessment",
        textEs: "Mapear actividades alineadas con Taxonomía UE como evidencia para el pilar 'Entorno' del B Impact Assessment",
        sourceCa: "Font: EU Taxonomy Delegated Act 2026", sourceEs: "Fuente: EU Taxonomy Delegated Act 2026" },
    ],
  },
  // Placeholder per a altres estàndards (es faran servir les mateixes dades que B Corp com a demo)
};

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

  const detail = STANDARDS_DETAIL[slug];

  // Per a estàndards sense detall encara, usar B Corp com a demo
  const effectiveDetail = detail || STANDARDS_DETAIL["b-corp"];
  const isDemo = !detail;

  const isPremium = user && plan === "premium";
  const isPremiumContent = effectiveDetail?.type === "cert";

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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <a href="/estandares-esg" className="text-accent-deep hover:underline">{tr("Estàndards ESG", "Estándares ESG")}</a> &gt; {effectiveDetail.name}
            </p>
            <div className="flex items-start gap-5">
              <div
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
                style={{ background: cfg.bg, border: `1px solid ${cfg.borderColor}` }}
              >
                {effectiveDetail.icon}
              </div>
              <div>
                <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
                  {effectiveDetail.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="inline-block rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider" style={{ background: cfg.bg, color: cfg.color }}>
                    {tr(cfg.labelCa, cfg.labelEs)}
                  </span>
                  {"  "}{tr(effectiveDetail.issuerCa, effectiveDetail.issuerEs)}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/75">
                  {tr(effectiveDetail.descCa, effectiveDetail.descEs)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-reference table */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                <option>{tr("Tots els impactes", "Todos los impactos")}</option>
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
