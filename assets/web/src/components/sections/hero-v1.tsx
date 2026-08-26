"use client";
import { useLanguage } from "@/components/language-provider";
import { Reveal } from "./reveal";

function HeroChart() {
  const t = {
    cap1: ["PÀGINES PUBLICADES ↑", "PÁGINAS PUBLICADAS ↑"],
    cap2: ["EL TEU TEMPS →", "TU TIEMPO →"],
    anys: ["2022", "2023", "2024", "2025", "2026"],
    fig: [
      "Il·lustratiu. El volum de publicació regulatòria creix cada curs fiscal; les hores disponibles del teu equip, no.",
      "Ilustrativo. El volumen de publicación regulatoria crece cada curso fiscal; las horas disponibles de tu equipo, no.",
    ],
  };
  return (
    <figure className="herochart" aria-label="Gràfic: el volum de publicacions regulatòries creix mentre el temps disponible es manté igual">
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
        <g fontFamily="var(--font-mono)" fontSize="11" fill="#4A5F53">
          {t.anys.map((a, i) => (
            <text key={a} x={96 + i * 82} y="300" textAnchor="middle">{a}</text>
          ))}
        </g>
        <g fontFamily="var(--font-mono)" fontSize="10.5">
          <rect x="330" y="26" width="168" height="22" rx="4" fill="#F5E381" />
          <text x="338" y="41" fill="#26312B" fontWeight="600">{t.cap1[0]}</text>
          <text x="60" y="186" fill="#A0522D" fontWeight="600">{t.cap2[0]}</text>
        </g>
      </svg>
      <figcaption className="mt-2.5 font-mono text-[.68rem] leading-relaxed tracking-[.05em] text-[var(--ink-soft)]">
        {t.fig[0].split(";")[0]};
        <b className="font-semibold text-[var(--ink)]">{t.fig[0].split(";")[1]}</b>
      </figcaption>
    </figure>
  );
}

export function HeroV1() {
  const { lang } = useLanguage();
  const ca = lang === "ca";

  return (
    <section id="hero" style={{ background: "var(--bg)" }} className="border-b border-[rgba(38,49,43,.09)] pt-[88px]">
      <div className="mx-auto grid max-w-[1160px] items-end gap-14 px-7 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="eyebrow">{ca ? "Intel·ligència regulatòria ESG" : "Inteligencia regulatoria ESG"}</p>
          <h1 className="mb-[26px] font-serif font-medium leading-[1.08] tracking-[-.012em] text-[var(--ink-deep)] text-[clamp(2.5rem,4.6vw,3.9rem)] [text-wrap:balance]">
            {ca ? (
              <>El context ESG sencer,
              <br />
              destil·lat en <span className="hl">cinc minuts</span>.</>
            ) : (
              <>Todo el contexto ESG,
              <br />
              destilado en <span className="hl">cinco minutos</span>.</>
            )}
          </h1>
          <p className="mb-9 max-w-[46ch] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)] [text-wrap:pretty]">
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
          </p>
          <div className="mb-[70px] flex flex-wrap gap-3.5">
            <a href="/registro" className="btn-v1 btn-v1-solid">{ca ? "Registra't gratis" : "Regístrate gratis"}</a>
            <a href="/que-fem" className="btn-v1 btn-v1-ghost">{ca ? "Com funciona el mètode" : "Cómo funciona el método"}</a>
          </div>
        </div>
        <Reveal>
          <HeroChart />
        </Reveal>
      </div>

      {/* Franja de dades */}
      <div className="statband">
        <div className="statband-inner mx-auto max-w-[1160px] px-7">
          <div className="stat"><div className="n">16</div><div className="t">{ca ? "Estàndards en creuament" : "Estándares en cruce"}</div></div>
          <div className="stat"><div className="n">8</div><div className="t">{ca ? "Blocs per informe" : "Bloques por informe"}</div></div>
          <div className="stat"><div className="n">5<small>&nbsp;min</small></div><div className="t">{ca ? "De lectura, com a màxim" : "De lectura, como máximo"}</div></div>
          <div className="stat"><div className="n"><small>p.&nbsp;</small>N</div><div className="t">{ca ? "Pàgina exacta a cada dada" : "Página exacta en cada dato"}</div></div>
        </div>
      </div>
    </section>
  );
}
