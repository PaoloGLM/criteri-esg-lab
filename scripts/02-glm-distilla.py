"""
Pas 2 del flux: GLM destil·la → Gemini.

Per cada PDF a /data/informes/0-originals/:
1. Llegeix el PDF localment
2. Extreu el text amb pdfplumber
3. Crida Gemini via Vertex AI
4. Guarda el ReportBlock JSON a /data/informes/1-distilats/

Ús:
    scripts/.venv/bin/python scripts/02-glm-distilla.py [slug_o_filename]

Si no es passa argument, processa tots els PDFs pendents.
"""
import sys
import os
import json
import time
from pathlib import Path

sys.path.insert(0, "./scripts")
from gemini_client import call_gemini
import pdfplumber

DATA_DIR = Path("./data/informes")
ORIGINALS_DIR = DATA_DIR / "0-originals"
DISTILATS_DIR = DATA_DIR / "1-distilats"
DISTILATS_DIR.mkdir(parents=True, exist_ok=True)


def extract_text_from_pdf(pdf_path: Path, max_chars: int = 30000) -> str:
    """Extreu text d'un PDF amb pdfplumber. Màx 30.000 caràcters."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n\n"
            if len(text) > max_chars:
                break
    return text[:max_chars]


def slugify(filename: str) -> str:
    """Converteix '2026-04-22_europe-sustainable-development-report-2026.pdf' -> 'europe-sustainable-development-report-2026'."""
    base = filename.rsplit(".", 1)[0]
    if len(base) > 11 and base[:11].endswith("_") and base[:4].isdigit():
        base = base[11:]
    return base


def get_metadata_from_filename(filename: str) -> dict:
    """Extreu títol i institució del nom del fitxer."""
    slug = slugify(filename)
    parts = slug.split("-", 1)
    if len(parts) > 1:
        institution_raw = parts[0]
        title_raw = parts[1].replace("-", " ").capitalize()
    else:
        institution_raw = slug
        title_raw = slug.replace("-", " ").capitalize()

    institutions = {
        "cnmv": "CNMV (Comisión Nacional del Mercado de Valores)",
        "unepfi": "UNEP FI (UN Environment Programme Finance Initiative)",
        "wef": "World Economic Forum",
        "ecb": "European Central Bank",
        "ecovadis": "EcoVadis",
        "efrag": "EFRAG",
        "esma": "ESMA (European Securities and Markets Authority)",
        "eba": "European Banking Authority",
        "eiopa": "EIOPA",
        "eca": "European Court of Auditors",
        "eea": "European Environment Agency",
        "entsoe": "ENTSO-E",
        "oecd": "OECD",
        "oxfam": "Oxfam",
        "sbti": "Science Based Targets initiative (SBTi)",
        "un": "United Nations",
        "unep": "UNEP",
        "wri": "World Resources Institute",
        "foretica": "Forética",
        "cdp": "CDP",
        "csddd": "Comissió Europea (CSDDD)",
        "eu": "Comissió Europea",
        "agora": "Agora Energiewende",
        "carbon": "Carbon Tracker",
        "cop30": "COP30",
        "influencemap": "InfluenceMap",
        "worldbank": "World Bank",
        "2026": "United Nations",  # per "2026-04-22_europe-..." prefix
    }
    institution = institutions.get(institution_raw.lower(), institution_raw.upper())

    return {"slug": slug, "title": title_raw, "institution": institution}


def process_one_pdf(pdf_path: Path) -> bool:
    """Processa un PDF. Retorna True si tot ha anat bé."""
    name = pdf_path.name
    slug = slugify(name)
    output_filename = f"{slug}.json"
    output_path = DISTILATS_DIR / output_filename

    # Comprovar si ja està destil·lat
    if output_path.exists():
        print(f"  ✓ Ja destil·lat: {output_filename}")
        return True

    meta = get_metadata_from_filename(name)
    print(f"\n=== Processant: {name} ({pdf_path.stat().st_size/1024/1024:.1f} MB) ===")
    print(f"  Slug: {meta['slug']}")
    print(f"  Títol: {meta['title']}")
    print(f"  Institució: {meta['institution']}")

    # 1. Extreure text
    print(f"  → Extraient text...")
    text = extract_text_from_pdf(pdf_path)
    if len(text) < 500:
        print(f"  ✗ Text massa curt ({len(text)} chars). Probablement és un PDF escanejat. Saltant.")
        return False
    print(f"  ✓ Text extret ({len(text)} chars)")

    # 2. Cridar Gemini (català i castellà)

    def _distill(lang):
        lang_instr = "Escriu tot el contingut en català." if lang == "ca" else "Escribe todo el contenido en castellano."
        sp = (
            "Ets un analista ESG expert de Criteri ESG. Sintetitza informes institucionals ESG en 8 blocs accionables.\n\n"
            "Genera EXCLUSIVAMENT un objecte JSON vàlid amb aquesta estructura (sense markdown, sense text fora del JSON):\n"
            '{"semafor":{"grade":"A"|"B"|"C"|"D","gradeLabel":"...","indicators":['
            '{"name":"Cobertura Scope 3","status":"verd"|"groc"|"vermell","label":"...","note":"..."},...]},'
            '"dadesClau":[{"value":"...","label":"...","page":"..."}],'
            '"resumExecutiu":"...","implicacions":{"empreses":"...","reguladors":"...","ciutadans":"..."},'
            '"mesEnllaCheckbox":{"criteri":"...","body":"..."},'
            '"connexions":[{"type":"Evolució|Complement|Contradicció","target":"...","desc":"..."}],'
            '"accions":[{"num":"01","title":"...","desc":"...","effort":"Baix|Mitjà|Alt","impact":"Baix|Mitjà|Alt"}],'
            '"crossRefs":[{"framework":"...","criterion":"...","impact":"..."}]}\n\n'
            "Criteris semàfor: verd=Quantificat, groc=Esmentat, vermell=Ignorat. "
            "grade: A=5v, B=4v+1g, C≤1r, D=2+r.\n"
            "Llargàries: resumExecutiu ~300p, implicacions ~150p cadascun, mesEnllaCheckbox ~150p, "
            "dadesClau 5, accions 4-5, connexions 2-3, crossRefs 2-3.\n"
            'Veu editorial mediterrània. "Més enllà del Checkbox" usa 1-2 criteris ètics '
            '(dignitat, justícia, sostenibilitat, co-decisió, arrelament). '
            "MAI esmentar Economia del Bé Comú ni Economia Ciutadana públicament."
        )
        up = (
            f"Analitza el següent informe i genera el ReportBlock JSON.\n\n"
            f"TÍTOL: {meta['title']}\nINSTITUCIÓ: {meta['institution']}\n{lang_instr}\n\n"
            f"=== TEXT ===\n{text[:28000]}\n=== FI ===\n\nGenera el JSON ara."
        )
        raw = call_gemini(sp, up, temperature=0.4, max_tokens=8000, force_text=True)
        import re
        m = re.search(r'```(?:json)?\s*([\s\S]*?)```', raw)
        if m: raw = m.group(1).strip()
        m = re.search(r'\{[\s\S]*\}', raw)
        if m: raw = m.group(0)
        return json.loads(raw)

    print(f"  → Generant versió catalana...")
    report_ca = _distill("ca")
    time.sleep(1)

    print(f"  → Generant versió castellana...")
    report_es = _distill("es")

    # 3. Guardar JSON combinat
    output = {
        "slug": meta["slug"],
        "title": meta["title"],
        "institution": meta["institution"],
        "filename_original": name,
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "content_ca": report_ca,
        "content_es": report_es,
    }
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  ✓ Guardat a {output_path}")
    return True


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pas 2: Gemini destil·la (LOCAL) ===\n")
    print(f"PDFs originals: {ORIGINALS_DIR}")
    print(f"Destinació: {DISTILATS_DIR}\n")

    pdfs = sorted(ORIGINALS_DIR.glob("*.pdf"))
    print(f"PDFs trobats: {len(pdfs)}\n")

    if target:
        pdfs = [p for p in pdfs if target.lower() in p.name.lower()]
        if not pdfs:
            print(f"✗ No s'ha trobat cap PDF que coincideixi amb '{target}'")
            return
        print(f"Filtrat per '{target}': {len(pdfs)} PDF(s)")

    ok = 0
    failed = 0
    for pdf in pdfs:
        try:
            if process_one_pdf(pdf):
                ok += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ✗ Error processant {pdf.name}: {e}")
            failed += 1

    print(f"\n=== Resum ===")
    print(f"  ✓ Processats: {ok}")
    print(f"  ✗ Fallats: {failed}")


if __name__ == "__main__":
    main()
