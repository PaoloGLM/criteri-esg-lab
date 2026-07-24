"""
Crida GLM directament des de Python via subprocess Node.
"""
import json
import subprocess
import os
import tempfile
from pathlib import Path

NODE_SCRIPT = r"""
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');

async function main() {
  const inputPath = process.argv[2];
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  const langInstruction = input.lang === 'ca'
    ? "Escriu tot el contingut en català."
    : "Escribe todo el contenido en castellano.";

  const systemPrompt = [
    "Ets un analista ESG expert de Criteri ESG. Sintetitza informes institucionals ESG en 8 blocs accionables.",
    "",
    langInstruction,
    "",
    "Genera EXCLUSIVAMENT un objecte JSON vàlid amb aquesta estructura (sense markdown, sense text fora del JSON):",
    "",
    "{",
    '  "semafor": {',
    '    "grade": "A"|"B"|"C"|"D",',
    '    "gradeLabel": string,',
    '    "indicators": [',
    '      {"name": "Cobertura Scope 3", "status": "verd"|"groc"|"vermell", "label": string, "note": string},',
    '      {"name": "Termes temporals", "status": "verd"|"groc"|"vermell", "label": string, "note": string},',
    '      {"name": "Fonts independents", "status": "verd"|"groc"|"vermell", "label": string, "note": string},',
    '      {"name": "Granularitat", "status": "verd"|"groc"|"vermell", "label": string, "note": string},',
    '      {"name": "Verificació externa", "status": "verd"|"groc"|"vermell", "label": string, "note": string}',
    "    ]",
    "  },",
    '  "dadesClau": [{"value": string, "label": string, "page": string}],',
    '  "resumExecutiu": string,',
    '  "implicacions": {"empreses": string, "reguladors": string, "ciutadans": string},',
    '  "mesEnllaCheckbox": {"criteri": string, "body": string},',
    '  "connexions": [{"type": "Evolució"|"Complement"|"Contradicció", "target": string, "desc": string}],',
    '  "accions": [{"num": "01", "title": string, "desc": string, "effort": "Baix"|"Mitjà"|"Alt", "impact": "Baix"|"Mitjà"|"Alt"}],',
    '  "crossRefs": [{"framework": string, "criterion": string, "impact": string}]',
    "}",
    "",
    "Criteris del semàfor:",
    "- verd = Quantificat, groc = Esmentat, vermell = Ignorat",
    "- grade A = 5 verds, B = 4 verds + 1 groc, C = fins a 1 vermell, D = 2+ vermells",
    "",
    "Llargàries: resumExecutiu ~300 paraules, implicacions ~150 cadascun, mesEnllaCheckbox ~150, dadesClau 5, accions 4-5, connexions 2-3, crossRefs 2-3.",
    "",
    'Veu editorial: mediterrània, crítica amb el greenwashing. "Més enllà del Checkbox" usa 1-2 dels 5 criteris (dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió, arrelament) — MAI esmentar Economia del Bé Comú ni Economia Ciutadana públicament.'
  ].join("\n");

  const userPrompt = [
    "Analitza el següent informe i genera el ReportBlock JSON.",
    "",
    "TÍTOL: " + input.title,
    "INSTITUCIÓ: " + input.institution,
    "",
    "=== TEXT ===",
    input.source,
    "=== FI ===",
    "",
    "Genera el JSON ara."
  ].join("\n");

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content || '';
    let jsonStr = content.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (braceMatch) parsed = JSON.parse(braceMatch[0]);
      else throw new Error('JSON parse failed: ' + e.message);
    }

    if (!parsed.semafor || !parsed.dadesClau || !parsed.resumExecutiu) {
      throw new Error('JSON incomplet');
    }

    process.stdout.write(JSON.stringify({ report: parsed }));
  } catch (e) {
    process.stderr.write('Error: ' + e.message);
    process.exit(1);
  }
}

main();
"""


def call_glm_direct(title: str, institution: str, source: str, lang: str = "ca") -> dict:
    """Crida GLM directament via Node subprocess. No requereix server web."""
    payload = {"title": title, "institution": institution, "source": source, "lang": lang}

    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump(payload, f)
        payload_path = f.name

    with tempfile.NamedTemporaryFile(mode="w", suffix=".js", delete=False) as f:
        f.write(NODE_SCRIPT)
        script_path = f.name

    try:
        result = subprocess.run(
            ["node", script_path, payload_path],
            capture_output=True,
            text=True,
            timeout=600,
            cwd="/home/z/my-project",
            env={"PATH": "/usr/local/bin:/usr/bin:/bin", "NODE_PATH": "/home/z/my-project/node_modules"},
        )

        if result.returncode != 0:
            raise Exception(f"Node error: {result.stderr[:500]}")

        data = json.loads(result.stdout)
        return data["report"]
    finally:
        try:
            os.unlink(payload_path)
            os.unlink(script_path)
        except:
            pass


if __name__ == "__main__":
    print("=== Test GLM direct ===")
    report = call_glm_direct(
        "Test informe ESG",
        "Test institució",
        "Aquest és un text de prova amb 100 caràcters per validar el flux de generació d'informes Criteri ESG. " * 5,
        "ca",
    )
    print("✓ OK! Report generat:")
    print(f"  - Grade: {report['semafor']['grade']}")
    print(f"  - Dades clau: {len(report['dadesClau'])}")
    print(f"  - Accions: {len(report['accions'])}")
    print(f"  - Cross-refs: {len(report['crossRefs'])}")
