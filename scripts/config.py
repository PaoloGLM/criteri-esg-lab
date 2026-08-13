"""
Configuració central pel flux de creació d'informes Criteri ESG.

Llegeix credencials de variables d'entorn (arxiu .env.local a la carpeta web).
Defineix els noms de les carpetes de Google Drive i el model de Gemini per defecte.
"""
import os
import json
import re
from pathlib import Path
from dotenv import load_dotenv

# Carregar .env.local des de la carpeta web
WEB_DIR = Path(__file__).resolve().parent.parent / "assets" / "web"
ENV_FILE = WEB_DIR / ".env.local"
load_dotenv(ENV_FILE)

# === Gemini ===
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-3-flash-preview"  # gratuït (free tier); alternativa PRO: gemini-3.1-pro-preview (pagament)

# === Gemini free tier (detecció i tasques de recerca, sense cost) ===
GEMINI_FREE_API_KEY = os.getenv("GEMINI_FREE_API_KEY", "")
GEMINI_FREE_MODEL = "gemini-3-flash-preview"

# === OpenRouter (Nemotron 3 Ultra) ===
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "nvidia/nemotron-3-ultra:free"

def get_openrouter_client():
    """Retorna client OpenAI/OpenRouter configurat."""
    if not OPENROUTER_API_KEY:
        raise ValueError(
            "OPENROUTER_API_KEY no configurada. Crea-la a https://openrouter.ai/keys "
            "i posa-la a assets/web/.env.local"
        )
    from openai import OpenAI
    return OpenAI(base_url=OPENROUTER_BASE_URL, api_key=OPENROUTER_API_KEY)

# === Google Drive ===
GCP_SERVICE_ACCOUNT_PATH = os.getenv(
    "GCP_SERVICE_ACCOUNT_PATH",
    "/home/z/my-project/.gcp-service-account.json",
)
DRIVE_ROOT_FOLDER_ID = os.getenv("DRIVE_ROOT_FOLDER_ID", "")  # s'omple després

# Noms de les subcarpetes dins de "Criteri ESG/informes/"
DRIVE_FOLDERS = {
    "0_originals": "0-originals",
    "1_distilats": "1-distilats",
    "2_aportacions_gemini": "2-aportacions-gemini",
    "3_fets": "3-fets",
    "4_revisats_ortografia": "4-revisats-ortografia",
    "5_validats_paolo": "5-validats-paolo",
    "6_publicats": "6-publicats",
}

# === Paths locals ===
PROJECT_ROOT = Path(__file__).resolve().parent.parent
STATE_DIR = Path(__file__).resolve().parent / "state"
STATE_DIR.mkdir(exist_ok=True)


def load_font_urls() -> dict:
    """Carrega les fonts institucionals des de 16-BASE-DADES-FONTS.md.

    Retorna {nom_font: url} llegint les taules markdown del document viu
    (v2.1, 192 fonts). Si el fitxer no existeix, retorna un diccionari buit.
    """
    fonts_file = PROJECT_ROOT / "16-BASE-DADES-FONTS.md"
    urls = {}
    if not fonts_file.exists():
        print(f"[config] AVÍS: {fonts_file.name} no trobat; FONT_URLS buit.")
        return urls
    for line in fonts_file.read_text(encoding="utf-8").splitlines():
        # Format: | # | Font | Tipus | URL | Periodicitat | ID Drive |
        m = re.match(r"^\|\s*\d+\s*\|\s*([^|]+?)\s*\|\s*[^|]*\s*\|\s*(https?://\S+?)\s*\|", line)
        if m:
            name = m.group(1).strip()
            url = m.group(2).strip()
            if name and url:
                urls[name] = url
    return urls


FONT_URLS = load_font_urls()


def get_gemini_client():
    """Retorna client de Gemini (paquet nou google-genai) autenticat."""
    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY no configurada. Crea-la a https://aistudio.google.com/app/apikey "
            "i posa-la a assets/web/.env.local"
        )
    from google import genai
    return genai.Client(api_key=GEMINI_API_KEY)


def get_gemini_free_client():
    """Retorna client de Gemini amb la clau free tier (GEMINI_FREE_API_KEY).

    Usar per a tasques de recerca/detecció que no han de generar despesa:
    el model per defecte és gemini-3-flash-preview (gratuït).
    """
    if not GEMINI_FREE_API_KEY:
        raise ValueError(
            "GEMINI_FREE_API_KEY no configurada. Posa la clau free tier (AIza...) "
            "a assets/web/.env.local com a GEMINI_FREE_API_KEY"
        )
    from google import genai
    return genai.Client(api_key=GEMINI_FREE_API_KEY)


