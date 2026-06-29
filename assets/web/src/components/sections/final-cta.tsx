"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles, ArrowRight } from "lucide-react";

interface FinalCtaProps {
  onOpenRegister: () => void;
}

export function FinalCta({ onOpenRegister }: FinalCtaProps) {
  const { t } = useLanguage();

  return (
    <section id="newsletter" className="border-b border-rule py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-rule bg-secondary/50 p-8">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-background text-accent-deep">
              <Mail className="h-5 w-5" />
            </div>
            <p className="eyebrow mb-2">{t("cta.newsletter.eyebrow")}</p>
            <h3 className="mb-3 font-serif text-2xl font-semibold leading-tight text-primary sm:text-3xl">
              {t("cta.newsletter.title")}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-foreground/80">
              {t("cta.newsletter.body")}
            </p>
            <Button variant="outline" size="lg" onClick={onOpenRegister} className="h-11 px-6">
              {t("hero.cta.newsletter")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
              <Button variant="secondary" size="lg" onClick={onOpenRegister} className="h-11 px-6">
                {t("hero.cta.trial")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
