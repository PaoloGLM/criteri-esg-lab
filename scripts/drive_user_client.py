"""
Client de Google Drive per Criteri ESG.

Prioritat:
1. OAuth d'usuari (tokens a .gcp-oauth-tokens.json) — accés al Drive personal,
   NO caduca (mode production des d'agost 2026).
2. Service Account (service-account.json) — fallback per a CI/GitHub Actions.

Ús en scripts: from drive_user_client import get_user_drive_service
"""
import json
import os
import time
import io
import requests
from pathlib import Path
from dotenv import load_dotenv

# Carregar .env.local si existeix
_env_path = Path(__file__).resolve().parent.parent / "assets" / "web" / ".env.local"
if _env_path.exists():
    load_dotenv(_env_path)

from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account

BASE_DIR = Path(__file__).resolve().parent
OAUTH_TOKENS_PATH = BASE_DIR / ".gcp-oauth-tokens.json"
OAUTH_CLIENT_PATH = BASE_DIR / ".gcp-oauth-client.json"
SERVICE_ACCOUNT_PATH = BASE_DIR / "service-account.json"

DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive"]

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
    tokens.update({
        "access_token": new_tokens["access_token"],
        "expires_in": new_tokens["expires_in"],
        "expires_at": int(time.time()) + new_tokens["expires_in"] - 60,
    })
    OAUTH_TOKENS_PATH.write_text(json.dumps(tokens, indent=2))
    return tokens


def _get_user_oauth_creds() -> Credentials | None:
    """Credencials OAuth d'usuari (si hi ha tokens vàlids)."""
    if not OAUTH_TOKENS_PATH.exists():
        return None
    tokens = json.loads(OAUTH_TOKENS_PATH.read_text())
    now = int(time.time())

    # Si el token caduca en menys de 5 min, refrescar
    if tokens.get("expires_at", 0) - now < 300:
        try:
            print("  → Refrescant OAuth token...")
            tokens = _refresh_token()
        except Exception as e:
            print(f"  ⚠ No s'ha pogut refrescar: {e}")
            return None

    client = _load_client_info()
    return Credentials(
        token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client["client_id"],
        client_secret=client["client_secret"],
        scopes=DRIVE_SCOPES,
    )


def _get_service_account_creds() -> Credentials | None:
    """Credencials de Service Account (fallback)."""
    if not SERVICE_ACCOUNT_PATH.exists():
        return None
    return service_account.Credentials.from_service_account_file(
        str(SERVICE_ACCOUNT_PATH), scopes=DRIVE_SCOPES
    )


def get_user_credentials() -> Credentials:
    """Retorna credencials vàlides: OAuth usuari, o Service Account com a fallback."""
    creds = _get_user_oauth_creds()
    if creds:
        return creds
    creds = _get_service_account_creds()
    if creds:
        return creds
    raise FileNotFoundError(
        "No hi ha credencials Google: falta .gcp-oauth-tokens.json (OAuth usuari) "
        "o service-account.json (Service Account)."
    )


def get_user_drive_service():
    """Retorna un servei Drive autenticat."""
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
    """Busca la carpeta 'Criteri ESG Informes' (flux d'informes)."""
    for name in ["Criteri ESG Informes", "Informes", "informes"]:
        folder_id = find_folder_id(drive, name)
        if folder_id:
            return folder_id
    # Si no existeix, buscar 'Criteri ESG'
    folder_id = find_folder_id(drive, "Criteri ESG")
    if folder_id:
        return folder_id
    raise FileNotFoundError(
        "Carpeta 'Criteri ESG Informes' o 'Criteri ESG' no trobada al Drive."
    )


def find_criteri_root(drive) -> str:
    """Busca la carpeta 'Criteri ESG' (pare)."""
    folder_id = find_folder_id(drive, "Criteri ESG")
    if folder_id:
        return folder_id
    raise FileNotFoundError("Carpeta 'Criteri ESG' no trobada al Drive.")


def get_subfolder_id(drive, name: str) -> str:
    """Busca una subcarpeta dins de 'Criteri ESG Informes'. La crea si no existeix."""
    parent_id = find_informes_root(drive)
    folder_id = find_folder_id(drive, name, parent_id)
    if folder_id:
        return folder_id
    file_metadata = {
        "name": name,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [parent_id],
    }
    created = drive.files().create(body=file_metadata, fields="id").execute()
    return created["id"]


def get_criteri_subfolder_id(drive, name: str) -> str:
    """Busca una subcarpeta dins de 'Criteri ESG'. La crea si no existeix."""
    parent_id = find_criteri_root(drive)
    folder_id = find_folder_id(drive, name, parent_id)
    if folder_id:
        return folder_id
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
        ext = local_path.suffix.lower()
        mime_type = {
            ".pdf": "application/pdf",
            ".json": "application/json",
            ".md": "text/markdown",
            ".txt": "text/plain",
            ".zip": "application/zip",
        }.get(ext, "application/octet-stream")

    media = MediaIoBaseUpload(
        io.BytesIO(local_path.read_bytes()),
        mimetype=mime_type,
        resumable=False,
    )
    metadata = {"name": drive_filename, "parents": [folder_id]}
    result = drive.files().create(body=metadata, media_body=media, fields="id, webViewLink").execute()
    return result


def list_files_in_folder(drive, folder_id: str) -> list:
    """Llista els fitxers d'una carpeta de Drive. Retorna [{'id','name','webViewLink'}]."""
    results = []
    page_token = None
    while True:
        resp = drive.files().list(
            q=f"'{folder_id}' in parents and trashed=false",
            fields="nextPageToken, files(id, name, webViewLink)",
            pageSize=100,
            pageToken=page_token,
        ).execute()
        results.extend(resp.get("files", []))
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    return results


def share_file_with_email(drive, file_id: str, email: str, role: str = "writer") -> None:
    """Comparteix un fitxer de Drive amb un email concret."""
    body = {
        "type": "user",
        "role": role,
        "emailAddress": email,
    }
    drive.permissions().create(fileId=file_id, body=body).execute()
