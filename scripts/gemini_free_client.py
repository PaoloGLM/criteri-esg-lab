""" 
Client Gemini free tier (REST directe).

Passos 1 (detecció) i 5 (ortografia) — feina gratuïta per disseny.

Fa servir l'endpoint REST directe (requests) perquè el SDK google-genai
2.16 TRUNCA les respostes llargues amb models 3.x (observat 13-agost-2026:
l'ortografia del pas 5 deixava els informes a 3 blocs dels 8).

Ús:
    scripts/.venv/bin/python scripts/gemini_free_client.py  # test ràpid
"""
import sys
import json
import re
import time
import requests
from pathlib import Path

sys.path.insert(0, "./scripts")
from config import GEMINI_FREE_API_KEY, GEMINI_FREE_MODEL

API_BASE = "https://generativelanguage.googleapis.com/v1beta"

# Comptatge de tokens (mateix fitxer que els altres clients)
USAGE_FILE = Path(__file__).resolve().parent.parent / "data" / "informes" / "state" / "token-usage.json"


def _record_usage(model: str, provider: str, prompt_tokens: int, completion_tokens: int):
    import json as _json
    import time as _time
    USAGE_FILE.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "ts": _time.strftime("%Y-%m-%dT%H:%M:%S"),
        "model": model,
        "provider": provider,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
    }
    data = []
    if USAGE_FILE.exists():
        try:
            data = _json.loads(USAGE_FILE.read_text(encoding="utf-8"))
        except Exception:
            data = []
    data.append(entry)
    USAGE_FILE.write_text(_json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def call_gemini_free(system_prompt: str, user_prompt: str, temperature: float = 0.2, max_tokens: int = 16000, timeout: int = 180) -> str:
    """Crida Gemini free tier via REST. Amb retry 429 i 503 (espera 60s)."""
    if not GEMINI_FREE_API_KEY:
        raise ValueError(
            "GEMINI_FREE_API_KEY no configurada. Posa la clau free tier (AIza...) "
            "a assets/web/.env.local com a GEMINI_FREE_API_KEY"
        )

    url = f"{API_BASE}/models/{GEMINI_FREE_MODEL}:generateContent?key={GEMINI_FREE_API_KEY}"
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
        },
    }

    while True:
        r = requests.post(url, json=payload, timeout=timeout)
        if r.status_code == 200:
            data = r.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise Exception(f"Gemini sense candidates: {json.dumps(data)[:300]}")
            parts = candidates[0].get("content", {}).get("parts", [])
            try:
                um = data.get("usageMetadata", {})
                _record_usage(
                    GEMINI_FREE_MODEL, "gemini-free",
                    um.get("promptTokenCount", 0),
                    um.get("candidatesTokenCount", 0),
                )
            except Exception:
                pass
            return "".join(p.get("text", "") for p in parts)
        if r.status_code == 429:
            print(f"[!] Error 429: Quota saturada. Esperant 60 segons abans de reintentar...")
            time.sleep(60)
            continue
        if r.status_code == 503:
            print(f"[!] Error 503: Model saturat temporalment. Esperant 60 segons abans de reintentar...")
            time.sleep(60)
            continue
        raise Exception(f"Gemini HTTP {r.status_code}: {r.text[:500]}")


if __name__ == "__main__":
    print("=== Test Gemini free (REST directe) ===")
    text = call_gemini_free(
        "Ets un assistent breu.",
        "Respon només: FREE-REST-OK",
        max_tokens=100,
    )
    print(f"Resposta: {text!r}")
