"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
<<<<<<< Updated upstream
import type { TranslationKey } from "@/lib/i18n";

/**
 * /qui-som — Fase 2D redesign.
 *
 * Design source: /home/z/my-project/scripts/informe-variants/qui-som-redissenyat.html
 *
 * 5 sections:
 *   1. Hero (cream): title + subtitle mentioning "agentes de cambio"
 *   2. Manifest hero (cream, box with copper left border): uses EXISTING i18n
 *      `quisom.manifest.page.body`.
 *   3. Equipo (cream, 3 cols): NO real names. Fundador / Tech Lead / Agente de IA.
 *      Bios come from EXISTING i18n `quisom.team.paolo.bio` etc.
 *   4. Lo que creemos (dark): 5 conviccions in 2-col grid.
 *   5. Closing (cream): centered eyebrow + text + CTA button.
 *
 * CRITICAL: do NOT invent information about Paolo. Use ONLY existing i18n texts.
=======

/**
 * /qui-som — Fase 2D redesign.
 * Design: /home/z/my-project/scripts/informe-variants/qui-som-redissenyat.html
 *
 * 5 seccions:
 *   1. Hero (cream)
 *   2. Manifest hero (cream, box amb barra coure)
 *   3. Equip (cream, 3 columnes sense noms propis)
 *   4. Lo que creemos (dark, 5 conviccions)
 *   5. Closing (cream)
 *
 * CRITICAL: No inventar informació sobre Paolo. Usar textos existents del i18n.
>>>>>>> Stashed changes
 */
