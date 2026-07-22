"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useRouter } from "next/navigation";

/**
 * /que-fem — Fase 2D redesign.
 *
 * Design source: /home/z/my-project/scripts/informe-variants/que-fem-redissenyat.html
 *
 * 6 sections:
 *   1. Hero (cream, 2 cols: title + meta)
 *   2. El proceso (cream, 3 cols: 01 Sintetizar / 02 Cruzar / 03 Recomendar)
 *   3. Semáforo hero (dark, 2 cols: text + 5 dimensions grid)
 *   4. Estructura del informe (cream, 2-col grid of 7 blocs; 06+07 starred)
 *   5. Criterios y valores (cream, 2-col grid of 6 criterios)
 *   6. Manifest (dark, centered)
 *
 * CRITICAL TEXT RULES:
 *   - Use "5 minutos" everywhere (decisió editorial 17).
 *   - All texts in Spanish for ES version (Paolo detected Catalan phrases in v1).
 *   - Catalan version is a natural translation.
=======

/**
 * /que-fem — Fase 2D redesign.
=======

/**
 * /que-fem — Fase 2D redesign.
>>>>>>> Stashed changes
 * Design: /home/z/my-project/scripts/informe-variants/que-fem-redissenyat.html
 *
 * 6 seccions:
 *   1. Hero (cream) — títol "Un filtro con criterio" + meta
 *   2. El procés (cream) — 3 columnes (Sintetitzar/Cruzar/Recomendar)
 *   3. Semàforo hero (dark) — 5 dimensions explicades
 *   4. Estructura del informe (cream) — 7 blocs grid (06+07 starred)
 *   5. Criterios y valores (cream) — 6 criteris
 *   6. Manifest (dark) — cita ètica
 *
 * Textos en castellà per defecte (decisió 14) amb traducció CAT.
 * "5 minuts" (decisió 17). Sense "4-6 informes", sense "1.000-1.100 paraules".
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
 */