def get_drive_service():
    """DEPRECAT — NO USAR PER A DRIVE.

    Aquesta funció (Service Account) només veu les carpetes compartides amb el bot,
    no el Drive complet de l'usuari. Per a qualsevol operació de Drive, utilitzar
    `drive_user_client.get_user_drive_service()` (OAuth d'usuari, visió completa).
    El Service Account queda reservat exclusivament per a Gemini/Vertex AI.
    """
    if not Path(GCP_SERVICE_ACCOUNT_PATH).exists():
        raise FileNotFoundError(
            f"Service Account JSON no trobat a {GCP_SERVICE_ACCOUNT_PATH}. "
            "Descarrega'l de Google Cloud Console i posa'l allà."
        )
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    SCOPES = ["https://www.googleapis.com/auth/drive"]
    creds = service_account.Credentials.from_service_account_file(
        GCP_SERVICE_ACCOUNT_PATH, scopes=SCOPES
    )
    return build("drive", "v3", credentials=creds)


def get_service_account_email() -> str:
    """Retorna l'email del Service Account (per verificar compartició Drive)."""
    with open(GCP_SERVICE_ACCOUNT_PATH, "r") as f:
        data = json.load(f)
    return data.get("client_email", "")


def call_gemini_safe(client, model, system_prompt, user_prompt, temperature=0.3, max_tokens=8000):
    """
    Crida Gemini amb gestió d'errors 429: si es bloqueja, espera 60 segons
    i reintenta (política de paciència per al pla gratuït).
    """
    import time
    # Importem l'excepció directament des del paquet genai
    from google.genai.errors import APIError

    while True:
        try:
            response = client.models.generate_content(
                model=model,
                contents=user_prompt,
                config={
                    "system_instruction": system_prompt,
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )
            return response.text
        except APIError as e:
            # Comprovem si és un error de limitació (429)
            if e.code == 429:
                print(f"[!] Error 429: Quota saturada. Esperant 60 segons abans de reintentar...")
                time.sleep(60)
            else:
                # Si és un altre error, pugem l'excepció
                raise e



def find_informes_root(drive_service) -> str:
    """
    Busca la carpeta pare 'Informes' o 'informes' al Drive del service account.
    Retorna el folder ID. Es guarda a state/drive-state.json per no cercar cada vegada.
    """
    state_file = STATE_DIR / "drive-state.json"
    if state_file.exists():
        with open(state_file, "r") as f:
            state = json.load(f)
        if "informes_folder_id" in state:
            return state["informes_folder_id"]

    # Buscar carpeta pare (provem diversos noms possibles)
    for name in ["Criteri ESG Informes", "informes", "Informes", "INFORMES"]:
        results = drive_service.files().list(
            q=f"name='{name}' and mimeType='application/vnd.google-apps.folder' and trashed=false",
            spaces="drive",
            fields="files(id, name, parents)",
        ).execute()
        files = results.get("files", [])
        if files:
            folder_id = files[0]["id"]
            with open(state_file, "w") as f:
                json.dump({"informes_folder_id": folder_id}, f, indent=2)
            return folder_id

    raise FileNotFoundError(
        "Carpeta 'Criteri ESG Informes' (o 'informes') no trobada al Drive. Crea-la i comparteix-la amb: "
        + get_service_account_email()
    )


def get_subfolder_id(drive_service, key: str) -> str:
    """
    Retorna el folder ID d'una subcarpeta (ex: '0_originals').
    La busca dins de 'informes/'. Si no existeix, la crea.
    """
    parent_id = find_informes_root(drive_service)
    folder_name = DRIVE_FOLDERS[key]

    # Buscar
    results = drive_service.files().list(
        q=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' "
          f"and '{parent_id}' in parents and trashed=false",
        spaces="drive",
        fields="files(id, name)",
    ).execute()
    files = results.get("files", [])
    if files:
        return files[0]["id"]

    # Crear
    file_metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [parent_id],
    }
    created = drive_service.files().create(body=file_metadata, fields="id").execute()
    return created["id"]


if __name__ == "__main__":
    # Test ràpid
    print("=== Test configuració ===")
    print(f"GEMINI_API_KEY: {'✓ configurada' if GEMINI_API_KEY else '✗ FALTA'}")
    print(f"GEMINI_MODEL: {GEMINI_MODEL}")
    print(f"Service Account path: {GCP_SERVICE_ACCOUNT_PATH}")
    print(f"Service Account email: {get_service_account_email()}")
    print(f"DRIVE_ROOT_FOLDER_ID: {DRIVE_ROOT_FOLDER_ID or '(pendent de verificar)'}")
    print(f"DRIVE_FOLDERS: {list(DRIVE_FOLDERS.values())}")
