"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import {
  TYPE_CONFIG,
  getStandardsWithCounts,
  type StandarType,
} from "@/lib/standards-data";

type FilterKey = "all" | StandarType;

export default function EstandaresPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  // Font única de veritat: count derivat de xrefRows
  const standards = getStandardsWithCounts();

  // Counts per tipus (derivats, mai hardcoded)
  const counts: Record<FilterKey, number> = {
    all: standards.length,
    reg: standards.filter((s) => s.type === "reg").length,
    fw: standards.filter((s) => s.type === "fw").length,
    cert: standards.filter((s) => s.type === "cert").length,
  };

  // Cerca sense accents sobre nom + emissor + descripció
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const filtered = standards.filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (search.trim()) {
      const q = norm(search.trim());
      const hay = norm(`${s.name} ${s.issuerCa} ${s.issuerEs} ${s.descCa} ${s.descEs}`);
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const resetFilters = () => { setTypeFilter("all"); setSearch(""); };

  const filterButtons: { key: FilterKey; label: string }[] = [
    { key: "all", label: tr("Tots", "Todos") },
    { key: "reg", label: tr("Regulacions", "Regulaciones") },
    { key: "fw", label: "Frameworks" },
    { key: "cert", label: tr("Certificacions", "Certificaciones") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* ══════════ HERO AMB NÚMERO GEGANT ══════════ */}
        <section className="border-b" style={{ background: "#F2F5F1", borderColor: "#D8E2DA" }}>
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-16 lg:px-8 lg:pt-20">
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-12">
              <div>
                <p className="eyebrow">Estàndards ESG · 2026</p>
                <h1 className="font-serif text-[clamp(2.3rem,4.2vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.012em] text-primary" style={{ textWrap: "balance", maxWidth: "24ch" }}>
                  {lang === "ca"
                    ? <>Els <span className="hl">16 estàndards</span> que un director de sostenibilitat no hauria de confondre.</>
                    : <>Los <span className="hl">16 estándares</span> que un director de sostenibilidad no debería confundir.</>}
                </h1>
                <p className="mt-6 max-w-[54ch] text-[1.05rem] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  <strong style={{ fontWeight: 500, color: "var(--ink)" }}>
                    {lang === "ca"
                      ? "Confondre-les té conseqüències operatives reals."
                      : "Confundirlas tiene consecuencias operativas reales."}
                  </strong>{" "}
                  {lang === "ca"
                    ? "Una regulació et pot multar, un framework et pot orientar i una certificació et pot obrir (o tancar) mercats. Saber què és cada cosa és el primer acte de criteri."
                    : "Una regulación te puede multar, un framework te puede orientar y una certificación te puede abrir (o cerrar) mercados. Saber qué es cada cosa es el primer acto de criterio."}
                </p>
                {/* Pills regulació / framework / certificació */}
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {[
                    { dot: "#26312B", label: tr("Una regulació t'obliga", "Una regulación te obliga") },
                    { dot: "#5E8772", label: tr("Un framework t'orienta", "Un framework te orienta") },
                    { dot: "#AAC9B6", label: tr("Una certificació t'avalua", "Una certificación te evalúa") },
                  ].map((pill) => (
                    <span
                      key={pill.label}
                      className="inline-flex items-center gap-2.5 rounded-full border px-3.5 py-[7px] font-mono text-[11px] font-medium tracking-[0.05em]"
                      style={{ borderColor: "rgba(74,95,83,0.35)", background: "#FFFFFF", color: "#4A5F53" }}
                    >
                      <i className="inline-block h-[9px] w-[9px] rounded-full" style={{ background: pill.dot }} aria-hidden="true" />
                      {pill.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Número gegant */}
              <figure aria-hidden="true">
                <div
                  className="select-none text-right font-serif font-light leading-[0.82]"
                  style={{ fontSize: "clamp(6rem,12vw,8.5rem)", letterSpacing: "-0.05em", color: "#5E8772" }}
                >
                  16<sup
                    className="font-mono font-semibold uppercase"
                    style={{ fontSize: "0.09em", letterSpacing: "0.34em", color: "#4A5F53", verticalAlign: "top", marginLeft: "0.08em" }}
                  >est</sup>
                </div>
                <figcaption className="mt-4 text-right font-mono text-[11px] leading-relaxed tracking-[0.08em]" style={{ color: "#4A5F53" }}>
                  {lang === "ca"
                    ? <>CATÀLEG COMPLET · {counts.reg} REGULACIONS + {counts.fw} FRAMEWORKS + {counts.cert} CERTIFICACIONS<br />CREUATS AMB CADA INFORME PUBLICAT</>
                    : <>CATÁLOGO COMPLETO · {counts.reg} REGULACIONES + {counts.fw} FRAMEWORKS + {counts.cert} CERTIFICACIONES<br />CRUZADOS CON CADA INFORME PUBLICADO</>}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ══════════ FILTRES + CERCA ══════════ */}
        <section className="border-b pb-10 pt-10" style={{ background: "#F2F5F1", borderColor: "#D8E2DA" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-9 flex flex-wrap items-center gap-2.5" role="group" aria-label={tr("Filtres del catàleg d'estàndards", "Filtros del catálogo de estándares")}>
              {filterButtons.map((btn) => {
                const active = typeFilter === btn.key;
                return (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => setTypeFilter(btn.key)}
                    className={`rounded-full border px-4 py-[9px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-150 ${
                      active
                        ? "border-primary bg-primary text-background"
                        : "border-black/25 bg-transparent text-[#4A5F53] hover:border-accent hover:text-accent"
                    }`}
                  >
                    {btn.label} ({counts[btn.key]})
                  </button>
                );
              })}
              {/* Cerca */}
              <div className="relative ml-auto w-full sm:w-auto">
                <label htmlFor="q-estandars" className="sr-only">{tr("Cerca estàndards", "Buscar estándares")}</label>
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-base leading-none" style={{ color: "#4A5F53" }} aria-hidden="true">⌕</span>
                <input
                  id="q-estandars"
                  type="search"
                  autoComplete="off"
                  placeholder={tr("Cerca: clima, salaris, due diligence…", "Busca: clima, salarios, due diligence…")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border bg-white py-[9px] pl-10 pr-4 font-mono text-xs outline-none transition-shadow focus:border-accent focus:shadow-[0_0_0_3px_rgba(94,135,114,0.14)] sm:w-[280px]"
                  style={{ borderColor: "rgba(38,49,43,0.28)", color: "#26312B" }}
                />
              </div>
            </div>

            {/* ══════════ GRAELLA DE TARGETES ══════════ */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
                {filtered.map((s) => {
                  const cfg = TYPE_CONFIG[s.type];
                  const num = String(standards.findIndex((x) => x.slug === s.slug) + 1).padStart(2, "0");
                  return (
                    <article
                      key={s.slug}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(38,49,43,0.08)]"
                      style={{ borderColor: "rgba(38,49,43,0.12)" }}
                      onClick={() => router.push(`/estandares-esg/${s.slug}`)}
                    >
                      {/* Banda de color per tipus */}
                      <div className="h-[5px] w-full flex-none" style={{ background: cfg.borderColor }} />

                      <div className="flex flex-1 flex-col px-6 pb-5 pt-6">
                        {/* Logo + número */}
                        <div className="mb-4 flex items-center gap-3">
                          <Image
                            src={s.logo}
                            alt={`Logo ${s.name}`}
                            width={112}
                            height={34}
                            className="h-[34px] w-auto max-w-[112px] object-contain"
                            unoptimized
                          />
                          <span className="ml-auto font-mono text-[11px] tracking-[0.14em]" style={{ color: "#4A5F53" }}>
                            {num}/{String(counts.all).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Tipus + accés */}
                        <div className="mb-2.5 flex items-center gap-2.5">
                          <span
                            className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                            style={{ color: s.type === "fw" ? "#5E8772" : s.type === "reg" ? "#141B18" : "#4A5F53" }}
                          >
                            {tr(cfg.labelCa, cfg.labelEs)}
                          </span>
                          {s.access === "free" ? (
                            <span className="rounded-full px-2 py-[3px] font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ background: "rgba(170,201,182,0.28)", color: "#26312B" }}>
                              {tr("Gratis", "Gratis")}
                            </span>
                          ) : (
                            <span className="rounded-full px-2 py-[3px] font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ background: "#26312B", color: "#AAC9B6" }}>
                              Premium
                            </span>
                          )}
                        </div>

                        {/* Nom + emissor */}
                        <h3 className="font-serif text-[1.72rem] font-medium leading-[1.1] tracking-[-0.01em] text-primary">{s.name}</h3>
                        <p className="mb-3 mt-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: "#4A5F53" }}>
                          {tr(s.issuerCa, s.issuerEs)}
                        </p>

                        {/* Descripció */}
                        <p className="flex-1 text-[13px] leading-relaxed" style={{ color: "#4A5F53" }}>
                          {tr(s.descCa, s.descEs)}
                        </p>

                        {/* Peu: count cross-ref + veure */}
                        <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3.5 font-mono text-[11px] tracking-[0.05em]" style={{ borderTopColor: "rgba(38,49,43,0.1)", color: "#4A5F53" }}>
                          <span>
                            <b style={{ color: "#5E8772", fontWeight: 600, fontSize: "0.98rem" }}>{s.count}</b>&nbsp;{tr("informes cross-ref", "informes cross-ref")}
                          </span>
                          <span className="font-semibold uppercase tracking-[0.12em] transition-colors group-hover:text-accent" style={{ color: "#26312B" }}>
                            {tr("Veure →", "Ver →")}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Estat buit */
              <div className="rounded-[10px] border border-dashed bg-white px-6 py-[72px] text-center" style={{ borderColor: "rgba(74,95,83,0.4)" }} role="status">
                <p className="mb-2.5 font-serif text-2xl font-medium italic text-primary">
                  {tr("Cap estàndard coincideix amb la cerca.", "Ningún estándar coincide con la búsqueda.")}
                </p>
                <p className="mx-auto mb-6 max-w-[46ch] text-sm" style={{ color: "#4A5F53" }}>
                  {tr(
                    "Prova amb un altre terme —per exemple «clima», «taxonomia» o «due diligence»— o reinicia els filtres per tornar al catàleg complet.",
                    "Prueba con otro término —por ejemplo «clima», «taxonomía» o «due diligence»— o reinicia los filtros para volver al catálogo completo."
                  )}
                </p>
                <button onClick={resetFilters} className="btn-v1 btn-v1-ghost">
                  {tr("Reinicia els filtres", "Reinicia los filtros")}
                </button>
              </div>
            )}

            {/* Nota peu de graella */}
            <p className="mt-8 font-mono text-[10px] tracking-[0.05em]" style={{ color: "#4A5F53" }}>
              {lang === "ca"
                ? "ELS COUNTS DE CROSS-REF DERIVEN DELS INFORMES JA PUBLICATS I S'ACTUALITZEN AMB CADA NOVA ENTREGA."
                : "LOS COUNTS DE CROSS-REF DERIVAN DE LOS INFORMES YA PUBLICADOS Y SE ACTUALIZAN CON CADA NUEVA ENTREGA."}
            </p>
          </div>
        </section>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
