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

  /* ── Semàfor: exemple real, nota B (4 verds + 1 groc) ── */
  const semaforoDims = [
    { name: t("quefem.semaforo.scope3"), val: t("quefem.semaforo.val.indirecte"), cls: "val-a" },
    { name: t("quefem.semaforo.plazos"), val: t("quefem.semaforo.val.quantificat"), cls: "val-v" },
    { name: t("quefem.semaforo.fuentes"), val: t("quefem.semaforo.val.quantificat"), cls: "val-v" },
    { name: t("quefem.semaforo.granularidad"), val: t("quefem.semaforo.val.quantificat"), cls: "val-v" },
    { name: t("quefem.semaforo.verificacion"), val: t("quefem.semaforo.val.quantificat"), cls: "val-v" },
  ];

  /* ── Format: 8 blocs, sempre iguals ── */
  const blocs = [
    { num: "00", name: t("quefem.bloc.00.name"), desc: t("quefem.bloc.00.desc"), meta: t("quefem.bloc.00.meta"), dark: false },
    { num: "01", name: t("quefem.bloc.01.name"), desc: t("quefem.bloc.01.desc"), meta: t("quefem.bloc.01.meta"), dark: false },
    { num: "02", name: t("quefem.bloc.02.name"), desc: t("quefem.bloc.02.desc"), meta: t("quefem.bloc.02.meta"), dark: false },
    { num: "03", name: t("quefem.bloc.03.name"), desc: t("quefem.bloc.03.desc"), meta: t("quefem.bloc.03.meta"), dark: false },
    { num: "04", name: t("quefem.bloc.04.name"), desc: t("quefem.bloc.04.desc"), meta: t("quefem.bloc.04.meta"), dark: false },
    { num: "05", name: t("quefem.bloc.05.name"), desc: t("quefem.bloc.05.desc"), meta: t("quefem.bloc.05.meta"), dark: false },
    { num: "06", name: t("quefem.bloc.06.name"), desc: t("quefem.bloc.06.desc"), meta: t("quefem.bloc.06.meta"), dark: false },
    { num: "07", name: t("quefem.bloc.07.name"), desc: t("quefem.bloc.07.desc"), meta: t("quefem.bloc.07.meta"), dark: true },
  ];

  /* ── Referència curta de criteris i valors (els detallats viuen a /qui-som) ── */
  const criteris = [
    { rom: "I", name: t("quisom.v2.conviccio.01.name"), text: t("quisom.v2.conviccio.01.text") },
    { rom: "II", name: t("quisom.v2.conviccio.02.name"), text: t("quisom.v2.conviccio.02.text") },
    { rom: "III", name: t("quisom.v2.conviccio.03.name"), text: t("quisom.v2.conviccio.03.text") },
    { rom: "IV", name: t("quisom.v2.conviccio.04.name"), text: t("quisom.v2.conviccio.04.text") },
    { rom: "V", name: t("quisom.v2.conviccio.05.name"), text: t("quisom.v2.conviccio.05.text") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">

        {/* ══════════ 1. HERO ══════════ */}
        <section className="border-b border-rule" style={{ background: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8 lg:pb-20 lg:pt-28">
            <p className="eyebrow">{t("quefem.hero.eyebrow")}</p>
            <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              {t("quefem.hero.title.pre")}
              <em className="hl">{t("quefem.hero.title.em")}</em>
              {t("quefem.hero.title.post")}
            </h1>
            <p className="sec-body mt-6 max-w-2xl !text-lg">{t("quefem.hero.subtitle")}</p>
          </div>

          {/* Franja de dades */}
          <div className="statband">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="statband-inner">
                <div className="stat"><div className="n">180<small>+</small></div><div className="t">{t("quefem.hero.meta.fuentes")}</div></div>
                <div className="stat"><div className="n">16</div><div className="t">{t("quefem.hero.meta.estandares")}</div></div>
                <div className="stat"><div className="n">5<small>&nbsp;min</small></div><div className="t">{t("quefem.hero.meta.minutos")}</div></div>
                <div className="stat"><div className="n">8</div><div className="t">{t("quefem.hero.meta.blocs")}</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 2. EL PROCÉS: 5 PASSOS ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">{t("quefem.proc5.eyebrow")}</p>
            <h2 className="sec-title max-w-3xl">{t("quefem.proc5.title")}</h2>
            <p className="sec-body max-w-2xl">{t("quefem.proc5.sub")}</p>
            <ol className="mt-12 border-l-2" style={{ borderColor: "var(--accent)" }}>
              {([
                { n: "01", t: t("quefem.proc5.01.t"), d: t("quefem.proc5.01.d") },
                { n: "02", t: t("quefem.proc5.02.t"), d: t("quefem.proc5.02.d") },
                { n: "03", t: t("quefem.proc5.03.t"), d: t("quefem.proc5.03.d") },
                { n: "04", t: t("quefem.proc5.04.t"), d: t("quefem.proc5.04.d") },
                { n: "05", t: t("quefem.proc5.05.t"), d: t("quefem.proc5.05.d") },
              ]).map((p) => (
                <li key={p.n} className="grid grid-cols-[70px_minmax(0,.42fr)_minmax(0,1fr)] items-start gap-6 py-[26px] pl-6 max-md:grid-cols-[56px_1fr]">
                  <span className="font-serif text-[2.4rem] font-medium leading-[.9]" style={{ color: "var(--verd-clar)" }}>
                    {p.n}
                  </span>
                  <h3 className="font-serif text-[1.25rem] font-semibold text-primary">
                    {p.t}
                  </h3>
                  <p className="text-[.93rem] leading-[1.62]" style={{ color: "var(--ink-soft)" }}>
                    {p.d}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-8 pl-6 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: "var(--ink-soft)" }}>
              {t("quefem.proc5.note")}
            </p>
          </div>
        </section>

        {/* ══════════ 3. EL SEMÀFOR METODOLÒGIC (dark) ══════════ */}
        <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-center">
              <div>
                <p className="eyebrow" style={{ color: "var(--verd-clar)" }}>{t("quefem.semaforo.eyebrow")}</p>
                <h2 className="sec-title" style={{ color: "var(--bg)" }}>
                  {t("quefem.semaforo.title.pre")}
                  <em className="italic" style={{ color: "var(--verd-clar)" }}>{t("quefem.semaforo.title.em")}</em>
                  {t("quefem.semaforo.title.post")}
                </h2>
                <p className="sec-body" style={{ color: "rgba(242,245,241,.78)" }}>{t("quefem.semaforo.desc")}</p>
                <p className="semafor-note">
                  {t("quefem.semaforo.regla.pre")}<em>{t("quefem.semaforo.regla.em")}</em>
                </p>
              </div>
              <div className="semafor" role="img" aria-label={`Exemple de semàfor: nota B · ${t("quefem.semaforo.grade.label")}`}>
                <div className="grade-row">
                  <div className="grade">B</div>
                  <div className="grade-meta">
                    <div className="dots">
                      <span className="dot g on" /><span className="dot g on" /><span className="dot g on" />
                      <span className="dot g on" /><span className="dot y on" />
                    </div>
                    <div className="grade-label">{t("quefem.semaforo.grade.label")}</div>
                  </div>
                </div>
                {semaforoDims.map((dim) => (
                  <div key={dim.name} className="ind">
                    <span className="name">{dim.name}</span>
                    <span className={`val ${dim.cls}`}>{dim.val}</span>
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
                <p className="eyebrow">{t("quefem.estructura.eyebrow")}</p>
                <h2 className="sec-title">
                  {t("quefem.format.title")}
                </h2>
                <p className="sec-body">{t("quefem.format.body")}</p>
              </div>
              <div className="whitespace-nowrap rounded-md border border-dashed px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em]"
                style={{ borderColor: "rgba(94,135,114,.45)", color: "var(--ink-soft)" }}>
                <b className="font-semibold" style={{ color: "var(--ink)" }}>{t("quefem.format.limit")}</b>
              </div>
            </div>

            <div className="blocgrid">
              {blocs.map((bloc) => (
                <article key={bloc.num} className={`bloc${bloc.dark ? " dark" : ""}`}>
                  <div className="num">{bloc.num}</div>
                  <h3>{bloc.name}</h3>
                  <p>{bloc.desc}</p>
                  <p className="!mt-3 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: bloc.dark ? "rgba(242,245,241,.55)" : "var(--ink-soft)" }}>
                    {bloc.meta}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 5. CRITERIS I VALORS (dark, referència curta) ══════════ */}
        <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <p className="eyebrow" style={{ color: "var(--verd-clar)" }}>{t("quefem.criteris.eyebrow")}</p>
            <h2 className="sec-title" style={{ color: "var(--bg)" }}>{t("quefem.criteris.head")}</h2>
            <p className="sec-body max-w-[64ch]" style={{ color: "rgba(242,245,241,.78)" }}>{t("quefem.criteris.body")}</p>

            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {criteris.map((c) => (
                <article key={c.rom}
                  className="flex flex-col rounded-[9px] border p-7 transition-colors duration-200 hover:border-[rgba(170,201,182,.45)]"
                  style={{ borderColor: "rgba(170,201,182,.18)", background: "rgba(38,49,43,.38)" }}>
                  <span className="font-serif text-[2.6rem] font-medium leading-none" style={{ color: "var(--verd-clar)" }}>
                    {c.rom}
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold" style={{ color: "var(--bg)" }}>
                    {c.name}
                  </h3>
                  <p className="mt-3 text-[.88rem] leading-[1.6]" style={{ color: "rgba(242,245,241,.74)" }}>
                    {c.text}
                  </p>
                </article>
              ))}
            </div>

            <a href="/qui-som" className="mt-10 inline-block font-mono text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors hover:opacity-80"
              style={{ color: "var(--verd-clar)" }}>
              {t("quefem.criteris.link")}
            </a>
          </div>
        </section>

        {/* ══════════ 6. PREGUNTES PER MILLORAR (Premium — referència curta; la versió completa viu a /qui-som) ══════════ */}
        <section className="border-b border-rule px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-10">
            <div className="max-w-2xl">
              <p className="eyebrow">{t("quefem.preguntes.eyebrow")}</p>
              <h2 className="sec-title">{t("quefem.preguntes.title")}</h2>
              <p className="sec-body">{t("quefem.preguntes.intro")}</p>
            </div>
            <div className="shrink-0 pb-1">
              <button onClick={() => setPreusOpen(true)} className="btn-v1 btn-v1-solid">
                {t("quefem.preguntes.cta")}
              </button>
            </div>
          </div>
        </section>

        {/* ══════════ 7. COMPROMÍS ══════════ */}
        <section className="principle">
          <div className="mx-auto max-w-4xl px-6">
            <p className="eyebrow justify-center" style={{ color: "var(--verd-clar)" }}>{t("quefem.manifest.eyebrow")}</p>
            <blockquote>
              {t("quefem.manifest.text.pre")}
              <em className="italic font-medium" style={{ color: "var(--highlight)" }}>{t("quefem.manifest.text.em")}</em>
              {t("quefem.manifest.text.post")}
            </blockquote>
            <p className="after">— {t("quefem.manifest.attribution")}</p>
          </div>
        </section>

      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