export default function QuiSomPage() {
  const { t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

<<<<<<< Updated upstream
  // 3 members — NO real names. Use existing bio i18n keys.
  const teamMembers: {
    icon: string;
    roleKey: TranslationKey;
    nameKey: TranslationKey;
    bioKey: TranslationKey;
    tagKey: TranslationKey;
    isAI?: boolean;
  }[] = [
    {
      icon: "★",
      roleKey: "v2.quisom.member.1.role",
      nameKey: "v2.quisom.member.1.name",
      bioKey: "quisom.team.paolo.bio",
      tagKey: "v2.quisom.member.1.tag",
    },
    {
      icon: "⚙",
      roleKey: "v2.quisom.member.2.role",
      nameKey: "v2.quisom.member.2.name",
      bioKey: "quisom.team.techlead.bio",
      tagKey: "v2.quisom.member.2.tag",
    },
    {
      icon: "◆",
      roleKey: "v2.quisom.member.3.role",
      nameKey: "v2.quisom.member.3.name",
      bioKey: "quisom.team.zai.bio",
      tagKey: "v2.quisom.member.3.tag",
      isAI: true,
    },
=======
  // 3 membres de l'equip (sense noms propis)
  const teamMembers = [
    { icon: "★", role: t("quisom.v2.team.01.role"), name: t("quisom.v2.team.01.name"), bio: t("quisom.v2.team.01.bio"), tag: t("quisom.v2.team.01.tag"), isAI: false },
    { icon: "⚙", role: t("quisom.v2.team.02.role"), name: t("quisom.v2.team.02.name"), bio: t("quisom.v2.team.02.bio"), tag: t("quisom.v2.team.02.tag"), isAI: false },
    { icon: "◆", role: t("quisom.v2.team.03.role"), name: t("quisom.v2.team.03.name"), bio: t("quisom.v2.team.03.bio"), tag: t("quisom.v2.team.03.tag"), isAI: true },
  ];

  // 5 conviccions
  const conviccions = [
    { num: "01", name: t("quisom.v2.conviccio.01.name"), text: t("quisom.v2.conviccio.01.text") },
    { num: "02", name: t("quisom.v2.conviccio.02.name"), text: t("quisom.v2.conviccio.02.text") },
    { num: "03", name: t("quisom.v2.conviccio.03.name"), text: t("quisom.v2.conviccio.03.text") },
    { num: "04", name: t("quisom.v2.conviccio.04.name"), text: t("quisom.v2.conviccio.04.text") },
    { num: "05", name: t("quisom.v2.conviccio.05.name"), text: t("quisom.v2.conviccio.05.text") },
>>>>>>> Stashed changes
  ];

  // 5 conviccions
  const conviccions: {
    numKey: TranslationKey;
    preKey: TranslationKey;
    emKey: TranslationKey;
    postKey: TranslationKey;
    fullSpan?: boolean;
  }[] = [
    {
      numKey: "v2.quisom.conviccions.1.num",
      preKey: "v2.quisom.conviccions.1.pre",
      emKey: "v2.quisom.conviccions.1.em",
      postKey: "v2.quisom.conviccions.1.post",
    },
    {
      numKey: "v2.quisom.conviccions.2.num",
      preKey: "v2.quisom.conviccions.2.pre",
      emKey: "v2.quisom.conviccions.2.em",
      postKey: "v2.quisom.conviccions.2.post",
    },
    {
      numKey: "v2.quisom.conviccions.3.num",
      preKey: "v2.quisom.conviccions.3.pre",
      emKey: "v2.quisom.conviccions.3.em",
      postKey: "v2.quisom.conviccions.3.post",
    },
    {
      numKey: "v2.quisom.conviccions.4.num",
      preKey: "v2.quisom.conviccions.4.pre",
      emKey: "v2.quisom.conviccions.4.em",
      postKey: "v2.quisom.conviccions.4.post",
    },
    {
      numKey: "v2.quisom.conviccions.5.num",
      preKey: "v2.quisom.conviccions.5.pre",
      emKey: "v2.quisom.conviccions.5.em",
      postKey: "v2.quisom.conviccions.5.post",
      fullSpan: true,
    },
  ];

  return (
<<<<<<< Updated upstream
    <div className="flex min-h-screen flex-col" style={{ background: "#F5EFE6", color: "#2C1810" }}>
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />
      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section
          className="px-6 py-20 sm:px-12 lg:px-16 lg:py-24"
          style={{ borderBottom: "1px solid #2C1810" }}
        >
          <div className="mx-auto max-w-7xl">
            <div
              className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
              style={{ color: "#8A5526", letterSpacing: "0.22em" }}
            >
              <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
              {t("v2.quisom.hero.eyebrow")}
            </div>
            <h1
              className="font-serif font-medium"
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.022em",
                color: "#2C1810",
                marginBottom: "16px",
                maxWidth: "1000px",
              }}
            >
              {t("v2.quisom.hero.title.pre")}
              <em className="italic font-normal" style={{ color: "#5C3A1E" }}>
                {t("v2.quisom.hero.title.em")}
              </em>
              {t("v2.quisom.hero.title.post")}
            </h1>
            <p
              className="font-serif italic"
              style={{
                fontSize: "clamp(1.0625rem, 1.6vw, 1.25rem)",
                lineHeight: 1.4,
                color: "#5C3A1E",
                maxWidth: "760px",
              }}
            >
              {t("v2.quisom.hero.subtitle")}
=======
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* === 1. HERO === */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                {t("quisom.v2.hero.eyebrow")}
              </p>
            </div>
            <h1 className="mb-6 max-w-5xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              {t("quisom.v2.hero.title.pre")}{" "}
              <em className="italic" style={{ color: "#5C3A1E" }}>{t("quisom.v2.hero.title.em")}</em>
              {t("quisom.v2.hero.title.post")}
            </h1>
            <p className="max-w-3xl font-serif text-xl italic" style={{ color: "#5C3A1E" }}>
              {t("quisom.v2.hero.subtitle")}
>>>>>>> Stashed changes
            </p>
          </div>
        </section>

<<<<<<< Updated upstream
        {/* ===== MANIFEST HERO (box with copper left border) ===== */}
        <section
          className="px-6 py-16 sm:px-12 lg:px-16 lg:py-20"
          style={{ borderBottom: "1px solid #2C1810" }}
        >
          <div className="mx-auto max-w-7xl">
            <div
              style={{
                borderLeft: "3px solid #B87333",
                padding: "24px 32px",
                background: "rgba(184, 115, 51, 0.06)",
              }}
            >
              <div
                className="mb-3 font-mono text-[11px] font-semibold uppercase"
                style={{ color: "#8A5526", letterSpacing: "0.22em" }}
              >
                {t("v2.quisom.manifest.eyebrow")}
              </div>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "1.375rem",
                  lineHeight: 1.45,
                  color: "#2C1810",
                  maxWidth: "1000px",
                }}
              >
