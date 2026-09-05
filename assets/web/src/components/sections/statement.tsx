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
      className="relative flex min-h-[92vh] flex-col items-center justify-center px-7 pb-28 text-center"
      style={{ background: "var(--ink-deep)", color: "var(--bg)" }}
    >
      <p
        className="mt-16 font-serif font-medium italic leading-[1.18] text-[clamp(3rem,8vw,7rem)] tracking-[-.015em] [text-wrap:balance]"
        style={{ color: "var(--verd-clar)" }}
      >
        {ca ? (
          <>
            No és la informació.
            <br />
            És el <span style={{ color: "var(--highlight)" }}>criteri.</span>
          </>
        ) : (
          <>
            No es la información.
            <br />
            Es el <span style={{ color: "var(--highlight)" }}>criterio.</span>
          </>
        )}
      </p>

      <p
        className="mx-auto mt-8 text-center text-[1.05rem] leading-[1.75] text-[rgba(242,245,241,.65)]"
        style={{ maxWidth: "58ch" }}
      >
        {ca
          ? "Cada mes, bancs centrals i reguladors publiquen milers de pàgines que afectaran la teva empresa. Les llegim, les contrastem i et retornem el que cal decidir-ne en 5 minuts."
          : "Cada mes, bancos centrales y reguladores publican miles de páginas que afectan a tu empresa. Las leemos, las contrastamos y te devolvemos lo que hay que decidir en 5 minutos."}
      </p>

      {/* indicador de scroll */}
      <a
        href="#hero"
        aria-label={ca ? "Baixa al contingut" : "Baja al contenido"}
        className="absolute bottom-20 flex flex-col items-center gap-3 font-mono text-[.66rem] uppercase tracking-[.24em] transition-colors hover:opacity-80"
        style={{ color: "var(--highlight)" }}
      >
        {ca ? "Continua" : "Continúa"}
        <svg width="18" height="30" viewBox="0 0 18 30" fill="none" aria-hidden="true" className="animate-bounce">
          <path d="M9 1v26M2 20l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
