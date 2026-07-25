"""
Client de Gemini via Vertex AI (europe-west1) amb Service Account.

Fa servir el model gemini-2.5-flash (l'únic disponible al juliol 2026;
gemini-2.0-flash ha estat retirat per Google).
"""
import sys
import os
import json
from pathlib import Path

sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from config import GCP_SERVICE_ACCOUNT_PATH

from google.oauth2 import service_account
import google.auth.transport.requests
import requests

# Caché del token (s'actualitza cada 50 min)
_token_cache = {"token": None, "expires": 0}
import time

PROJECT_ID = "criteri-esg"
LOCATION = "europe-west1"
MODEL = "gemini-2.5-flash"


def get_token() -> str:
    """Retorna un access token vàlid pel Service Account. Caché 50 min."""
    if _token_cache["token"] and time.time() < _token_cache["expires"]:
        return _token_cache["token"]

    creds = service_account.Credentials.from_service_account_file(
        GCP_SERVICE_ACCOUNT_PATH,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    creds.refresh(google.auth.transport.requests.Request())
    _token_cache["token"] = creds.token
    _token_cache["expires"] = time.time() + 50 * 60
    return creds.token


def call_gemini(system_prompt: str, user_prompt: str, temperature: float = 0.6, max_tokens: int = 4000) -> str:
    """Crida Gemini 2.5 Flash i retorna la resposta de text."""
    token = get_token()
    url = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL}:generateContent"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
            "response_mime_type": "application/json",
            "response_schema": {
                "type": "OBJECT",
                "properties": {
                    "propostes": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "bloc": {"type": "STRING"},
                                "tipus": {"type": "STRING"},
                                "proposta": {"type": "STRING"},
                                "justificacio": {"type": "STRING"},
                            },
                            "required": ["bloc", "tipus", "proposta", "justificacio"],
                        },
                    },
                    "advocat_diable": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "tipus": {"type": "STRING"},
                                "bloc_afectat": {"type": "STRING"},
                                "observacio": {"type": "STRING"},
                                "evidencia_original": {"type": "STRING"},
                            },
                            "required": ["tipus", "bloc_afectat", "observacio", "evidencia_original"],
                        },
                    },
                },
                "required": ["propostes", "advocat_diable"],
            },
        },
    }

    r = requests.post(url, headers=headers, json=payload, timeout=120)
    if r.status_code != 200:
        raise Exception(f"Gemini HTTP {r.status_code}: {r.text[:500]}")

    data = r.json()
    candidates = data.get("candidates", [])
    if not candidates:
        raise Exception(f"Gemini sense candidates: {json.dumps(data)[:300]}")
    text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
    return text


def call_gemini_json(system_prompt: str, user_prompt: str, temperature: float = 0.6, max_tokens: int = 4000) -> dict:
    """Crida Gemini i parseja la resposta com a JSON amb tolerància a errors."""
    text = call_gemini(system_prompt, user_prompt, temperature, max_tokens)

    # Intent 1: parsejar directament
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Intent 2: extreure el primer {...} de la resposta
    import re
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass

    # Intent 3: reparar problemes comuns (comes finals, comes entre elements)
    try:
        # Treure comes finals abans de } o ]
        fixed = re.sub(r",\s*([}\]])", r"\1", text)
        return json.loads(fixed)
    except json.JSONDecodeError as e:
        raise Exception(f"JSON parse failed: {e}. Resposta (300 chars): {text[:300]}")


if __name__ == "__main__":
    print("=== Test Gemini client ===")
    result = call_gemini_json(
        "Ets un assistent. Torna un JSON amb la resposta.",
        "Torna un JSON amb aquesta estructura: {\"ok\": true, \"message\": \"Hola\"}",
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
