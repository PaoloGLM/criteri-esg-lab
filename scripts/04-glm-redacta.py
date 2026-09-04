"""
Pas 4 del flux: GLM 5.3 Flash redacta.

Per cada informe:
1. Llegeix el destil·lat (pas 2)
2. Llegeix les aportacions de Gemini (pas 3)
3. Crida GLM 5.3 Flash Free amb rol de redactor
4. Genera l'informe final en Markdown (CA + ES)
5. Guarda a /data/informes/3-fets/<slug>.md

Ús:
    scripts/.venv/bin/python scripts/04-glm-redacta.py [slug]
"""
import sys
import os
import json
import time
from pathlib import Path

sys.path.insert(0, "./scripts")
from glm_flash_client import call_glm_flash

DATA_DIR = Path("./data/informes")
DISTILATS_DIR = DATA_DIR / "1-distilats"
APORTACIONS_DIR = DATA_DIR / "2-aportacions-gemini"
FETS_DIR = DATA_DIR / "3-fets"
FETS_DIR.mkdir(parents=True, exist_ok=True)


def call_glm_flash_redactor(title: str, institution: str, destilat: str, aportacions: str, lang: str = "ca") -> str:
    """Crida GLM 5.3 Flash per redactar l'informe final. Retorna Markdown."""
    lang_instr = "Escriu l'informe en català." if lang == "ca" else "Escribe el informe en castellano."
    system_prompt = (
        "Ets el redactor principal de Criteri ESG. La teva feina és redactar l'informe final.\n"
        "Tens dos inputs:\n"
        "  1. Un destil·lat inicial (pas 2)\n"
        "  2. Aportacions crítiques fetes per Gemini (pas 3): propostes + advocat del diable\n\n"
        "Per a cadascuna de les aportacions, decideix:\n"
        "  - Si l'incorpores a l'informe final (i com)\n"
        "  - Si la descartes (i per què)\n\n"
        "Veu editorial Criteri ESG:\n"
        "- Mediterrània, crítica amb el greenwashing, propera a cooperatives i B Corps\n"
        '- "Més enllà del Checkbox": tria 1-2 dels 5 criteris ètics (dignitat, justícia distributiva,\n'
        "  sostenibilitat absoluta, co-decisió democràtica, arrelament territorial)\n"
        "- MAI esmentar Economia del Bé Comú ni Economia Ciutadana públicament\n"
        "- Longitud màxima: 1.100 paraules (permet '5 minuts per criteri clar')\n\n"
        "Format de sortida: Markdown amb estructura de 8 blocs:\n"
        "## Bloc 0 — Semàfor Metodològic\n"
        "## Bloc 1 — Fitxa tècnica\n"
        "## Bloc 2 — 5 dades clau\n"
        "## Bloc 3 — Resum executiu (~300 paraules)\n"
        "## Bloc 4 — Implicacions (Empreses, Reguladors, Ciutadans, Més enllà del Checkbox)\n"
        "## Bloc 5 — Connexions\n"
        "## Bloc 6 — Accions recomanades\n"
        "## Bloc 7 — Cross-reference\n\n"
        "Inclou front-matter YAML al principi (slug, title, institution, date, lang)."
    )
    user_prompt = (
        f"Redacta l'informe final integrant el destil·lat i les aportacions crítiques.\n\n"
        f"TÍTOL: {title}\nINSTITUCIÓ: {institution}\n{lang_instr}\n\n"
        f"=== DESTIL·LAT INICIAL ===\n{destilat}\n=== FI ===\n\n"
        f"=== APORTACIONS DE GEMINI ===\n{aportacions}\n=== FI ===\n\n"
        f"Redacta el Markdown ara (amb el front-matter YAML al principi)."
    )

    from config import get_openrouter_client, GLM_53_FLASH_MODEL
    from openai import OpenAI
    
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY", "")
    )

    response = client.chat.completions.create(
        model="z-ai/glm-5.3-flash:free",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.4,
        max_tokens=16000,
    )
    return response.choices[0].message.content


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

    # Destil·lat com a string JSON (sencer)
    destilat_str = json.dumps({
        "content_ca": distilat_data.get("content_ca"),
        "content_es": distilat_data.get("content_es"),
    }, ensure_ascii=False, indent=2)

    # Aportacions de Gemini (senceres)
    aportacions_str = json.dumps(aportacions_data.get("aportacions"), ensure_ascii=False, indent=2)

    # Redactar CA
    print(f"  → Redactant versió catalana...")
    md_ca = call_glm_flash_redactor(
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
    md_es = call_glm_flash_redactor(
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

    print("=== Pas 4: GLM 5.3 Flash redacta (integra aportacions de Gemini) ===\n")
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