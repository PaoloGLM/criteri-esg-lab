"use client";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "./reveal";

/**
 * Statement inicial fullscreen — com la web original:
 * "No és la informació. És el criteri." ocupant tota la pantalla,
 * bilingüe, amb scroll suau cap al hero.
 */
export function Statement() {
  const { lang } = useLanguage();
  const ca = lang === "ca";

  return (
    <section
      className="relative flex min-h-[92vh] flex-col items-center justify-center px-7 text-center"
      style={{ background: "var(--ink-deep)", color: "var(--bg)" }}
    >
      <p
        className="font-serif font-medium italic leading-[1.15] text-[clamp(2.6rem,6.5vw,5.8rem)] tracking-[-.015em] [text-wrap:balance]"
        style={{ color: "var(--verd-clar)" }}
      >
        {ca ? (
          <>
            No és la informació.
            <br />
            <span style={{ color: "var(--bg)" }}>És el criteri.</span>
          </>
        ) : (
          <>
            No es la información.
            <br />
            <span style={{ color: "var(--bg)" }}>Es el criterio.</span>
          </>
        )}
      </p>

      <p className="mt-10 max-w-[52ch] text-[1.05rem] leading-[1.7] text-[rgba(242,245,241,.65)] [text-wrap:pretty]">
        {ca
          ? "Cada mes, bancs centrals i reguladors publiquen milers de pàgines que afectaran la teva empresa. Nosaltres les llegim, les contrastem i et retornem el que cal decidir-ne en cinc minuts."
          : "Cada mes, bancos centrales y reguladores publican miles de páginas que afectarán a tu empresa. Nosotros las leemos, las contrastamos y te devolvemos lo que hay que decidir en cinco minutos."}
      </p>

      {/* indicador de scroll */}
      <a
        href="#hero"
        aria-label={ca ? "Baixa al contingut" : "Baja al contenido"}
        className="absolute bottom-12 flex flex-col items-center gap-3 font-mono text-[.66rem] uppercase tracking-[.24em] text-[rgba(170,201,182,.55)] transition-colors hover:text-[var(--highlight)]"
      >
        {ca ? "Continua" : "Continúa"}
        <svg width="18" height="30" viewBox="0 0 18 30" fill="none" aria-hidden="true" className="animate-bounce">
          <path d="M9 1v26M2 20l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
