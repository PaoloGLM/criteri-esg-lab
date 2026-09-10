"use client";

import { useState } from "react";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { FreeBlocks } from "@/components/cms/blocks-view";
import { CmsTexts, EditableItem, EditableText } from "@/components/cms/editable-texts";
import { useGroupOrder, sortItems } from "@/components/cms/text-order";



export default function QueFemPage() {
  const { t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  /* ── Semàfor: exemple real, nota B (4 verds + 1 groc) ── */
  const semaforoDims = [
    { name: t("quefem.semaforo.scope3"), val: t("quefem.semaforo.val.indirecte"), cls: "val-a" },
    { name: t("quefem.semaforo.plazos"), val: t("quefem.semaforo.val.quantificat"), cls: "val-v" },
    { name: t("quefem.semaforo.fuentes"), val: t("quefem.semaforo.val.quantificat"), cls: "val-v" },
    { name: t("quefem.semaforo.granularidad"), val: t("quefem.semaforo.val.quantificat"), cls: "val-v" },
    { name: t("quefem.semaforo.verificacion"), val: t("quefem.semaforo.val.quantificat"), cls: "val-v" },
  ];

  /* ── Format: 8 blocs, sempre iguals (disseny unificat amb la landing) ── */
  const blocs = [
    { num: "00", name: t("quefem.bloc.00.name"), desc: t("quefem.bloc.00.desc"), meta: t("quefem.bloc.00.meta") },
    { num: "01", name: t("quefem.bloc.01.name"), desc: t("quefem.bloc.01.desc"), meta: t("quefem.bloc.01.meta") },
    { num: "02", name: t("quefem.bloc.02.name"), desc: t("quefem.bloc.02.desc"), meta: t("quefem.bloc.02.meta") },
    { num: "03", name: t("quefem.bloc.03.name"), desc: t("quefem.bloc.03.desc"), meta: t("quefem.bloc.03.meta") },
    { num: "04", name: t("quefem.bloc.04.name"), desc: t("quefem.bloc.04.desc"), meta: t("quefem.bloc.04.meta") },
    { num: "05", name: t("quefem.bloc.05.name"), desc: t("quefem.bloc.05.desc"), meta: t("quefem.bloc.05.meta") },
    { num: "06", name: t("quefem.bloc.06.name"), desc: t("quefem.bloc.06.desc"), meta: t("quefem.bloc.06.meta") },
    { num: "07", name: t("quefem.bloc.07.name"), desc: t("quefem.bloc.07.desc"), meta: t("quefem.bloc.07.meta") },
  ];

  /* ── Referència curta de criteris i valors — resum d'una frase; el desplegable viu a /qui-som ── */
  const criteris = [
    { rom: "I", name: t("quisom.valors.dignitat.title"), text: t("quefem.criteris.sum.dignitat") },
    { rom: "II", name: t("quisom.valors.etica.title"), text: t("quefem.criteris.sum.etica") },
    { rom: "III", name: t("quisom.valors.economia.title"), text: t("quefem.criteris.sum.economia") },
    { rom: "IV", name: t("quisom.valors.territori.title"), text: t("quefem.criteris.sum.territori") },
  ];

  /* ── Ordres editables (reordre amb drag des de /admin/visual) ── */
  const ordreBlocs = useGroupOrder("quefem.blocs");
  const ordreCriteris = useGroupOrder("quefem.criteris");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        <CmsTexts page="que-fem">

        {/* ══════════ 1. HERO ══════════ */}
        <section className="border-b border-rule" style={{ background: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8 lg:pb-20 lg:pt-28">
            <EditableText id="hero.eyebrow" as="p" className="eyebrow">{t("quefem.hero.eyebrow")}</EditableText>
            <EditableText id="hero.title" as="h1" styleEl="h1" className="max-w-4xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              {t("quefem.hero.title.pre")}
              <em className="hl">{t("quefem.hero.title.em")}</em>
              {t("quefem.hero.title.post")}
            </EditableText>
            <EditableText id="hero.subtitle" as="p" className="sec-body mt-6 max-w-2xl !text-lg">{t("quefem.hero.subtitle")}</EditableText>
          </div>

          {/* Franja de dades */}
          <div className="statband">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="statband-inner">
                <div className="stat">
                  <EditableText id="stats.1.n" as="div" styleEl="h2" className="n">180<small>+</small></EditableText>
                  <EditableText id="stats.1.t" as="div" styleEl="eyebrow" className="t">{t("quefem.hero.meta.fuentes")}</EditableText>
                </div>
                <div className="stat">
                  <EditableText id="stats.2.n" as="div" styleEl="h2" className="n">16</EditableText>
                  <EditableText id="stats.2.t" as="div" styleEl="eyebrow" className="t">{t("quefem.hero.meta.estandares")}</EditableText>
                </div>
                <div className="stat">
                  <EditableText id="stats.3.n" as="div" styleEl="h2" className="n">5<small>&nbsp;min</small></EditableText>
                  <EditableText id="stats.3.t" as="div" styleEl="eyebrow" className="t">{t("quefem.hero.meta.minutos")}</EditableText>
                </div>
                <div className="stat">
                  <EditableText id="stats.4.n" as="div" styleEl="h2" className="n">8</EditableText>
                  <EditableText id="stats.4.t" as="div" styleEl="eyebrow" className="t">{t("quefem.hero.meta.blocs")}</EditableText>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 2. EL PROCÉS: 5 PASSOS ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <EditableText id="proc5.eyebrow" as="p" className="eyebrow">{t("quefem.proc5.eyebrow")}</EditableText>
            <EditableText id="proc5.title" as="h2" className="sec-title max-w-3xl">{t("quefem.proc5.title")}</EditableText>
            <EditableText id="proc5.sub" as="p" className="sec-body max-w-2xl">{t("quefem.proc5.sub")}</EditableText>
            <ol className="mt-12 border-l-2" style={{ borderColor: "var(--accent)" }}>
              {([
                { n: "01", t: t("quefem.proc5.01.t"), d: t("quefem.proc5.01.d") },
                { n: "02", t: t("quefem.proc5.02.t"), d: t("quefem.proc5.02.d") },
                { n: "03", t: t("quefem.proc5.03.t"), d: t("quefem.proc5.03.d") },
                { n: "04", t: t("quefem.proc5.04.t"), d: t("quefem.proc5.04.d") },
                { n: "05", t: t("quefem.proc5.05.t"), d: t("quefem.proc5.05.d") },
              ]).map((p, pi) => (
                <li key={p.n} className="grid grid-cols-[70px_minmax(0,.42fr)_minmax(0,1fr)] items-start gap-6 py-[26px] pl-6 max-md:grid-cols-[56px_1fr]">
                  <EditableText id={`proc5.${pi + 1}.n`} as="span" styleEl="h2" className="font-serif text-[2.4rem] font-medium leading-[.9]" style={{ color: "var(--verd-clar)" }}>
                    {p.n}
                  </EditableText>
                  <EditableText id={`proc5.${pi + 1}.t`} as="h3" styleEl="h2" className="font-serif text-[1.25rem] font-semibold text-primary">
                    {p.t}
                  </EditableText>
                  {/* Mòbil: el grid només té 2 columnes — la descripció baixa a fila pròpia ocupant tota l'amplada (fix paràgrafs a 56px). */}
                  <EditableText id={`proc5.${pi + 1}.d`} as="p" styleEl="body" className="text-[.93rem] leading-[1.62] max-md:col-start-1 max-md:col-span-2" style={{ color: "var(--ink-soft)" }}>
                    {p.d}
                  </EditableText>
                </li>
              ))}
            </ol>
            <EditableText id="proc5.note" as="p" className="mt-8 pl-6 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: "var(--ink-soft)" }}>
              {t("quefem.proc5.note")}
            </EditableText>
          </div>
        </section>

        {/* ══════════ 3. EL SEMÀFOR METODOLÒGIC (dark) ══════════ */}
        <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-center">
              <div>
                <EditableText id="semafor.eyebrow" as="p" className="eyebrow" style={{ color: "var(--verd-clar)" }}>{t("quefem.semaforo.eyebrow")}</EditableText>
                <EditableText id="semafor.title" as="h2" className="sec-title" style={{ color: "var(--bg)" }}>
                  {t("quefem.semaforo.title.pre")}
                  <em className="italic" style={{ color: "var(--verd-clar)" }}>{t("quefem.semaforo.title.em")}</em>
                  {t("quefem.semaforo.title.post")}
                </EditableText>
                <EditableText id="semafor.desc" as="p" className="sec-body" style={{ color: "rgba(242,245,241,.78)" }}>{t("quefem.semaforo.desc")}</EditableText>
                <p className="semafor-note">
                  {t("quefem.semaforo.regla.pre")}<em>{t("quefem.semaforo.regla.em")}</em>
                </p>
              </div>
              <div className="semafor" role="img" aria-label={`Exemple de semàfor: nota B · ${t("quefem.semaforo.grade.label")}`}>
                <div className="grade-row">
                  <EditableText id="semafor.grade" as="div" styleEl="h1" className="grade">B</EditableText>
                  <div className="grade-meta">
                    <div className="dots">
                      <span className="dot g on" /><span className="dot g on" /><span className="dot g on" />
                      <span className="dot g on" /><span className="dot y on" />
                    </div>
                    <EditableText id="semafor.grade.label" as="div" styleEl="eyebrow" className="grade-label">{t("quefem.semaforo.grade.label")}</EditableText>
                  </div>
                </div>
                {semaforoDims.map((dim, di) => (
                  <div key={dim.name} className="ind">
                    <EditableText id={`semafor.dim.${di + 1}.name`} as="span" className="name">{dim.name}</EditableText>
                    <EditableText id={`semafor.dim.${di + 1}.val`} as="span" className={`val ${dim.cls}`}>{dim.val}</EditableText>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 4. EL FORMAT: 8 BLOCS ══════════ */}
        <section id="format" className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
              <div>
                <EditableText id="format.eyebrow" as="p" className="eyebrow">{t("quefem.estructura.eyebrow")}</EditableText>
                <EditableText id="format.title" as="h2" className="sec-title">
                  {t("quefem.format.title")}
                </EditableText>
                <EditableText id="format.body" as="p" className="sec-body">{t("quefem.format.body")}</EditableText>
              </div>
              <div className="max-md:whitespace-normal max-md:px-3 max-md:text-center whitespace-nowrap rounded-md border border-dashed px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em]"
                style={{ borderColor: "rgba(94,135,114,.45)", color: "var(--ink-soft)" }}>
                <EditableText id="format.limit" as="b" className="font-semibold" style={{ color: "var(--ink)" }}>{t("quefem.format.limit")}</EditableText>
              </div>
            </div>

            <div className="blocgrid" data-corder="quefem.blocs">
              {sortItems(blocs, ordreBlocs, (b) => b.num).map((bloc) => {
                // #6 (disseny unificat amb la landing): blocs diferenciadors (00, 06, 07) en verd fosc; resta requadre salvia.
                const star = bloc.num === "00" || bloc.num === "06" || bloc.num === "07";
                const salvia = !star;
                return (
                <EditableItem key={bloc.num} as="article" id={`quefem.blocs.${bloc.num}`} dataCitem={bloc.num} className="bloc"
                  style={star
                    ? { background: "var(--ink)", borderColor: "var(--ink)" }
                    : salvia
                      ? { background: "#AAC9B6", borderColor: "#26312B" }
                      : undefined}>
                  <EditableText id={`bloc.${bloc.num}.num`} as="div" className="num" style={star ? { color: "var(--highlight)" } : { color: "#26312B" }}>{bloc.num}</EditableText>
                  <EditableText id={`bloc.${bloc.num}.name`} as="h3" styleEl="h2" style={star ? { color: "var(--bg)" } : { color: "#26312B" }}>{bloc.name}</EditableText>
                  <EditableText id={`bloc.${bloc.num}.desc`} as="p" styleEl="body" style={star ? { color: "rgba(242,245,241,.75)" } : { color: "rgba(38,49,43,.82)" }}>{bloc.desc}</EditableText>
                  <EditableText id={`bloc.${bloc.num}.meta`} as="p" className="!mt-3 font-mono text-[10px] uppercase tracking-[0.14em]" style={star ? { color: "rgba(242,245,241,.55)" } : { color: "rgba(38,49,43,.6)" }}>
                    {bloc.meta}
                  </EditableText>
                </EditableItem>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════ 5. CRITERIS I VALORS (dark, referència curta) ══════════ */}
        <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <EditableText id="criteris.eyebrow" as="p" className="eyebrow" style={{ color: "var(--verd-clar)" }}>{t("quefem.criteris.eyebrow")}</EditableText>
            <EditableText id="criteris.head" as="h2" className="sec-title" style={{ color: "var(--bg)" }}>{t("quefem.criteris.head")}</EditableText>
            <EditableText id="criteris.body" as="p" className="sec-body max-w-[64ch]" style={{ color: "rgba(242,245,241,.78)" }}>{t("quefem.criteris.body")}</EditableText>

              {/* Criteris i valors — mateixa llista (grid de 4 cards) i mateix contingut que /qui-som */}
              <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-corder="quefem.criteris">
                {sortItems(criteris, ordreCriteris, (c) => c.rom).map((c) => (
                  <EditableItem key={c.rom} as="article" id={`quefem.criteris.${c.rom}`} dataCitem={c.rom}
                    className="grid grid-cols-[52px_minmax(0,.55fr)_minmax(0,1fr)] items-start gap-5 py-6 lg:grid-cols-none lg:block"
                    style={{ borderTop: "1px solid rgba(242,245,241,.14)" }}>
                    <EditableText id={`criteris.card.${c.rom}.rom`} as="span" className="font-serif text-[1.7rem] font-medium leading-[1.2]" style={{ color: "var(--verd-clar)" }}>
                      {c.rom}
                    </EditableText>
                    <EditableText id={`criteris.card.${c.rom}.name`} as="h3" styleEl="h2" className="font-serif text-[1.12rem] font-semibold" style={{ color: "var(--bg)" }}>
                      {c.name}
                    </EditableText>
                    <EditableText id={`criteris.card.${c.rom}.text`} as="p" styleEl="body" className="text-[.92rem] leading-[1.62]" style={{ color: "rgba(242,245,241,.72)" }}>
                      {c.text}
                    </EditableText>
                  </EditableItem>
                ))}
              </div>

            <EditableText id="criteris.link" as="a" href="/qui-som" styleEl="button" className="mt-10 inline-block font-mono text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors hover:opacity-80"
              style={{ color: "var(--verd-clar)" }}>
              {t("quefem.criteris.link")}
            </EditableText>
          </div>
        </section>

        {/* ══════════ 6. PREGUNTES PER MILLORAR (Premium — referència curta; la versió completa viu a /qui-som) ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-10">
            <div className="max-w-2xl">
              <EditableText id="preguntes.eyebrow" as="p" className="eyebrow">{t("quefem.preguntes.eyebrow")}</EditableText>
              <EditableText id="preguntes.title" as="h2" className="sec-title">{t("quefem.preguntes.title")}</EditableText>
              <EditableText id="preguntes.intro" as="p" className="sec-body">{t("quefem.preguntes.intro")}</EditableText>
            </div>
            <div className="shrink-0 pb-1">
              <EditableText id="preguntes.cta" as="button" onClick={() => setPreusOpen(true)} styleEl="button" className="btn-v1 btn-v1-solid">
                {t("quefem.preguntes.cta")}
              </EditableText>
            </div>
          </div>
        </section>

        {/* ══════════ 7. COMPROMÍS ══════════ */}
        <section className="principle">
          <div className="mx-auto max-w-4xl px-6">
            <EditableText id="manifest.eyebrow" as="p" className="eyebrow justify-center" style={{ color: "var(--verd-clar)" }}>{t("quefem.manifest.eyebrow")}</EditableText>
            <EditableText id="manifest.quote" as="blockquote">
              {t("quefem.manifest.text.pre")}
              <em className="italic font-medium" style={{ color: "var(--highlight)" }}>{t("quefem.manifest.text.em")}</em>
              {t("quefem.manifest.text.post")}
            </EditableText>
            <EditableText id="manifest.attribution" as="p" className="after">— {t("quefem.manifest.attribution")}</EditableText>
          </div>
        </section>

        {/* CMS fase 3: blocs lliures editables des de /admin */}
        </CmsTexts>
        <FreeBlocks slug="que-fem" />

      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
