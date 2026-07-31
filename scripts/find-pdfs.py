"""Buscar TOTS els PDFs accessibles per OAuth d'usuari (visió completa)."""
import sys
sys.path.insert(0, "./scripts")
from drive_user_client import get_user_drive_service

drive = get_user_drive_service()
results = drive.files().list(
    q="mimeType='application/pdf' and trashed=false",
    spaces="drive",
    fields="files(id, name, size, parents)",
    pageSize=200,
).execute()
files = results.get("files", [])
print(f"Total PDFs accessibles: {len(files)}\n")
for f in files:
    size_mb = int(f.get("size", 0)) / 1024 / 1024
    print(f"  • {f['name']} ({size_mb:.1f} MB) [parents: {f.get('parents', [])[:1]}]")
