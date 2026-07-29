"""
Pas 3 del flux: Gemini revisa (crtic + advocat del diable).

Per cada JSON a /data/informes/1-distilats/:
1. Llegeix el JSON (destil·lat del pas 2)
2. Llegeix el PDF original associat
3. Crida Gemini 2.5 Flash amb rol de crític + advocat del diable
4. Guarda les propostes a /data/informes/2-aportacions-gemini/

Ús:
    scripts/.venv/bin/python scripts/03-gemini-revisa.py [slug]
"""
import sys
import json
import time
from pathlib import Path

sys.path.insert(0, "./scripts")
from gemini_client import call_gemini_json

DATA_DIR = Path("./data/informes")
ORIGINALS_DIR = DATA_DIR / "0-originals"
DISTILATS_DIR = DATA_DIR / "1-distilats"
APORTACIONS_DIR = DATA_DIR / "2-aportacions-gemini"
APORTACIONS_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = """Ets un crític ESG extern independent. NO ets l'autor de l'informe — ets un revisor rigorós.

Rep un destil·lat d'un informe institucional ESG (fet per un altre agent GLM) i l'informe original en text.

La teva feina té DUES parts:

A) PROPOSTES DE VALOR: per a cadascun dels 8 apartats del destil·lat, proposa afegir o modificar contingut per millorar-lo. Sigues concret: "Al bloc 2, la dada 61% hauria d'anar acompanyada del context 1.144 datapoints". Identifica dades importants de l'original que NO surten al destil·lat.

B) ADVOCAT DEL DIABLE: identifica contradiccions, mancances metodològiques, fonts no verificades, possible greenwashing, i criteris ètics oblidats (dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió, arrelament). Pregunta: què NO diu aquest informe que hauria de dir?

Torna un objecte JSON amb aquesta estructura exacta:
{
  "propostes": [
    {
      "bloc": "0-semafor|2-dadesClau|3-resum|4-implicacions|4b-mesEnlla|5-connexions|6-accions|7-crossRefs",
      "tipus": "afegir|modificar|eliminar",
      "proposta": "text concret del canvi",
      "justificacio": "per què és important"
    }
  ],
  "advocat_diable": [
    {
      "tipus": "contradiccio|mancanca|greenwashing|criteri_oblidat|font_no_verificada",
      "bloc_afectat": "string",
      "observacio": "text concret",
      "evidencia_original": "cita literal de l'original si n'hi ha"
    }
  ]
}

Sigues crític i específic. No aportis genèriques. Mínim 5 propostes i 3 observacions d'advocat del diable."""


def find_original_pdf(slug: str, distilat_data: dict) -> Path | None:
    """Troba el PDF original associat a un destil·lat."""
    fname = distilat_data.get("filename_original")
    if fname:
        path = ORIGINALS_DIR / fname
        if path.exists():
            return path
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


def process_one(distilat_path: Path) -> bool:
    """Processa un destil·lat amb Gemini."""
    slug = distilat_path.stem
    output_path = APORTACIONS_DIR / f"{slug}.json"

    # Si ja existeix, esborrar i refer (perquè ara és Gemini real, no GLM)
    if output_path.exists():
        print(f"  · Ja existia, refent amb Gemini: {slug}")
        output_path.unlink()

    print(f"\n=== Revisant amb Gemini: {slug} ===")
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

    user_prompt = f"""Analitza el destil·lat següent i compara'l amb l'informe original.

TÍTOL: {distilat_data['title']}
INSTITUCIÓ: {distilat_data['institution']}

=== DESTIL·LAT (fet per GLM) ===
{destilat_str}
=== FI ===

=== INFORME ORIGINAL (extracte) ===
{original_text}
=== FI ===

Genera el JSON crític ara."""

    print(f"  → Cridant Gemini 2.5 Flash (crític + advocat del diable)...")
    aportacions = call_gemini_json(SYSTEM_PROMPT, user_prompt, temperature=0.7, max_tokens=16000)

    # Guardar
    output = {
        "slug": slug,
        "title": distilat_data["title"],
        "institution": distilat_data["institution"],
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "model": "gemini-2.5-flash (vertex-ai europe-west1)",
        "aportacions": aportacions,
    }
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  ✓ Guardat a {output_path}")
    print(f"    - Propostes: {len(aportacions.get('propostes', []))}")
    print(f"    - Advocat del diable: {len(aportacions.get('advocat_diable', []))}")
    return True


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pas 3: Gemini (crític + advocat del diable) ===\n")
    print(f"Model: gemini-2.5-flash via Vertex AI europe-west1\n")
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