=======
        {/* === 2. MANIFEST HERO === */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div
              className="border-l-4 p-6 lg:p-8"
              style={{ borderColor: "#B87333", background: "rgba(184,115,51,0.06)" }}
            >
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                {t("quisom.v2.manifest.eyebrow")}
              </p>
              <p className="max-w-4xl font-serif text-xl italic leading-relaxed text-primary sm:text-2xl">
>>>>>>> Stashed changes
                {t("quisom.manifest.page.body")}
              </p>
            </div>
          </div>
        </section>

<<<<<<< Updated upstream
        {/* ===== EQUIPO (3 cols, no real names) ===== */}
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
              {t("v2.quisom.equip.eyebrow")}
            </div>
            <h2
              className="mb-4 font-serif font-medium"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.625rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.018em",
                color: "#2C1810",
                maxWidth: "900px",
              }}
            >
              {t("v2.quisom.equip.title.pre")}
              <em className="italic font-normal" style={{ color: "#5C3A1E" }}>
                {t("v2.quisom.equip.title.em")}
              </em>
              {t("v2.quisom.equip.title.post")}
            </h2>
            <p
              className="mb-12 font-serif italic"
              style={{
                fontSize: "1.0625rem",
                color: "#5C3A1E",
                maxWidth: "720px",
                lineHeight: 1.5,
              }}
            >
              {t("v2.quisom.equip.intro")}
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4"
                  style={{
                    background: "white",
                    border: "1px solid #C9B89A",
                    padding: "32px",
                  }}
                >
                  <div
                    className="flex items-center justify-center font-serif font-medium"
                    style={{
                      width: "56px",
                      height: "56px",
                      background: member.isAI ? "#B87333" : "#2C1810",
                      color: "#F5EFE6",
                      fontSize: "1.375rem",
=======
        {/* === 3. EQUIP === */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                {t("quisom.v2.team.eyebrow")}
              </p>
            </div>
            <h2 className="mb-4 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quisom.v2.team.title.pre")}{" "}
              <em className="italic" style={{ color: "#5C3A1E" }}>{t("quisom.v2.team.title.em")}</em>
              {t("quisom.v2.team.title.post")}
            </h2>
            <p className="mb-12 max-w-3xl font-serif text-lg italic" style={{ color: "#5C3A1E" }}>
              {t("quisom.v2.team.intro")}
            </p>
            <div className="grid gap-8 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col gap-4 border p-8"
                  style={{ borderColor: "#C9B89A", background: "white" }}
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center font-serif text-2xl font-medium"
                    style={{
                      background: member.isAI ? "#B87333" : "#2C1810",
                      color: "#F5EFE6",
>>>>>>> Stashed changes
                    }}
                  >
                    {member.icon}
                  </div>
<<<<<<< Updated upstream
                  <div
                    className="font-mono text-[10px] font-semibold uppercase"
                    style={{
                      color: "#8A5526",
                      letterSpacing: "0.18em",
                      marginBottom: "4px",
                    }}
                  >
                    {t(member.roleKey)}
                  </div>
                  <div
                    className="font-serif font-medium"
                    style={{
                      fontSize: "1.5rem",
                      color: "#2C1810",
                      letterSpacing: "-0.012em",
                    }}
                  >
                    {t(member.nameKey)}
                  </div>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#5C3A1E",
                      lineHeight: 1.55,
                    }}
                  >
                    {t(member.bioKey)}
=======
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#8A5526" }}>
                    {member.role}
                  </p>
                  <h3 className="font-serif text-2xl font-medium text-primary" style={{ letterSpacing: "-0.012em" }}>
                    {member.name}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#5C3A1E" }}>
                    {member.bio}
                  </p>
                  <p
                    className="mt-auto border-t pt-3 font-mono text-[9px] uppercase tracking-[0.16em]"
                    style={{ borderColor: "#C9B89A", color: "#8B7355" }}
                  >
                    {member.tag}
>>>>>>> Stashed changes
                  </p>
                  <div
                    className="font-mono text-[9px] font-medium uppercase"
                    style={{
                      color: "#8B7355",
                      letterSpacing: "0.16em",
                      marginTop: "auto",
                      paddingTop: "12px",
                      borderTop: "1px solid #C9B89A",
                    }}
                  >
                    {t(member.tagKey)}
                  </div>
                </div>
              ))}
            </div>
