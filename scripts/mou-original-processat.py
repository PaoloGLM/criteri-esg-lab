"""
Mou un PDF original de /0-originals/pendents/ a /0-originals/processats/.

S'executa al PAS 7 del flux d'informes: quan un informe es publica a la web,
el seu PDF original deixa de ser "pendent" i passa a "processats".

Ús:
    scripts/.venv/bin/python scripts/mou-original-processat.py [slug_o_fragment]

Si es passa un fragment de nom, mou TOTS els PDFs pendents que el continguin.
Sense argument, llista els pendents i surt.
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, "./scripts")
from drive_user_client import get_user_drive_service, find_folder_id

ORIGINALS_FOLDER_ID = "1v6pULB8Zm94m7VmuSjT3NPncN3jhqlAP"


def get_subfolder_id(drive, parent_id: str, name: str) -> str | None:
    """Busca una subcarpeta pel nom dins d'un parent."""
    q = f"name='{name}' and mimeType='application/vnd.google-apps.folder' and '{parent_id}' in parents and trashed=false"
    r = drive.files().list(q=q, spaces="drive", fields="files(id,name)", pageSize=10).execute()
    files = r.get("files", [])
    return files[0]["id"] if files else None


def list_pdfs(drive, folder_id: str) -> list:
    """Llista els PDFs d'una carpeta."""
    r = drive.files().list(
        q=f"'{folder_id}' in parents and mimeType='application/pdf' and trashed=false",
        spaces="drive",
        fields="files(id,name)",
        pageSize=200,
    ).execute()
    return r.get("files", [])


def move_file(drive, file_id: str, new_parent: str, old_parent: str) -> None:
    """Mou un fitxer de carpeta."""
    drive.files().update(
        fileId=file_id,
        addParents=new_parent,
        removeParents=old_parent,
        fields="id, parents",
    ).execute()


def main():
    drive = get_user_drive_service()
    pendents_id = get_subfolder_id(drive, ORIGINALS_FOLDER_ID, "pendents")
    processats_id = get_subfolder_id(drive, ORIGINALS_FOLDER_ID, "processats")

    if not pendents_id or not processats_id:
        print("✗ No s'han trobat les subcarpetes 'pendents'/'processats' a 0-originals.")
        print("  Executa primer l'Opció A (creació de subcarpetes).")
        return

    target = sys.argv[1] if len(sys.argv) > 1 else None

    if not target:
        print("=== PDFs pendents a /0-originals/pendents/ ===\n")
        pendents = list_pdfs(drive, pendents_id)
        print(f"Total: {len(pendents)} PDFs\n")
        for f in pendents:
            print(f"  • {f['name']}")
        print("\nÚs: mou-original-processat.py [fragment_del_nom]")
        return

    pendents = list_pdfs(drive, pendents_id)
    matching = [f for f in pendents if target.lower() in f["name"].lower()]

    if not matching:
        print(f"✗ Cap PDF pendent conté '{target}'")
        return

    print(f"Movent {len(matching)} PDF(s) a /processats/:\n")
    for f in matching:
        move_file(drive, f["id"], processats_id, pendents_id)
        print(f"  ✅ {f['name']} → processats/")

    print("\n✓ Fet. Recorda fer commit si hi ha canvis al repo.")


if __name__ == "__main__":
    main()
