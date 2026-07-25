"""
Pas final: puja els informes corregits (pas 4) a Drive /4-revisats-ortografia/.

Per cada informe a /data/informes/4-revisats-ortografia/:
1. Converteix el .md a PDF (pandoc + weasyprint)
2. Puja el PDF a Drive /4-revisats-ortografia/ (amb OAuth d'usuari)
3. També puja el .md (per si vols editar-lo)

Ús:
    scripts/.venv/bin/python scripts/puja-a-drive.py [slug]
"""
import sys
import subprocess
import tempfile
from pathlib import Path

sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from drive_user_client import get_user_drive_service, get_subfolder_id, upload_file, list_files_in_folder

REVISATS_DIR = Path("/home/z/my-project/criteri-esg-lab/data/informes/4-revisats-ortografia")

# CSS bàsica per al PDF
CSS = """
body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #2C1810;
    max-width: 700px;
    margin: 0 auto;
    padding: 40px 20px;
}
h1 {
    font-size: 24pt;
    color: #2C1810;
    border-bottom: 2px solid #B87333;
    padding-bottom: 10px;
    margin-top: 30px;
}
h2 {
    font-size: 18pt;
    color: #5C3A1E;
    margin-top: 25px;
}
h3 {
    font-size: 14pt;
    color: #8A5526;
}
hr {
    border: none;
    border-top: 1px solid #C9B89A;
    margin: 30px 0;
}
strong {
    color: #B87333;
}
code, pre {
    background: #F5EFE6;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 9pt;
}
ul, ol {
    padding-left: 20px;
}
"""


def md_to_pdf(md_path: Path, pdf_path: Path):
    """Converteix Markdown a PDF via pandoc + weasyprint."""
    # 1. MD → HTML amb pandoc
    html_path = pdf_path.with_suffix(".html")
    css_path = pdf_path.with_suffix(".css")
    css_path.write_text(CSS, encoding="utf-8")

    result = subprocess.run(
        [
            "pandoc",
            str(md_path),
            "-o", str(html_path),
            "--standalone",
            "--metadata", "title=",
            "-c", str(css_path.name),
        ],
        cwd=pdf_path.parent,
        capture_output=True,
        text=True,
        timeout=30,
    )
    if result.returncode != 0:
        raise Exception(f"Pandoc error: {result.stderr[:200]}")

    # 2. HTML → PDF amb weasyprint
    result = subprocess.run(
        ["weasyprint", str(html_path), str(pdf_path)],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        raise Exception(f"Weasyprint error: {result.stderr[:200]}")

    # Netejar
    html_path.unlink(missing_ok=True)
    css_path.unlink(missing_ok=True)


def process_one(slug: str) -> bool:
    """Processa un slug (versió CA + ES): MD → PDF → Drive."""
    ca_md = REVISATS_DIR / f"{slug}.ca.md"
    es_md = REVISATS_DIR / f"{slug}.es.md"

    if not ca_md.exists() or not es_md.exists():
        print(f"  ✗ Falten versions (CA o ES) per {slug}")
        return False

    print(f"\n=== Pujant a Drive: {slug} ===")

    drive = get_user_drive_service()
    folder_4_id = get_subfolder_id(drive, "4-revisats-ortografia")

    # Llistar què ja hi ha a Drive
    existing = {f["name"] for f in list_files_in_folder(drive, folder_4_id)}

    ok = True
    for md_path in [ca_md, es_md]:
        lang = "ca" if ".ca." in md_path.name else "es"
        pdf_name = f"{slug}.{lang}.pdf"
        md_name = md_path.name

        # Convertir a PDF (local)
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            pdf_path = Path(tmp.name)
        try:
            print(f"  → Convertint {md_path.name} a PDF...")
            md_to_pdf(md_path, pdf_path)
            print(f"  ✓ PDF generat ({pdf_path.stat().st_size/1024:.1f} KB)")

            # Pujar PDF
            if pdf_name in existing:
                print(f"  · {pdf_name} ja existeix a Drive (sobreescrivint...)")
                # Esborrar l'existent
                existing_files = drive.files().list(
                    q=f"name='{pdf_name}' and '{folder_4_id}' in parents and trashed=false",
                    fields="files(id)",
                ).execute()
                for f in existing_files.get("files", []):
                    drive.files().delete(fileId=f["id"]).execute()

            print(f"  → Pujant {pdf_name} a Drive /4-revisats-ortografia/...")
            upload_file(drive, pdf_path, pdf_name, folder_4_id, mime_type="application/pdf")
            print(f"  ✓ Pujat")

            # Pujar MD (com a referència editable)
            if md_name not in existing:
                upload_file(drive, md_path, md_name, folder_4_id, mime_type="text/markdown")
                print(f"  ✓ MD també pujat")
        finally:
            pdf_path.unlink(missing_ok=True)

    return ok


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pujada a Drive /4-revisats-ortografia/ ===\n")
    print(f"Markdown locals: {REVISATS_DIR}\n")

    md_files = sorted(REVISATS_DIR.glob("*.md"))
    slugs = sorted({p.name.rsplit(".", 2)[0] for p in md_files})
    print(f"Informes per pujar: {len(slugs)}\n")

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
    print(f"  ✓ Pujats: {ok}")
    print(f"  ✗ Fallats: {failed}")


if __name__ == "__main__":
    main()
