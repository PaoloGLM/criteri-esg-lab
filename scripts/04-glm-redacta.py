"""
Pas 4 del flux: GLM redacta l'informe final integrant les aportacions de Gemini.

Per cada informe:
1. Llegeix el destil·lat (pas 2)
2. Llegeix les aportacions de Gemini (pas 3)
3. Crida GLM amb rol de redactor: decideix què és rellevant de Gemini i què no
4. Genera l'informe final en Markdown (CA + ES)
5. Guarda a /data/informes/3-fets/<slug>.md

Ús:
    scripts/.venv/bin/python scripts/04-glm-redacta.py [slug]
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
DISTILATS_DIR = DATA_DIR / "1-distilats"
APORTACIONS_DIR = DATA_DIR / "2-aportacions-gemini"
FETS_DIR = DATA_DIR / "3-fets"
FETS_DIR.mkdir(parents=True, exist_ok=True)

NODE_SCRIPT = r"""
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');

async function main() {
  const inputPath = process.argv[2];
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  const systemPrompt = [
    "Ets el redactor principal de Criteri ESG. La teva feina és redactar l'informe final.",
    "Tens dos inputs:",
    "  1. Un destil·lat inicial fet per GLM (pas 2)",
    "  2. Aportacions crítiques fetes per Gemini (pas 3): propostes + advocat del diable",
    "",
    "Per a cadascuna de les aportacions de Gemini, decideix:",
    "  - Si l'incorpores a l'informe final (i com)",
    "  - Si la descartes (i per què)",
    "",
    "Veu editorial Criteri ESG:",
    "- Mediterrània, crítica amb el greenwashing, propera a cooperatives i B Corps",
    '- "Més enllà del Checkbox": tria 1-2 dels 5 criteris ètics (dignitat, justícia distributiva,',
    "  sostenibilitat absoluta, co-decisió democràtica, arrelament territorial)",
    "- MAI esmentar Economia del Bé Comú ni Economia Ciutadana públicament",
    "- Longitud màxima: 1.100 paraules (permet '5 minuts per criteri clar')",
    "",
    "Format de sortida: Markdown amb aquesta estructura exacta:",
    "",
    "---",
    "slug: <slug>",
    "title: <títol>",
    "institution: <institució>",
    "date: <data>",
    "lang: ca",
    "---",
    "",
    "# <títol>",
    "",
    "## Bloc 0 — Semàfor Metodològic",
    "",
    "Nota global: <lletra A-D> · <etiqueta>",
    "",
    "- **Cobertura Scope 3**: <color> — <nota breu>",
    "- **Termes temporals**: <color> — <nota breu>",
    "- **Fonts independents**: <color> — <nota breu>",
    "- **Granularitat**: <color> — <nota breu>",
    "- **Verificació externa**: <color> — <nota breu>",
    "",
    "## Bloc 1 — Fitxa tècnica",
    "",
    "- Institució: ...",
    "- Data: ...",
    "- Tipus: ...",
    "- Pàgines: ...",
    "- Àmbit: ...",
    "- URL: ...",
    "",
    "## Bloc 2 — 5 dades clau",
    "",
    "1. **<valor>** — <context> (p. X)",
    "2. ...",
    "",
    "## Bloc 3 — Resum executiu",
    "",
    "<~300 paraules>",
    "",
    "## Bloc 4 — Implicacions",
    "",
    "### Empreses",
    "<~150 paraules>",
    "### Reguladors",
    "<~150 paraules>",
    "### Ciutadans",
    "<~150 paraules>",
    "",
    "### Més enllà del Checkbox",
    "Criteri: <criteri triat>",
    "<~150 paraules>",
    "",
    "## Bloc 5 — Connexions",
    "",
    "- **<tipus>** — <target>: <desc>",
    "",
    "## Bloc 6 — Accions recomanades",
    "",
    "01. **<títol>** — <desc>",
    "   - Esforç: <Baix/Mitjà/Alt> · Impacte: <Baix/Mitjà/Alt>",
    "",
    "## Bloc 7 — Cross-reference",
    "",
    "- **<framework>** — <criteri>: <impacte>",
    "",
    "---",
    "Processat amb assistència d'IA (GLM + Gemini) i pendent de validació per Paolo."
  ].join("\n");

  const userPrompt = [
    "Redacta l'informe final integrant el destil·lat i les aportacions crítiques.",
    "",
    "TÍTOL: " + input.title,
    "INSTITUCIÓ: " + input.institution,
    "",
    "=== DESTIL·LAT INICIAL ===",
    input.destilat,
    "=== FI ===",
    "",
    "=== APORTACIONS DE GEMINI ===",
    input.aportacions,
    "=== FI ===",
    "",
    "Idioma de sortida: " + input.lang + " (ca=català, es=castellà).",
    "",
    "Redacta el Markdown ara (amb el front-matter YAML al principi)."
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
    process.stdout.write(content);
  } catch (e) {
    process.stderr.write('Error: ' + e.message);
    process.exit(1);
  }
}

