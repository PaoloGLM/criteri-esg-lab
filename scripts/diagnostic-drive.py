"""Diagnòstic: quines carpetes veu el Service Account i de quin tipus són."""
import sys
sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from config import get_drive_service, get_service_account_email, find_informes_root, DRIVE_FOLDERS

drive = get_drive_service()
print(f"Service Account: {get_service_account_email()}\n")

# 1. Buscar Shared Drives (unitats compartides)
print("=== Shared Drives accessibles ===")
try:
    results = drive.drives().list(pageSize=50, fields="drives(id,name)").execute()
    shared_drives = results.get("drives", [])
    if shared_drives:
        for sd in shared_drives:
            print(f"  • {sd['name']} (ID: {sd['id']})")
    else:
        print("  (cap Shared Drive)")
except Exception as e:
    print(f"  Error: {e}")

# 2. Buscar carpeta 'informes'
print("\n=== Carpeta 'informes' ===")
try:
    folder_id = find_informes_root(drive)
    print(f"  ✓ Trobada (ID: {folder_id})")
    # Detalls
    info = drive.files().get(fileId=folder_id, fields="id,name,mimeType,parents,driveId").execute()
    print(f"  Nom: {info.get('name')}")
    print(f"  DriveId: {info.get('driveId', '(cap - és My Drive)')}")
    print(f"  Parents: {info.get('parents', [])}")
except Exception as e:
    print(f"  ✗ {e}")

# 3. Llistar subcarpetes
print("\n=== Subcarpetes ===")
results = drive.files().list(
    q="mimeType='application/vnd.google-apps.folder' and trashed=false",
    spaces="drive",
    fields="files(id, name, parents, driveId)",
    pageSize=50,
).execute()
for f in results.get("files", []):
    is_in_drive = "✓ SharedDrive" if f.get("driveId") else "  MyDrive"
    print(f"  {is_in_drive} {f['name']} (parents: {f.get('parents', [])[:1]})")
