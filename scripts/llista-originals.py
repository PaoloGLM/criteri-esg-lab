"""Llista els PDFs a Drive /informes/0-originals/ i quins ja estan destil·lats a /1-distilats/."""
import sys
sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from config import get_drive_service, get_subfolder_id

drive = get_drive_service()
originals_id = get_subfolder_id(drive, "0_originals")
distilats_id = get_subfolder_id(drive, "1_distilats")

# Llistar PDFs a 0-originals
print("=== PDFs a /informes/0-originals/ ===")
results = drive.files().list(
    q=f"'{originals_id}' in parents and trashed=false",
    spaces="drive",
    fields="files(id, name, mimeType, size, modifiedTime)",
    pageSize=200,
    orderBy="name",
).execute()
originals = results.get("files", [])
print(f"Total: {len(originals)} arxius\n")
for f in originals:
    size_mb = int(f.get("size", 0)) / 1024 / 1024
    print(f"  • {f['name']} ({size_mb:.1f} MB)")

# Llistar JSONs a 1-distilats
print("\n=== JSONs a /informes/1-distilats/ ===")
results = drive.files().list(
    q=f"'{distilats_id}' in parents and trashed=false",
    spaces="drive",
    fields="files(id, name)",
    pageSize=200,
).execute()
distilats = results.get("files", [])
print(f"Total: {len(distilats)} arxius\n")
for f in distilats:
    print(f"  • {f['name']}")

# Informe
print("\n=== Resum ===")
print(f"  Pendents de destil·lar: {len(originals) - len(distilats)}")
