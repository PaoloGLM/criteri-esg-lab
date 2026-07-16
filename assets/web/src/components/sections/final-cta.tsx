"use client";

import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles, ArrowRight, Crown, CheckCircle2 } from "lucide-react";

interface FinalCtaProps {
  onOpenRegister: () => void;
  onOpenPreus?: () => void;
}

export function FinalCta({ onOpenRegister, onOpenPreus }: FinalCtaProps) {
  const { t } = useLanguage();
  const { user, plan } = useAuth();

  const isPremium = user && plan === "premium";
  const isFree = user && plan !== "premium";

  // Si l'usuari ja és Premium, tota la secció de CTA no té sentit:
  // mostrem només una targeta de confirmació + accés a la biblioteca.
  if (isPremium) {
    return (
      <section id="newsletter" className="border-b border-rule py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-accent/30 bg-accent-soft/10 p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft/20 text-accent-deep">
                <Crown className="h-5 w-5 text-accent" />
              </div>
              <p className="eyebrow mb-2">{t("cta.premium.badge")}</p>
              <h3 className="mb-3 font-serif text-2xl font-semibold leading-tight text-primary sm:text-3xl">
                {t("cta.premium.badge")}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-foreground/80">
                {t("cta.newsletter.subscribed")} · {t("cta.premium.badge")}
              </p>
              <a
                href="/informes"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t("nav.informes")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            <div className="rounded-lg border border-rule bg-card p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-accent-deep">
                <Mail className="h-5 w-5" />
              </div>
              <p className="eyebrow mb-2">{t("cta.newsletter.manage")}</p>
              <h3 className="mb-3 font-serif text-2xl font-semibold leading-tight text-primary sm:text-3xl">
                {t("cta.newsletter.manage")}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-foreground/80">
                {t("cta.newsletter.subscribed")}.
              </p>
              <a
                href="/cuenta"
                className="inline-flex h-11 items-center justify-center rounded-md border border-rule bg-background px-6 text-sm font-medium text-foreground hover:border-accent"
              >
                {t("cta.newsletter.manage")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Si l'usuari és free, el primer card (newsletter) es converteix en
  // "gestiona la teva subscripció" (perquè ja està subscrit en registrar-se)
  // i el segon (Premium) es manté però amb CTA "Fes-te Premium".
  return (
    <section id="newsletter" className="border-b border-rule py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-rule bg-secondary/50 p-8">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-background text-accent-deep">
              {isFree ? (
                <CheckCircle2 className="h-5 w-5 text-accent" />
              ) : (
                <Mail className="h-5 w-5" />
              )}
            </div>
            <p className="eyebrow mb-2">{t("cta.newsletter.eyebrow")}</p>
            <h3 className="mb-3 font-serif text-2xl font-semibold leading-tight text-primary sm:text-3xl">
              {isFree
                ? t("cta.newsletter.manage")
                : t("cta.newsletter.title")}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-foreground/80">
              {isFree
                ? t("cta.newsletter.subscribed")
                : t("cta.newsletter.body")}
            </p>
            {isFree ? (
              <a
                href="/cuenta"
                className="inline-flex h-11 items-center justify-center rounded-md border border-rule bg-background px-6 text-sm font-medium text-foreground hover:border-accent"
              >
                {t("cta.newsletter.manage")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            ) : (
              <Button variant="outline" size="lg" onClick={onOpenRegister} className="h-11 px-6">
                {t("hero.cta.newsletter")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="relative overflow-hidden rounded-lg border border-accent bg-accent p-8 text-accent-foreground">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent-soft/20" />
            <div className="relative">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-foreground/15 text-accent-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent-foreground/80">
                {t("cta.premium.eyebrow")}
              </p>
              <h3 className="mb-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
                {t("cta.premium.title")}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-accent-foreground/90">
                {t("cta.premium.body")}
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={isFree ? (onOpenPreus || onOpenRegister) : onOpenRegister}
                className="h-11 px-6"
              >
                {isFree ? t("cta.upgrade.button") : t("hero.cta.trial")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
