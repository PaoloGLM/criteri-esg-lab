""" 
Client Gemini 3.6 Flash (API de pagament, compte PRO).

Pas 3 del flux (revisió crítica + advocat del diable) — l'únic pas
que consumeix API de pagament per disseny.

Fa servir l'endpoint REST directe (requests) perquè el SDK google-genai
dona errors amb els models 3.6 (respostes estranyes/timeouts) mentre que
la crida REST funciona correctament (verificat 13-agost-2026).

Ús:
    scripts/.venv/bin/python scripts/gemini_paid_client.py  # test ràpid
"""
import sys
import json
import re
import time
import requests
from pathlib import Path

sys.path.insert(0, "./scripts")
from config import GEMINI_API_KEY, GEMINI_PAID_MODEL

API_BASE = "https://generativelanguage.googleapis.com/v1beta"

# Comptatge de tokens (mateix fitxer que deepseek_client per consolidar costos)
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


def call_gemini_paid(system_prompt: str, user_prompt: str, temperature: float = 0.7, max_tokens: int = 16000, timeout: int = 120) -> str:
    """Crida Gemini 3.6 Flash via REST. Amb retry 429 (espera 60s)."""
    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY no configurada. Posa la clau PRO (AQ...) "
            "a assets/web/.env.local com a GEMINI_API_KEY"
        )

    url = f"{API_BASE}/models/{GEMINI_PAID_MODEL}:generateContent?key={GEMINI_API_KEY}"
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
            # Comptatge de tokens per càlcul de costos
            try:
                um = data.get("usageMetadata", {})
                _record_usage(
                    GEMINI_PAID_MODEL, "gemini-paid",
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


def call_gemini_paid_json(system_prompt: str, user_prompt: str, temperature: float = 0.7, max_tokens: int = 16000) -> dict:
    text = call_gemini_paid(system_prompt, user_prompt, temperature, max_tokens)

    # Intent 1: parsejar directament
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Intent 2: extreure el primer {...} de la resposta
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass

    # Intent 3: reparar problemes comuns (comes finals, blocs ```json)
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip())
    try:
        fixed = re.sub(r",\s*([}\]])", r"\1", cleaned)
        return json.loads(fixed)
    except json.JSONDecodeError as e:
        raise Exception(f"JSON parse failed: {e}. Resposta (300 chars): {text[:300]}")


if __name__ == "__main__":
    print("=== Test Gemini 3.6 Flash (pagament) ===")
    result = call_gemini_paid_json(
        "Ets un assistent. Torna un JSON.",
        'Torna un JSON: {"ok": true, "missatge": "hola"}',
        max_tokens=500,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
