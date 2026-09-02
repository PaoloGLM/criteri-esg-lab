"""
drive_helper.py — Operacions Google Drive per al scraper.

Funcions:
- upload_to_originals(pdf_path, title): puja PDF a carpeta 0-originals
- upload_manifest(local_path): puja manifest.json a Drive
- download_manifest(): baixa manifest.json de Drive
- download_manifest(): baixa manifest.json de Drive

Credencials: Service Account (GCP_SERVICE_ACCOUNT_PATH) o OAuth usuari
segons el que estigui configurat a .env.local.
"""
import os
import json
from pathlib import Path

DRIVE_FOLDER_NAME = "Criteri ESG Informes"
ORIGINALS_SUBFOLDER = "0-originals"


def _get_drive_service():
    """Retorna servei Drive (service account)."""
    sa_path = os.getenv("GCP_SERVICE_ACCOUNT_PATH", "")
    # Fallback: root del repo, després scripts/
    if not sa_path or not Path(sa_path).exists():
        for candidate in [Path(__file__).parent.parent / ".gcp-service-account.json", Path(__file__).parent / ".gcp-service-account.json"]:
            if candidate.exists():
                sa_path = str(candidate)
                break
    if not sa_path or not Path(sa_path).exists():
        raise FileNotFoundError(f"Service Account JSON no trobat (prova GCP_SERVICE_ACCOUNT_PATH, .gcp-service-account.json al root, o scripts/)")
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    SCOPES = ["https://www.googleapis.com/auth/drive"]
    creds = service_account.Credentials.from_service_account_file(sa_path, scopes=SCOPES)
    return build("drive", "v3", credentials=creds)


def _find_folder(service, name: str, parent_id: str | None = None) -> str | None:
    """Busca carpeta per nom (opcionalment dins d'un pare)."""
    q = f"name='{name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        q += f" and '{parent_id}' in parents"
    results = service.files().list(q=q, spaces="drive", fields="files(id, name)").execute()
    files = results.get("files", [])
    return files[0]["id"] if files else None


def _ensure_folder(service, name: str, parent_id: str | None = None) -> str:
    """Busca o crea carpeta."""
    fid = _find_folder(service, name, parent_id)
    if fid:
        return fid
    meta = {"name": name, "mimeType": "application/vnd.google-apps.folder"}
    if parent_id:
        meta["parents"] = [parent_id]
    created = service.files().create(body=meta, fields="id").execute()
    return created["id"]


def get_originals_folder_id() -> str:
    """Retorna l'ID de la carpeta 0-originals (la crea si no existeix)."""
    service = _get_drive_service()
    root = _ensure_folder(service, DRIVE_FOLDER_NAME)
    return _ensure_folder(service, ORIGINALS_SUBFOLDER, root)


def upload_to_originals(pdf_path: Path, title: str = "") -> dict:
    """Puja un PDF a 0-originals. Retorna metadata."""
    from googleapiclient.http import MediaFileUpload

    service = _get_drive_service()
    folder_id = get_originals_folder_id()

    # Nom de fitxer: slug títol + data
    safe_title = "".join(c if c.isalnum() or c in "-_ " else "" for c in title).strip()[:60]
    date_prefix = Path(pdf_path.stem).name[:10] if Path(pdf_path.stem).name[:4].isdigit() else ""
    filename = pdf_path.name
    if safe_title and safe_title not in filename:
        filename = f"{date_prefix}_{safe_title}.pdf" if date_prefix else f"{safe_title}.pdf"

    meta = {"name": filename, "parents": [folder_id]}
    media = MediaFileUpload(str(pdf_path), mimetype="application/pdf", resumable=True)
    result = service.files().create(body=meta, media_body=media, fields="id, name, webViewLink").execute()
    return result


def upload_manifest(local_path: Path) -> dict:
    """Puja manifest.json a Drive (a l'arrel de la carpeta Informes)."""
    from googleapiclient.http import MediaFileUpload

    service = _get_drive_service()
    root = _ensure_folder(service, DRIVE_FOLDER_NAME)

    # Buscar manifest existent
    q = f"name='manifest.json' and '{root}' in parents and trashed=false"
    results = service.files().list(q=q, spaces="drive", fields="files(id)").execute()
    files = results.get("files", [])

    media = MediaFileUpload(str(local_path), mimetype="application/json", resumable=False)
    if files:
        return service.files().update(fileId=files[0]["id"], media_body=media, fields="id").execute()
    meta = {"name": "manifest.json", "parents": [root]}
    return service.files().create(body=meta, media_body=media, fields="id").execute()


def download_manifest() -> dict | None:
    """Baixa manifest.json de Drive. Retorna dict o None si no existeix."""
    from googleapiclient.http import MediaIoBaseDownload
    import io

    try:
        service = _get_drive_service()
        root = _find_folder(service, DRIVE_FOLDER_NAME)
        if not root:
            return None
        q = f"name='manifest.json' and '{root}' in parents and trashed=false"
        results = service.files().list(q=q, spaces="drive", fields="files(id)").execute()
        files = results.get("files", [])
        if not files:
            return None
        request = service.files().get_media(fileId=files[0]["id"])
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
        return json.loads(fh.getvalue().decode("utf-8"))
    except Exception as e:
        print(f"[drive_helper] ERROR baixant manifest: {e}")
        return None