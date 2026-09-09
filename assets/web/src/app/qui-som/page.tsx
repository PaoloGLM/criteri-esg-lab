"use client";

import { useState } from "react";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { FreeBlocks } from "@/components/cms/blocks-view";
import { CmsTexts, EditableText } from "@/components/cms/editable-texts";
import { useGroupOrder, sortItems } from "@/components/cms/text-order";



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

  /* ── Ordres editables (reordre amb drag des de /admin/visual) ── */
  const ordreValors = useGroupOrder("quisom.valors");
  const ordreCriteris = useGroupOrder("quisom.criteris");

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
        <CmsTexts page="qui-som">

        {/* ══════════ 1. HERO ══════════ */}
        <section className="border-b border-rule" style={{ background: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <EditableText id="hero.eyebrow" as="p" className="eyebrow">{t("quisom.v2.hero.eyebrow")}</EditableText>
            <EditableText id="hero.title" as="h1" styleEl="h1" className="max-w-5xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              {t("quisom.v2.hero.title.pre")}
              <em className="hl">{t("quisom.v2.hero.title.em")}</em>
              {t("quisom.v2.hero.title.post")}
            </EditableText>
            <EditableText id="hero.subtitle" as="p" className="sec-body mt-6 max-w-3xl !text-lg">{t("quisom.v2.hero.subtitle")}</EditableText>
          </div>
        </section>

        {/* ══════════ 2. MANIFEST ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-start max-lg:gap-12">
            <div>
              <EditableText id="manifest.eyebrow" as="p" className="eyebrow">{t("quisom.manifest.page.eyebrow")}</EditableText>
              <div>
                {manifestParagrafs.map((p, i) => (
                  <EditableText key={i} id={`manifest.p${i + 1}`} as="p"
                    className="mb-[26px] font-serif !text-[clamp(1.15rem,1.7vw,1.4rem)] leading-[1.55]"
                    style={{ color: i === 0 ? "var(--ink-deep)" : "var(--ink)" }}>
                    {p}
                  </EditableText>
                ))}
              </div>
            </div>

            <div className="lg:mt-[72px]">
              <ul className="grid gap-10 sm:grid-cols-3 max-sm:gap-8" data-corder="quisom.valors">
                {sortItems(valors, ordreValors, (v) => v.num).map((v) => (
                  <li key={v.num} data-citem={v.num} className="border-t-2 pt-5" style={{ borderColor: "var(--accent)" }}>
                    <EditableText id={`valor.${v.num}.num`} as="span" className="mb-2.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                      {v.num}
                    </EditableText>
                    <EditableText id={`valor.${v.num}.name`} as="h3" styleEl="h2" className="mb-2.5 font-serif text-[1.25rem] font-semibold" style={{ color: "var(--ink-deep)" }}>
                      {v.name}
                    </EditableText>
                    <EditableText id={`valor.${v.num}.desc`} as="p" styleEl="body" className="text-[.94rem] leading-[1.6]" style={{ color: "var(--ink-soft)" }}>
                      {v.desc}
                    </EditableText>
                  </li>
                ))}
              </ul>

              {/* Il·lustració editorial del Manifest — variant C (terrasses) */}
              <figure className="mt-12">
                <img
                  src="/illustrations/manifest-c-terrasses.svg"
                  alt="Il·lustració editorial: terrasses que s'escalen cap al sol amb una llavor plantada — el criteri es construeix per estrats, amb el bé comú com a referent"
                  width={900}
                  height={675}
                  loading="lazy"
                  className="w-full max-w-[440px] border border-rule"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* ══════════ 3. COM TREBALLEM + NO SOM NEUTRES (dark) ══════════ */}
        <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

            {/* Com treballem */}
            <EditableText id="ai.eyebrow" as="p" className="eyebrow" style={{ color: "var(--verd-clar)" }}>{t("quisom.ai.title")}</EditableText>
            <EditableText id="ai.title" as="h2" className="sec-title" style={{ color: "var(--bg)" }}>{t("quisom.ai.h2")}</EditableText>
            <EditableText id="ai.body" as="p" className="sec-body max-w-[70ch] leading-[1.7]" style={{ color: "rgba(242,245,241,.78)" }}>
              {t("quisom.ai.body")}{" "}
              <strong className="font-medium" style={{ color: "var(--bg)" }}>
                {t("quisom.ai.supervision.body")}
              </strong>
            </EditableText>

            {/* No som neutres — criteris ètics detallats */}
            <div className="mt-24">
              <EditableText id="valors.eyebrow" as="p" className="eyebrow" style={{ color: "var(--verd-clar)" }}>{t("quisom.valors.title")}</EditableText>
              <EditableText id="valors.head" as="h2" className="sec-title" style={{ color: "var(--bg)" }}>{t("quisom.valors.head")}</EditableText>
              <EditableText id="valors.intro" as="p" className="sec-body max-w-[70ch]" style={{ color: "rgba(242,245,241,.78)" }}>
                {t("quisom.valors.intro").replace(/^(No som neutres\.|No somos neutrales\.)\s*/i, "")}
              </EditableText>

              <ol className="mt-14 flex flex-col" data-corder="quisom.criteris">
                {sortItems(criteris, ordreCriteris, (c) => c.rom).map((c, i) => (
                  <li key={c.rom} data-citem={c.rom}
                    className="grid grid-cols-[52px_minmax(0,.55fr)_minmax(0,1fr)] items-start gap-5 py-6"
                    style={{ borderTop: i === 0 ? "none" : "1px solid rgba(242,245,241,.14)" }}>
                    <EditableText id={`criteri.${c.rom}.rom`} as="span" className="font-serif text-[1.7rem] font-medium leading-[1.2]" style={{ color: "var(--verd-clar)" }}>
                      {c.rom}
                    </EditableText>
                    <EditableText id={`criteri.${c.rom}.name`} as="h3" styleEl="h2" className="font-serif text-[1.12rem] font-semibold" style={{ color: "var(--bg)" }}>
                      {c.name}
                    </EditableText>
                    <EditableText id={`criteri.${c.rom}.text`} as="p" styleEl="body" className="text-[.92rem] leading-[1.62]" style={{ color: "rgba(242,245,241,.72)" }}>
                      {c.text}
                    </EditableText>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════ 4. L'EQUIP (tinted, com el mockup v1) ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24" style={{ background: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl">
            <EditableText id="team.eyebrow" as="p" className="eyebrow">{t("quisom.v2.team.eyebrow")}</EditableText>
            <EditableText id="team.title" as="h2" className="sec-title">
              {t("quisom.v2.team.title.pre")}
              <em className="italic" style={{ color: "var(--accent)" }}>{t("quisom.v2.team.title.em")}</em>
              {t("quisom.v2.team.title.post")}
            </EditableText>
            <EditableText id="team.intro" as="p" className="sec-body">{t("quisom.v2.team.intro")}</EditableText>

            <div className="mt-14 grid gap-[18px] lg:grid-cols-3">
              {teamMembers.map((m, i) => (
                <article key={m.name} className="card-v1 flex flex-col p-[30px]">
                  <EditableText id={`team.${i + 1}.role`} as="p" styleEl="eyebrow" className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
                    {m.role}
                  </EditableText>
                  <div className="mb-[18px] flex h-16 w-16 items-center justify-center rounded-full font-serif text-[1.5rem]"
                    style={m.isAI ? { background: "var(--accent)", color: "#fff" } : { background: "var(--ink)", color: "var(--verd-clar)" }}>
                    {m.initial}
                  </div>
                  <EditableText id={`team.${i + 1}.name`} as="h3" styleEl="h2" className="mb-1 font-serif text-[1.35rem] font-semibold" style={{ color: "var(--ink-deep)" }}>
                    {m.name}
                  </EditableText>
                  <EditableText id={`team.${i + 1}.tag`} as="p" className="mb-4 font-mono text-[11px] tracking-[0.04em]" style={{ color: "var(--ink-soft)" }}>
                    {m.tag}
                  </EditableText>
                  <EditableText id={`team.${i + 1}.bio`} as="p" styleEl="body" className="text-[.9rem] leading-[1.65]" style={{ color: "var(--ink-soft)" }}>
                    {m.bio}
                  </EditableText>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 5. PREGUNTES PER MILLORAR (Premium) ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-start">
            <div>
              <EditableText id="preguntes.eyebrow" as="p" className="eyebrow">
                {t("quisom.preguntes.label")}
                <span className="ml-2 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ background: "var(--ink)", color: "var(--bg)" }}>
                  Premium
                </span>
              </EditableText>
              <EditableText id="preguntes.title" as="h2" className="sec-title">{t("quisom.preguntes.h2")}</EditableText>
              <EditableText id="preguntes.body" as="p" className="sec-body">{t("quisom.preguntes.body")}</EditableText>
            </div>
            <div className="card-v1 p-9" style={{ borderLeft: "4px solid var(--highlight)" }}>
              <EditableText id="preguntes.example.title" as="p" styleEl="eyebrow" className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
                {t("quisom.preguntes.example.title")}
              </EditableText>
              <EditableText id="preguntes.example.body" as="p" styleEl="quote" className="font-serif !text-[1.3rem] italic leading-[1.45]" style={{ color: "var(--ink-deep)" }}>
                {t("quisom.preguntes.example.body")}
              </EditableText>
              <EditableText id="preguntes.example.cta" as="p" className="mt-[18px] font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
                {t("quisom.preguntes.cta")}
              </EditableText>
            </div>
          </div>
        </section>

        {/* ══════════ 6. COMPROMÍS ══════════ */}
        <section className="principle">
          <div className="mx-auto max-w-4xl px-6">
            <EditableText id="closing.quote" as="blockquote" styleEl="quote">
              {t("quisom.v2.closing.text.pre")}
              <em className="italic font-medium" style={{ color: "var(--highlight)" }}>{t("quisom.v2.closing.text.em")}</em>
              {t("quisom.v2.closing.text.post")}
            </EditableText>
          </div>
        </section>

        {/* ══════════ 7. VOLS FORMAR-NE PART? ══════════ */}
        <section className="border-t border-rule px-6 py-20 lg:px-8 lg:py-24" style={{ background: "var(--bg)" }}>
          <div className="mx-auto max-w-3xl text-center">
            <EditableText id="join.title" as="h2" className="sec-title !mb-5">
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
            </EditableText>
            <EditableText id="join.body" as="p" className="sec-body mx-auto !max-w-[48ch]">{t("quisom.team.join.body")}</EditableText>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <EditableText id="join.cta.mail" as="a" href="mailto:info@criteriesg.com" className="btn-v1 btn-v1-solid" styleEl="button">
                info@criteriesg.com
              </EditableText>
              <EditableText id="join.cta.register" as="button" onClick={() => openAuth("register")} className="btn-v1 btn-v1-ghost" styleEl="button">
                {t("quisom.v2.closing.cta")}
              </EditableText>
            </div>
          </div>
        </section>

        {/* CMS fase 3: blocs lliures editables des de /admin */}
        </CmsTexts>
        <FreeBlocks slug="qui-som" />

      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
