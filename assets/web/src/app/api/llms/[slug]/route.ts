import { NextResponse } from "next/server";
import { reports } from "@/lib/reports";
import { getReportContent } from "@/lib/reports-content";

/**
 * Endpoint markdown net per a answer engines (ChatGPT, Perplexity, Claude, Gemini).
 *
 * Els LLM citen molt més fàcilment text planer que HTML pesat. Aquesta ruta
 * serveix el contingut complet d'un informe en markdown sense cap embolcall
 * de UI, a la URL neta /informes/[slug].md (rewrite des de src/proxy.ts).
 *
 * Idioma: català per defecte (?lang=es per a castellà).
 * Només contingut publicat: si el slug no té contingut destil·lat → 404.
 */

export const dynamic = "force-static";
export const revalidate = 3600;

function buildMarkdown(slug: string, lang: "ca" | "es"): string | null {
  const meta = reports.find((r) => r.slug === slug);
  if (!meta) return null;
  const c = getReportContent(slug, lang);
  if (!c) return null;

  const canonical = `https://criteriesg.com/informes/${slug}`;
  const L: string[] = [];

  L.push(`# ${meta.title}`);
  L.push("");
  L.push(`> Destil·lat per Criteri ESG · ${canonical}`);
  L.push("");
  L.push(`- **Institució**: ${meta.institution}`);
  L.push(`- **Data**: ${meta.date}`);
  L.push(`- **Pàgines de l'original**: ${meta.pages}`);
  L.push(`- **Àmbit**: ${meta.scope}`);
  L.push(`- **Original**: ${meta.url}`);
  if (meta.tags.length) L.push(`- **Temes**: ${meta.tags.join(", ")}`);
  L.push("");

  L.push(`## Semàfor metodològic: ${c.semafor.grade} (${c.semafor.gradeLabel})`);
  L.push("");
  for (const i of c.semafor.indicators) {
    L.push(`- **${i.name}**: ${i.status.toUpperCase()} — ${i.label}${i.note ? ` (${i.note})` : ""}`);
  }
  L.push("");

  L.push("## 5 dades clau");
  L.push("");
  for (const d of c.dadesClau) {
    L.push(`- **${d.value}** — ${d.label}${d.page ? ` (p. ${d.page})` : ""}`);
  }
  L.push("");

  L.push("## Resum executiu");
  L.push("");
  L.push(c.resumExecutiu);
  L.push("");

  L.push("## Implicacions");
  L.push("");
  L.push(`### Per a les empreses`);
  L.push(c.implicacions.empreses);
  L.push("");
  L.push(`### Per als reguladors`);
  L.push(c.implicacions.reguladors);
  L.push("");
  L.push(`### Per a la ciutadania`);
  L.push(c.implicacions.ciutadans);
  L.push("");

  L.push(`## Més enllà del Checkbox: ${c.mesEnllaCheckbox.criteri}`);
  L.push("");
  L.push(c.mesEnllaCheckbox.body);
  L.push("");

  if (c.connexions.length) {
    L.push("## Connexions amb altres informes");
    L.push("");
    for (const x of c.connexions) L.push(`- **${x.type}** → ${x.target}: ${x.desc}`);
    L.push("");
  }

  if (c.accions.length) {
    L.push("## Accions recomanades");
    L.push("");
    for (const a of c.accions) {
      L.push(`### ${a.num}. ${a.title}`);
      L.push(a.desc);
      L.push(`*Esforç: ${a.effort} · Impacte: ${a.impact}*`);
      L.push("");
    }
  }

  if (c.crossRefs.length) {
    L.push("## Cross-reference amb estàndards");
    L.push("");
    for (const x of c.crossRefs) L.push(`- **${x.framework}** ${x.criterion}: ${x.impact}`);
    L.push("");
  }

  L.push("---");
  L.push(
    `Criteri ESG destil·la informes institucionals ESG en resums de 5 minuts amb traçabilitat de pàgina exacta. Més informes: https://criteriesg.com/informes — Contacte: info@criteriesg.com`
  );
  return L.join("\n");
}

export async function generateStaticParams() {
  return reports.map((r) => ({ slug: r.slug }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "es" ? "es" : "ca";

  const md = buildMarkdown(slug, lang);
  if (!md) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(md, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "all",
    },
  });
}
