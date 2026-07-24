import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * POST /api/generate-report
 *
 * Genera un ReportBlock complet (8 blocs) a partir d'un text o URL d'un
 * informe ESG institucional. Fa servir l'LLM via z-ai-web-dev-sdk.
 *
 * Input JSON:
 *   - source: string (text complet o URL de l'informe)
 *   - title: string (títol de l'informe)
 *   - institution: string
 *   - lang: "ca" | "es" (idioma de sortida)
 *
 * Output JSON: ReportBlock (estructurat)
 */

interface GenerateRequest {
  source: string;
  title: string;
  institution: string;
  lang: "ca" | "es";
}

const MAX_INPUT_CHARS = 30000; // límit per l'LLM

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequest;
    const { source, title, institution, lang } = body;

    if (!source || source.trim().length < 100) {
      return NextResponse.json(
        { error: "Cal un text d'origen vàlid (mínim 100 caràcters)" },
        { status: 400 }
      );
    }

    const sourceTrimmed = source.slice(0, MAX_INPUT_CHARS);

    const langInstruction =
      lang === "ca"
        ? "Escriu tot el contingut en català."
        : "Escribe todo el contenido en castellano.";

    const systemPrompt = `Ets un analista ESG expert de Criteri ESG. El teu objectiu és sintetitzar informes institucionals ESG en 8 blocs accionables per a directors de sostenibilitat.

${langInstruction}

Has de generar EXCLUSIVAMENT un objecte JSON vàlid amb aquesta estructura exacta (sense markdown, sense comentaris, sense text fora del JSON):

{
  "semafor": {
    "grade": "A" | "B" | "C" | "D",
    "gradeLabel": string,
    "indicators": [
      {"name": "Cobertura Scope 3", "status": "verd"|"groc"|"vermell", "label": string, "note": string},
      {"name": "Termes temporals", "status": "verd"|"groc"|"vermell", "label": string, "note": string},
      {"name": "Fonts independents", "status": "verd"|"groc"|"vermell", "label": string, "note": string},
      {"name": "Granularitat", "status": "verd"|"groc"|"vermell", "label": string, "note": string},
      {"name": "Verificació externa", "status": "verd"|"groc"|"vermell", "label": string, "note": string}
    ]
  },
  "dadesClau": [
    {"value": string, "label": string, "page": string}
  ],
  "resumExecutiu": string,
  "implicacions": {
    "empreses": string,
    "reguladors": string,
    "ciutadans": string
  },
  "mesEnllaCheckbox": {
    "criteri": string,
    "body": string
  },
  "connexions": [
    {"type": "Evolució"|"Complement"|"Contradicció", "target": string, "desc": string}
  ],
  "accions": [
    {"num": "01", "title": string, "desc": string, "effort": "Baix"|"Mitjà"|"Alt", "impact": "Baix"|"Mitjà"|"Alt"}
  ],
  "crossRefs": [
    {"framework": string, "criterion": string, "impact": string}
  ]
}

Criteris del semàfor:
- verd = Quantificat (dades verificables, fonts independents)
- groc = Esmentat (present però sense profunditat)
- vermell = Ignorat (no tractat o superficial)
- grade A = 5 verds, B = 4 verds + 1 groc, C = barreja amb fins a 1 vermell, D = 2+ vermells

Llargàries:
- resumExecutiu: ~300 paraules
- implicacions (cada camp): ~150 paraules
- mesEnllaCheckbox.body: ~150 paraules
- dadesClau: 5 entrades amb dades concretes extretes de l'informe
- accions: 4-5 accions operatives
- connexions: 2-3 connexions
- crossRefs: 2-3 cross-references amb EcoVadis, B Corp, MSCI, GRI, ESRS, CSDDD, TCFD, TNFD, SFDR, EU Taxonomy

El to ha de ser professional, directe i operatiu. Sense genericidades. Sinó hi ha dades suficients per un bloc, inventa només el mínim imprescindible i manté coherència amb l'origen.`;

    const userPrompt = `Analitza el següent informe institucional i genera el ReportBlock JSON.

TÍTOL: ${title}
INSTITUCIÓ: ${institution}

=== TEXT DE L'INFORME ===
${sourceTrimmed}
=== FI ===

Genera el JSON ara.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      // thinking: { type: "disabled" },
    });

    const content = completion.choices[0]?.message?.content || "";

    // Extreu el JSON (pot venir dins de markdown ```json ... ```)
    let jsonStr = content.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Intenta parsejar
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      // Si falla, intenta extreure el primer { ... } de la resposta
      const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        try {
          parsed = JSON.parse(braceMatch[0]);
        } catch (e2) {
          console.error("[generate-report] JSON parse error:", e2);
          return NextResponse.json(
            { error: "L'LLM no ha retornat JSON vàlid", raw: content.slice(0, 500) },
            { status: 502 }
          );
        }
      } else {
        console.error("[generate-report] No JSON found");
        return NextResponse.json(
          { error: "L'LLM no ha retornat JSON", raw: content.slice(0, 500) },
          { status: 502 }
        );
      }
    }

    // Validació mínima
    if (!parsed.semafor || !parsed.dadesClau || !parsed.resumExecutiu) {
      return NextResponse.json(
        { error: "JSON generat incomplet", raw: content.slice(0, 500) },
        { status: 502 }
      );
    }

    return NextResponse.json({ report: parsed });
  } catch (e: any) {
    console.error("[generate-report] Error:", e);
    return NextResponse.json(
      { error: e?.message || "Error intern del servidor" },
      { status: 500 }
    );
  }
}
