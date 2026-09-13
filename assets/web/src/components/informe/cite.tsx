import { type ReactNode } from "react";

/**
 * Citació de pàgina amb tooltip (estil NotebookLM).
 *
 * Superíndol discret «p.53»; en passar-hi el cursor (o focus táctil)
 * apareix una etiqueta fosca amb la font completa. CSS pur, sense JS.
 *
 * `page` pot ser: "53", "44-45", "68 ±1", "no verificada"…
 * `state`: "ok" (verificada al PDF), "rang" (localitzada en 2-3 pàg.),
 *          undefined (citació sense verificar encara).
 */
export function Cite({
  page,
  title,
  state,
}: {
  page: string;
  title?: string;
  state?: "ok" | "rang";
}) {
  const tip = [
    title || null,
    `p. ${page}`,
    state === "ok" ? "✓ verificada al document" : state === "rang" ? "⚠ localitzada en 2-3 pàg. (rang aproximat)" : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <span className="group relative inline-block align-super">
      <button
        type="button"
        aria-label={tip}
        className="font-mono text-[9px] leading-none font-semibold px-0.5 cursor-pointer"
        style={{ color: "var(--c-salvia)" }}
      >
        <span style={{ fontSize: 8, color: "#93A698" }}>p.</span>
        {page}
      </button>
      <span
        className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 w-max max-w-[240px] -translate-x-1/2 translate-y-1 rounded-md px-3 py-2 font-mono text-[10px] leading-[1.5] tracking-[0.02em] opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        style={{ background: "var(--c-fosc)", color: "var(--c-clar)" }}
      >
        {tip}
      </span>
    </span>
  );
}

/**
 * Converteix citacions inline «(p. 53)» / «(pàg. 44-45)» / «(pág. 42)»
 * presents al text del redactat en <Cite> amb tooltip. La resta del text
 * es conserva tal qual. Ús: blocs 3 i 4 (i qualsevol altre paràgraf).
 */
const CITE_RE = /\((?:p\.|pàg\.|pág\.)\s*([\d][\d,\s\-–\.]*[\d])\)\s*/gi;

export function renderWithCites(text: string, title?: string): ReactNode[] {
  if (!text) return [];
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  CITE_RE.lastIndex = 0;
  while ((m = CITE_RE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<Cite key={`c${key++}`} page={m[1].trim().replace(/\s+/g, " ")} title={title} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out.length ? out : [text];
}
