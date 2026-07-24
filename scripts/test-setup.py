"""
Test ràpid de connexió a Gemini i Google Drive.
Verifica que tot està configurat correctament abans de començar amb el flux.
"""
import sys
sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")

from config import (
    get_gemini_client,
    get_drive_service,
    get_service_account_email,
    find_informes_root,
    get_subfolder_id,
    DRIVE_FOLDERS,
)


def test_gemini():
    """Test: Gemini respon a un prompt simple."""
    print("\n=== Test Gemini ===")
    try:
        client = get_gemini_client()
        from google.genai import types
        response = client.models.generate_content(
            model="gemini-2.5-flash",  # fallback a flash si 2.0-pro no disponible
            contents="Respon només amb: 'OK'",
            config=types.GenerateContentConfig(max_output_tokens=10),
        )
        text = response.text.strip()
        print(f"  Resposta de Gemini: '{text}'")
        if "OK" in text:
            print("  ✓ Gemini funciona correctament")
            return True
        else:
            print(f"  ✗ Gemini ha respost algo inesperat")
            return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_drive():
    """Test: Service Account pot accedir a la carpeta 'informes' i crear/llistar subcarpetes."""
    print("\n=== Test Google Drive ===")
    try:
        sa_email = get_service_account_email()
        print(f"  Service Account email: {sa_email}")

        drive = get_drive_service()

        # Buscar carpeta 'informes'
        try:
            folder_id = find_informes_root(drive)
            print(f"  ✓ Carpeta 'informes' trobada (ID: {folder_id})")
        except FileNotFoundError as e:
            print(f"  ✗ {e}")
            return False

        # Llistar subcarpetes existents
        results = drive.files().list(
            q=f"'{folder_id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false",
            spaces="drive",
            fields="files(id, name)",
        ).execute()
        existing = {f["name"]: f["id"] for f in results.get("files", [])}
        print(f"  Subcarpetes existents: {list(existing.keys()) or '(cap)'}")

        # Verificar/crear les 7 subcarpetes necessàries
        all_ok = True
        for key, expected_name in DRIVE_FOLDERS.items():
            try:
                sub_id = get_subfolder_id(drive, key)
                status = "✓ existeix" if expected_name in existing else "✓ creada"
                print(f"  {status}: {expected_name} (ID: {sub_id})")
            except Exception as e:
                print(f"  ✗ Error amb {expected_name}: {e}")
                all_ok = False

        return all_ok
    except Exception as e:
        print(f"  ✗ Error general: {e}")
        return False


if __name__ == "__main__":
    gemini_ok = test_gemini()
    drive_ok = test_drive()

    print("\n=== Resum ===")
    print(f"  Gemini: {'✓' if gemini_ok else '✗'}")
    print(f"  Drive:  {'✓' if drive_ok else '✗'}")

    if gemini_ok and drive_ok:
        print("\n✅ Tot llest per començar amb el flux.")
        sys.exit(0)
    else:
        print("\n❌ Hi ha hagut errors. Revisa els tests anteriors.")
        sys.exit(1)
