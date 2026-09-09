"use client";
import { useLanguage } from "@/components/language-provider";
import { Reveal } from "./reveal";
import { EditableText } from "@/components/cms/editable-texts";
import { EditableFigure } from "@/components/cms/figure-styles";

function HeroChart() {
  const { lang } = useLanguage();
  const ca = lang === "ca";
  const t = {
    cap1: ["PÀGINES PUBLICADES ↑", "PÁGINAS PUBLICADAS ↑"],
    cap2: ["EL TEU TEMPS →", "TU TIEMPO →"],
    anys: ["2022", "2023", "2024", "2025", "2026"],
    fites: [
      ["CSRD aprovada", "Ley CSRD"],
      ["ESRS Set 1", "ESRS Set 1"],
      ["1a onada", "1.ª ola"],
      ["Omnibus", "Omnibus"],
      ["ESRS revisats −61%", "ESRS revisados −61%"],
    ],
    fig: [
      "Il·lustratiu: les fites són reals i datades; les alçades mostren la tendència del volum regulatòri, no una sèrie estadística.",
      "Ilustrativo: los hitos son reales y fechados; las alturas muestran la tendencia del volumen regulatorio, no una serie estadística.",
    ],
  };
  return (
    <figure className="herochart" aria-label="Gràfic: el volum de publicacions regulatòries creix mentre el temps disponible es manté igual">
      <EditableFigure id="hero.chart">
        <svg viewBox="0 0 520 340" role="img" className="w-full">
        <g stroke="#26312B" strokeOpacity=".07">
          <line x1="46" y1="60" x2="500" y2="60" /><line x1="46" y1="120" x2="500" y2="120" />
          <line x1="46" y1="180" x2="500" y2="180" /><line x1="46" y1="240" x2="500" y2="240" />
        </g>
        <g fill="#5E8772">
          <rect x="70" y="212" width="52" height="68" rx="3" />
          <rect x="152" y="188" width="52" height="92" rx="3" />
          <rect x="234" y="150" width="52" height="130" rx="3" />
          <rect x="316" y="104" width="52" height="176" rx="3" />
          <rect x="398" y="52" width="52" height="228" rx="3" fill="#26312B" />
        </g>
        <line x1="60" y1="196" x2="480" y2="196" stroke="#A0522D" strokeWidth="2" strokeDasharray="6 5" />
        <circle cx="480" cy="196" r="4" fill="#A0522D" />
        <g fontFamily="var(--font-mono)" fontSize="13" fill="#4A5F53">
          {t.anys.map((a, i) => (
            <text key={a} x={96 + i * 82} y="300" textAnchor="middle">{a}</text>
          ))}
        </g>
        <g fontFamily="var(--font-mono)" fontSize="12">
          <rect x="330" y="26" width="168" height="22" rx="4" fill="#F5E381" />
          <text x="338" y="41" fill="#26312B" fontWeight="600">{t.cap1[ca ? 0 : 1]}</text>
          <text x="60" y="186" fill="#A0522D" fontWeight="600">{t.cap2[ca ? 0 : 1]}</text>
        </g>
        <g fontFamily="var(--font-mono)" fontSize="10" fill="#7A8B7F" textAnchor="middle">
          {t.fites.map((f, i) => {
            const label = f[ca ? 0 : 1];
            const cut = label.length > 15 ? label.indexOf(" ", 8) : -1;
            const lines = cut > 0 ? [label.slice(0, cut), label.slice(cut + 1)] : [label];
            return (
              <text key={label} x={96 + i * 82} y="316">
                {lines.map((ln, j) => (
                  <tspan key={ln} x={96 + i * 82} dy={j === 0 ? 0 : 12}>{ln}</tspan>
                ))}
              </text>
            );
          })}
        </g>
        </svg>
      </EditableFigure>
      <EditableText id="hero.fig" as="figcaption" styleEl="eyebrow" className="mt-2.5 font-mono text-[.68rem] leading-relaxed tracking-[.05em] text-[var(--ink-soft)]">
        <b className="font-semibold text-[var(--ink)]">{t.fig[ca ? 0 : 1].split(":")[0]}:</b>
        {t.fig[ca ? 0 : 1].slice(t.fig[ca ? 0 : 1].indexOf(":") + 1)}
      </EditableText>
    </figure>
  );
}

