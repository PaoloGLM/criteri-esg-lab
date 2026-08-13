""" 
Client Gemini 3.6 Flash (API de pagament, compte PRO).

Pas 3 del flux (revisió crítica + advocat del diable) — l'únic pas
que consumeix API de pagament per disseny.

Ús:
    scripts/.venv/bin/python scripts/gemini_paid_client.py  # test ràpid
"""
import sys
import json
import re
import time
from pathlib import Path

sys.path.insert(0, "./scripts")
from config import GEMINI_API_KEY, GEMINI_PAID_MODEL, call_gemini_safe


def get_gemini_paid_client():
    """Retorna client Gemini amb la clau PRO (GEMINI_API_KEY, de pagament)."""
    from google import genai
    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY no configurada. Posa la clau PRO (AQ...) "
            "a assets/web/.env.local com a GEMINI_API_KEY"
        )
    return genai.Client(api_key=GEMINI_API_KEY)


def call_gemini_paid(system_prompt: str, user_prompt: str, temperature: float = 0.7, max_tokens: int = 16000) -> str:
    """Crida Gemini 3.6 Flash amb retry 429 (call_gemini_safe)."""
    client = get_gemini_paid_client()
    return call_gemini_safe(
        client, GEMINI_PAID_MODEL, system_prompt, user_prompt,
        temperature=temperature, max_tokens=max_tokens,
    )


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

    # Intent 3: reparar problemes comuns (comes finals)
    try:
        fixed = re.sub(r",\s*([}\]])", r"\1", text)
        return json.loads(fixed)
    except json.JSONDecodeError as e:
        raise Exception(f"JSON parse failed: {e}. Resposta (300 chars): {text[:300]}")


if __name__ == "__main__":
    print("=== Test Gemini 3.6 Flash (pagament) ===")
    result = call_gemini_paid_json(
        "Ets un assistent. Torna un JSON.",
        'Digues Hola en catala. Torna {"ok": true, "missatge": "la teva resposta"}',
        max_tokens=200,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