export default function QueFemPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  // Process steps
  const processSteps = [
    {
      num: "01",
      verbKey: "v2.quefem.process.1.verb" as const,
      descKey: "v2.quefem.process.1.desc" as const,
    },
    {
      num: "02",
      verbKey: "v2.quefem.process.2.verb" as const,
      descKey: "v2.quefem.process.2.desc" as const,
    },
    {
      num: "03",
      verbKey: "v2.quefem.process.3.verb" as const,
      descKey: "v2.quefem.process.3.desc" as const,
    },
  ];

  // 5 semáforo dimensions
  const semaforDims = [
    { nameKey: "v2.quefem.semafor.dim1.name" as const, descKey: "v2.quefem.semafor.dim1.desc" as const },
    { nameKey: "v2.quefem.semafor.dim2.name" as const, descKey: "v2.quefem.semafor.dim2.desc" as const },
    { nameKey: "v2.quefem.semafor.dim3.name" as const, descKey: "v2.quefem.semafor.dim3.desc" as const },
    { nameKey: "v2.quefem.semafor.dim4.name" as const, descKey: "v2.quefem.semafor.dim4.desc" as const },
    { nameKey: "v2.quefem.semafor.dim5.name" as const, descKey: "v2.quefem.semafor.dim5.desc" as const, fullSpan: true },
  ];

  // 7 blocs (06 and 07 starred)
  const blocs = [
    {
      num: "01",
      nameKey: "v2.quefem.blocs.1.name" as const,
      descKey: "v2.quefem.blocs.1.desc" as const,
      metaKey: "v2.quefem.blocs.1.meta" as const,
      star: false,
    },
    {
      num: "02",
      nameKey: "v2.quefem.blocs.2.name" as const,
      descKey: "v2.quefem.blocs.2.desc" as const,
      metaKey: "v2.quefem.blocs.2.meta" as const,
      star: false,
    },
    {
      num: "03",
      nameKey: "v2.quefem.blocs.3.name" as const,
      descKey: "v2.quefem.blocs.3.desc" as const,
      metaKey: "v2.quefem.blocs.3.meta" as const,
      star: false,
    },
    {
      num: "04",
      nameKey: "v2.quefem.blocs.4.name" as const,
      descKey: "v2.quefem.blocs.4.desc" as const,
      metaKey: "v2.quefem.blocs.4.meta" as const,
      star: false,
    },
    {
      num: "05",
      nameKey: "v2.quefem.blocs.5.name" as const,
      descKey: "v2.quefem.blocs.5.desc" as const,
      metaKey: "v2.quefem.blocs.5.meta" as const,
      star: false,
    },
    {
      num: "06",
      nameKey: "v2.quefem.blocs.6.name" as const,
      descKey: "v2.quefem.blocs.6.desc" as const,
      metaKey: "v2.quefem.blocs.6.meta" as const,
      star: true,
    },
    {
      num: "07",
      nameKey: "v2.quefem.blocs.7.name" as const,
      descKey: "v2.quefem.blocs.7.desc" as const,
      metaKey: "v2.quefem.blocs.7.meta" as const,
      star: true,
      fullSpan: true,
    },
  ];

  // 6 criterios
  const criterios = [
    {
      numKey: "v2.quefem.valors.1.num" as const,
      preKey: "v2.quefem.valors.1.pre" as const,
      emKey: "v2.quefem.valors.1.em" as const,
    },
    {
      numKey: "v2.quefem.valors.2.num" as const,
      preKey: "v2.quefem.valors.2.pre" as const,
      emKey: "v2.quefem.valors.2.em" as const,
    },
    {
      numKey: "v2.quefem.valors.3.num" as const,
      preKey: "v2.quefem.valors.3.pre" as const,
      emKey: "v2.quefem.valors.3.em" as const,
    },
    {
      numKey: "v2.quefem.valors.4.num" as const,
      preKey: "v2.quefem.valors.4.pre" as const,
      emKey: "v2.quefem.valors.4.em" as const,
    },
    {
      numKey: "v2.quefem.valors.5.num" as const,
      preKey: "v2.quefem.valors.5.pre" as const,
      emKey: "v2.quefem.valors.5.em" as const,
    },
    {
      numKey: "v2.quefem.valors.6.num" as const,
      preKey: "v2.quefem.valors.6.pre" as const,
      emKey: "v2.quefem.valors.6.em" as const,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5EFE6", color: "#2C1810" }}>
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />
      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section
          className="px-6 py-16 sm:px-12 lg:px-16 lg:py-20"
          style={{ borderBottom: "1px solid #2C1810" }}
        >
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <div
                className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
                style={{ color: "#8A5526", letterSpacing: "0.22em" }}
              >
                <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
                {t("v2.quefem.hero.eyebrow")}
              </div>
              <h1
                className="font-serif font-medium"
                style={{
                  fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.022em",
                  color: "#2C1810",
                  marginBottom: "16px",
                }}
              >
                {t("v2.quefem.hero.title.pre")}
                <em
                  className="italic font-normal"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.quefem.hero.title.em")}
                </em>
                {t("v2.quefem.hero.title.post")}
              </h1>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "clamp(1rem, 1.5vw, 1.1875rem)",
                  lineHeight: 1.4,
                  color: "#5C3A1E",
                  maxWidth: "600px",
                }}
              >
                {t("v2.quefem.hero.subtitle")}
              </p>
            </div>
            <div
              className="font-mono text-[10px] font-medium uppercase md:text-right"
              style={{
                letterSpacing: "0.16em",
                color: "#8B7355",
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: "#2C1810", fontWeight: 600 }}>192</strong>{" "}
              {t("v2.quefem.hero.meta.sources")}
              <br />
              <strong style={{ color: "#2C1810", fontWeight: 600 }}>16</strong>{" "}
              {t("v2.quefem.hero.meta.standards")}
              <br />
              <strong style={{ color: "#2C1810", fontWeight: 600 }}>5</strong>{" "}
              {t("v2.quefem.hero.meta.reading")}