export function HeroV1() {
  const { lang } = useLanguage();
  const ca = lang === "ca";

  return (
    <section id="hero" style={{ background: "var(--bg)" }} className="border-b border-[rgba(38,49,43,.09)] pt-[88px]">
      <div className="mx-auto grid max-w-[1160px] items-center gap-14 px-7 lg:grid-cols-[.95fr_1.05fr]">
        <div>
          <EditableText id="hero.eyebrow" as="p" className="eyebrow">{ca ? "Intel·ligència regulatòria ESG" : "Inteligencia regulatoria ESG"}</EditableText>
          <EditableText
            id="hero.title"
            as="h1"
            className="mb-[26px] font-serif font-medium leading-[1.08] tracking-[-.012em] text-[var(--ink-deep)] text-[clamp(2.75rem,5vw,4.2rem)] [text-wrap:balance]"
          >
            {ca ? (
              <>El context ESG sencer,
              <br />
              destil·lat en <span className="hl">cinc minuts</span>.</>
            ) : (
              <>Todo el contexto ESG,
              <br />
              destilado en <span className="hl">cinco minutos</span>.</>
            )}
          </EditableText>
          <EditableText
            id="hero.body"
            as="p"
            className="mb-9 max-w-[46ch] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)] [text-wrap:pretty]"
          >
            {ca ? (
              <>
                Cada mes, bancs centrals, reguladors i organismes internacionals publiquen
                <strong className="font-medium text-[var(--ink)]"> milers de pàgines</strong> que acabaran afectant la teva
                empresa. Nosaltres les llegim totes, les contrastem i et fem arribar el que cal decidir-ne:
                <strong className="font-medium text-[var(--ink)]"> clar, breu i amb la pàgina exacta de la font</strong>.
              </>
            ) : (
              <>
                Cada mes, bancos centrales, reguladores y organismos internacionales publican
                <strong className="font-medium text-[var(--ink)]"> miles de páginas</strong> que acabarán afectando a tu empresa.
                Nosotros las leemos todas, las contrastamos y te hacemos llegar lo que hay que decidir:
                <strong className="font-medium text-[var(--ink)]"> claro, breve y con la página exacta de la fuente</strong>.
              </>
            )}
          </EditableText>
          <div className="mb-[26px] flex flex-wrap gap-3.5">
            <EditableText id="hero.cta.registro" as="a" href="/registro" styleEl="button" className="btn-v1 btn-v1-solid">{ca ? "Registra't gratis" : "Regístrate gratis"}</EditableText>
            <EditableText id="hero.cta.metode" as="a" href="/que-fem" styleEl="button" className="btn-v1 btn-v1-ghost">{ca ? "Com funciona el mètode" : "Cómo funciona el método"}</EditableText>
          </div>
        </div>
        <Reveal className="mb-12">
          <HeroChart />
        </Reveal>
      </div>

      {/* Franja de dades */}
      <div className="statband">
        <div className="statband-inner mx-auto max-w-[1160px] px-7">
          <div className="stat">
            <EditableText id="hero.stat.1.n" as="div" styleEl="h2" className="n">16</EditableText>
            <EditableText id="hero.stat.1.t" as="div" styleEl="eyebrow" className="t">{ca ? "Estàndards en creuament" : "Estándares en cruce"}</EditableText>
          </div>
          <div className="stat">
            <EditableText id="hero.stat.2.n" as="div" styleEl="h2" className="n">8</EditableText>
            <EditableText id="hero.stat.2.t" as="div" styleEl="eyebrow" className="t">{ca ? "Blocs per informe" : "Bloques por informe"}</EditableText>
          </div>
          <div className="stat">
            <EditableText id="hero.stat.3.n" as="div" styleEl="h2" className="n">5<small>&nbsp;min</small></EditableText>
            <EditableText id="hero.stat.3.t" as="div" styleEl="eyebrow" className="t">{ca ? "De lectura, com a màxim" : "De lectura, como máximo"}</EditableText>
          </div>
          <div className="stat">
            <EditableText id="hero.stat.4.n" as="div" styleEl="h2" className="n"><small>p.&nbsp;</small>N</EditableText>
            <EditableText id="hero.stat.4.t" as="div" styleEl="eyebrow" className="t">{ca ? "Pàgina exacta a cada dada" : "Página exacta en cada dato"}</EditableText>
          </div>
        </div>
      </div>
    </section>
  );
}
