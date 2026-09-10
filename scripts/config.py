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

# === Gemini 3.6 Flash (API de pagament — pas 3, revisió crítica) ===
GEMINI_PAID_MODEL = "gemini-3.6-flash"  # només pas 3 per contenir costos

# === DeepSeek v4 Pro (passos 2, 4 i 7) ===
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_MODEL = "deepseek-v4-pro"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"

# === OpenRouter (selecció de models de l'usuari) ===
# Paolo tria el pool a .env.local (OPENROUTER_MODEL_POOL); el selector sempre
# usa el MÉS BARAT DISPONIBLE del pool en el moment de cada crida.
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"

# Pool per defecte (si .env.local no defineix OPENROUTER_MODEL_POOL).
# Comma-separated; IDs d'OpenRouter. ":free" = $0.
_OPENROUTER_DEFAULT_POOL = [
    "z-ai/glm-5.3-flash:free",
    "z-ai/glm-4.7-flash",
    "z-ai/glm-5.2",
]

def get_openrouter_pool() -> list:
    """Retorna la selecció de models de l'usuari (de .env.local)."""
    raw = os.getenv("OPENROUTER_MODEL_POOL", "")
    if not raw.strip():
        return list(_OPENROUTER_DEFAULT_POOL)
    pool = [m.strip() for m in raw.split(",") if m.strip()]
    if not pool:
        return list(_OPENROUTER_DEFAULT_POOL)
    return pool

def get_openrouter_client():
    """Retorna client OpenAI/OpenRouter configurat."""
    if not OPENROUTER_API_KEY:
        raise ValueError(
            "OPENROUTER_API_KEY no configurada. Crea-la a https://openrouter.ai/keys "
            "i posa-la a assets/web/.env.local"
        )
    from openai import OpenAI
    return OpenAI(base_url=OPENROUTER_BASE_URL, api_key=OPENROUTER_API_KEY)

# --- Selector "més barat disponible" ---

# Cache de preus (TTL 6h): evita cridar /models a cada crida del flux.
_or_price_cache = {"ts": 0.0, "prices": {}}
_OR_PRICE_TTL = 6 * 3600

def fetch_openrouter_prices() -> dict:
    """Consulta preus reals de l'API pública d'OpenRouter (/api/v1/models).

    Retorna {model_id: prompt_price_per_token}. Amb cache 6h.
    """
    import time
    now = time.time()
    if _or_price_cache["prices"] and now - _or_price_cache["ts"] < _OR_PRICE_TTL:
        return _or_price_cache["prices"]
    import json
    import urllib.request
    req = urllib.request.Request(
        f"{OPENROUTER_BASE_URL}/models",
        headers={"User-Agent": "criteri-esg-flux/1.0"},
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.load(r)["data"]
    prices = {}
    for m in data:
        p = m.get("pricing", {}) or {}
        try:
            prices[m["id"]] = float(p.get("prompt") or 0)
        except (TypeError, ValueError):
            prices[m["id"]] = 0.0
    _or_price_cache["ts"] = now
    _or_price_cache["prices"] = prices
    return prices

def pick_cheapest_available(pool: list = None) -> str:
    """Del pool seleccionat per l'usuari, tria el model MÉS BARAT que existeix
    i està actiu al catàleg d'OpenRouter ara mateix.

    Els models morts (retirats del catàleg, com passa amb els :free quan
    l'editor els tanca) queden exclosos automàticament.
    Si cap del pool és trobat al catàleg, retorna el primer del pool
    (l'error real de la crida ho destaparà).
    """
    pool = pool or get_openrouter_pool()
    try:
        prices = fetch_openrouter_prices()
    except Exception as e:
        print(f"[openrouter] AVÍS: no puc consultar preus ({e}); uso l'ordre del pool.")
        return pool[0]
    live = [m for m in pool if m in prices]
    if not live:
        print(f"[openrouter] AVÍS: cap model del pool és actiu a OpenRouter ({pool}).")
        return pool[0]
    cheapest = min(live, key=lambda m: (prices[m], live.index(m)))
    return cheapest

# TTL de la tria: dins d'un mateix procés (un informe) no reconsultem
# entre crides per estabilitat (un informe = un model).
_or_pick_cache = {"model": None}

def call_openrouter_auto(system_prompt: str, user_prompt: str,
                         temperature: float = 0.3, max_tokens: int = 4096) -> str:
    """Crida OpenRouter amb el model més barat disponible del pool de l'usuari.

    Si la crida falla (429, model mort, timeout), reintenta amb el següent
    del pool ordenat per preu.
    """
    from openai import OpenAI, APIError

    client = get_openrouter_client()
    pool = get_openrouter_pool()

    # Ordre de prova: per preu ascendent (més barat primer)
    try:
        prices = fetch_openrouter_prices()
        candidates = sorted(
            [m for m in pool if m in prices],
            key=lambda m: (prices[m], pool.index(m)),
        ) + [m for m in pool if m not in prices]
    except Exception:
        candidates = list(pool)

    # Dins del mateix procés, mantén el model triat (un informe = un model)
    if _or_pick_cache["model"] in candidates:
        candidates = (
            [_or_pick_cache["model"]]
            + [m for m in candidates if m != _or_pick_cache["model"]]
        )

    last_err = None
    for model in candidates:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            content = response.choices[0].message.content
            if content is None:
                reasoning = getattr(response.choices[0].message, "reasoning_content", None)
                content = reasoning or ""
            if _or_pick_cache["model"] is None:
                _or_pick_cache["model"] = model
            return content
        except (APIError, Exception) as e:
            last_err = e
            print(f"[openrouter] Model {model} ha fallat ({type(e).__name__}): "
                  f"{str(e)[:160]}; probant el següent del pool...")
    raise RuntimeError(f"Cap model del pool ha funcionat. Últim error: {last_err}")

# === OpenRouter (GLM 5.2 Free) ===
GLM_FREE_MODEL = "z-ai/glm-5.2:free"

# === OpenRouter (Nemotron 3 Ultra Free) ===
NEMOTRON_3_ULTRA_FREE = "nvidia/nemotron-3-ultra-550b-a55b:free"

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


def get_deepseek_client():
    """Retorna client OpenAI-compatible per DeepSeek v4 Pro (API oficial)."""
    if not DEEPSEEK_API_KEY:
        raise ValueError(
            "DEEPSEEK_API_KEY no configurada. Posa-la a assets/web/.env.local"
        )
    from openai import OpenAI
    return OpenAI(base_url=DEEPSEEK_BASE_URL, api_key=DEEPSEEK_API_KEY)


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
