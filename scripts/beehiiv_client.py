"""
Client de l'API de Beehiiv per gestionar la newsletter de Criteri ESG.

Documentació: https://developers.beehiiv.com/v2/reference
Aquesta API permet:
- Crear esborranys (drafts) de newsletters
- Llistar esborranys existents
- Obtenir estadístiques
- Gestionar subscriptors

NO permet enviar emails directament (cal pla Enterprise a 1.000+$/mes).
El flux és: jo creo esborrany via API → Paolo revisa al dashboard i clica "Send".
"""
import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path("/home/z/my-project/criteri-esg-lab/assets/web/.env.local"))

API_KEY = os.getenv("BEEHIIV_API_KEY", "")
PUBLICATION_ID = os.getenv("BEEHIIV_PUBLICATION_ID", "")

BASE_URL = "https://api.beehiiv.com/v2"


def _headers():
    if not API_KEY:
        raise ValueError("BEEHIIV_API_KEY no configurada")
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }


def _pub_path(path: str) -> str:
    """Afegeix el publication ID al path."""
    if not PUBLICATION_ID:
        raise ValueError("BEEHIIV_PUBLICATION_ID no configurada")
    return f"/publications/{PUBLICATION_ID}{path}"


def test_connection() -> bool:
    """Test ràpid: obtenir info de la publicació."""
    try:
        r = requests.get(
            f"{BASE_URL}{_pub_path('')}",
            headers=_headers(),
            timeout=15,
        )
        if r.status_code == 200:
            data = r.json().get("data", {})
            print(f"  ✓ Connexió OK")
            print(f"  Publicació: {data.get('name', '?')}")
            print(f"  Subscriptors: {data.get('stats', {}).get('active_subscribers', '?')}")
            return True
        else:
            print(f"  ✗ HTTP {r.status_code}: {r.text[:200]}")
            return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def create_draft(
    title: str,
    subject_line: str,
    html_content: str,
    preview_text: str = "",
    subtitle: str = "",
) -> dict:
    """
    Crea un esborrany de newsletter.

    Args:
        title: títol intern de l'esborrany (no visible pels subscriptors)
        subject_line: assumpte de l'email
        preview_text: text preview que es veu a la safata d'entrada
        subtitle: subtítol (opcional)
        html_content: HTML del cos de la newsletter

    Returns:
        Resposta de Beehiiv amb l'ID del draft creat.
    """
    payload = {
        "title": title,
        "subject_line": subject_line,
        "preview_text": preview_text or subtitle,
        "subtitle": subtitle,
        "content": {
            "html": html_content,
        },
        "audience": "all",  # tots els subscriptors
        "web_publication": True,  # publicar també a la web
    }

    r = requests.post(
        f"{BASE_URL}{_pub_path('/posts')}",
        headers=_headers(),
        json=payload,
        timeout=30,
    )

    if r.status_code in (200, 201):
        data = r.json()
        print(f"  ✓ Esborrany creat: ID {data.get('data', {}).get('id', '?')}")
        return data
    else:
        raise Exception(f"Beehiiv HTTP {r.status_code}: {r.text[:500]}")


def list_drafts(limit: int = 10) -> list:
    """Llista els esborranys recents."""
    r = requests.get(
        f"{BASE_URL}{_pub_path('/posts')}",
        headers=_headers(),
        params={"status": "draft", "limit": limit, "direction": "desc"},
        timeout=15,
    )
    if r.status_code == 200:
        return r.json().get("data", [])
    else:
        raise Exception(f"Beehiiv HTTP {r.status_code}: {r.text[:300]}")


def get_post(post_id: str) -> dict:
    """Obté un post específic (draft o publicat)."""
    r = requests.get(
        f"{BASE_URL}{_pub_path('/posts/' + post_id)}",
        headers=_headers(),
        timeout=15,
    )
    if r.status_code == 200:
        return r.json().get("data", {})
    else:
        raise Exception(f"Beehiiv HTTP {r.status_code}: {r.text[:300]}")


if __name__ == "__main__":
    print("=== Test Beehiiv ===")
    print(f"Publication ID: {PUBLICATION_ID}")
    print(f"API Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    print()
    test_connection()
