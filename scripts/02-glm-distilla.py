"""
Pas 2 del flux: GLM destil·la.

Per cada PDF a Drive /informes/0-originals/:
1. Descarrega el PDF
2. Extreu el text amb pdfplumber
3. Crida GLM (via la API route /api/generate-report de la web local)
4. Guarda el resultat (ReportBlock JSON) a Drive /informes/1-distilats/

Ús:
    scripts/.venv/bin/python scripts/02-glm-distilla.py [slug_o_filename]

Si no es passa argument, processa tots els PDFs pendents.
"""
import sys
import os
import json
import io
import time
from pathlib import Path

sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from config import get_drive_service, get_subfolder_id, STATE_DIR
from glm_client import call_glm_direct
import pdfplumber


def extract_text_from_pdf(pdf_bytes: bytes, max_chars: int = 30000) -> str:
    """Extreu text d'un PDF amb pdfplumber. Màx 30.000 caràcters per l'LLM."""
    text = ""
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n\n"
            if len(text) > max_chars:
                break
    return text[:max_chars]


def slugify(filename: str) -> str:
    """Converteix '2026-04-22_europe-sustainable-development-report-2026.pdf' -> 'europe-sustainable-development-report-2026'."""
    base = filename.rsplit(".", 1)[0]
    # Treure prefix de data si hi és
    if len(base) > 11 and base[:11].endswith("_") and base[:4].isdigit():
        base = base[11:]
    return base


def get_metadata_from_filename(filename: str) -> dict:
    """Extreu títol i institució del nom del fitxer."""
    slug = slugify(filename)
    # Heurística simple: primera paraula = institució, resta = títol
    parts = slug.split("-", 1)
    if len(parts) > 1:
        institution_raw = parts[0]
        title_raw = parts[1].replace("-", " ").capitalize()
    else:
        institution_raw = slug
        title_raw = slug.replace("-", " ").capitalize()

    # Map d'institucions conegudes
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
    }
    institution = institutions.get(institution_raw.lower(), institution_raw.upper())

    return {"slug": slug, "title": title_raw, "institution": institution}


def call_glm_api(title: str, institution: str, source: str, lang: str = "ca") -> dict:
    """Crida GLM directament via subprocess Node."""
    print(f"  → Cridant GLM ({len(source)} chars d'input, idioma={lang})...")
    return call_glm_direct(title, institution, source, lang)


def upload_to_drive(drive, content: str, filename: str, folder_id: str, mime_type: str = "application/json"):
    """Puja un arxiu a Drive. Fa servir supportsAllDrives per carpetes compartides."""
    from googleapiclient.http import MediaIoBaseUpload

    media = MediaIoBaseUpload(io.BytesIO(content.encode("utf-8")), mimetype=mime_type, resumable=False)
    metadata = {"name": filename, "parents": [folder_id]}
    drive.files().create(
        body=metadata,
        media_body=media,
        fields="id",
        supportsAllDrives=True,
    ).execute()


def process_one_pdf(drive, file_metadata: dict, originals_id: str, distilats_id: str) -> bool:
    """Processa un PDF. Retorna True si tot ha anat bé."""
    name = file_metadata["name"]
    file_id = file_metadata["id"]
    size_mb = int(file_metadata.get("size", 0)) / 1024 / 1024

    slug = slugify(name)
    output_filename = f"{slug}.json"

    # Comprovar si ja està destil·lat
    existing = drive.files().list(
        q=f"name='{output_filename}' and '{distilats_id}' in parents and trashed=false",
        spaces="drive",
        fields="files(id, name)",
    ).execute()
    if existing.get("files"):
        print(f"  ✓ Ja destil·lat: {output_filename}")
        return True

    print(f"\n=== Processant: {name} ({size_mb:.1f} MB) ===")
    meta = get_metadata_from_filename(name)
    print(f"  Slug: {meta['slug']}")
    print(f"  Títol: {meta['title']}")
    print(f"  Institució: {meta['institution']}")

    # 1. Descarregar PDF
    print(f"  → Descarregant PDF...")
    request = drive.files().get_media(fileId=file_id)
    pdf_bytes = request.execute()
    print(f"  ✓ Descarregat ({len(pdf_bytes)/1024:.1f} KB)")

    # 2. Extreure text
    print(f"  → Extraient text...")
    text = extract_text_from_pdf(pdf_bytes)
    if len(text) < 500:
        print(f"  ✗ Text massa curt ({len(text)} chars). Probablement és un PDF escanejat. Saltant.")
        return False
    print(f"  ✓ Text extret ({len(text)} chars)")

    # 3. Cridar GLM (català i castellà)
    print(f"  → Generant versió catalana...")
    report_ca = call_glm_api(meta["title"], meta["institution"], text, "ca")
    time.sleep(2)  # Evitar rate limiting

    print(f"  → Generant versió castellana...")
    report_es = call_glm_api(meta["title"], meta["institution"], text, "es")

    # 4. Guardar JSON combinat a Drive
    output = {
        "slug": meta["slug"],
        "title": meta["title"],
        "institution": meta["institution"],
        "filename_original": name,
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "content_ca": report_ca,
        "content_es": report_es,
    }
    json_str = json.dumps(output, ensure_ascii=False, indent=2)
    print(f"  → Pujant a Drive /1-distilats/{output_filename}...")
    upload_to_drive(drive, json_str, output_filename, distilats_id)
    print(f"  ✓ Pujat")
    return True


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pas 2: GLM destil·la ===\n")
    drive = get_drive_service()
    originals_id = get_subfolder_id(drive, "0_originals")
    distilats_id = get_subfolder_id(drive, "1_distilats")

    # Llistar PDFs
    results = drive.files().list(
        q=f"'{originals_id}' in parents and trashed=false",
        spaces="drive",
        fields="files(id, name, size)",
        pageSize=200,
        orderBy="name",
    ).execute()
    originals = results.get("files", [])
    print(f"PDFs originals: {len(originals)}")
    print(f"Destinació: /informes/1-distilats/\n")

    if target:
        # Filtrar per argument
        originals = [f for f in originals if target.lower() in f["name"].lower()]
        if not originals:
            print(f"✗ No s'ha trobat cap PDF que coincideixi amb '{target}'")
            return
        print(f"Filtrat per '{target}': {len(originals)} PDF(s)")

    # Processar cada PDF
    ok = 0
    failed = 0
    for f in originals:
        try:
            if process_one_pdf(drive, f, originals_id, distilats_id):
                ok += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ✗ Error processant {f['name']}: {e}")
            failed += 1

    print(f"\n=== Resum ===")
    print(f"  ✓ Processats: {ok}")
    print(f"  ✗ Fallats: {failed}")


if __name__ == "__main__":
    main()
