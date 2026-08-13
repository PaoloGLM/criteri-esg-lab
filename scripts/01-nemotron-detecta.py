""" 
Pas 1 del flux: Gemini detecta informes nous a les fonts institucionals.

1. Cerca a les fonts institucionals establertes (veure config.py: FONT_URLS)
2. Per cada PDF nou trobat:
   - Descarrega el PDF
   - Guarda a /data/informes/0-originals/
   - Registra a l'estat (data/informes/state/pending_detection.json)
3. Actualitza l'estat de deteccio

Us:
    scripts/.venv/bin/python scripts/01-nemotron-detecta.py

Configuracio: Necessita GEMINI_FREE_API_KEY al .env.local (clau free tier AIza...)
per usar gemini-3-flash-preview (gratuit). Si falta, cau a GEMINI_API_KEY.
"""
import sys
import json
import time
import requests
import hashlib
from pathlib import Path
from datetime import datetime

sys.path.insert(0, "./scripts")
from config import FONT_URLS, GEMINI_FREE_MODEL

ORIGINALS_DIR = Path("./data/informes/0-originals")
ORIGINALS_DIR.mkdir(parents=True, exist_ok=True)
STATE_DIR = Path("./data/informes/state")
STATE_DIR.mkdir(parents=True, exist_ok=True)
PENDING_FILE = Path("./data/informes/state/pending_detection.json")
HISTORY_FILE = Path("./data/informes/state/detection_history.json")

DETECTION_MODEL = GEMINI_FREE_MODEL  # gemini-3-flash-preview (gratuit)

def load_state(filepath: Path, default=None):
    if filepath.exists():
        return json.loads(filepath.read_text(encoding="utf-8"))
    return default if default is not None else {}

def save_state(filepath: Path, data: dict):
    filepath.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

def get_gemini_client():
    # Client REST directe (no SDK — el SDK 2.16 trunca respostes amb models 3.x)
    return None

def call_gemini(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 8000) -> str:
    # Usa gemini_free_client (REST directe, retry 429/503 amb espera de 60s)
    from gemini_free_client import call_gemini_free
    return call_gemini_free(
        system_prompt, user_prompt,
        temperature=temperature, max_tokens=max_tokens,
    )

def fetch_font_page(url: str) -> list:
    try:
        response = requests.get(url, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        response.raise_for_status()
        return []
    except Exception as e:
        print(f"  Error accedint a {url}: {e}")
        return []

def descarrega_pdf(url: str, dest_path: Path) -> bool:
    try:
        response = requests.get(url, timeout=60, stream=True, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        response.raise_for_status()
        content_type = response.headers.get("Content-Type", "")
        if "pdf" not in content_type.lower() and not url.lower().endswith(".pdf"):
            print(f"  No es PDF: {content_type}")
            return False
        with open(dest_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"  Error descarregant: {e}")
        return False

def generar_slug(url: str, title: str) -> str:
    base = hashlib.md5(url.encode()).hexdigest()[:8]
    return f"{datetime.now().strftime('%Y-%m-%d')}_{base}"

def processar_font(font_name: str, font_url: str, history: set) -> list:
    print(f"\n=== Processant font: {font_name} ===")
    print(f"  URL: {font_url}")
    print(f"  Parser no implementat per {font_name}. Cal implementar parser específic.")
    return []

def main():
    print("=== Pas 1: Gemini - Deteccio d'informes nous ===\n")
    print(f"Model: {DETECTION_MODEL} (via Gemini free tier)")
    print(f"Fonts configurades: {len(FONT_URLS)}\n")
    
    history = set(load_state(HISTORY_FILE, {}).get("processed_urls", []))
    print(f"URLs ja processades (historial): {len(history)}")
    
    pending = load_state(PENDING_FILE, {"pending": []})
    print(f"Pendents existents a processar: {len(pending.get('pending', []))}")
    
    total_nous = 0
    
    for font_name, font_url in FONT_URLS.items():
        nous_pdfs = processar_font(font_name, FONT_URLS[font_name], set())
        total_nous += len(nous_pdfs)
    
    print(f"\n=== Resum ===")
    print(f"  PDFs nous detectats: {total_nous}")
    
    if total_nous > 0:
        print(f"\nS'han detectat {total_nous} PDFs nous. Executa pas 2 per destil·lar.")

if __name__ == "__main__":
    main()