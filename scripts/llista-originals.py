"""Llista els PDFs a Drive /informes/0-originals/ separats en pendents i processats."""
import sys
sys.path.insert(0, "./scripts")
from drive_user_client import get_user_drive_service, find_informes_root, find_folder_id

drive = get_user_drive_service()
originals_id = find_folder_id(drive, "0-originals", find_informes_root(drive))
distilats_id = find_folder_id(drive, "1-distilats", find_informes_root(drive))

# Subcarpetes dins de 0-originals (Opció A)
def find_subfolder(parent_id: str, name: str) -> str | None:
    results = drive.files().list(
        q=f"name='{name}' and mimeType='application/vnd.google-apps.folder' "
          f"and '{parent_id}' in parents and trashed=false",
        spaces="drive",
        fields="files(id, name)",
    ).execute()
    files = results.get("files", [])
    return files[0]["id"] if files else None


def list_pdfs(folder_id: str) -> list:
    if not folder_id:
        return []
    results = drive.files().list(
        q=f"'{folder_id}' in parents and trashed=false",
        spaces="drive",
        fields="files(id, name, mimeType, size, modifiedTime)",
        pageSize=200,
        orderBy="name",
    ).execute()
    return results.get("files", [])


pendents_id = find_subfolder(originals_id, "pendents")
processats_id = find_subfolder(originals_id, "processats")

print("=== PENDENTS (per processar) ===")
pendents = [f for f in list_pdfs(pendents_id) if f.get("mimeType") == "application/pdf"]
print(f"Total: {len(pendents)} PDFs\n")
for f in pendents:
    size_mb = int(f.get("size", 0)) / 1024 / 1024
    print(f"  • {f['name']} ({size_mb:.1f} MB)")

print("\n=== PROCESSATS (ja publicats) ===")
processats = [f for f in list_pdfs(processats_id) if f.get("mimeType") == "application/pdf"]
print(f"Total: {len(processats)} PDFs\n")
for f in processats:
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
print(f"  Pendents de destil·lar: {len(pendents)}")
print(f"  Processats (publicats): {len(processats)}")
print(f"  Destil·lats existents:  {len(distilats)}")
