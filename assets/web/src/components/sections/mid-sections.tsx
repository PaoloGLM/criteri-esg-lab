"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Network,
  Target,
  ClipboardCheck,
  FileText,
  TrendingUp,
  ArrowRight,
  Eye,
} from "lucide-react";

interface MidSectionsProps {
  onOpenRegister?: () => void;
  onOpenReport?: () => void;
}

export function MidSections({ onOpenRegister, onOpenReport }: MidSectionsProps = {}) {
  const { t } = useLanguage();
  void onOpenRegister; // mantingut per compatibilitat futura

  // Els 8 FormatBloc definits com a array per evitar repetició i facilitar
  // la lectura de quins textos venen de i18n.
  const formatBlocs: {
    num: string;
    icon: React.ReactNode;
    titleKey:
      | "mid.format.bloc0.title"
      | "mid.format.bloc1.title"
      | "mid.format.bloc2.title"
      | "mid.format.bloc3.title"
      | "mid.format.bloc4.title"
      | "mid.format.bloc5.title"
      | "mid.format.bloc6.title"
      | "mid.format.bloc7.title";
    descKey:
      | "mid.format.bloc0.desc"
      | "mid.format.bloc1.desc"
      | "mid.format.bloc2.desc"
      | "mid.format.bloc3.desc"
      | "mid.format.bloc4.desc"
      | "mid.format.bloc5.desc"
      | "mid.format.bloc6.desc"
      | "mid.format.bloc7.desc";
    highlighted?: boolean;
  }[] = [
    { num: "00", icon: <Target className="h-4 w-4" />, titleKey: "mid.format.bloc0.title", descKey: "mid.format.bloc0.desc", highlighted: true },
    { num: "01", icon: <FileText className="h-4 w-4" />, titleKey: "mid.format.bloc1.title", descKey: "mid.format.bloc1.desc" },
    { num: "02", icon: <TrendingUp className="h-4 w-4" />, titleKey: "mid.format.bloc2.title", descKey: "mid.format.bloc2.desc" },
    { num: "03", icon: <Layers className="h-4 w-4" />, titleKey: "mid.format.bloc3.title", descKey: "mid.format.bloc3.desc" },
    { num: "04", icon: <Target className="h-4 w-4" />, titleKey: "mid.format.bloc4.title", descKey: "mid.format.bloc4.desc" },
    { num: "05", icon: <Network className="h-4 w-4" />, titleKey: "mid.format.bloc5.title", descKey: "mid.format.bloc5.desc" },
    { num: "06", icon: <ClipboardCheck className="h-4 w-4" />, titleKey: "mid.format.bloc6.title", descKey: "mid.format.bloc6.desc", highlighted: true },
    { num: "07", icon: <Network className="h-4 w-4" />, titleKey: "mid.format.bloc7.title", descKey: "mid.format.bloc7.desc", highlighted: true },
  ];

  return (
    <>
      {/* Speed section */}
      <section className="border-b border-rule py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-3">{t("mid.speed.eyebrow")}</p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                {t("mid.speed.title")}
              </h2>
              <div className="rule-accent my-5" />
              <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
                {t("mid.speed.body")}
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-3 gap-3">
                <StatCard value={t("mid.speed.stat1.value")} label={t("mid.speed.stat1.label")} />
                <StatCard value={t("mid.speed.stat2.value")} label={t("mid.speed.stat2.label")} />
                <StatCard value={t("mid.speed.stat3.value")} label={t("mid.speed.stat3.label")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Format section */}
      <section className="border-b border-rule bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow mb-3">{t("mid.format.eyebrow")}</p>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              {t("mid.format.title")}
            </h2>
            <div className="rule-accent my-5" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              {t("mid.format.body")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {formatBlocs.map((b) => (
              <FormatBloc
                key={b.num}
                num={b.num}
                icon={b.icon}
                title={t(b.titleKey)}
                desc={t(b.descKey)}
                highlighted={b.highlighted}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              variant="default"
              onClick={onOpenReport}
              className="h-12 px-6 text-base"
            >
              <Eye className="mr-2 h-4 w-4" />
              {t("format.exemple.cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t("format.exemple.note")}
          </p>
        </div>
      </section>
    </>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-rule bg-card p-4 text-center">
      <div className="font-serif text-3xl font-semibold text-accent sm:text-4xl">{value}</div>
      <div className="mt-1 text-xs leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}

function FormatBloc({
  num,
  icon,
  title,
  desc,
  highlighted,
  wide,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  highlighted?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-4 ${
        highlighted ? "border-accent bg-accent-soft/15" : "border-rule bg-card"
      } ${wide ? "lg:col-span-2" : ""}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-xs text-accent-deep">{num}</span>
        <span className="text-accent-deep">{icon}</span>
      </div>
      <h3 className="mb-1.5 font-serif text-base font-semibold leading-tight text-primary">{title}</h3>
      <p className="text-xs leading-relaxed text-foreground/70">{desc}</p>
    </div>
  );
}
