"use client";

import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Crown, CheckCircle2, Gauge, ClipboardCheck, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  onOpenReport: () => void;
  onOpenRegister: () => void;
  onOpenPreus?: () => void;
}

export function Hero({ onOpenReport, onOpenRegister, onOpenPreus }: HeroProps) {
  const { t } = useLanguage();
  const { user, plan } = useAuth();

  const isPremium = user && plan === "premium";
  const isFree = user && plan !== "premium";

  // Dades del cross-reference de l'informe ESRS (hardcoded per la hero,
  // ja que és un exemple visual. En el informe real es carrega dinàmicament).
  const xrefRows: { cert: string; criterion: { ca: string; es: string }; impact: "high" | "med" }[] = [
    {
      cert: "EcoVadis",
      criterion: {
        ca: "Reducció del 61% en datapoints afecta l'score de reporting",
        es: "Reducción de 61% en datapoints afecta al score de reporting",
      },
      impact: "high",
    },
    {
      cert: "B Corp",
      criterion: {
        ca: "La simplificació pot facilitar el procés de certificació",
        es: "Simplificación puede facilitar el proceso de certificación",
      },
      impact: "med",
    },
    {
      cert: "MSCI ESG",
      criterion: {
        ca: "Convergència amb GRI i ISSB: impacte en la metodologia de rating",
        es: "Convergencia con GRI e ISSB: impacto en rating methodology",
      },
      impact: "high",
    },
    {
      cert: "GRI",
      criterion: {
        ca: "Interoperabilitat ESRS-GRI reforçada en aquesta revisió",
        es: "Interoperabilidad ESRS-GRI reforzada en esta revisión",
      },
      impact: "med",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          {/* === COLUMNA ESQUERRA: títol + bullets + blocs + CTAs === */}
          <div>
            <p className="eyebrow mb-4">{t("hero.eyebrow")}</p>

            {/* Títol: "Informes ESG → Conocimiento. En sólo 5 minutos." */}
            <h1 className="font-serif font-semibold leading-[1.08] tracking-tight text-primary">
              <span className="block text-4xl sm:text-5xl">
                {t("hero.title.line1")}{" "}
                <span className="text-accent">↗</span>{" "}
                <span className="text-accent">{t("hero.title.line1b")}</span>
              </span>
              <span className="mt-1 block text-3xl font-medium sm:text-4xl">
                {t("hero.title.line2")}
              </span>
            </h1>

            <div className="rule-accent my-6" />

            {/* 3 bullets */}
            <ul className="mb-8 space-y-2.5">
              {[
                { key: "hero.bullet1" as const },
                { key: "hero.bullet2" as const },
                { key: "hero.bullet3" as const },
              ].map((bullet) => (
                <li key={bullet.key} className="flex items-start gap-3 text-base text-foreground/80">
                  <span className="mt-0.5 flex-shrink-0 font-bold text-accent">→</span>
                  <span>{t(bullet.key)}</span>
                </li>
              ))}
            </ul>

            {/* 3 blocs diferenciadors */}
            <div className="mb-8 flex flex-wrap gap-3">
              <BlocKey icon={<Gauge className="h-5 w-5" />} name={t("hero.bloc0.name")} desc={t("hero.bloc0.desc")} />
              <BlocKey icon={<ClipboardCheck className="h-5 w-5" />} name={t("hero.bloc6.name")} desc={t("hero.bloc6.desc")} />
              <BlocKey icon={<Network className="h-5 w-5" />} name={t("hero.bloc7.name")} desc={t("hero.bloc7.desc")} />
            </div>

            {/* ===== CTAs condicionals segons estat d'usuari ===== */}
            {isPremium ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Badge
                  variant="secondary"
                  className="h-12 gap-2 border border-accent/30 bg-accent-soft/20 px-4 text-sm font-medium text-accent-deep"
                >
                  <Crown className="h-4 w-4 text-accent" />
                  {t("cta.premium.badge")}
                </Badge>
                <Button size="lg" variant="outline" onClick={onOpenReport} className="h-12 px-6 text-base">
                  {t("latest.cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : isFree ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  onClick={onOpenPreus || onOpenRegister}
                  className="h-12 px-6 text-base"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  {t("cta.upgrade.button")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <a
                  href="/cuenta"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-rule bg-card px-6 text-sm font-medium text-foreground/80 transition-colors hover:border-accent hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {t("cta.newsletter.manage")}
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" onClick={onOpenRegister} className="h-12 px-6 text-base">
                  {t("hero.cta.trial")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={onOpenRegister} className="h-12 px-6 text-base">
                  <Mail className="mr-2 h-4 w-4" />
                  {t("hero.cta.newsletter")}
                </Button>
              </div>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              {isPremium
                ? t("cta.premium.badge")
                : isFree
                  ? t("cta.upgrade.body")
                  : t("hero.note")}
            </p>
          </div>

          {/* === COLUMNA DRETA: cross-reference table === */}
          <div>
            <div className="overflow-hidden rounded-lg border border-rule bg-card shadow-lg">
              {/* Header */}
              <div className="border-b border-rule bg-accent-soft/10 p-5">
                <span className="mb-2 inline-block rounded-full bg-accent px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-accent-foreground">
                  {t("hero.xref.badge")}
                </span>
                <p className="font-serif text-base font-semibold text-primary">
                  {t("hero.xref.title")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("hero.xref.subtitle")}
                </p>
              </div>

              {/* Table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-rule bg-secondary/30 px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-accent-deep">
                      {t("hero.xref.col_cert")}
                    </th>
                    <th className="border-b border-rule bg-secondary/30 px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-accent-deep">
                      {t("hero.xref.col_criterion")}
                    </th>
                    <th className="border-b border-rule bg-secondary/30 px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-accent-deep">
                      {t("hero.xref.col_impact")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {xrefRows.map((row, i) => (
                    <tr key={i} className={i < xrefRows.length - 1 ? "border-b border-rule/40" : ""}>
                      <td className="px-4 py-3 align-top">
                        <span className="font-serif text-sm font-semibold text-primary">{row.cert}</span>
                      </td>
                      <td className="px-4 py-3 align-top text-xs leading-relaxed text-foreground/80">
                        {row.criterion[t("brand.name") === "Criteri ESG" ? "ca" : "es"]}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-block rounded px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                            row.impact === "high"
                              ? "bg-[#A0522D]/12 text-[#A0522D]"
                              : "bg-[#C9A961]/15 text-[#8A6D2B]"
                          }`}
                        >
                          {row.impact === "high" ? t("hero.xref.impact.high") : t("hero.xref.impact.med")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Note */}
              <div className="border-t border-rule bg-secondary/30 px-5 py-3 text-xs italic leading-relaxed text-muted-foreground">
                <strong className="not-italic text-accent-deep">{t("hero.xref.note_title")}</strong>{" "}
                {t("hero.xref.note_body")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * BlocKey — card petit pels 3 blocs diferenciadors.
 * Segueix el patró de FormatBloc de mid-sections.tsx però més compacte.
 */
function BlocKey({
  icon,
  name,
  desc,
}: {
  icon: React.ReactNode;
  name: string;
  desc: string;
}) {
  return (
    <div className="flex-1 rounded-md border border-accent bg-accent-soft/10 p-5 text-center transition-all hover:shadow-sm" style={{ minWidth: "130px" }}>
      <div className="mb-2 flex justify-center text-accent-deep">{icon}</div>
      <p className="mb-1 font-serif text-sm font-semibold text-primary">{name}</p>
      <p className="text-xs leading-snug text-muted-foreground">{desc}</p>
    </div>
  );
}
