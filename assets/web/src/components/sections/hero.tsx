"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Award, Mail, Gauge, Compass, Feather } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  onOpenReport: () => void;
  onOpenRegister: () => void;
}

export function Hero({ onOpenReport, onOpenRegister }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">{t("hero.eyebrow")}</p>
            <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <div className="rule-accent my-6" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" onClick={onOpenRegister} className="h-12 px-6 text-base">
                {t("hero.cta.trial")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onOpenRegister} className="h-12 px-6 text-base">
                <Mail className="mr-2 h-4 w-4" />
                {t("hero.cta.newsletter")}
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t("hero.note")}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg border border-rule bg-card p-6 shadow-sm">
              <Badge
                variant="secondary"
                className="mb-3 border border-accent/30 bg-accent-soft/20 text-accent-deep hover:bg-accent-soft/30"
              >
                {t("latest.eyebrow")}
              </Badge>
              <h3 className="font-serif text-2xl font-semibold leading-tight text-primary">
                {t("latest.title")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                {t("latest.summary")}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Button onClick={onOpenReport} className="w-full">
                  {t("latest.cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onOpenRegister} className="w-full">
                  {t("latest.cta.trial")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-6">
            <p className="eyebrow mb-2">{t("sections.subtitle")}</p>
            <h2 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">
              {t("sections.title")}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <SectionCard href="/informes" icon={<FileText className="h-5 w-5" />} title={t("sections.informes.title")} desc={t("sections.informes.desc")} />
            <SectionCard href="#newsletter" icon={<Mail className="h-5 w-5" />} title={t("sections.newsletter.title")} desc={t("sections.newsletter.desc")} />
            <SectionCard href="/informes" icon={<Award className="h-5 w-5" />} title={t("sections.crossref.title")} desc={t("sections.crossref.desc")} />
            <SectionCard href="/informes" icon={<Gauge className="h-5 w-5" />} title={t("sections.semafor.title")} desc={t("sections.semafor.desc")} highlighted />
            <SectionCard href="/informes" icon={<Compass className="h-5 w-5" />} title={t("sections.editorial.title")} desc={t("sections.editorial.desc")} highlighted />
            <SectionCard href="#newsletter" icon={<Feather className="h-5 w-5" />} title={t("sections.cartadirector.title")} desc={t("sections.cartadirector.desc")} highlighted />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionCard({
  href,
  icon,
  title,
  desc,
  highlighted,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  highlighted?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group relative rounded-lg border p-5 transition-all hover:shadow-md ${
        highlighted
          ? "border-accent bg-accent-soft/10 hover:border-accent"
          : "border-rule bg-card hover:border-accent"
      }`}
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-accent-deep">
        {icon}
      </div>
      {highlighted && (
        <span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-widest text-accent">
          ⭐ Diferencial
        </span>
      )}
      <h3 className="mb-2 font-serif text-lg font-semibold leading-tight text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/70">{desc}</p>
      <ArrowRight className="absolute right-4 bottom-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}