<<<<<<< Updated upstream
          </div>
        </section>

        {/* ===== LO QUE CREEMOS (dark, 5 conviccions) ===== */}
        <section
          className="px-6 py-24 sm:px-12 lg:px-16 lg:py-24"
          style={{
            background: "#2C1810",
            color: "#F5EFE6",
            borderBottom: "1px solid #B87333",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <div
              className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
              style={{ color: "#D9A574", letterSpacing: "0.22em" }}
            >
              <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
              {t("v2.quisom.conviccions.eyebrow")}
            </div>
            <h2
              className="mb-8 font-serif font-medium"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.625rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.018em",
                color: "#F5EFE6",
                maxWidth: "900px",
              }}
            >
              {t("v2.quisom.conviccions.title.pre")}
              <em className="italic font-normal" style={{ color: "#D9A574" }}>
                {t("v2.quisom.conviccions.title.em")}
              </em>
              {t("v2.quisom.conviccions.title.post")}
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-16">
              {conviccions.map((c, i) => (
                <div
                  key={i}
                  className="py-5"
                  style={{
                    borderBottom: "1px solid rgba(217, 165, 116, 0.2)",
                    gridColumn: c.fullSpan ? "span 2" : undefined,
                  }}
                >
                  <div
                    className="mb-2 font-mono text-[10px] font-semibold uppercase"
                    style={{ color: "#D9A574", letterSpacing: "0.18em" }}
                  >
                    {t(c.numKey)}
                  </div>
                  <p
                    className="font-serif italic"
                    style={{
                      fontSize: "1.25rem",
                      lineHeight: 1.35,
                      color: "#F5EFE6",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {t(c.preKey)}
                    <em
                      className="not-italic font-medium"
                      style={{ color: "#D9A574" }}
                    >
                      {t(c.emKey)}
                    </em>
                    {t(c.postKey)}
                  </p>
                </div>
              ))}
=======
          </div>
        </section>

        {/* === 4. LO QUE CREEMOS (dark) === */}
        <section style={{ background: "#2C1810", color: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#D9A574" }}>
                {t("quisom.v2.conviccions.eyebrow")}
              </p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl" style={{ color: "#F5EFE6" }}>
              {t("quisom.v2.conviccions.title.pre")}{" "}
              <em className="italic" style={{ color: "#D9A574" }}>{t("quisom.v2.conviccions.title.em")}</em>
              {t("quisom.v2.conviccions.title.post")}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-16">
              {conviccions.map((c, i) => (
                <div
                  key={c.num}
                  className="border-b py-5"
                  style={{
                    borderBottomColor: "rgba(217,165,116,0.2)",
                    gridColumn: i === 4 ? "span 2" : "auto",
                  }}
                >
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#D9A574" }}>
                    {c.num} · {c.name}
                  </p>
                  <p className="font-serif text-xl italic leading-snug" style={{ color: "#F5EFE6", letterSpacing: "-0.005em" }}>
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === 5. CLOSING === */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                {t("quisom.v2.closing.eyebrow")}
              </p>
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
>>>>>>> Stashed changes
            </div>
            <p className="font-serif text-3xl leading-snug text-primary sm:text-4xl" style={{ letterSpacing: "-0.015em" }}>
              {t("quisom.v2.closing.text.pre")}{" "}
              <em className="italic font-medium" style={{ color: "#5C3A1E" }}>{t("quisom.v2.closing.text.em")}</em>
              {t("quisom.v2.closing.text.post")}
            </p>
            <button
              onClick={() => openAuth("register")}
              className="mt-8 px-9 py-4 text-sm font-semibold text-white"
              style={{ background: "#B87333" }}
            >
              {t("quisom.v2.closing.cta")}
            </button>
          </div>
        </section>

        {/* ===== CLOSING (cream, centered) ===== */}
        <section
          className="flex flex-col items-center gap-6 px-6 py-24 text-center sm:px-12 lg:py-28"
          style={{ borderBottom: "1px solid #2C1810" }}
        >
          <div
            className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
            style={{ color: "#8A5526", letterSpacing: "0.22em" }}
          >
            <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
            {t("v2.quisom.closing.eyebrow")}
            <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
          </div>
          <p
            className="font-serif font-normal"
            style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
              color: "#2C1810",
              maxWidth: "900px",
            }}
          >
            {t("v2.quisom.closing.text.pre")}
            <em className="italic font-medium" style={{ color: "#5C3A1E" }}>
              {t("v2.quisom.closing.text.em")}
            </em>
            {t("v2.quisom.closing.text.post")}
          </p>
          <button
            onClick={() => openAuth("register")}
            className="font-sans text-sm font-semibold"
            style={{
              background: "#B87333",
              color: "#FFFFFF",
              padding: "16px 36px",
              border: "none",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            {t("v2.quisom.closing.button")}
          </button>
        </section>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
