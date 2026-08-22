"""
Pas 3 del flux: Gemini 3.6 Flash revisa (critic + advocat del diable).

Per cada JSON a /data/informes/1-distilats/:
1. Llegeix el JSON (destil·lat del pas 2)
2. Llegeix el PDF original associat
3. Crida Gemini 3.6 Flash amb rol de critic + advocat del diable
4. Guarda les propostes a /data/informes/2-aportacions-gemini/

Ús:
    scripts/.venv/bin/python scripts/03-gemini-revisa.py [slug]

Model: gemini-3.6-flash (API de pagament, clau GEMINI_API_KEY — compte PRO).
"""
import sys
import json
import time
from pathlib import Path

sys.path.insert(0, "./scripts")
from gemini_paid_client import call_gemini_paid_json

DATA_DIR = Path("./data/informes")
ORIGINALS_DIR = DATA_DIR / "0-originals"
DISTILATS_DIR = DATA_DIR / "1-distilats"
APORTACIONS_DIR = DATA_DIR / "2-aportacions-gemini"
APORTACIONS_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = """Ets un critic ESG extern independent. NO ets l'autor de l'informe -- ets un revisor rigoros.

Rep un destil·lat d'un informe institucional ESG (fet per un altre agent DeepSeek) i l'informe original en text.

La teva feina te DUES parts:

A) PROPOSTES DE VALOR: per a cadascun dels 8 apartats del destil·lat, proposa afegir o modificar contingut per millorar-lo. Sigues concret: "Al bloc 2, la dada 61% hauria d'anar acompanyada del context 1.144 datapoints". Identifica dades importants de l'original que NO surten al destil·lat.

B) ADVOCAT DEL DIABLE: identifica contradiccions, mancances metodologiques, fonts no verificades, possible greenwashing, i criteris etics oblidats (dignitat, justícia distributiva, sostenibilitat absoluta, co-decisio, arrelament). Pregunta: que NO diu aquest informe que hauria de dir?

Torna un objecte JSON amb aquesta estructura exacta:
{
  "propostes": [
    {
      "bloc": "0-semafor|2-dadesClau|3-resum|4-implicacions|4b-mesEnlla|5-connexions|6-accions|7-crossRefs",
      "tipus": "afegir|modificar|eliminar",
      "proposta": "text concret del canvi",
      "justificacio": "per que és important"
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

Sigues critic i específic. No aportis genèriques. Minim 5 propostes i 3 observacions d'advocat del diable.

VERIFICACIÓ ESPECÍFICA DELS CROSS-REFERENCES (bloc 7-crossRefs):
- Comprova que cada 'criterion' sigui un requisit CONCRET de l'estàndard (ex. 'GRI 305-1'), no un tema genèric. Si és genèric, proposa el requisit concret.
- Comprova que 'coverage' sigui coherent amb l'original: 'compleix' només si l'informe el tracta amb contingut real (dades o anàlisi); 'parcial' si només el menciona; 'no-cobert' si no apareix.
- Comprova que 'evidence.page' sigui un número de pàgina REAL de l'original. Si no es pot verificar o és inventat, proposa eliminar-lo o corregir-lo (nul si no és localitzable).
- Comprova que 'nature' distingeixi bé entre dada quantitativa (número/mètrica), qualitativa (narrativa/política) i compromís (objectiu declarat).
- Si un requisit material de l'estàndard NO apareix a cap crossRef però l'informe el tracta, proposa afegir-lo.

ENTORN TANCAT (regles de verificació):
1. Totes les propostes i observacions han de fonamentar-se EXCLUSIVAMENT en el destil·lat i l'informe original que reps. MAI afegeixis coneixement extern ni dades que no apareguin a l'original.
2. Cada proposta que es refereixi a una dada de l'original ha d'indicar-ne la font (p. N o secció) a 'justificacio' o 'evidencia_original'.
3. Si identifiques una dada important de l'original que falta al destil·lat, cita-la literalment a 'evidencia_original'.
4. MAI inventis dades, xifres ni fonts que no estiguin a l'original per justificar una crítica."""

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


def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extreu TOT el text d'un PDF (sense truncar). Els models tenen 1M de context."""
    import pdfplumber
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n\n"
    return text


def process_one(distilat_path: Path) -> bool:
    """Processa un destil·lat amb Gemini 3.6 Flash (API de pagament)."""
    slug = distilat_path.stem
    output_path = APORTACIONS_DIR / f"{slug}.json"

    # Si ja existeix, esborrar i refer (ara amb Gemini 3.6 Flash)
    if output_path.exists():
        print(f"  · Ja existia, refent amb Gemini 3.6 Flash: {slug}")
        output_path.unlink()

    print(f"\n=== Revisant amb Gemini 3.6 Flash: {slug} ===")
    distilat_data = json.loads(distilat_path.read_text(encoding="utf-8"))

    # Trobar PDF original
    pdf_path = find_original_pdf(slug, distilat_data)
    if not pdf_path:
        print(f"  Error: No s'ha trobat el PDF original per {slug}")
        return False

    print(f"  -> Extraient text de {pdf_path.name}...")
    original_text = extract_text_from_pdf(pdf_path)
    print(f"  Text original: {len(original_text)} chars")

    # Destil·lat com a string JSON (sencer, sense truncar)
    destilat_str = json.dumps({
        "content_ca": distilat_data.get("content_ca"),
    }, ensure_ascii=False, indent=2)

    user_prompt = f"""Analitza el destil·lat següent i compara'l amb l'informe original.

TITOL: {distilat_data['title']}
INSTITUCIO: {distilat_data['institution']}

=== DESTIL·LAT (fet per DeepSeek) ===
{destilat_str}
=== FI ===

=== INFORME ORIGINAL (extracte) ===
{original_text}
=== FI ===

Genera el JSON critic ara."""

    print(f"  -> Cridant Gemini 3.6 Flash (critic + advocat del diable)...")
    aportacions = call_gemini_paid_json(SYSTEM_PROMPT, user_prompt, temperature=0.7, max_tokens=16000)

    # Guardar
    output = {
        "slug": slug,
        "title": distilat_data["title"],
        "institution": distilat_data["institution"],
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "model": "gemini-3.6-flash (API de pagament)",
        "aportacions": aportacions,
    }
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  Guardat a {output_path}")
    print(f"    - Propostes: {len(aportacions.get('propostes', []))}")
    print(f"    - Advocat del diable: {len(aportacions.get('advocat_diable', []))}")
    return True


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pas 3: Gemini 3.6 Flash (critic + advocat del diable) ===\n")
    print(f"Model: gemini-3.6-flash (API de pagament)\n")
    print(f"Destil·lats: {DISTILATS_DIR}")
    print(f"Destinació: {APORTACIONS_DIR}\n")

    distilats = sorted(DISTILATS_DIR.glob("*.json"))
    print(f"Destil·lats trobats: {len(distilats)}\n")

    if target:
        distilats = [d for d in distilats if target.lower() in d.stem.lower()]
        if not distilats:
            print(f"Error: No s'ha trobat cap destil·lat que coincideixi amb '{target}'")
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
            print(f"  Error: {e}")
            failed += 1

    print(f"\n=== Resum ===")
    print(f"  Revisats: {ok}")
    print(f"  Fallats: {failed}")


if __name__ == "__main__":
    main()
