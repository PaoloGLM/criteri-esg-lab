"""
Processa els PDFs pendents un per un, amb fitxer de progrés.
Si es talla, es pot tornar a executar i continua on ho va deixar.
"""
import sys
import subprocess
import time
from pathlib import Path

DATA_DIR = Path("/home/z/my-project/criteri-esg-lab/data/informes")
ORIGINALS_DIR = DATA_DIR / "0-originals"
DISTILATS_DIR = DATA_DIR / "1-distilats"

# Llistar pendents
all_pdfs = sorted(ORIGINALS_DIR.glob("*.pdf"))
pendings = []
for pdf in all_pdfs:
    slug = pdf.stem
    if len(slug) > 11 and slug[:11].endswith("_") and slug[:4].isdigit():
        slug = slug[11:]
    output = DISTILATS_DIR / f"{slug}.json"
    if not output.exists():
        pendings.append(pdf)

print(f"Pendents: {len(pendings)} de {len(all_pdfs)}")
if not pendings:
    print("✓ Tots processats!")
    sys.exit(0)

for i, pdf in enumerate(pendings, 1):
    print(f"\n{'='*60}")
    print(f"[{i}/{len(pendings)}] {pdf.name}")
    print(f"{'='*60}")
    sys.stdout.flush()
    try:
        result = subprocess.run(
            ["scripts/.venv/bin/python", "scripts/02-glm-distilla.py", pdf.stem],
            cwd="/home/z/my-project/criteri-esg-lab",
            timeout=600,
            capture_output=False,
        )
        print(f"✓ Completat ({result.returncode})")
    except subprocess.TimeoutExpired:
        print(f"✗ Timeout (10 min)")
    except Exception as e:
        print(f"✗ Error: {e}")
    sys.stdout.flush()
    time.sleep(2)

print("\n=== Finalitzat ===")
print(f"Total destil·lats: {len(list(DISTILATS_DIR.glob('*.json')))}")
