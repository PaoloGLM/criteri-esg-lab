"""Descarrega els PDFs de Drive a local (fa servir la carpeta 0-originals/pendents per ID conegut)."""
import sys
from pathlib import Path
sys.path.insert(0, "./scripts")
from drive_user_client import get_user_drive_service

LOCAL_DIR = Path("./data/informes/0-originals")
LOCAL_DIR.mkdir(parents=True, exist_ok=True)

drive = get_user_drive_service()

# ID de la carpeta 0-originals (trobat abans via find-pdfs.py)
ORIGINALS_FOLDER_ID = "1v6pULB8Zm94m7VmuSjT3NPncN3jhqlAP"
# Subcarpeta "pendents" (PDFs nous per processar) — Opció A d'organització
PENDENTS_FOLDER_ID = "1ab7xpHZH9VzyqHtX3Q4_XQvkrLJ5gORN"


def find_subfolder(parent_id: str, name: str) -> str | None:
    """Busca una subcarpeta pel nom dins d'un parent."""
    results = drive.files().list(
        q=f"name='{name}' and mimeType='application/vnd.google-apps.folder' "
          f"and '{parent_id}' in parents and trashed=false",
        spaces="drive",
        fields="files(id, name)",
    ).execute()
    files = results.get("files", [])
    return files[0]["id"] if files else None


def get_pendents_id() -> str:
    """Retorna l'ID de la subcarpeta 'pendents'. La crea si no existeix."""
    sub = find_subfolder(ORIGINALS_FOLDER_ID, "pendents")
    if sub:
        return sub
    file_metadata = {
        "name": "pendents",
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [ORIGINALS_FOLDER_ID],
    }
    created = drive.files().create(body=file_metadata, fields="id").execute()
    return created["id"]


# Llistar PDFs a Drive (només pendents)
pendents_id = get_pendents_id()
results = drive.files().list(
    q=f"'{pendents_id}' in parents and trashed=false",
    spaces="drive",
    fields="files(id, name, size)",
    pageSize=200,
    orderBy="name",
).execute()
files = results.get("files", [])
print(f"PDFs a Drive /0-originals/pendents/: {len(files)}\n")

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
print(f"\nNota: els PDFs processats (publicats) es mouen a /0-originals/processats/ i ja no es descarreguen.")
