"""
Pas 3 del flux: GLM actua com a crític + advocat del diable (en lloc de Gemini).

NOTA: Originalment aquest pas l'havia de fer Gemini, però la key no funciona
des d'Espanya ('User location is not supported'). Per tant, faig servir GLM
amb un system prompt molt diferent que l'obliga a actuar com a crític extern.

Per cada JSON a /data/informes/1-distilats/:
1. Llegeix el JSON (destil·lat del pas 2)
2. Llegeix el PDF original associat
3. Crida GLM amb rol de crític + advocat del diable
4. Guarda les propostes a /data/informes/2-aportacions-gemini/

Ús:
    scripts/.venv/bin/python scripts/03-gemini-revisa.py [slug]
"""
import sys
import os
import json
import subprocess
import tempfile
import time
from pathlib import Path

sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")

DATA_DIR = Path("/home/z/my-project/criteri-esg-lab/data/informes")
ORIGINALS_DIR = DATA_DIR / "0-originals"
DISTILATS_DIR = DATA_DIR / "1-distilats"
APORTACIONS_DIR = DATA_DIR / "2-aportacions-gemini"
APORTACIONS_DIR.mkdir(parents=True, exist_ok=True)

NODE_SCRIPT = r"""
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');

async function main() {
  const inputPath = process.argv[2];
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  const systemPrompt = [
    "Ets un crític ESG extern independent. NO ets l'autor de l'informe — ets un revisor rigorós.",
    "Rep un destil·lat d'un informe institucional ESG (fet per un altre agent) i l'informe original.",
    "",
    "La teva feina té DUES parts:",
    "",
    "A) PROPOSTES DE VALOR: per a cadascun dels 8 apartats del destil·lat,",
    "   proposa afegir o modificar contingut per millorar-lo. Sigues concret:",
    '   "Al bloc 2, la dada 61% hauria d\'anar acompanyada del context 1.144 datapoints".',
    "   Identifica dades importants de l'original que NO surten al destil·lat.",
    "",
    "B) ADVOCAT DEL DIABLE: identifica contradiccions, mancances metodològiques,",
    "   fonts no verificades, possible greenwashing, i criteris ètics oblidats",
    "   (dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió, arrelament).",
    "   Pregunta: què NO diu aquest informe que hauria de dir?",
    "",
    "Torna un objecte JSON vàlid amb aquesta estructura exacta:",
    "{",
    '  "propostes": [',
    '    {"bloc": "0-semafor|2-dadesClau|3-resum|4-implicacions|4b-mesEnlla|5-connexions|6-accions|7-crossRefs",',
    '     "tipus": "afegir|modificar|eliminar",',
    '     "proposta": "text concret del canvi",',
    '     "justificacio": "per què és important"}',
    "  ],",
    '  "advocat_diable": [',
    '    {"tipus": "contradiccio|mancanca|greenwashing|criteri_oblidat|font_no_verificada",',
    '     "bloc_afectat": "string",',
    '     "observacio": "text concret",',
    '     "evidencia_original": "cita literal de l\'original si n\'hi ha"}',
    "  ]",
    "}",
    "",
    "Sigues crític i específic. No aportis genèriques. Mínim 5 propostes i 3 observacions d'advocat del diable."
  ].join("\n");

  const userPrompt = [
    "Analitza el destil·lat següent i compara'l amb l'informe original.",
    "",
    "TÍTOL: " + input.title,
    "INSTITUCIÓ: " + input.institution,
    "",
    "=== DESTIL·LAT (fet per GLM) ===",
    input.destilat,
    "=== FI ===",
    "",
    "=== INFORME ORIGINAL (extracte) ===",
    input.original,
    "=== FI ===",
    "",
    "Genera el JSON crític ara."
  ].join("\n");

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
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

    if (!parsed.propostes && !parsed.advocat_diable) {
      throw new Error('JSON incomplet');
    }

    process.stdout.write(JSON.stringify({ aportacions: parsed }));
  } catch (e) {
    process.stderr.write('Error: ' + e.message);
    process.exit(1);
  }
}

main();
"""


