"use client";

import { useState } from "react";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";

export default function QuiSomPage() {
  const { t, lang } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  /* ── Manifest en 3 temps ── */
  const manifestParagrafs = [
    t("quisom.manifest.page.body"),
    t("quisom.paragraph1"),
    t("quisom.paragraph2"),
  ];

  /* ── Tres valors del manifest ── */
  const valors = [
    { num: "01", name: t("quisom.manifest.valor.01.name"), desc: t("quisom.manifest.valor.01.desc") },
    { num: "02", name: t("quisom.manifest.valor.02.name"), desc: t("quisom.manifest.valor.02.desc") },
    { num: "03", name: t("quisom.manifest.valor.03.name"), desc: t("quisom.manifest.valor.03.desc") },
  ];

  /* ── Criteris ètics detallats I-IV (la seva casa natural) ── */
  const criteris = [
    { rom: "I", name: t("quisom.valors.dignitat.title"), text: t("quisom.valors.dignitat.body") },
    { rom: "II", name: t("quisom.valors.etica.title"), text: t("quisom.valors.etica.body") },
    { rom: "III", name: t("quisom.valors.economia.title"), text: t("quisom.valors.economia.body") },
    { rom: "IV", name: t("quisom.valors.territori.title"), text: t("quisom.valors.territori.body") },
  ];

  /* ── Equip ── */
  const teamMembers = [
    {
      initial: "P",
      name: "Paolo",
      role: t("quisom.v2.team.01.role"),
      bio: t("quisom.team.paolo.bio"),
      tag: t("quisom.v2.team.01.tag"),
      isAI: false,
    },
    {
      initial: "R",
      name: "Roser",
      role: t("quisom.v2.team.02.role"),
      bio: t("quisom.team.techlead.bio"),
      tag: t("quisom.v2.team.02.tag"),
      isAI: false,
    },
    {
      initial: "✳",
      name: t("quisom.v2.team.03.name"),
      role: t("quisom.v2.team.03.role"),
      bio: t("quisom.team.zai.bio"),
      tag: t("quisom.v2.team.03.tag"),
      isAI: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">

        {/* ══════════ 1. HERO ══════════ */}
        <section className="border-b border-rule" style={{ background: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <p className="eyebrow">{t("quisom.v2.hero.eyebrow")}</p>
            <h1 className="max-w-5xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              {t("quisom.v2.hero.title.pre")}
              <em className="hl">{t("quisom.v2.hero.title.em")}</em>
              {t("quisom.v2.hero.title.post")}
            </h1>
            <p className="sec-body mt-6 max-w-3xl !text-lg">{t("quisom.v2.hero.subtitle")}</p>
          </div>
        </section>

        {/* ══════════ 2. MANIFEST ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-start max-lg:gap-12">
            <div>
              <p className="eyebrow">{t("quisom.manifest.page.eyebrow")}</p>
              <div>
                {manifestParagrafs.map((p, i) => (
                  <p key={i}
                    className="mb-[26px] font-serif !text-[clamp(1.15rem,1.7vw,1.4rem)] leading-[1.55]"
                    style={{ color: i === 0 ? "var(--ink-deep)" : "var(--ink)" }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <ul className="grid gap-10 sm:grid-cols-3 lg:mt-[72px] max-sm:gap-8">
              {valors.map((v) => (
                <li key={v.num} className="border-t-2 pt-5" style={{ borderColor: "var(--accent)" }}>
                  <span className="mb-2.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                    {v.num}
                  </span>
                  <h3 className="mb-2.5 font-serif text-[1.25rem] font-semibold" style={{ color: "var(--ink-deep)" }}>
                    {v.name}
                  </h3>
                  <p className="text-[.94rem] leading-[1.6]" style={{ color: "var(--ink-soft)" }}>
                    {v.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══════════ 3. COM TREBALLEM + NO SOM NEUTRES (dark) ══════════ */}
        <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

            {/* Com treballem */}
            <p className="eyebrow" style={{ color: "var(--verd-clar)" }}>{t("quisom.ai.title")}</p>
            <h2 className="sec-title" style={{ color: "var(--bg)" }}>{t("quisom.ai.h2")}</h2>
            <p className="sec-body max-w-[70ch] leading-[1.7]" style={{ color: "rgba(242,245,241,.78)" }}>
              {t("quisom.ai.body")}{" "}
              <strong className="font-medium" style={{ color: "var(--bg)" }}>
                {t("quisom.ai.supervision.body")}
              </strong>
            </p>

            {/* No som neutres — criteris ètics detallats */}
            <div className="mt-24">
              <p className="eyebrow" style={{ color: "var(--verd-clar)" }}>{t("quisom.valors.title")}</p>
              <h2 className="sec-title" style={{ color: "var(--bg)" }}>{t("quisom.valors.head")}</h2>
              <p className="sec-body max-w-[70ch]" style={{ color: "rgba(242,245,241,.78)" }}>{t("quisom.valors.intro")}</p>

              <ol className="mt-14 flex flex-col">
                {criteris.map((c, i) => (
                  <li key={c.rom}
                    className="grid grid-cols-[52px_minmax(0,.55fr)_minmax(0,1fr)] items-start gap-5 py-6"
                    style={{ borderTop: i === 0 ? "none" : "1px solid rgba(242,245,241,.14)" }}>
                    <span className="font-serif text-[1.7rem] font-medium leading-[1.2]" style={{ color: "var(--verd-clar)" }}>
                      {c.rom}
                    </span>
                    <h3 className="font-serif text-[1.12rem] font-semibold" style={{ color: "var(--bg)" }}>
                      {c.name}
                    </h3>
                    <p className="text-[.92rem] leading-[1.62]" style={{ color: "rgba(242,245,241,.72)" }}>
                      {c.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════ 4. L'EQUIP ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24" style={{ background: "#FFFFFF" }}>
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">{t("quisom.v2.team.eyebrow")}</p>
            <h2 className="sec-title">
              {t("quisom.v2.team.title.pre")}
              <em className="italic" style={{ color: "var(--accent)" }}>{t("quisom.v2.team.title.em")}</em>
              {t("quisom.v2.team.title.post")}
            </h2>
            <p className="sec-body">{t("quisom.v2.team.intro")}</p>

            <div className="mt-14 grid gap-[18px] lg:grid-cols-3">
              {teamMembers.map((m) => (
                <article key={m.name} className="card-v1 flex flex-col p-[30px]">
                  <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
                    {m.role}
                  </p>
                  <div className="mb-[18px] flex h-16 w-16 items-center justify-center rounded-full font-serif text-[1.5rem]"
                    style={m.isAI ? { background: "var(--accent)", color: "#fff" } : { background: "var(--ink)", color: "var(--verd-clar)" }}>
                    {m.initial}
                  </div>
                  <h3 className="mb-1 font-serif text-[1.35rem] font-semibold" style={{ color: "var(--ink-deep)" }}>
                    {m.name}
                  </h3>
                  <p className="mb-4 font-mono text-[11px] tracking-[0.04em]" style={{ color: "var(--ink-soft)" }}>
                    {m.tag}
                  </p>
                  <p className="text-[.9rem] leading-[1.65]" style={{ color: "var(--ink-soft)" }}>
                    {m.bio}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 5. PREGUNTES PER MILLORAR (Premium) ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="eyebrow">
                {t("quisom.preguntes.label")}
                <span className="ml-2 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ background: "var(--ink)", color: "var(--bg)" }}>
                  Premium
                </span>
              </p>
              <h2 className="sec-title">{t("quisom.preguntes.h2")}</h2>
              <p className="sec-body">{t("quisom.preguntes.body")}</p>
            </div>
            <div className="card-v1 p-9" style={{ borderLeft: "4px solid var(--highlight)" }}>
              <p className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
                {t("quisom.preguntes.example.title")}
              </p>
              <p className="font-serif !text-[1.3rem] italic leading-[1.45]" style={{ color: "var(--ink-deep)" }}>
                {t("quisom.preguntes.example.body")}
              </p>
              <p className="mt-[18px] font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
                {t("quisom.preguntes.cta")}
              </p>
            </div>
          </div>
        </section>

        {/* ══════════ 6. COMPROMÍS ══════════ */}
        <section className="principle">
          <div className="mx-auto max-w-4xl px-6">
            <blockquote>
              {t("quisom.v2.closing.text.pre")}
              <em className="italic font-medium" style={{ color: "var(--highlight)" }}>{t("quisom.v2.closing.text.em")}</em>
              {t("quisom.v2.closing.text.post")}
            </blockquote>
          </div>
        </section>

        {/* ══════════ 7. VOLS FORMAR-NE PART? ══════════ */}
        <section className="border-t border-rule px-6 py-20 lg:px-8 lg:py-24" style={{ background: "var(--bg)" }}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="sec-title !mb-5">
              {(() => {
                const title = t("quisom.team.join.title");
                const hl = lang === "ca" ? "part?" : "parte?";
                return title.endsWith(hl) ? (
                  <>
                    {title.slice(0, title.length - hl.length)}
                    <em className="hl">{hl}</em>
                  </>
                ) : (
                  title
                );
              })()}
            </h2>
            <p className="sec-body mx-auto !max-w-[48ch]">{t("quisom.team.join.body")}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:info@criteriesg.com" className="btn-v1 btn-v1-solid">
                info@criteriesg.com
              </a>
              <button onClick={() => openAuth("register")} className="btn-v1 btn-v1-ghost">
                {t("quisom.v2.closing.cta")}
              </button>
            </div>
          </div>
        </section>

      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
