"use client";

import { useState } from "react";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";

export default function QueFemPage() {
  const { t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const semaforoDims = [
    { name: t("quefem.semaforo.scope3") },
    { name: t("quefem.semaforo.plazos") },
    { name: t("quefem.semaforo.fuentes") },
    { name: t("quefem.semaforo.granularidad") },
    { name: t("quefem.semaforo.verificacion") },
  ];

  const blocs = [
    { num: "01", name: t("quefem.bloc.01.name"), desc: t("quefem.bloc.01.desc"), meta: t("quefem.bloc.01.meta"), star: false },
    { num: "02", name: t("quefem.bloc.02.name"), desc: t("quefem.bloc.02.desc"), meta: t("quefem.bloc.02.meta"), star: false },
    { num: "03", name: t("quefem.bloc.03.name"), desc: t("quefem.bloc.03.desc"), meta: t("quefem.bloc.03.meta"), star: false },
    { num: "04", name: t("quefem.bloc.04.name"), desc: t("quefem.bloc.04.desc"), meta: t("quefem.bloc.04.meta"), star: false },
    { num: "05", name: t("quefem.bloc.05.name"), desc: t("quefem.bloc.05.desc"), meta: t("quefem.bloc.05.meta"), star: false },
    { num: "06", name: t("quefem.bloc.06.name"), desc: t("quefem.bloc.06.desc"), meta: t("quefem.bloc.06.meta"), star: true },
    { num: "07", name: t("quefem.bloc.07.name"), desc: t("quefem.bloc.07.desc"), meta: t("quefem.bloc.07.meta"), star: true },
  ];

  const criteris = [
    { num: "01", name: t("quefem.criteri.01.name"), text: t("quefem.criteri.01.text") },
    { num: "02", name: t("quefem.criteri.02.name"), text: t("quefem.criteri.02.text") },
    { num: "03", name: t("quefem.criteri.03.name"), text: t("quefem.criteri.03.text") },
    { num: "04", name: t("quefem.criteri.04.name"), text: t("quefem.criteri.04.text") },
    { num: "05", name: t("quefem.criteri.05.name"), text: t("quefem.criteri.05.text") },
    { num: "06", name: t("quefem.criteri.06.name"), text: t("quefem.criteri.06.text") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* 1. HERO */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{t("quefem.hero.eyebrow")}</p>
                </div>
                <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
                  {t("quefem.hero.title.pre")}<em className="italic" style={{ color: "#141B18" }}>{t("quefem.hero.title.em")}</em>{t("quefem.hero.title.post")}
                </h1>
                <p className="mt-6 max-w-2xl font-serif text-lg italic" style={{ color: "#141B18" }}>{t("quefem.hero.subtitle")}</p>
              </div>
              <div className="text-right font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#4A5F53" }}>
                <p><strong className="font-semibold text-primary">192</strong> {t("quefem.hero.meta.fuentes")}</p>
                <p><strong className="font-semibold text-primary">16</strong> {t("quefem.hero.meta.estandares")}</p>
                <p><strong className="font-semibold text-primary">5</strong> {t("quefem.hero.meta.minutos")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. EL PROCÉS */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{t("quefem.proceso.eyebrow")}</p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.proceso.title.pre")}<em className="italic" style={{ color: "#141B18" }}>{t("quefem.proceso.title.em")}</em>{t("quefem.proceso.title.post")}
            </h2>
            <div className="grid gap-0 border-t border-primary sm:grid-cols-3">
              {[
                { num: "01", verb: t("quefem.proceso.01.verb"), desc: t("quefem.proceso.01.desc") },
                { num: "02", verb: t("quefem.proceso.02.verb"), desc: t("quefem.proceso.02.desc") },
                { num: "03", verb: t("quefem.proceso.03.verb"), desc: t("quefem.proceso.03.desc") },
              ].map((step, i) => (
                <div key={step.num} className="flex flex-col gap-4 p-8" style={{ borderRight: i < 2 ? "1px solid rgba(44,24,16,0.15)" : "none" }}>
                  <div className="font-serif text-6xl font-light leading-none" style={{ color: "#5E8772", letterSpacing: "-0.04em" }}>{step.num}</div>
                  <div className="font-serif text-3xl font-medium text-primary" style={{ letterSpacing: "-0.012em" }}>{step.verb}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "#141B18" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. SEMÀFOR HERO (dark) */}
        <section style={{ background: "#26312B", color: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div className="flex flex-col gap-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#AAC9B6" }}>{t("quefem.semaforo.eyebrow")}</p>
                <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl" style={{ color: "#F2F5F1" }}>
                  {t("quefem.semaforo.title.pre")}<em className="italic" style={{ color: "#AAC9B6" }}>{t("quefem.semaforo.title.em")}</em>{t("quefem.semaforo.title.post")}
                </h2>
                <p className="max-w-md font-serif text-lg italic" style={{ color: "rgba(245,239,230,0.75)" }}>{t("quefem.semaforo.desc")}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {semaforoDims.map((dim, i) => (
                  <div key={dim.name} className="flex flex-col gap-1.5 border-b py-4" style={{ borderBottomColor: "rgba(217,165,116,0.2)", gridColumn: i === 4 ? "span 2" : "auto" }}>
                    <div className="font-serif text-lg font-medium" style={{ color: "#F2F5F1" }}>{dim.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. ESTRUCTURA DEL INFORME */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{t("quefem.estructura.eyebrow")}</p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.estructura.title.pre")}<em className="italic" style={{ color: "#141B18" }}>{t("quefem.estructura.title.em")}</em>{t("quefem.estructura.title.post")}
            </h2>
            <div className="grid gap-0 border-t border-primary sm:grid-cols-2">
              {blocs.map((bloc, i) => (
                <div key={bloc.num} className="flex flex-col gap-3 border-b border-r p-8" style={{ borderRightColor: i % 2 === 0 ? "rgba(44,24,16,0.15)" : "none", borderBottomColor: "rgba(44,24,16,0.15)", background: bloc.star ? "rgba(184,115,51,0.06)" : "transparent" }}>
                  <div className="font-serif text-5xl font-light leading-none" style={{ color: "#5E8772", letterSpacing: "-0.03em" }}>{bloc.num}</div>
                  <div className="font-serif text-xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>{bloc.name}{bloc.star && <span className="ml-2 text-base">⭐</span>}</div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#141B18" }}>{bloc.desc}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#4A5F53" }}>{bloc.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CRITERIOS Y VALORES */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{t("quefem.criteris.eyebrow")}</p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.criteris.title.pre")}<em className="italic" style={{ color: "#141B18" }}>{t("quefem.criteris.title.em")}</em>{t("quefem.criteris.title.post")}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-16">
              {criteris.map((c) => (
                <div key={c.num} className="border-b py-5" style={{ borderBottomColor: "rgba(201,184,154,0.5)" }}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#5E8772" }}>{c.num} · {c.name}</p>
                  <p className="font-serif text-xl italic leading-snug text-primary" style={{ letterSpacing: "-0.005em" }}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5b. COM PROCESSAM CADA INFORME */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>Com processem cada informe</p>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-medium leading-tight text-primary sm:text-4xl">
              Doble revisió d&apos;IA amb validació humana
            </h2>
            <div className="rule-accent mb-6" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              Cada informe Criteri ESG passa per un flux de doble revisió d&apos;IA amb validació humana obligatòria. Detecció d&apos;informes originals, redacció d&apos;informes propis, advocat del diable, revisió ortogràfica i finalment l&apos;equip humà valida sempre cada bloc abans de publicar. La IA sempre està supervisada.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#3F6653" }}>
              Providers: Agent GLM 5.2 i API Gemini 2.5 Flash
            </p>
          </div>
        </section>

        {/* 6. MANIFEST (dark) */}
        <section style={{ background: "#26312B", color: "#F2F5F1" }}>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-28">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#AAC9B6" }}>{t("quefem.manifest.eyebrow")}</p>
            <p className="font-serif text-3xl leading-snug sm:text-4xl" style={{ color: "#F2F5F1", letterSpacing: "-0.018em" }}>
              {t("quefem.manifest.text.pre")}<em className="italic font-medium" style={{ color: "#AAC9B6" }}>{t("quefem.manifest.text.em")}</em>{t("quefem.manifest.text.post")}
            </p>
            <p className="mt-6 font-serif text-sm italic" style={{ color: "rgba(245,239,230,0.5)" }}>— {t("quefem.manifest.attribution")}</p>
          </div>
        </section>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