=======
  // 5 dimensions del semàforo (descripcions curtes, mateixes que al popup)
  const semaforoDimensions = [
    { name: "Scope 3", desc: t("quefem.semaforo.scope3") },
    { name: "Plazos", desc: t("quefem.semaforo.plazos") },
    { name: "Fuentes", desc: t("quefem.semaforo.fuentes") },
    { name: "Granularidad", desc: t("quefem.semaforo.granularidad") },
    { name: "Verificación", desc: t("quefem.semaforo.verificacion") },
  ];

  // 7 blocs de l'informe (01-07)
  const blocs = [
    { num: "01", name: t("quefem.bloc.01.name"), desc: t("quefem.bloc.01.desc"), meta: t("quefem.bloc.01.meta"), star: false },
    { num: "02", name: t("quefem.bloc.02.name"), desc: t("quefem.bloc.02.desc"), meta: t("quefem.bloc.02.meta"), star: false },
    { num: "03", name: t("quefem.bloc.03.name"), desc: t("quefem.bloc.03.desc"), meta: t("quefem.bloc.03.meta"), star: false },
    { num: "04", name: t("quefem.bloc.04.name"), desc: t("quefem.bloc.04.desc"), meta: t("quefem.bloc.04.meta"), star: false },
    { num: "05", name: t("quefem.bloc.05.name"), desc: t("quefem.bloc.05.desc"), meta: t("quefem.bloc.05.meta"), star: false },
    { num: "06", name: t("quefem.bloc.06.name"), desc: t("quefem.bloc.06.desc"), meta: t("quefem.bloc.06.meta"), star: true },
    { num: "07", name: t("quefem.bloc.07.name"), desc: t("quefem.bloc.07.desc"), meta: t("quefem.bloc.07.meta"), star: true },
  ];

  // 6 criteris i valors
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
=======
  // 5 dimensions del semàforo (descripcions curtes, mateixes que al popup)
  const semaforoDimensions = [
    { name: "Scope 3", desc: t("quefem.semaforo.scope3") },
    { name: "Plazos", desc: t("quefem.semaforo.plazos") },
    { name: "Fuentes", desc: t("quefem.semaforo.fuentes") },
    { name: "Granularidad", desc: t("quefem.semaforo.granularidad") },
    { name: "Verificación", desc: t("quefem.semaforo.verificacion") },
  ];

  // 7 blocs de l'informe (01-07)
  const blocs = [
    { num: "01", name: t("quefem.bloc.01.name"), desc: t("quefem.bloc.01.desc"), meta: t("quefem.bloc.01.meta"), star: false },
    { num: "02", name: t("quefem.bloc.02.name"), desc: t("quefem.bloc.02.desc"), meta: t("quefem.bloc.02.meta"), star: false },
    { num: "03", name: t("quefem.bloc.03.name"), desc: t("quefem.bloc.03.desc"), meta: t("quefem.bloc.03.meta"), star: false },
    { num: "04", name: t("quefem.bloc.04.name"), desc: t("quefem.bloc.04.desc"), meta: t("quefem.bloc.04.meta"), star: false },
    { num: "05", name: t("quefem.bloc.05.name"), desc: t("quefem.bloc.05.desc"), meta: t("quefem.bloc.05.meta"), star: false },
    { num: "06", name: t("quefem.bloc.06.name"), desc: t("quefem.bloc.06.desc"), meta: t("quefem.bloc.06.meta"), star: true },
    { num: "07", name: t("quefem.bloc.07.name"), desc: t("quefem.bloc.07.desc"), meta: t("quefem.bloc.07.meta"), star: true },
  ];

  // 6 criteris i valors
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
>>>>>>> Stashed changes
        {/* === 1. HERO === */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                    {t("quefem.hero.eyebrow")}
                  </p>
                </div>
                <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
                  {t("quefem.hero.title.pre")}{" "}
                  <em className="italic" style={{ color: "#5C3A1E" }}>{t("quefem.hero.title.em")}</em>
                  {t("quefem.hero.title.post")}
                </h1>
                <p className="mt-6 max-w-2xl font-serif text-lg italic" style={{ color: "#5C3A1E" }}>
                  {t("quefem.hero.subtitle")}
                </p>
              </div>
              <div className="text-right font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#8B7355" }}>
                <p><strong className="font-semibold" style={{ color: "#2C1810" }}>192</strong> {t("quefem.hero.meta.fuentes")}</p>
                <p><strong className="font-semibold" style={{ color: "#2C1810" }}>16</strong> {t("quefem.hero.meta.estandares")}</p>
                <p><strong className="font-semibold" style={{ color: "#2C1810" }}>5</strong> {t("quefem.hero.meta.minutos")}</p>
              </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            </div>
          </div>
        </section>

