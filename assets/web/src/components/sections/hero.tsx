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
 * - Fons var(--c-fosc) (dark primari), text var(--c-clar)
 * - Eyebrow en JetBrains Mono uppercase 0.30em letter-spacing, color coure clar (var(--c-salvia-light))
 *   dins d'un requadre amb border coure transparent
 * - Títol Fraunces gegant (124px desktop, responsive) amb "criterio" en cursiva + coure clar
 * - Subtítol Fraunces italic, color tènue
 * - 2 CTAs:
 *   * Primari: coure sòlid (var(--c-salvia)) amb text blanc
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
      style={{ background: "var(--c-fosc)", color: "var(--c-clar)" }}
    >
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "1px", background: "var(--c-salvia)" }}
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-9">
        {/* Eyebrow */}
        <span
          className="font-mono text-[11px] font-semibold uppercase"
          style={{
            color: "var(--c-salvia-light)",
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
            color: "var(--c-clar)",
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
              style={{ color: "var(--c-salvia-light)" }}
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
                  color: "var(--c-salvia-light)",
                }}
              >
                <Crown className="h-4 w-4" style={{ color: "var(--c-salvia-light)" }} />
                {t("cta.premium.badge")}
              </span>
              <button
                onClick={onOpenReport}
                className="inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "var(--c-salvia)", color: "#FFFFFF" }}
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
                style={{ background: "var(--c-salvia)", color: "#FFFFFF" }}
              >
                <Crown className="h-4 w-4" />
                {t("cta.upgrade.button")}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="/cuenta"
                className="inline-flex h-12 items-center justify-center gap-2 px-2 font-serif text-base italic font-medium transition-colors"
                style={{
                  color: "var(--c-clar)",
                  borderBottom: "1px solid var(--c-salvia-light)",
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
                style={{ background: "var(--c-salvia)", color: "#FFFFFF" }}
              >
                {t("v2.hero.cta.primary")}
              </button>
              <button
                onClick={onOpenReport}
                className="inline-flex h-12 items-center justify-center gap-2 px-2 font-serif text-base italic font-medium transition-colors"
                style={{
                  color: "var(--c-clar)",
                  borderBottom: "1px solid var(--c-salvia-light)",
                }}
              >
                {t("v2.hero.cta.secondary")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Banner: 2 mesos Premium gratis */}
      <div
        className="relative mx-auto mt-12 w-full max-w-3xl px-6 py-4 text-center"
        style={{
          background: "rgba(184,115,51,0.15)",
          border: "1px solid var(--c-salvia)",
          borderRadius: "2px",
        }}
      >
        <p
          className="font-serif text-base italic sm:text-lg"
          style={{ color: "var(--c-clar)" }}
        >
          {t("v2.hero.free_premium_banner")}
        </p>
      </div>
    </section>
  );
}