def find_original_pdf(slug: str, distilat_data: dict) -> Path | None:
    """Troba el PDF original associat a un destil·lat."""
    # Per filename_original del JSON
    fname = distilat_data.get("filename_original")
    if fname:
        path = ORIGINALS_DIR / fname
        if path.exists():
            return path
    # Per slug
    for pdf in ORIGINALS_DIR.glob("*.pdf"):
        if slug in pdf.stem:
            return pdf
    return None


def extract_text_from_pdf(pdf_path: Path, max_chars: int = 15000) -> str:
    """Extreu text d'un PDF."""
    import pdfplumber
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n\n"
            if len(text) > max_chars:
                break
    return text[:max_chars]


def call_glm_critic(title: str, institution: str, destilat: str, original: str) -> dict:
    """Crida GLM amb rol de crític."""
    payload = {
        "title": title,
        "institution": institution,
        "destilat": destilat,
        "original": original,
    }

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
        return data["aportacions"]
    finally:
        try:
            os.unlink(payload_path)
            os.unlink(script_path)
        except:
            pass


def process_one(distilat_path: Path) -> bool:
    """Processa un destil·lat."""
    slug = distilat_path.stem
    output_path = APORTACIONS_DIR / f"{slug}.json"

    if output_path.exists():
        print(f"  ✓ Ja revisat: {slug}")
        return True

    print(f"\n=== Revisant: {slug} ===")
    distilat_data = json.loads(distilat_path.read_text(encoding="utf-8"))

    # Trobar PDF original
    pdf_path = find_original_pdf(slug, distilat_data)
    if not pdf_path:
        print(f"  ✗ No s'ha trobat el PDF original per {slug}")
        return False

    print(f"  → Extraient text de {pdf_path.name}...")
    original_text = extract_text_from_pdf(pdf_path)
    print(f"  ✓ Text original: {len(original_text)} chars")

    # Destil·lat com a string JSON
    destilat_str = json.dumps({
        "content_ca": distilat_data.get("content_ca"),
    }, ensure_ascii=False, indent=2)[:15000]

    print(f"  → Cridant GLM (crític + advocat del diable)...")
    aportacions = call_glm_critic(
        distilat_data["title"],
        distilat_data["institution"],
        destilat_str,
        original_text,
    )

    # Guardar
    output = {
        "slug": slug,
        "title": distilat_data["title"],
        "institution": distilat_data["institution"],
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "aportacions": aportacions,
    }
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  ✓ Guardat a {output_path}")
    print(f"    - Propostes: {len(aportacions.get('propostes', []))}")
    print(f"    - Advocat del diable: {len(aportacions.get('advocat_diable', []))}")
    return True


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pas 3: Crític + Advocat del diable (GLM, no Gemini) ===\n")
    print(f"Destil·lats: {DISTILATS_DIR}")
    print(f"Destinació: {APORTACIONS_DIR}\n")

    distilats = sorted(DISTILATS_DIR.glob("*.json"))
    print(f"Destil·lats trobats: {len(distilats)}\n")

    if target:
        distilats = [d for d in distilats if target.lower() in d.stem.lower()]
        if not distilats:
            print(f"✗ No s'ha trobat cap destil·lat que coincideixi amb '{target}'")
            return
        print(f"Filtrat per '{target}': {len(distilats)} destil·lat(s)")

    ok = 0
    failed = 0
    for d in distilats:
        try:
            if process_one(d):
                ok += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ✗ Error: {e}")
            failed += 1

    print(f"\n=== Resum ===")
    print(f"  ✓ Revisats: {ok}")
    print(f"  ✗ Fallats: {failed}")


if __name__ == "__main__":
    main()
