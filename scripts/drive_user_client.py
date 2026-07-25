"""
Client de Google Drive amb OAuth d'usuari (no Service Account).

Fa servir els tokens d'/home/z/my-project/.gcp-oauth-tokens.json i el
client OAuth d'/home/z/my-project/.gcp-oauth-client.json. Refresca el
access_token automàticament quan caduca.

Aquesta és la manera de pujar arxius al Drive de l'usuari real (que
sí té quota), no pas a la carpeta buida del Service Account.
"""
import json
import time
import requests
import io
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from google.oauth2.credentials import Credentials

OAUTH_TOKENS_PATH = Path("/home/z/my-project/.gcp-oauth-tokens.json")
OAUTH_CLIENT_PATH = Path("/home/z/my-project/.gcp-oauth-client.json")

# Caché
_creds_cache = {"creds": None, "expires": 0}


def _load_client_info() -> dict:
    """Llegeix client_id i client_secret del fitxer OAuth client."""
    data = json.loads(OAUTH_CLIENT_PATH.read_text())
    inst = data.get("installed", data)
    return {
        "client_id": inst["client_id"],
        "client_secret": inst["client_secret"],
    }


def _refresh_token() -> dict:
    """Refresca l'access_token fent servir el refresh_token."""
    tokens = json.loads(OAUTH_TOKENS_PATH.read_text())
    client = _load_client_info()

    r = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "client_id": client["client_id"],
            "client_secret": client["client_secret"],
            "refresh_token": tokens["refresh_token"],
            "grant_type": "refresh_token",
        },
        timeout=30,
    )
    if r.status_code != 200:
        raise Exception(f"Refresh token failed: HTTP {r.status_code}: {r.text[:300]}")

    new_tokens = r.json()
    # Combinar amb els existents (el refresh_token no es torna a enviar)
    tokens.update({
        "access_token": new_tokens["access_token"],
        "expires_in": new_tokens["expires_in"],
        "expires_at": int(time.time()) + new_tokens["expires_in"] - 60,  # marge 60s
    })
    OAUTH_TOKENS_PATH.write_text(json.dumps(tokens, indent=2))
    return tokens


def get_user_credentials() -> Credentials:
    """Retorna credencials OAuth d'usuari vàlides. Caché 50 min."""
    if _creds_cache["creds"] and time.time() < _creds_cache["expires"]:
        return _creds_cache["creds"]

    tokens = json.loads(OAUTH_TOKENS_PATH.read_text())
    now = int(time.time())

    # Si el token caduca en menys de 5 min, refrescar
    if tokens.get("expires_at", 0) - now < 300:
        print("  → Refrescant OAuth token...")
        tokens = _refresh_token()

    creds = Credentials(
        token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=_load_client_info()["client_id"],
        client_secret=_load_client_info()["client_secret"],
        scopes=["https://www.googleapis.com/auth/drive"],
    )
    _creds_cache["creds"] = creds
    _creds_cache["expires"] = tokens["expires_at"] - 60
    return creds


def get_user_drive_service():
    """Retorna un servei Drive autenticat amb OAuth d'usuari."""
    creds = get_user_credentials()
    return build("drive", "v3", credentials=creds)


def find_folder_id(drive, name: str, parent_id: str = None) -> str | None:
    """Busca una carpeta per nom dins d'un parent (o al root si parent_id és None)."""
    q = f"name='{name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        q += f" and '{parent_id}' in parents"
    r = drive.files().list(q=q, spaces="drive", fields="files(id,name)", pageSize=10).execute()
    files = r.get("files", [])
    return files[0]["id"] if files else None


def find_informes_root(drive) -> str:
    """Busca la carpeta pare 'Criteri ESG Informes' (o variants)."""
    for name in ["Criteri ESG Informes", "Informes", "informes"]:
        folder_id = find_folder_id(drive, name)
        if folder_id:
            return folder_id
    raise FileNotFoundError(
        "Carpeta 'Criteri ESG Informes' no trobada al Drive de l'usuari. "
        "Crea-la o comprova que el OAuth token té accés."
    )


def get_subfolder_id(drive, name: str) -> str:
    """Busca una subcarpeta dins de 'Criteri ESG Informes'. La crea si no existeix."""
    parent_id = find_informes_root(drive)
    folder_id = find_folder_id(drive, name, parent_id)
    if folder_id:
        return folder_id

    # Crear
    file_metadata = {
        "name": name,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [parent_id],
    }
    created = drive.files().create(body=file_metadata, fields="id").execute()
    return created["id"]


def upload_file(drive, local_path: Path, drive_filename: str, folder_id: str, mime_type: str = None) -> str:
    """Puja un arxiu local a Drive. Retorna l'ID de l'arxiu creat."""
    if mime_type is None:
        # Detectar per extensió
        ext = local_path.suffix.lower()
        mime_type = {
            ".pdf": "application/pdf",
            ".json": "application/json",
            ".md": "text/markdown",
            ".txt": "text/plain",
        }.get(ext, "application/octet-stream")

    media = MediaIoBaseUpload(
        io.BytesIO(local_path.read_bytes()),
        mimetype=mime_type,
        resumable=False,
    )
    metadata = {"name": drive_filename, "parents": [folder_id]}
    result = drive.files().create(body=metadata, media_body=media, fields="id").execute()
    return result["id"]


def list_files_in_folder(drive, folder_id: str) -> list:
    """Llista els arxius d'una carpeta."""
    r = drive.files().list(
        q=f"'{folder_id}' in parents and trashed=false",
        spaces="drive",
        fields="files(id,name,size)",
        pageSize=200,
    ).execute()
    return r.get("files", [])


if __name__ == "__main__":
    print("=== Test OAuth Drive client ===")
    try:
        drive = get_user_drive_service()
        # Llistar primers 5 arxius del Drive de l'usuari
        r = drive.files().list(pageSize=5, fields="files(id,name,mimeType)").execute()
        print(f"\n✓ Connexió OK. Primers 5 arxius del Drive de l'usuari:")
        for f in r.get("files", []):
            print(f"  - {f['name']} ({f['mimeType']})")

        # Buscar carpeta 'Criteri ESG Informes'
        try:
            folder_id = find_informes_root(drive)
            print(f"\n✓ Carpeta 'Criteri ESG Informes' trobada (ID: {folder_id})")

            # Llistar subcarpetes
            r = drive.files().list(
                q=f"'{folder_id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false",
                fields="files(id,name)",
            ).execute()
            print(f"  Subcarpetes:")
            for f in r.get("files", []):
                print(f"    - {f['name']} (ID: {f['id']})")
        except FileNotFoundError as e:
            print(f"\n✗ {e}")

    except Exception as e:
        print(f"\n✗ Error: {e}")