<<<<<<< Updated upstream
<<<<<<< Updated upstream
        {/* ===== EL PROCESO (3 cols) ===== */}
        <section
          className="px-6 py-16 sm:px-12 lg:px-16 lg:py-20"
          style={{ borderBottom: "1px solid #2C1810" }}
        >
          <div className="mx-auto max-w-7xl">
            <div
              className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
              style={{ color: "#8A5526", letterSpacing: "0.22em" }}
            >
              <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
              {t("v2.quefem.process.eyebrow")}
            </div>
            <h2
              className="mb-8 font-serif font-medium"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.625rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.018em",
                color: "#2C1810",
                maxWidth: "900px",
              }}
            >
              {t("v2.quefem.process.title.pre")}
              <em className="italic font-normal" style={{ color: "#5C3A1E" }}>
                {t("v2.quefem.process.title.em")}
              </em>
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ borderTop: "1px solid #2C1810" }}
            >
              {processSteps.map((step, i) => (
                <div
                  key={step.num}
                  className="flex flex-col gap-4 py-8"
                  style={{
                    padding: "32px",
                    borderRight:
                      i < processSteps.length - 1 ? "1px solid rgba(44, 24, 16, 0.15)" : undefined,
                  }}
                >
                  <div
                    className="font-serif font-light"
                    style={{
                      fontSize: "4rem",
                      color: "#B87333",
                      letterSpacing: "-0.04em",
                      lineHeight: 0.9,
                    }}
                  >
                    {step.num}
                  </div>
                  <div
                    className="font-serif font-medium"
                    style={{
                      fontSize: "1.75rem",
                      color: "#2C1810",
                      letterSpacing: "-0.012em",
                    }}
                  >
                    {t(step.verbKey)}
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#5C3A1E",
                      lineHeight: 1.55,
                    }}
                  >
                    {t(step.descKey)}
=======
        {/* === 2. EL PROCÉS === */}
=======
        {/* === 2. EL PROCÉS === */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                {t("quefem.proceso.eyebrow")}
              </p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.proceso.title.pre")}{" "}
              <em className="italic" style={{ color: "#5C3A1E" }}>{t("quefem.proceso.title.em")}</em>
              {t("quefem.proceso.title.post")}
            </h2>
            <div className="grid gap-0 border-t border-primary">
              {[
                { num: "01", verb: t("quefem.proceso.01.verb"), desc: t("quefem.proceso.01.desc") },
                { num: "02", verb: t("quefem.proceso.02.verb"), desc: t("quefem.proceso.02.desc") },
                { num: "03", verb: t("quefem.proceso.03.verb"), desc: t("quefem.proceso.03.desc") },
              ].map((step, i) => (
                <div
                  key={step.num}
                  className="flex flex-col gap-4 p-8"
                  style={{
                    borderRight: i < 2 ? "1px solid rgba(44,24,16,0.15)" : "none",
                  }}
                >
                  <div className="font-serif text-6xl font-light leading-none" style={{ color: "#B87333", letterSpacing: "-0.04em" }}>
                    {step.num}
                  </div>
                  <div className="font-serif text-3xl font-medium text-primary" style={{ letterSpacing: "-0.012em" }}>
                    {step.verb}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === 3. SEMÀFOR HERO (dark) === */}
        <section style={{ background: "#2C1810", color: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div className="flex flex-col gap-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#D9A574" }}>
                  {t("quefem.semaforo.eyebrow")}
                </p>
                <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl" style={{ color: "#F5EFE6" }}>
                  {t("quefem.semaforo.title.pre")}{" "}
                  <em className="italic" style={{ color: "#D9A574" }}>{t("quefem.semaforo.title.em")}</em>
                  {t("quefem.semaforo.title.post")}
                </h2>
                <p className="max-w-md font-serif text-lg italic" style={{ color: "rgba(245,239,230,0.75)" }}>
                  {t("quefem.semaforo.desc")}
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {semaforoDimensions.map((dim, i) => (
                  <div
                    key={dim.name}
                    className="flex flex-col gap-1.5 border-b py-4"
                    style={{
                      borderBottomColor: "rgba(217,165,116,0.2)",
                      gridColumn: i === 4 ? "span 2" : "auto",
                    }}
                  >
                    <div className="font-serif text-lg font-medium" style={{ color: "#F5EFE6" }}>
                      {dim.name}
                    </div>
                    <div className="text-[13px] leading-relaxed" style={{ color: "rgba(245,239,230,0.65)" }}>
                      {dim.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === 4. ESTRUCTURA DEL INFORME === */}
>>>>>>> Stashed changes
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
<<<<<<< Updated upstream
                {t("quefem.proceso.eyebrow")}
              </p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.proceso.title.pre")}{" "}
              <em className="italic" style={{ color: "#5C3A1E" }}>{t("quefem.proceso.title.em")}</em>
              {t("quefem.proceso.title.post")}
            </h2>
            <div className="grid gap-0 border-t border-primary">
              {[
                { num: "01", verb: t("quefem.proceso.01.verb"), desc: t("quefem.proceso.01.desc") },
                { num: "02", verb: t("quefem.proceso.02.verb"), desc: t("quefem.proceso.02.desc") },
                { num: "03", verb: t("quefem.proceso.03.verb"), desc: t("quefem.proceso.03.desc") },
              ].map((step, i) => (
                <div
                  key={step.num}
                  className="flex flex-col gap-4 p-8"
                  style={{
                    borderRight: i < 2 ? "1px solid rgba(44,24,16,0.15)" : "none",
                  }}
                >
                  <div className="font-serif text-6xl font-light leading-none" style={{ color: "#B87333", letterSpacing: "-0.04em" }}>
                    {step.num}
                  </div>
                  <div className="font-serif text-3xl font-medium text-primary" style={{ letterSpacing: "-0.012em" }}>
                    {step.verb}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
                    {step.desc}
>>>>>>> Stashed changes
=======
                {t("quefem.estructura.eyebrow")}
              </p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.estructura.title.pre")}{" "}
              <em className="italic" style={{ color: "#5C3A1E" }}>{t("quefem.estructura.title.em")}</em>
              {t("quefem.estructura.title.post")}
            </h2>
            <div className="grid gap-0 border-t border-primary sm:grid-cols-2">
              {blocs.map((bloc, i) => (
                <div
                  key={bloc.num}
                  className="flex flex-col gap-3 border-b border-r p-8"
                  style={{
                    borderRightColor: i % 2 === 0 ? "rgba(44,24,16,0.15)" : "none",
                    borderBottomColor: "rgba(44,24,16,0.15)",
                    background: bloc.star ? "rgba(184,115,51,0.06)" : "transparent",
                  }}
                >
                  <div className="font-serif text-5xl font-light leading-none" style={{ color: "#B87333", letterSpacing: "-0.03em" }}>
                    {bloc.num}
                  </div>
                  <div className="font-serif text-xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                    {bloc.name}
                    {bloc.star && <span className="ml-2 text-base">⭐</span>}
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#5C3A1E" }}>
                    {bloc.desc}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}>
                    {bloc.meta}
>>>>>>> Stashed changes
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

<<<<<<< Updated upstream
<<<<<<< Updated upstream
        {/* ===== SEMÁFORO HERO (dark) ===== */}
        <section
          className="px-6 py-16 sm:px-12 lg:px-16 lg:py-20"
          style={{
            background: "#2C1810",
            color: "#F5EFE6",
            borderBottom: "1px solid #B87333",
          }}
        >
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
            {/* Left text */}
            <div className="flex flex-col gap-5">
              <span
                className="font-mono text-[11px] font-semibold uppercase"
                style={{ color: "#D9A574", letterSpacing: "0.22em" }}
              >
                {t("v2.quefem.semafor.tag")}
              </span>
              <h2
                className="font-serif font-medium"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.018em",
                  color: "#F5EFE6",
                }}
              >
                {t("v2.quefem.semafor.title.pre")}
                <em className="italic font-normal" style={{ color: "#D9A574" }}>
                  {t("v2.quefem.semafor.title.em")}
                </em>
                {t("v2.quefem.semafor.title.post")}
              </h2>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "1.0625rem",
                  lineHeight: 1.5,
                  color: "rgba(245, 239, 230, 0.75)",
                  maxWidth: "480px",
                }}
              >
                {t("v2.quefem.semafor.desc")}
=======
        {/* === 3. SEMÀFOR HERO (dark) === */}
        <section style={{ background: "#2C1810", color: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div className="flex flex-col gap-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#D9A574" }}>
                  {t("quefem.semaforo.eyebrow")}
                </p>
                <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl" style={{ color: "#F5EFE6" }}>
                  {t("quefem.semaforo.title.pre")}{" "}
                  <em className="italic" style={{ color: "#D9A574" }}>{t("quefem.semaforo.title.em")}</em>
                  {t("quefem.semaforo.title.post")}
                </h2>
                <p className="max-w-md font-serif text-lg italic" style={{ color: "rgba(245,239,230,0.75)" }}>
                  {t("quefem.semaforo.desc")}
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {semaforoDimensions.map((dim, i) => (
                  <div
                    key={dim.name}
                    className="flex flex-col gap-1.5 border-b py-4"
                    style={{
                      borderBottomColor: "rgba(217,165,116,0.2)",
                      gridColumn: i === 4 ? "span 2" : "auto",
                    }}
                  >
                    <div className="font-serif text-lg font-medium" style={{ color: "#F5EFE6" }}>
                      {dim.name}
                    </div>
                    <div className="text-[13px] leading-relaxed" style={{ color: "rgba(245,239,230,0.65)" }}>
                      {dim.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === 4. ESTRUCTURA DEL INFORME === */}
=======
        {/* === 5. CRITERIOS Y VALORES === */}
>>>>>>> Stashed changes
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
<<<<<<< Updated upstream
                {t("quefem.estructura.eyebrow")}
>>>>>>> Stashed changes
=======
                {t("quefem.criteris.eyebrow")}
>>>>>>> Stashed changes
              </p>
              <button
                onClick={() => router.push("/informes/revisio-esrs-maig-2026")}
                className="self-start border-0 bg-transparent p-0 font-sans text-[13px] font-semibold"
                style={{
                  color: "#D9A574",
                  borderBottom: "1px solid #B87333",
                  paddingBottom: "4px",
                  cursor: "pointer",
                }}
              >
                {t("v2.quefem.semafor.cta")}
              </button>
            </div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream

            {/* Right dimensions grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 sm:gap-x-8">
              {semaforDims.map((dim, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1.5 py-4"
                  style={{
                    borderBottom: "1px solid rgba(217, 165, 116, 0.2)",
                    gridColumn: dim.fullSpan ? "span 2" : undefined,
                  }}
                >
                  <div
                    className="font-serif font-medium"
                    style={{ fontSize: "1.125rem", color: "#F5EFE6" }}
                  >
                    {t(dim.nameKey)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(245, 239, 230, 0.65)",
                      lineHeight: 1.45,
                    }}
                  >
                    {t(dim.descKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ESTRUCTURA DEL INFORME (7 blocs) ===== */}
        <section
          className="px-6 py-16 sm:px-12 lg:px-16 lg:py-20"
          style={{ borderBottom: "1px solid #2C1810" }}
        >
          <div className="mx-auto max-w-7xl">
            <div
              className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
              style={{ color: "#8A5526", letterSpacing: "0.22em" }}
            >
              <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
              {t("v2.quefem.blocs.eyebrow")}
            </div>
            <h2
              className="mb-8 font-serif font-medium"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.625rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.018em",
                color: "#2C1810",
                maxWidth: "900px",
              }}
            >
              {t("v2.quefem.blocs.title.pre")}
              <em className="italic font-normal" style={{ color: "#5C3A1E" }}>
                {t("v2.quefem.blocs.title.em")}
              </em>
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ borderTop: "1px solid #2C1810" }}
            >
              {blocs.map((b) => (
                <div
                  key={b.num}
                  className="flex flex-col gap-3 py-8"
                  style={{
                    padding: "32px",
                    background: b.star ? "rgba(184, 115, 51, 0.06)" : "transparent",
                    borderRight:
                      !b.fullSpan ? "1px solid rgba(44, 24, 16, 0.15)" : undefined,
                    borderBottom: "1px solid rgba(44, 24, 16, 0.15)",
                    gridColumn: b.fullSpan ? "span 2" : undefined,
                  }}
                >
                  <div
                    className="font-serif font-light"
                    style={{
                      fontSize: "3.5rem",
                      color: "#B87333",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {b.num}
                  </div>
                  <div
                    className="font-serif font-medium"
                    style={{
                      fontSize: "1.375rem",
                      color: "#2C1810",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {t(b.nameKey)}
                    {b.star && (
                      <span style={{ marginLeft: "8px", fontSize: "1rem" }}>⭐</span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#5C3A1E",
                      lineHeight: 1.5,
                    }}
                  >
                    {t(b.descKey)}
                  </p>
                  <div
                    className="font-mono text-[10px] font-medium uppercase"
                    style={{
                      letterSpacing: "0.14em",
                      color: "#8B7355",
                      marginTop: "4px",
                    }}
                  >
                    {t(b.metaKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CRITERIOS Y VALORES (6) ===== */}
        <section
          className="px-6 py-16 sm:px-12 lg:px-16 lg:py-20"
          style={{ borderBottom: "1px solid #2C1810" }}
        >
          <div className="mx-auto max-w-7xl">
            <div
              className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
              style={{ color: "#8A5526", letterSpacing: "0.22em" }}
            >
              <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
              {t("v2.quefem.valors.eyebrow")}
            </div>
            <h2
              className="mb-8 font-serif font-medium"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.625rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.018em",
                color: "#2C1810",
                maxWidth: "900px",
              }}
            >
              {t("v2.quefem.valors.title.pre")}
              <em className="italic font-normal" style={{ color: "#5C3A1E" }}>
                {t("v2.quefem.valors.title.em")}
              </em>
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-16">
              {criterios.map((c, i) => (
                <div
                  key={i}
                  className="py-5"
                  style={{ borderBottom: "1px solid rgba(201, 184, 154, 0.5)" }}
                >
                  <div
                    className="mb-2 font-mono text-[10px] font-semibold uppercase"
                    style={{ color: "#B87333", letterSpacing: "0.18em" }}
                  >
                    {t(c.numKey)}
                  </div>
                  <p
                    className="font-serif italic"
                    style={{
                      fontSize: "1.25rem",
                      lineHeight: 1.35,
                      color: "#2C1810",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {t(c.preKey)}
                    <em
                      className="not-italic font-medium"
                      style={{ color: "#5C3A1E" }}
                    >
                      {t(c.emKey)}
                    </em>
=======
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.estructura.title.pre")}{" "}
              <em className="italic" style={{ color: "#5C3A1E" }}>{t("quefem.estructura.title.em")}</em>
              {t("quefem.estructura.title.post")}
            </h2>
            <div className="grid gap-0 border-t border-primary sm:grid-cols-2">
              {blocs.map((bloc, i) => (
                <div
                  key={bloc.num}
                  className="flex flex-col gap-3 border-b border-r p-8"
                  style={{
                    borderRightColor: i % 2 === 0 ? "rgba(44,24,16,0.15)" : "none",
                    borderBottomColor: "rgba(44,24,16,0.15)",
                    background: bloc.star ? "rgba(184,115,51,0.06)" : "transparent",
                  }}
                >
                  <div className="font-serif text-5xl font-light leading-none" style={{ color: "#B87333", letterSpacing: "-0.03em" }}>
                    {bloc.num}
                  </div>
                  <div className="font-serif text-xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                    {bloc.name}
                    {bloc.star && <span className="ml-2 text-base">⭐</span>}
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#5C3A1E" }}>
                    {bloc.desc}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}>
                    {bloc.meta}
=======
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.criteris.title.pre")}{" "}
              <em className="italic" style={{ color: "#5C3A1E" }}>{t("quefem.criteris.title.em")}</em>
              {t("quefem.criteris.title.post")}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-16">
              {criteris.map((c) => (
                <div key={c.num} className="border-b py-5" style={{ borderBottomColor: "rgba(201,184,154,0.5)" }}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>
                    {c.num} · {c.name}
                  </p>
                  <p className="font-serif text-xl italic leading-snug text-primary" style={{ letterSpacing: "-0.005em" }}>
                    {c.text}
>>>>>>> Stashed changes
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

<<<<<<< Updated upstream
        {/* === 5. CRITERIOS Y VALORES === */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                {t("quefem.criteris.eyebrow")}
              </p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quefem.criteris.title.pre")}{" "}
              <em className="italic" style={{ color: "#5C3A1E" }}>{t("quefem.criteris.title.em")}</em>
              {t("quefem.criteris.title.post")}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-16">
              {criteris.map((c) => (
                <div key={c.num} className="border-b py-5" style={{ borderBottomColor: "rgba(201,184,154,0.5)" }}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>
                    {c.num} · {c.name}
                  </p>
                  <p className="font-serif text-xl italic leading-snug text-primary" style={{ letterSpacing: "-0.005em" }}>
                    {c.text}
>>>>>>> Stashed changes
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

<<<<<<< Updated upstream
        {/* ===== MANIFEST (dark, centered) ===== */}
        <section
          className="flex flex-col items-center gap-6 px-6 py-24 text-center sm:px-12 lg:py-28"
          style={{
            background: "#2C1810",
            color: "#F5EFE6",
            borderBottom: "1px solid #B87333",
          }}
        >
          <div
            className="font-mono text-[11px] font-semibold uppercase"
            style={{ color: "#D9A574", letterSpacing: "0.22em" }}
          >
            {t("v2.quefem.manifest.eyebrow")}
=======
=======
>>>>>>> Stashed changes
        {/* === 6. MANIFEST (dark) === */}
        <section style={{ background: "#2C1810", color: "#F5EFE6" }}>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-28">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#D9A574" }}>
              {t("quefem.manifest.eyebrow")}
            </p>
            <p className="font-serif text-3xl leading-snug sm:text-4xl" style={{ color: "#F5EFE6", letterSpacing: "-0.018em" }}>
              {t("quefem.manifest.text.pre")}{" "}
              <em className="italic font-medium" style={{ color: "#D9A574" }}>{t("quefem.manifest.text.em")}</em>
              {t("quefem.manifest.text.post")}
            </p>
            <p className="mt-6 font-serif text-sm italic" style={{ color: "rgba(245,239,230,0.5)" }}>
              — {t("quefem.manifest.attribution")}
            </p>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          </div>
          <p
            className="font-serif font-normal"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.018em",
              color: "#F5EFE6",
              maxWidth: "920px",
            }}
          >
            {t("v2.quefem.manifest.text.pre")}
            <em
              className="italic font-medium"
              style={{ color: "#D9A574" }}
            >
              {t("v2.quefem.manifest.text.em")}
            </em>
            {t("v2.quefem.manifest.text.post")}
          </p>
          <p
            className="font-serif italic"
            style={{
              fontSize: "0.875rem",
              color: "rgba(245, 239, 230, 0.5)",
              marginTop: "8px",
            }}
          >
            {t("v2.quefem.manifest.attribution")}
          </p>
        </section>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
