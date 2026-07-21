"use client";

import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Crown, Mail } from "lucide-react";

interface HeroProps {
  onOpenReport: () => void;
  onOpenRegister: () => void;
  onOpenPreus?: () => void;
}

/**
 * HERO — Variant 2 (Manifest Editorial) · dark
 *
 * Disseny:
 * - Fons #2C1810 (dark primari), text #F5EFE6
 * - Eyebrow en JetBrains Mono uppercase 0.30em letter-spacing, color coure clar (#D9A574)
 *   dins d'un requadre amb border coure transparent
 * - Títol Fraunces gegant (124px desktop, responsive) amb "criterio" en cursiva + coure clar
 * - Subtítol Fraunces italic, color tènue
 * - 2 CTAs:
 *   * Primari: coure sòlid (#B87333) amb text blanc
 *   * Secundari: text "Veure un informe real →" amb underline coure
 *
 * Els CTAs són auth-aware (com el hero anterior):
 * - Premium: badge "Ets Premium" + botó "Veure un informe real"
 * - Free: botó "Fes-te Premium" + gestió newsletter
 * - Anònim: prova gratis 7 dies + veure informe real
 */
export function Hero({ onOpenReport, onOpenRegister, onOpenPreus }: HeroProps) {
  const { t } = useLanguage();
  const { user, plan } = useAuth();

  const isPremium = user && plan === "premium";
  const isFree = user && plan !== "premium";

  return (
    <section
      className="relative flex flex-col items-center px-6 py-24 text-center sm:px-8 sm:py-32 lg:py-40"
      style={{ background: "#2C1810", color: "#F5EFE6" }}
    >
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "1px", background: "#B87333" }}
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-9">
        {/* Eyebrow */}
        <span
          className="font-mono text-[11px] font-semibold uppercase"
          style={{
            color: "#D9A574",
            letterSpacing: "0.3em",
            padding: "8px 16px",
            border: "1px solid rgba(217, 165, 116, 0.4)",
          }}
        >
          {t("v2.hero.eyebrow")}
        </span>

        {/* Title */}
        <h1
          className="font-serif font-normal leading-[0.98]"
          style={{
            color: "#F5EFE6",
            letterSpacing: "-0.035em",
            fontSize: "clamp(3rem, 8.6vw, 7.75rem)",
            maxWidth: "1200px",
          }}
        >
          <span className="block">{t("v2.hero.title.line1")}</span>
          <span className="block">
            {t("v2.hero.title.line2").split(" ").slice(0, -1).join(" ")}{" "}
            <em
              className="italic font-medium"
              style={{ color: "#D9A574" }}
            >
              {t("v2.hero.title.line2").split(" ").slice(-1)}
            </em>
            .
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-serif italic font-normal"
          style={{
            color: "rgba(245, 239, 230, 0.7)",
            fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
            lineHeight: 1.4,
            maxWidth: "760px",
          }}
        >
          {t("v2.hero.subtitle")}
        </p>

        {/* CTAs — auth-aware */}
        <div className="mt-4 flex flex-col items-center gap-7 sm:flex-row sm:items-center">
          {isPremium ? (
            <>
              <span
                className="inline-flex h-12 items-center gap-2 px-4 text-sm font-medium"
                style={{
                  border: "1px solid rgba(217, 165, 116, 0.4)",
                  background: "rgba(217, 165, 116, 0.1)",
                  color: "#D9A574",
                }}
              >
                <Crown className="h-4 w-4" style={{ color: "#D9A574" }} />
                {t("cta.premium.badge")}
              </span>
              <button
                onClick={onOpenReport}
                className="inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "#B87333", color: "#FFFFFF" }}
              >
                {t("v2.hero.cta.secondary")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : isFree ? (
            <>
              <button
                onClick={onOpenPreus || onOpenRegister}
                className="inline-flex h-12 items-center justify-center gap-2 px-7 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "#B87333", color: "#FFFFFF" }}
              >
                <Crown className="h-4 w-4" />
                {t("cta.upgrade.button")}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="/cuenta"
                className="inline-flex h-12 items-center justify-center gap-2 px-2 font-serif text-base italic font-medium transition-colors"
                style={{
                  color: "#F5EFE6",
                  borderBottom: "1px solid #D9A574",
                }}
              >
                <Mail className="h-4 w-4" />
                {t("cta.newsletter.manage")}
              </a>
            </>
          ) : (
            <>
              <button
                onClick={onOpenRegister}
                className="inline-flex h-12 items-center justify-center gap-2 px-9 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "#B87333", color: "#FFFFFF" }}
              >
                {t("v2.hero.cta.primary")}
              </button>
              <button
                onClick={onOpenReport}
                className="inline-flex h-12 items-center justify-center gap-2 px-2 font-serif text-base italic font-medium transition-colors"
                style={{
                  color: "#F5EFE6",
                  borderBottom: "1px solid #D9A574",
                }}
              >
                {t("v2.hero.cta.secondary")}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
