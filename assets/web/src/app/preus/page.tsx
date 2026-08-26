"use client";

import { useState } from "react";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { useLanguage } from "@/components/language-provider";

function FeatLi({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li
      className="grid grid-cols-[18px_1fr] gap-2.5 border-t py-2 text-[0.9rem] leading-[1.45]"
      style={{ borderColor: "rgba(38,49,43,.08)", color: ok ? "var(--ink)" : "var(--ink-soft)" }}
    >
      <span aria-hidden className="font-bold" style={{ color: ok ? "var(--accent)" : "rgba(38,49,43,.35)", fontSize: ".85rem", lineHeight: 1.7 }}>
        {ok ? "✓" : "○"}
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function PreusPage() {
  const { lang } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [billing, setBilling] = useState<"anual" | "mensual">("anual");

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  const anual = billing === "anual";
  const premium = anual
    ? {
        badge: tr("Anual", "Anual"),
        num: "440",
        unit: tr("any", "año"),
        equiv: tr("Equival a 36,67€/mes · Impostos inclosos", "Equivale a 36,67€/mes · Impuestos incluidos"),
        cta: tr("Subscriure'm anualment", "Suscríbeme anualmente"),
      }
    : {
        badge: tr("Mensual", "Mensual"),
        num: "39",
        unit: tr("mes", "mes"),
        equiv: tr("Sense descompte anual · Impostos inclosos", "Sin descuento anual · Impuestos incluidos"),
        cta: tr("Subscriure'm mensualment", "Suscríbeme mensualmente"),
      };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">

        {/* ══════════ PAGE HERO ══════════ */}
        <section className="border-b border-rule" style={{ background: "var(--background)" }}>
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8">
            <p className="eyebrow">{tr("Preus · Setembre 2026", "Precios · Septiembre 2026")}</p>
            <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl" style={{ color: "var(--ink-deep)" }}>
              {tr("Tria com vols ", "Elige cómo quieres ")}<span className="hl">{tr("avançar", "avanzar")}</span>.
            </h1>
            <p className="sec-body mt-6 max-w-2xl text-lg">
              {tr("Comencem amb ", "Empezamos con ")}<strong>{tr("2 mesos gratuïts per a tothom", "2 meses gratis para todos")}</strong>
              {tr(" (setembre i octubre 2026). A partir de novembre, tries el teu pla. La subscripció Premium es paga anualment. ",
                " (septiembre y octubre de 2026). A partir de noviembre, eliges tu plan. La suscripción Premium se paga anualmente. ")}
              <strong>{tr("Sense permanència, cancel·la quan vulguis.", "Sin permanencia, cancela cuando quieras.")}</strong>
            </p>

            {/* Toggle Anual / Mensual */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <div
                role="group"
                aria-label={tr("Període de facturació", "Período de facturación")}
                className="inline-flex overflow-hidden rounded-lg border"
                style={{ borderColor: "rgba(38,49,43,.25)", background: "#fff" }}
              >
                <button
                  type="button"
                  aria-pressed={anual}
                  onClick={() => setBilling("anual")}
                  className="cursor-pointer px-[22px] py-[11px] font-mono text-xs font-semibold uppercase tracking-[0.08em] transition-colors"
                  style={{ background: anual ? "var(--accent)" : "transparent", color: anual ? "#fff" : "var(--ink-soft)" }}
                >
                  {tr("Anual", "Anual")}
                </button>
                <button
                  type="button"
                  aria-pressed={!anual}
                  onClick={() => setBilling("mensual")}
                  className="cursor-pointer px-[22px] py-[11px] font-mono text-xs font-semibold uppercase tracking-[0.08em] transition-colors"
                  style={{ background: !anual ? "var(--accent)" : "transparent", color: !anual ? "#fff" : "var(--ink-soft)" }}
                >
                  {tr("Mensual", "Mensual")}
                </button>
              </div>
              <span className="px-1 py-0.5 font-mono text-xs tracking-[0.04em]" style={{ background: "linear-gradient(transparent 55%, var(--highlight) 55%)", color: "var(--ink)" }}>
                {tr("Estalvia 28€/any pagant anualment", "Ahorra 28€/año pagando anualmente")}
              </span>
            </div>
          </div>
        </section>

        {/* ══════════ PLANS ══════════ */}
        <section className="border-b border-rule" style={{ background: "var(--background)" }}>
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-4 lg:px-8">

            <div className="mx-auto grid w-full max-w-[520px] items-stretch gap-5 md:max-w-none md:auto-rows-fr md:grid-cols-3 lg:mt-10">

              {/* GRATUÏT */}
              <article className="relative flex flex-col rounded-[9px] border bg-white px-[30px] pb-[30px] pt-[34px]"
                style={{ borderColor: "rgba(38,49,43,.12)" }}>
                <p className="mb-3.5 flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
                  {tr("01 · Per començar", "01 · Para empezar")}
                </p>
                <h2 className="font-serif text-[1.65rem] font-medium leading-tight" style={{ color: "var(--ink-deep)" }}>{tr("Gratuït", "Gratis")}</h2>
                <p className="mt-1.5 min-h-[44px] text-[0.9rem]" style={{ color: "var(--ink-soft)" }}>
                  {tr("Per començar a entendre l'ecosistema ESG europeu.", "Para empezar a entender el ecosistema ESG europeo.")}
                </p>
                <div className="mb-0.5 mt-5 flex items-baseline gap-2">
                  <span className="font-serif text-[3.3rem] font-medium leading-none tracking-[-0.02em]" style={{ color: "var(--ink-deep)" }}>0</span>
                  <span className="font-serif text-2xl font-medium" style={{ color: "var(--ink-soft)" }}>€</span>
                  <span className="font-mono text-xs uppercase tracking-[0.08em]" style={{ color: "var(--ink-soft)" }}>{tr("sempre", "siempre")}</span>
                </div>
                <p className="mb-5 mt-1 font-mono text-[11px] tracking-[0.05em]" style={{ color: "var(--ink-soft)" }}>
                  {tr("Sense targeta · per sempre", "Sin tarjeta · para siempre")}
                </p>
                <ul className="mb-6 flex-1">
                  <FeatLi ok={true}>{tr("Newsletter bimensual", "Newsletter bimensual")}</FeatLi>
                  <FeatLi ok={true}>{tr("Accés a informes >6 mesos", "Acceso a informes >6 meses")}</FeatLi>
                  <FeatLi ok={true}>{tr("Accés a la biblioteca pública", "Acceso a la biblioteca pública")}</FeatLi>
                  <FeatLi ok={false}>{tr("Informes recents (< 6 mesos)", "Informes recientes (< 6 meses)")}</FeatLi>
                  <FeatLi ok={false}>{tr("Cross-reference amb certificacions", "Cross-reference con certificaciones")}</FeatLi>
                </ul>
                <button onClick={() => openAuth("register")} className="btn-v1 btn-v1-ghost w-full text-center">
                  {tr("Comença gratis", "Empieza gratis")}
                </button>
              </article>

              {/* PREMIUM (destacat) */}
              <article
                className="relative order-first flex flex-col rounded-[9px] border-2 bg-white px-[30px] pb-[30px] pt-[34px] lg:order-none lg:-translate-y-2.5"
                style={{ borderColor: "var(--accent)", boxShadow: "0 18px 44px rgba(94,135,114,.18)" }}
              >
                <span
                  className="absolute -top-3 right-[22px] rounded px-3 py-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.1em]"
                  style={{ background: "var(--highlight)", color: "var(--ink-deep)" }}
                >
                  {premium.badge}
                </span>
                <p className="mb-3.5 flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
                  {tr("02 · Recomanat", "02 · Recomendado")}
                </p>
                <h2 className="font-serif text-[1.65rem] font-medium leading-tight" style={{ color: "var(--ink-deep)" }}>Premium</h2>
                <p className="mt-1.5 min-h-[44px] text-[0.9rem]" style={{ color: "var(--ink-soft)" }}>
                  {tr("Per al professional que ha de decidir cada setmana.", "Para el profesional que tiene que decidir cada semana.")}
                </p>
                <div className="mb-0.5 mt-5 flex items-baseline gap-2">
                  <span className="font-serif text-[3.3rem] font-medium leading-none tracking-[-0.02em]" style={{ color: "var(--ink-deep)" }}>{premium.num}</span>
                  <span className="font-serif text-2xl font-medium" style={{ color: "var(--ink-soft)" }}>€</span>
                  <span className="font-mono text-xs uppercase tracking-[0.08em]" style={{ color: "var(--ink-soft)" }}>{premium.unit}</span>
                </div>
                <p className="mb-5 mt-1 font-mono text-[11px] tracking-[0.05em]" style={{ color: "var(--ink-soft)" }}>{premium.equiv}</p>
                <ul className="mb-6 flex-1">
                  <FeatLi ok={true}>{tr("Tot el que té el pla Gratuït", "Todo lo que incluye el plan Gratis")}</FeatLi>
                  <FeatLi ok={true}>{tr("Arxiu complet i cerca avançada", "Archivo completo y búsqueda avanzada")}</FeatLi>
                  <FeatLi ok={true}>{tr("Tots els informes recents (< 6 mesos)", "Todos los informes recientes (< 6 meses)")}</FeatLi>
                  <FeatLi ok={true}>Cross-reference {tr("amb EcoVadis, B Corp, MSCI, GRI", "con EcoVadis, B Corp, MSCI, GRI")}</FeatLi>
                  <FeatLi ok={true}>{tr("Alertes personalitzades per temes", "Alertas personalizadas por temas")}</FeatLi>
                  <FeatLi ok={true}>{tr("Preguntes per millorar (reflexió ètica mensual)", "Preguntas para mejorar (reflexión ética mensual)")}</FeatLi>
                </ul>
                <button
                  onClick={() => { window.location.href = "/pagament?plan=premium&period=annual"; }}
                  className="btn-v1 btn-v1-solid w-full text-center"
                >
                  {premium.cta}
                </button>
              </article>

              {/* ULTRA (pròximament) */}
              <article className="relative flex flex-col rounded-[9px] border bg-white px-[30px] pb-[30px] pt-[34px] opacity-55"
                style={{ borderColor: "rgba(38,49,43,.12)" }}>
                <span
                  className="absolute -top-3 right-[22px] rounded border px-3 py-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.1em]"
                  style={{ background: "#fff", borderColor: "rgba(38,49,43,.25)", color: "var(--ink-soft)" }}
                >
                  {tr("Pròximament · abril 2027", "Próximamente · abril 2027")}
                </span>
                <p className="mb-3.5 flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
                  {tr("03 · Per a equips", "03 · Para equipos")}
                </p>
                <h2 className="font-serif text-[1.65rem] font-medium leading-tight" style={{ color: "var(--ink-deep)" }}>Ultra</h2>
                <p className="mt-1.5 min-h-[44px] text-[0.9rem]" style={{ color: "var(--ink-soft)" }}>
                  {tr("Per a l'equip que necessita sintetitzar per a la junta.", "Para el equipo que necesita sintetizar para la junta.")}
                </p>
                <div className="mb-0.5 mt-5 flex items-baseline gap-2">
                  <span className="font-serif text-[3.3rem] font-medium leading-none tracking-[-0.02em]" style={{ color: "var(--ink-deep)" }}>—</span>
                </div>
                <p className="mb-5 mt-1 font-mono text-[11px] tracking-[0.05em]" style={{ color: "var(--ink-soft)" }}>
                  {tr("Preu per confirmar al llançament", "Precio por confirmar en el lanzamiento")}
                </p>
                <ul className="mb-6 flex-1">
                  <FeatLi ok={true}>{tr("Tot el que té Premium", "Todo lo que incluye Premium")}</FeatLi>
                  <FeatLi ok={true}>{tr("Podcast d'àudio de cada informe (5 min)", "Podcast de audio de cada informe (5 min)")}</FeatLi>
                  <FeatLi ok={true}>{tr("Diapositives PowerPoint editables", "Diapositivas PowerPoint editables")}</FeatLi>
                  <FeatLi ok={true}>{tr("Dossier mensual temàtic + 1 connexió personalitzada/mes", "Dossier mensual temático + 1 conexión personalizada/mes")}</FeatLi>
                </ul>
                <a
                  className="btn-v1 btn-v1-ghost w-full text-center"
                  href={`mailto:info@criteriesg.com?subject=${encodeURIComponent(tr("Llista d'espera Ultra", "Lista de espera Ultra"))}`}
                >
                  {tr("Aviseu-me quan obri", "Avisadme cuando abra")}
                </a>
              </article>
            </div>

            {/* ══════════ EARLY BIRD — bloc separat ══════════ */}
            <div
              className="mt-14 grid overflow-hidden rounded-xl border-[1.5px] border-dashed md:grid-cols-[minmax(0,.42fr)_minmax(0,.58fr)]"
              style={{ borderColor: "var(--accent)", background: "#fff" }}
            >
              <div className="flex flex-col justify-center p-8 lg:p-11" style={{ background: "var(--ink)", color: "var(--bg)" }}>
                <span
                  className="mb-5 self-start rounded px-3 py-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ background: "var(--highlight)", color: "var(--ink-deep)" }}
                >
                  {tr("Oferta de llançament · 50 places limitades", "Oferta de lanzamiento · 50 plazas limitadas")}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-6xl font-medium leading-none lg:text-[4.4rem]" style={{ color: "var(--verd-clar)" }}>290&nbsp;€</span>
                  <span className="font-mono text-[13px] uppercase tracking-[0.1em]" style={{ color: "rgba(242,245,241,.75)" }}>{tr("any", "año")}</span>
                </div>
                <p className="mt-3.5 font-mono text-[11px] tracking-[0.05em]" style={{ color: "rgba(242,245,241,.66)" }}>
                  {tr("Equival a 24,17€/mes · Impostos inclosos · Estalvi de 150€", "Equivale a 24,17€/mes · Impuestos incluidos · Ahorro de 150€")}
                </p>
              </div>
              <div className="flex flex-col items-start justify-center p-8 lg:p-10">
                <h3 className="mb-3.5 max-w-md font-serif text-2xl font-medium leading-snug" style={{ color: "var(--ink-deep)" }}>
                  {tr("Early bird — 50 places amb pagament anual", "Early bird — 50 plazas con pago anual")}
                </h3>
                <p className="mb-6 text-[0.95rem] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {tr("Els primers 50 subscriptors Premium paguen ", "Los primeros 50 suscriptores Premium pagan ")}
                  <strong className="font-medium" style={{ color: "var(--ink)" }}>{tr("290€/any", "290€/año")}</strong>
                  {tr(" (impostos inclosos) en lloc dels 440€ habituals. Equival a ", " (impuestos incluidos) en lugar de los 440€ habituales. Equivale a ")}
                  <em className="not-italic" style={{ background: "linear-gradient(transparent 58%, var(--highlight) 58%)" }}>24,17€/mes</em>
                  {tr(" — un descompte del 34%. Llançament setembre 2026. Una vegada assignades les 50 places, el preu torna a 440€/any.",
                      " — un descuento del 34%. Lanzamiento septiembre de 2026. Una vez asignadas las 50 plazas, el precio vuelve a 440€/año.")}
                </p>
                <a href="/pagament" className="btn-v1 btn-v1-solid">
                  {tr("Reservar plaça early bird", "Reservar plaza early bird")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ REGLA DELS 6 MESOS (dark) ══════════ */}
        <section className="border-b" style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:px-8 lg:py-24">
            <div>
              <p className="eyebrow">{tr("Compromís d'accés", "Compromiso de acceso")}</p>
              <h2 className="font-serif text-4xl font-medium leading-[1.14] tracking-[-0.01em] sm:text-[2.7rem]" style={{ color: "var(--bg)" }}>
                {tr("Regla dels 6 mesos:", "Regla de los 6 meses:")}
              </h2>
              <p className="mt-5 max-w-xl text-[1.03rem] leading-relaxed" style={{ color: "rgba(242,245,241,.78)" }}>
                {tr("Tots els informes amb més de 6 mesos d'antiguitat són ", "Todos los informes con más de 6 meses de antigüedad son ")}
                <strong className="font-medium" style={{ color: "var(--bg)" }}>{tr("gratuïts per sempre", "gratis para siempre")}</strong>.
                {tr(" Només els informes recents requereixen Premium. Així garantim accés universal al coneixement ESG acumulat.",
                    " Solo los informes recientes requieren Premium. Así garantizamos acceso universal al conocimiento ESG acumulado.")}
              </p>
            </div>
            <figure>
              <svg
                viewBox="0 0 560 250"
                role="img"
                aria-label={tr(
                  "Línia de temps: un informe és Premium els primers 6 mesos i després passa a ser gratuït per sempre",
                  "Línea de tiempo: un informe es Premium los primeros 6 meses y después pasa a ser gratis para siempre"
                )}
                className="block h-auto w-full"
              >
                <line x1="30" y1="130" x2="530" y2="130" stroke="#AAC9B6" strokeOpacity=".4" strokeWidth="1.5" />
                <rect x="30" y="86" width="240" height="88" rx="8" fill="#26312B" stroke="#AAC9B6" strokeOpacity=".25" />
                <text x="52" y="118" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="#AAC9B6" fontWeight="600">
                  {"MES 0 → MES 6"}
                </text>
                <text x="52" y="140" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="rgba(242,245,241,.65)">PREMIUM</text>
                <path d="M278 122 l16 8 -16 8 z" fill="#F5E381" />
                <rect x="302" y="86" width="228" height="88" rx="8" fill="none" stroke="#5E8772" strokeWidth="1.5" strokeDasharray="5 4" />
                <text x="324" y="118" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="#F5E381" fontWeight="600">
                  {tr("DES DEL MES 6", "DESDE EL MES 6")}
                </text>
                <text x="324" y="140" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="#AAC9B6">
                  {tr("GRATUÏT PER SEMPRE", "GRATIS PARA SIEMPRE")}
                </text>
                <circle cx="30" cy="130" r="5" fill="#5E8772" />
                <circle cx="270" cy="130" r="5" fill="#F5E381" />
                <g fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="rgba(242,245,241,.6)">
                  <text x="30" y="205" textAnchor="middle">{tr("PUBLICACIÓ", "PUBLICACIÓN")}</text>
                  <text x="270" y="205" textAnchor="middle">{tr("6 MESOS", "6 MESES")}</text>
                  <text x="530" y="205" textAnchor="end">∞</text>
                </g>
                <text
                  x="280" y="46" textAnchor="middle"
                  fontFamily="'Newsreader',Georgia,serif" fontStyle="italic" fontSize="15" fill="#AAC9B6"
                >
                  {tr("El coneixement acumulat no es tanca darrere d'un paywall.", "El conocimiento acumulado no se cierra tras un paywall.")}
                </text>
              </svg>
              <figcaption className="mt-4 font-mono text-[11px] leading-relaxed tracking-[0.05em]" style={{ color: "rgba(242,245,241,.55)" }}>
                {tr("Il·lustratiu. Cada informe envelleix ", "Ilustrativo. Cada informe envejece ")}
                <b className="font-semibold" style={{ color: "var(--verd-clar)" }}>{tr("cap a la gratuïtat", "hacia la gratuidad")}</b>
                {tr(": els recents sostenen el projecte, l'arxiu queda obert per a tothom.", ": los recientes sostienen el proyecto, el archivo queda abierto para todos.")}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ══════════ MÈTODES DE PAGAMENT ══════════ */}
        <section className="border-b border-rule bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <p className="eyebrow">{tr("Mètodes de pagament", "Métodos de pago")}</p>
            <h2 className="font-serif text-4xl font-medium leading-[1.14] tracking-[-0.01em] sm:text-[2.7rem]" style={{ color: "var(--ink-deep)" }}>
              {tr("Tria també com vols pagar", "Elige también cómo quieres pagar")}
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <article className="flex flex-col items-start gap-3.5 rounded-[9px] border p-8" style={{ borderColor: "rgba(38,49,43,.12)" }}>
                <svg viewBox="0 0 44 44" width="44" height="44" role="img" aria-label={tr("Icona de targeta bancària", "Icono de tarjeta bancaria")}>
                  <rect x="4" y="10" width="36" height="24" rx="4" fill="none" stroke="#5E8772" strokeWidth="2" />
                  <line x1="4" y1="18" x2="40" y2="18" stroke="#5E8772" strokeWidth="2" />
                  <rect x="9" y="26" width="10" height="3" rx="1.5" fill="#F5E381" />
                </svg>
                <h3 className="font-serif text-[1.35rem] font-medium" style={{ color: "var(--ink-deep)" }}>
                  {tr("Targeta (Stripe)", "Tarjeta (Stripe)")}
                </h3>
                <p className="flex-1 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {tr("Mensual o anual. Activació immediata. Mètode estàndard a internet.", "Mensual o anual. Activación inmediata. Método estándar en internet.")}
                </p>
                <a href="/pagament#targeta" className="btn-v1 btn-v1-solid">
                  {tr("Pagar amb targeta", "Pagar con tarjeta")}
                </a>
              </article>

              <article className="flex flex-col items-start gap-3.5 rounded-[9px] border p-8" style={{ borderColor: "rgba(38,49,43,.12)" }}>
                <svg viewBox="0 0 44 44" width="44" height="44" role="img" aria-label={tr("Icona de transferència bancària", "Icono de transferencia bancaria")}>
                  <circle cx="15" cy="15" r="8" fill="none" stroke="#5E8772" strokeWidth="2" />
                  <path d="M23 23 L37 37 M37 37 v-9 M37 37 h-9" stroke="#5E8772" strokeWidth="2" fill="none" />
                  <rect x="8" y="30" width="12" height="3" rx="1.5" fill="#F5E381" />
                </svg>
                <h3 className="font-serif text-[1.35rem] font-medium" style={{ color: "var(--ink-deep)" }}>
                  {tr("Transferència (Fiare Banca Ètica)", "Transferencia (Fiare Banca Ética)")}
                </h3>
                <p className="flex-1 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {tr("Només anual. Transferència manual amb comprovant. Activació immediata.", "Solo anual. Transferencia manual con justificante. Activación inmediata.")}
                </p>
                <a href="/pagament#transferencia" className="btn-v1 btn-v1-ghost">
                  {tr("Pagar amb transferència", "Pagar con transferencia")}
                </a>
              </article>
            </div>

            <p
              className="mt-11 max-w-[76ch] rounded-r-[9px] px-8 py-7 text-[0.97rem] leading-relaxed"
              style={{ borderLeft: "3px solid var(--highlight)", background: "var(--background)", color: "var(--ink)" }}
            >
              {tr("Si pagues amb targeta (Stripe), una corporació nord-americana es queda una comissió del nostre treball i els diners circulen pel sistema financer especulatiu. Si tries la transferència anual al nostre compte de Fiare Banca Ètica, ",
                  "Si pagas con tarjeta (Stripe), una corporación norteamericana se queda una comisión de nuestro trabajo y el dinero circula por el sistema financiero especulativo. Si eliges la transferencia anual a nuestra cuenta de Fiare Banca Ética, ")}
              <strong className="font-medium">{tr("el 100% dels teus diners dona suport a l'economia social i transformadora.", "el 100% de tu dinero apoya la economía social y transformadora.")}</strong>
            </p>
          </div>
        </section>

        {/* ══════════ COMPARATIVA (contingut existent conservat) ══════════ */}
        <section className="border-b border-rule bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
            <h2 className="mb-8 text-center font-serif text-3xl font-medium" style={{ color: "var(--ink)" }}>
              {tr("Comparativa detallada", "Comparativa detallada")}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {[tr("Característica", "Característica"), tr("Gratuït", "Gratis"), "Premium", "Ultra"].map((h, i) => (
                      <th
                        key={h}
                        className={`p-3.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] ${i === 0 ? "text-left" : "text-center"}`}
                        style={{ background: "var(--ink-deep)", color: "var(--bg)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: tr("Informes antics (>6 mesos)", "Informes antiguos (>6 meses)"), free: true, premium: true, ultra: true },
                    { label: tr("Informes recents (últims 6 mesos)", "Informes recientes (últimos 6 meses)"), free: false, premium: true, ultra: true },
                    { label: tr("Semàfor metodològic", "Semáforo metodológico"), free: true, premium: true, ultra: true },
                    { label: tr("Cross-reference amb certificacions", "Cross-reference con certificaciones"), free: false, premium: true, ultra: true },
                    { label: tr("Alertes personalitzades", "Alertas personalizadas"), free: false, premium: true, ultra: true },
                    { label: tr("Preguntes per millorar", "Preguntas para mejorar"), free: false, premium: true, ultra: true },
                    { label: tr("Newsletter completa", "Newsletter completa"), free: false, premium: true, ultra: true },
                    { label: tr("Connexions personalitzades", "Conexiones personalizadas"), free: false, premium: false, ultra: true },
                    { label: tr("Format PPT", "Formato PPT"), free: false, premium: false, ultra: true },
                    { label: tr("Podcast exclusiu", "Podcast exclusivo"), free: false, premium: false, ultra: true },
                    { label: tr("Anàlisi personalitzat", "Análisis personalizado"), free: false, premium: false, ultra: true },
                  ].map((row) => (
                    <tr key={row.label} className="border-b" style={{ borderColor: "var(--rule)" }}>
                      <td className="p-3.5 text-[13px]" style={{ color: "var(--ink)" }}>{row.label}</td>
                      <td className="p-3.5 text-center" style={{ color: row.free ? "var(--sem-g)" : "var(--ink-soft)", opacity: row.free ? 1 : 0.5 }}>{row.free ? "✓" : "—"}</td>
                      <td className="p-3.5 text-center" style={{ color: row.premium ? "var(--sem-g)" : "var(--ink-soft)", opacity: row.premium ? 1 : 0.5 }}>{row.premium ? "✓" : "—"}</td>
                      <td className="p-3.5 text-center" style={{ color: row.ultra ? "var(--sem-g)" : "var(--ink-soft)", opacity: row.ultra ? 1 : 0.5 }}>{row.ultra ? "✓" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══════════ FAQ (contingut existent conservat) ══════════ */}
        <section className="border-b border-rule" style={{ background: "var(--background)" }}>
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="mb-8 text-center font-serif text-3xl font-medium" style={{ color: "var(--ink)" }}>
              {tr("Preguntes freqüents", "Preguntas frecuentes")}
            </h2>
            <div className="flex flex-col">
              {[
                {
                  q: tr("Quan s'activa el paywall?", "¿Cuándo se activa el paywall?"),
                  a: tr(
                    "Al novembre de 2026. Durant setembre i octubre, tot el contingut és gratuït. A partir de novembre, els informes recents (últims 6 mesos) requeriran subscripció Premium; els informes de més de 6 mesos continuaran sent gratuits per sempre.",
                    "En noviembre de 2026. Durante septiembre y octubre, todo el contenido es gratuito. A partir de noviembre, los informes recientes (últimos 6 meses) requerirán suscripción Premium; los informes de más de 6 meses seguirán siendo gratis para siempre."
                  ),
                },
                {
                  q: tr("Què passa amb els 50 primers subscriptors?", "¿Qué pasa con los primeros 50 suscriptores?"),
                  a: tr(
                    "Conserven el preu early bird: 290€/any (24,17€/mes) en lloc dels 440€ habituals, amb pagament anual. Un cop assignades les 50 places, el preu torna a 440€/any.",
                    "Conservan el precio early bird: 290€/año (24,17€/mes) en lugar de los 440€ habituales, con pago anual. Una vez asignadas las 50 plazas, el precio vuelve a 440€/año."
                  ),
                },
                {
                  q: tr("Hi ha permanència?", "¿Hay permanencia?"),
                  a: tr(
                    "Cap. Cancel·les quan vulguis. L'early bird (290€/any) requereix pagament anual; el pla estàndard també es pot contractar mensualment (39€/mes) sense cap compromís de durada.",
                    "Ninguna. Cancelas cuando quieras. El early bird (290€/año) requiere pago anual; el plan estándar también se puede contratar mensualmente (39€/mes) sin ningún compromiso de duración."
                  ),
                },
                {
                  q: tr("Puc provar-ho abans de pagar?", "¿Puedo probarlo antes de pagar?"),
                  a: tr(
                    "Sí. Setembre i octubre de 2026 són gratuïts per a tothom, sense targeta. A partir de novembre tries el teu pla — o continues amb el pla Gratuït (informes de més de 6 mesos).",
                    "Sí. Septiembre y octubre de 2026 son gratuitos para todos, sin tarjeta. A partir de noviembre eliges tu plan — o sigues con el plan Gratis (informes de más de 6 meses)."
                  ),
                },
                {
                  q: tr("Quan estarà disponible Ultra?", "¿Cuándo estará disponible Ultra?"),
                  a: tr(
                    "Abril de 2027, 6 mesos després del llançament. Ho retràstem a propòsit: necessitem afinar els formats premium abans de vendre'ls.",
                    "Abril de 2027, 6 meses después del lanzamiento. Lo retrasamos a propósito: necesitamos afinar los formatos premium antes de venderlos."
                  ),
                },
              ].map((faq) => (
                <div key={faq.q} className="border-b py-5" style={{ borderColor: "var(--rule)" }}>
                  <h3 className="mb-2 font-serif text-lg font-medium" style={{ color: "var(--ink)" }}>{faq.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ CTA FINAL ══════════ */}
        <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center">
            <h2 className="font-serif text-4xl font-medium leading-snug tracking-[-0.015em]" style={{ color: "var(--bg)" }}>
              {tr("Comencem sent gratis.", "Empezamos siendo gratis.")}<br />
              <span className="hl">{tr("Decideix després.", "Decide después.")}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.97rem]" style={{ color: "rgba(242,245,241,.72)" }}>
              {tr("Registra't ara i gaudeix de tot el contingut durant setembre i octubre. Sense targeta, sense compromís.",
                  "Regístrate ahora y disfruta de todo el contenido durante septiembre y octubre. Sin tarjeta, sin compromiso.")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => openAuth("register")} className="btn-v1 btn-v1-solid">
                {tr("Crear compte gratuït", "Crear cuenta gratis")}
              </button>
              <a
                href="/pagament"
                className="btn-v1 transition-colors"
                style={{ color: "var(--bg)", border: "1px solid rgba(242,245,241,.35)", background: "transparent" }}
              >
                {tr("Reservar plaça early bird", "Reservar plaza early bird")}
              </a>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(242,245,241,.55)" }}>
              <b className="font-semibold" style={{ color: "var(--highlight)" }}>
                {tr("SETEMBRE I OCTUBRE 2026", "SEPTIEMBRE Y OCTUBRE DE 2026")}
              </b>
              {" · "}
              {tr("TOT GRATUÏT · SENSE TARGETA", "TODO GRATIS · SIN TARJETA")}
            </p>
          </div>
        </section>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </div>
  );
}
