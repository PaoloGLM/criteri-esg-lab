"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import {
  Search,
  Eye,
  Target,
  ClipboardCheck,
  Network,
  Cpu,
  Scale,
  Sprout,
  Heart,
  Users,
} from "lucide-react";

export default function QueFemPage() {
  const { t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  // Passos del procés (array per evitar repetició)
  const processSteps: {
    num: number;
    icon: React.ReactNode;
    titleKey:
      | "quefem.process.step1.title"
      | "quefem.process.step2.title"
      | "quefem.process.step3.title"
      | "quefem.process.step4.title"
      | "quefem.process.step5.title";
    bodyKey:
      | "quefem.process.step1.body"
      | "quefem.process.step2.body"
      | "quefem.process.step3.body"
      | "quefem.process.step4.body"
      | "quefem.process.step5.body";
  }[] = [
    { num: 1, icon: <Search className="h-5 w-5" />, titleKey: "quefem.process.step1.title", bodyKey: "quefem.process.step1.body" },
    { num: 2, icon: <Eye className="h-5 w-5" />, titleKey: "quefem.process.step2.title", bodyKey: "quefem.process.step2.body" },
    { num: 3, icon: <Target className="h-5 w-5" />, titleKey: "quefem.process.step3.title", bodyKey: "quefem.process.step3.body" },
    { num: 4, icon: <ClipboardCheck className="h-5 w-5" />, titleKey: "quefem.process.step4.title", bodyKey: "quefem.process.step4.body" },
    { num: 5, icon: <Network className="h-5 w-5" />, titleKey: "quefem.process.step5.title", bodyKey: "quefem.process.step5.body" },
  ];

  // Els 8 blocs del format (reutilitzem les claus mid.format.*)
  const formatBlocs: {
    num: string;
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
    { num: "0", titleKey: "mid.format.bloc0.title", descKey: "mid.format.bloc0.desc", highlighted: true },
    { num: "1", titleKey: "mid.format.bloc1.title", descKey: "mid.format.bloc1.desc" },
    { num: "2", titleKey: "mid.format.bloc2.title", descKey: "mid.format.bloc2.desc" },
    { num: "3", titleKey: "mid.format.bloc3.title", descKey: "mid.format.bloc3.desc" },
    { num: "4", titleKey: "mid.format.bloc4.title", descKey: "mid.format.bloc4.desc" },
    { num: "5", titleKey: "mid.format.bloc5.title", descKey: "mid.format.bloc5.desc" },
    { num: "6", titleKey: "mid.format.bloc6.title", descKey: "mid.format.bloc6.desc", highlighted: true },
    { num: "7", titleKey: "mid.format.bloc7.title", descKey: "mid.format.bloc7.desc", highlighted: true },
  ];

  // Els 4 valors (reutilitzem les claus quisom.valors.*)
  const valors: {
    icon: React.ReactNode;
    titleKey:
      | "quisom.valors.etica.title"
      | "quisom.valors.economia.title"
      | "quisom.valors.dignitat.title"
      | "quisom.valors.territori.title";
    bodyKey:
      | "quisom.valors.etica.body"
      | "quisom.valors.economia.body"
      | "quisom.valors.dignitat.body"
      | "quisom.valors.territori.body";
  }[] = [
    { icon: <Scale className="h-4 w-4" />, titleKey: "quisom.valors.etica.title", bodyKey: "quisom.valors.etica.body" },
    { icon: <Sprout className="h-4 w-4" />, titleKey: "quisom.valors.economia.title", bodyKey: "quisom.valors.economia.body" },
    { icon: <Heart className="h-4 w-4" />, titleKey: "quisom.valors.dignitat.title", bodyKey: "quisom.valors.dignitat.body" },
    { icon: <Users className="h-4 w-4" />, titleKey: "quisom.valors.territori.title", bodyKey: "quisom.valors.territori.body" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />
      <main className="flex-1">
        {/* Page hero */}
        <section className="border-b border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow mb-2">{t("quefem.eyebrow")}</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              {t("quefem.title")}
            </h1>
            <div className="rule-accent my-5" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              {t("quefem.subtitle")}
            </p>
          </div>
        </section>

        {/* Procés — 5 passos */}
        <section className="border-b border-rule py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="eyebrow mb-3">{t("quefem.process.eyebrow")}</p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                {t("quefem.process.title")}
              </h2>
              <div className="rule-accent my-5" />
              <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
                {t("quefem.process.body")}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {processSteps.map((step) => (
                <div
                  key={step.num}
                  className="rounded-md border border-rule bg-card p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent-deep">
                      {step.icon}
                    </span>
                    <span className="font-mono text-xs text-accent-deep">
                      PAS {step.num}
                    </span>
                  </div>
                  <h3 className="mb-2 font-serif text-base font-semibold text-primary">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/75">
                    {t(step.bodyKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Format — 8 blocs */}
        <section className="border-b border-rule bg-secondary/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="eyebrow mb-3">{t("quefem.format.eyebrow")}</p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                {t("quefem.format.title")}
              </h2>
              <div className="rule-accent my-5" />
              <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
                {t("quefem.format.body")}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {formatBlocs.map((b) => (
                <div
                  key={b.num}
                  className={`rounded-md border p-4 ${
                    b.highlighted
                      ? "border-accent bg-accent-soft/15"
                      : "border-rule bg-card"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-xs text-accent-deep">
                      {b.num}
                    </span>
                  </div>
                  <h3 className="mb-1.5 font-serif text-base font-semibold leading-tight text-primary">
                    {t(b.titleKey)}
                  </h3>
                  <p className="text-xs leading-relaxed text-foreground/70">
                    {t(b.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sistema d'IA + supervisió */}
        <section className="border-b border-rule py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-md border border-accent/30 bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-accent" />
                <p className="font-mono text-xs uppercase tracking-widest text-accent-deep">
                  {t("quisom.ai.title")}
                </p>
              </div>
              <p className="text-base leading-relaxed text-foreground/80">
                {t("quisom.ai.body")}
              </p>
              <div className="mt-4 flex items-start gap-2 rounded-md border border-rule bg-secondary/30 p-3">
                <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-deep" />
                <p className="text-xs leading-relaxed text-foreground/75">
                  <strong className="text-accent-deep">{t("quisom.ai.supervision.title")}</strong>{" "}
                  {t("quisom.ai.supervision.body")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Criteris i valors */}
        <section className="border-b border-rule bg-secondary/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="eyebrow mb-3">{t("quefem.valors.eyebrow")}</p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                {t("quefem.valors.title")}
              </h2>
              <div className="rule-accent my-5" />
              <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
                {t("quefem.valors.intro")}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {valors.map((v, i) => (
                <div
                  key={i}
                  className="rounded-md border border-rule bg-secondary/30 p-4"
                >
                  <div className="mb-2 flex items-center gap-2 text-accent-deep">
                    {v.icon}
                    <h4 className="font-serif text-sm font-semibold text-primary">
                      {t(v.titleKey)}
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/75">
                    {t(v.bodyKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preguntes per millorar (Premium) */}
        <section className="border-b border-rule py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-md border border-accent bg-accent-soft/15 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-accent" />
                <p className="font-mono text-xs uppercase tracking-widest text-accent-deep">
                  {t("quefem.preguntes.eyebrow")}
                </p>
              </div>
              <h2 className="mb-3 font-serif text-2xl font-semibold leading-tight text-primary sm:text-3xl">
                {t("quefem.preguntes.title")}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-foreground/80">
                {t("quefem.preguntes.intro")}
              </p>
              <div className="rounded-md border border-rule bg-background p-4">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent-deep">
                  {t("quisom.preguntes.example.title")}
                </p>
                <p className="font-serif text-base italic leading-relaxed text-foreground">
                  {t("quisom.preguntes.example.body")}
                </p>
              </div>
              <p className="mt-3 text-xs font-medium text-accent-deep">
                🔒 {t("quisom.preguntes.cta")}
              </p>
            </div>
          </div>
        </section>

        {/* Tancament */}
        <section className="border-b border-rule bg-secondary/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-md border-l-2 border-accent bg-accent-soft/10 p-5">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-deep">
                {t("quefem.closing.eyebrow")}
              </p>
              <p className="font-serif text-lg leading-relaxed text-foreground italic">
                {t("quefem.closing.body")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => openAuth("register")}
      />
    </div>
  );
}