main();
"""


def call_glm_redactor(title: str, institution: str, destilat: str, aportacions: str, lang: str = "ca") -> str:
    """Crida GLM per redactar l'informe final. Retorna Markdown."""
    payload = {
        "title": title,
        "institution": institution,
        "destilat": destilat,
        "aportacions": aportacions,
        "lang": lang,
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

        return result.stdout
    finally:
        try:
            os.unlink(payload_path)
            os.unlink(script_path)
        except:
            pass


def process_one(slug: str) -> bool:
    """Processa un informe: destil·lat + aportacions → informe final."""
    distilat_path = DISTILATS_DIR / f"{slug}.json"
    aportacions_path = APORTACIONS_DIR / f"{slug}.json"

    if not distilat_path.exists():
        print(f"  ✗ No hi ha destil·lat per {slug}")
        return False
    if not aportacions_path.exists():
        print(f"  ✗ No hi ha aportacions per {slug} (falta pas 3)")
        return False

    output_ca = FETS_DIR / f"{slug}.ca.md"
    output_es = FETS_DIR / f"{slug}.es.md"

    if output_ca.exists() and output_es.exists():
        print(f"  ✓ Ja redactat: {slug}")
        return True

    print(f"\n=== Redactant: {slug} ===")
    distilat_data = json.loads(distilat_path.read_text(encoding="utf-8"))
    aportacions_data = json.loads(aportacions_path.read_text(encoding="utf-8"))

    # Destil·lat com a string JSON
    destilat_str = json.dumps({
        "content_ca": distilat_data.get("content_ca"),
        "content_es": distilat_data.get("content_es"),
    }, ensure_ascii=False, indent=2)[:10000]

    # Aportacions de Gemini
    aportacions_str = json.dumps(aportacions_data.get("aportacions"), ensure_ascii=False, indent=2)[:10000]

    # Redactar CA
    print(f"  → Redactant versió catalana...")
    md_ca = call_glm_redactor(
        distilat_data["title"],
        distilat_data["institution"],
        destilat_str,
        aportacions_str,
        "ca",
    )
    output_ca.write_text(md_ca, encoding="utf-8")
    print(f"  ✓ Guardat: {output_ca.name} ({len(md_ca)} chars)")

    time.sleep(2)

    # Redactar ES
    print(f"  → Redactant versió castellana...")
    md_es = call_glm_redactor(
        distilat_data["title"],
        distilat_data["institution"],
        destilat_str,
        aportacions_str,
        "es",
    )
    output_es.write_text(md_es, encoding="utf-8")
    print(f"  ✓ Guardat: {output_es.name} ({len(md_es)} chars)")

    return True


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pas 4: GLM redacta (integra aportacions de Gemini) ===\n")
    print(f"Destil·lats: {DISTILATS_DIR}")
    print(f"Aportacions: {APORTACIONS_DIR}")
    print(f"Destinació: {FETS_DIR}\n")

    # Llistar slugs amb ambdós fitxers
    distilats = {p.stem for p in DISTILATS_DIR.glob("*.json")}
    aportacions = {p.stem for p in APORTACIONS_DIR.glob("*.json")}
    slugs = sorted(distilats & aportacions)
    print(f"Informes amb destil·lat + aportacions: {len(slugs)}\n")

    if target:
        slugs = [s for s in slugs if target.lower() in s.lower()]
        if not slugs:
            print(f"✗ No s'ha trobat cap informe que coincideixi amb '{target}'")
            return
        print(f"Filtrat per '{target}': {len(slugs)} informe(s)")

    ok = 0
    failed = 0
    for slug in slugs:
        try:
            if process_one(slug):
                ok += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ✗ Error: {e}")
            failed += 1

    print(f"\n=== Resum ===")
    print(f"  ✓ Redactats: {ok}")
    print(f"  ✗ Fallats: {failed}")


if __name__ == "__main__":
    main()
