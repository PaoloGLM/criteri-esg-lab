"use client";

import { useLanguage } from "@/components/language-provider";

const COLS = [
  {
    titol: { ca: "Producte", es: "Producto" },
    links: [
      { href: "/informes", ca: "Informes", es: "Informes" },
      { href: "/estandares-esg", ca: "Estàndards", es: "Estándares" },
      { href: "/preus", ca: "Preus", es: "Precios" },
    ],
  },
  {
    titol: { ca: "Projecte", es: "Proyecto" },
    links: [
      { href: "/qui-som", ca: "Qui som", es: "Quiénes somos" },
      { href: "/que-fem", ca: "Què fem", es: "Qué hacemos" },
      { href: "/mas-alla-del-checkbox", ca: "Més enllà del Checkbox", es: "Más allá del checkbox" },
      { href: "/faq", ca: "FAQ", es: "FAQ" },
    ],
  },
  {
    titol: { ca: "Legal", es: "Legal" },
    links: [
      { href: "/legal/privacitat", ca: "Privacitat", es: "Privacidad" },
      { href: "/legal/avis-legal", ca: "Avís legal", es: "Aviso legal" },
      { href: "/legal/cookies", ca: "Cookies", es: "Cookies" },
    ],
  },
];

export function FooterV1() {
  const { lang } = useLanguage();

  return (
    <footer style={{ background: "var(--ink)" }} className="text-[rgba(242,245,241,.75)]">
      <div className="mx-auto max-w-[1160px] px-6 pb-[34px] pt-16">
        <div className="mb-[52px] grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="font-serif text-[1.25rem] font-semibold text-[var(--bg)]">
              Criteri <em className="font-normal italic text-[var(--verd-clar)]">ESG</em>
            </span>
            <p className="mt-3 max-w-[30ch] text-[.88rem] leading-relaxed text-[rgba(242,245,241,.6)]">
              {lang === "ca"
                ? "Intel·ligència regulatòria ESG destil·lada amb criteri humà."
                : "Inteligencia regulatoria ESG destilada con criterio humano."}
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.titol.ca}>
              <h4 className="mb-4 font-mono text-[.68rem] font-semibold uppercase tracking-[.16em] text-[var(--verd-clar)]">
                {lang === "ca" ? col.titol.ca : col.titol.es}
              </h4>
              <ul className="space-y-[9px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-[.9rem] text-[rgba(242,245,241,.75)] transition-colors hover:text-[var(--highlight)]">
                      {lang === "ca" ? l.ca : l.es}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(242,245,241,.14)] pt-6 font-mono text-[.68rem] tracking-[.06em] text-[rgba(242,245,241,.5)]">
          <span>© 2026 CRITERI ESG</span>
          <span>RIGOR · FRESCOR · SOBRIETAT</span>
        </div>
      </div>
    </footer>
  );
}
