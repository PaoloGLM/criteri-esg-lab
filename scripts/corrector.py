"""
Corrector ortogràfic automatitzat amb Gemini 2.5 Flash.
Revisa textos en català i castellà i reporta errors.

Ús:
    scripts/.venv/bin/python scripts/corrector.py <fitxer> [ca|es]
"""
import sys, os, json, requests, time
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path("/home/z/my-project/criteri-esg-lab/assets/web/.env.local"))

SERVICE_ACCOUNT_PATH = "/home/z/my-project/.gcp-service-account.json"

def get_token():
    from google.oauth2 import service_account
    import google.auth.transport.requests
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_PATH,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    creds.refresh(google.auth.transport.requests.Request())
    return creds.token

def correct_text(text: str, lang: str = "ca") -> list:
    """Corregeix text amb Gemini. Retorna llista d'errors trobats."""
    token = get_token()
    url = "https://europe-west1-aiplatform.googleapis.com/v1/projects/criteri-esg/locations/europe-west1/publishers/google/models/gemini-2.5-flash:generateContent"

    lang_name = "català" if lang == "ca" else "castellano"
    prompt = f"""Revisa aquest text en {lang_name} i troba errors ortogràfics, gramaticals o d'estil.
Torna un JSON amb aquesta estructura:
{{
  "errors": [
    {{
      "original": "text amb l'error",
      "correccio": "text corregit",
      "tipus": "ortografia|gramatica|estil|anglicisme",
      "explicacio": "breu explicació"
    }}
  ]
}}

Si no hi ha errors, torna: {{"errors": []}}

Text a revisar:
{text}"""

    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 2000, "response_mime_type": "application/json"},
    }

    r = requests.post(url, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, json=payload, timeout=60)
    if r.status_code != 200:
        print(f"  ✗ Gemini HTTP {r.status_code}: {r.text[:200]}")
        return []

    data = r.json()
    text_resp = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

    try:
        parsed = json.loads(text_resp)
        return parsed.get("errors", [])
    except:
        return []


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Ús: corrector.py <fitxer> [ca|es]")
        sys.exit(1)

    filepath = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else "ca"

    text = Path(filepath).read_text(encoding="utf-8")
    # Limitar a 10000 chars
    if len(text) > 10000:
        text = text[:10000] + "..."

    print(f"=== Corrector ({lang}) ===")
    print(f"Fitxer: {filepath}")
    print(f"Text: {len(text)} chars")
    print()

    errors = correct_text(text, lang)

    if not errors:
        print("✓ No s'han trobat errors.")
    else:
        print(f"✗ {len(errors)} errors trobats:\n")
        for i, e in enumerate(errors, 1):
            print(f"  {i}. [{e.get('tipus', '?')}] '{e.get('original', '')}' → '{e.get('correccio', '')}'")
            print(f"     {e.get('explicacio', '')}")
            print()
