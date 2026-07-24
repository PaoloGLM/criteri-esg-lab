"""Descarrega els PDFs de Drive a local (fa servir la carpeta 0-originals per ID conegut)."""
import sys
from pathlib import Path
sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from config import get_drive_service

LOCAL_DIR = Path("/home/z/my-project/criteri-esg-lab/data/informes/0-originals")
LOCAL_DIR.mkdir(parents=True, exist_ok=True)

drive = get_drive_service()

# ID de la carpeta 0-originals (trobat abans via find-pdfs.py)
ORIGINALS_FOLDER_ID = "1v6pULB8Zm94m7VmuSjT3NPncN3jhqlAP"

# Llistar PDFs a Drive
results = drive.files().list(
    q=f"'{ORIGINALS_FOLDER_ID}' in parents and trashed=false",
    spaces="drive",
    fields="files(id, name, size)",
    pageSize=200,
    orderBy="name",
).execute()
files = results.get("files", [])
print(f"PDFs a Drive /0-originals/: {len(files)}\n")

ok = 0
skip = 0
fail = 0
for f in files:
    name = f["name"]
    dest = LOCAL_DIR / name
    if dest.exists():
        skip += 1
        continue
    try:
        size_mb = int(f.get("size", 0)) / 1024 / 1024
        print(f"  ↓ {name} ({size_mb:.1f} MB)")
        request = drive.files().get_media(fileId=f["id"])
        data = request.execute()
        dest.write_bytes(data)
        ok += 1
    except Exception as e:
        print(f"  ✗ {name}: {e}")
        fail += 1

print(f"\n✓ Descarregats: {ok}")
print(f"· Ja existien: {skip}")
print(f"✗ Fallats: {fail}")
print(f"Total a local: {len(list(LOCAL_DIR.glob('*.pdf')))}")
