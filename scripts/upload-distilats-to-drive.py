"""Puja TOTS els JSONs locals de /data/informes/1-distilats/ a Drive /1-distilats/.

Fa servir OAuth d'usuari (visió completa del Drive), com tots els scripts operatius.
"""
import sys
import io
from pathlib import Path
sys.path.insert(0, "./scripts")
from drive_user_client import get_user_drive_service, get_subfolder_id
from googleapiclient.http import MediaIoBaseUpload

LOCAL_DIR = Path("./data/informes/1-distilats")
drive = get_user_drive_service()

# ID de la carpeta 1-distilats (la busquem via get_subfolder_id)
try:
    distilats_id = get_subfolder_id(drive, "1_distilats")
    print(f"✓ Carpeta Drive /1-distilats/ trobada (ID: {distilats_id})")
except Exception as e:
    print(f"✗ No s'ha trobat la carpeta /1-distilats/: {e}")
    sys.exit(1)

# Llistar què ja hi ha a Drive
existing = drive.files().list(
    q=f"'{distilats_id}' in parents and trashed=false",
    spaces="drive",
    fields="files(id, name)",
    pageSize=200,
).execute()
existing_names = {f["name"] for f in existing.get("files", [])}
print(f"Arxius ja existents a Drive: {len(existing_names)}")

# Llistar JSONs locals
jsons = sorted(LOCAL_DIR.glob("*.json"))
print(f"JSONs locals: {len(jsons)}\n")

ok = 0
skip = 0
fail = 0
for jf in jsons:
    name = jf.name
    if name in existing_names:
        print(f"  · {name} (ja existeix)")
        skip += 1
        continue
    try:
        content = jf.read_bytes()
        media = MediaIoBaseUpload(io.BytesIO(content), mimetype="application/json", resumable=False)
        metadata = {"name": name, "parents": [distilats_id]}
        drive.files().create(
            body=metadata,
            media_body=media,
            fields="id",
            supportsAllDrives=True,
        ).execute()
        print(f"  ✓ {name}")
        ok += 1
    except Exception as e:
        err_msg = str(e)[:200]
        print(f"  ✗ {name}: {err_msg}")
        fail += 1

print(f"\n=== Resum ===")
print(f"  ✓ Pujats: {ok}")
print(f"  · Ja existien: {skip}")
print(f"  ✗ Fallats: {fail}")
