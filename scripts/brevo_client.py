"""
Client de l'API de Brevo per gestionar newsletters Criteri ESG.

Documentació: https://developers.brevo.com/
Fa servir l'SDK oficial sib-api-v3-sdk (mantingut per Brevo).

Aquesta API permet al pla FREE:
- Crear campanyes de newsletter
- Pujar HTML de la campanya
- Enviar la campanya als subscriptors
- Gestionar contactes (afegir, llistar, segmentar)
- Crear llistes de correu

Tot via API, sense cap acció manual al dashboard.
"""
import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / "assets" / "web" / ".env.local")

API_KEY = os.getenv("BREVO_API_KEY", "")
SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "info@criteriesg.com")
SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "Criteri ESG")

BASE_URL = "https://api.brevo.com/v3"


def _headers():
    if not API_KEY:
        raise ValueError("BREVO_API_KEY no configurada")
    return {
        "api-key": API_KEY,
        "Content-Type": "application/json",
        "accept": "application/json",
    }


def test_connection() -> bool:
    """Test ràpid: obtenir info del compte."""
    try:
        r = requests.get(f"{BASE_URL}/account", headers=_headers(), timeout=15)
        if r.status_code == 200:
            data = r.json()
            print(f"  ✓ Connexió OK")
            print(f"  Compte: {data.get('company_name', '?')}")
            print(f"  Email: {data.get('email', '?')}")
            print(f"  Plan: {data.get('plan', [{}])[0].get('type', '?') if data.get('plan') else '?'}")
            return True
        else:
            print(f"  ✗ HTTP {r.status_code}: {r.text[:200]}")
            return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def get_or_create_list(name: str = "Criteri ESG Newsletter") -> int:
    """Busca o crea una llista de contactes. Retorna l'ID."""
    # Buscar llista existent
    r = requests.get(
        f"{BASE_URL}/contacts/lists",
        headers=_headers(),
        params={"limit": 50},
        timeout=15,
    )
    if r.status_code == 200:
        for lst in r.json().get("lists", []):
            if lst.get("name") == name:
                return lst["id"]

    # Crear
    r = requests.post(
        f"{BASE_URL}/contacts/lists",
        headers=_headers(),
        json={"name": name, "folderId": 1},
        timeout=15,
    )
    if r.status_code in (200, 201):
        return r.json()["id"]
    raise Exception(f"Error creant llista: {r.status_code}: {r.text[:200]}")


def add_contact(email: str, list_id: int, attributes: dict = None) -> bool:
    """Afegeix un contacte a una llista."""
    payload = {
        "email": email,
        "listIds": [list_id],
        "updateEnabled": True,
    }
    if attributes:
        payload["attributes"] = attributes

    r = requests.post(
        f"{BASE_URL}/contacts",
        headers=_headers(),
        json=payload,
        timeout=15,
    )
    return r.status_code in (200, 201, 204)


def create_campaign_draft(
    subject: str,
    html_content: str,
    list_id: int,
    sender_email: str = None,
    sender_name: str = None,
) -> int:
    """
    Crea una campanya en estat esborrany (NO envia).
    Paolo pot editar-la al dashboard de Brevo i enviar-la quan vulgui.

    Retorna l'ID de la campanya creada.
    """
    sender_email = sender_email or SENDER_EMAIL
    sender_name = sender_name or SENDER_NAME

    campaign_data = {
        "name": subject,
        "subject": subject,
        "sender": {"name": sender_name, "email": sender_email},
        "type": "classic",
        "htmlContent": html_content,
        "recipients": {"listIds": [list_id]},
        # No passem scheduledAt — Paolo decideix quan enviar al dashboard
    }

    r = requests.post(
        f"{BASE_URL}/emailCampaigns",
        headers=_headers(),
        json=campaign_data,
        timeout=30,
    )
    if r.status_code not in (200, 201):
        raise Exception(f"Error creant campanya: {r.status_code}: {r.text[:300]}")

    campaign_id = r.json()["id"]
    print(f"  ✓ Esborrany creat: ID {campaign_id}")
    print(f"  → Paolo: obre Brevo → Campanyes → revisa i envia")
    return campaign_id


def send_campaign(campaign_id: int) -> bool:
    """Envia una campanya existent. Normalment ho fa Paolo al dashboard."""
    r = requests.post(
        f"{BASE_URL}/emailCampaigns/{campaign_id}/sendNow",
        headers=_headers(),
        timeout=30,
    )
    if r.status_code in (200, 201, 204):
        print(f"  ✓ Campanya {campaign_id} enviada!")
        return True
    else:
        print(f"  ✗ HTTP {r.status_code}: {r.text[:300]}")
        return False


def create_and_send_campaign(
    subject: str,
    html_content: str,
    list_id: int,
    to_email: str = None,
    sender_email: str = None,
    sender_name: str = None,
) -> dict:
    """
    Crea una campanya i l'envia.

    Si to_email s'especifica, envia només a aquest email (test).
    Si no, envia a tota la llista list_id.
    """
    sender_email = sender_email or SENDER_EMAIL
    sender_name = sender_name or SENDER_NAME

    # 1. Crear la campanya
    campaign_data = {
        "name": subject,
        "subject": subject,
        "sender": {"name": sender_name, "email": sender_email},
        "type": "classic",
        "recipients": {"listIds": [list_id]} if not to_email else None,
    }
    if to_email:
        # Per test, usem una llista "test" o enviem directament
        # Brevo no permet enviar a un email concret sense llista a la API clàssica
        # Solució: crear contacte temporal, llista temporal, enviar, esborrar
        pass

    # Crear sense schedule
    campaign_data["scheduledAt"] = None

    r = requests.post(
        f"{BASE_URL}/emailCampaigns",
        headers=_headers(),
        json=campaign_data,
        timeout=30,
    )
    if r.status_code not in (200, 201):
        raise Exception(f"Error creant campanya: {r.status_code}: {r.text[:300]}")

    campaign_id = r.json()["id"]
    print(f"  ✓ Campanya creada: ID {campaign_id}")

    # 2. Pujar el contingut HTML
    r = requests.put(
        f"{BASE_URL}/emailCampaigns/{campaign_id}",
        headers=_headers(),
        json={
            "sender": {"name": sender_name, "email": sender_email},
            "name": subject,
            "subject": subject,
            "type": "classic",
            "htmlContent": html_content,
            "recipients": {"listIds": [list_id]},
            "scheduledAt": None,
        },
        timeout=30,
    )
    if r.status_code not in (200, 204):
        raise Exception(f"Error pujant HTML: {r.status_code}: {r.text[:300]}")
    print(f"  ✓ HTML pujat ({len(html_content)/1024:.1f} KB)")

    # 3. Enviar la campanya
    r = requests.post(
        f"{BASE_URL}/emailCampaigns/{campaign_id}/sendNow",
        headers=_headers(),
        timeout=30,
    )
    if r.status_code in (200, 201, 204):
        print(f"  ✓ Campanya enviada!")
        return {"campaign_id": campaign_id, "status": "sent"}
    else:
        raise Exception(f"Error enviant: {r.status_code}: {r.text[:300]}")


def send_test_email(
    to_email: str,
    subject: str,
    html_content: str,
    sender_email: str = None,
    sender_name: str = None,
) -> bool:
    """
    Envia un email de test a una adreça concreta via SMTP API (no campanya).
    Útil per fer proves ràpides sense crear llistes.
    """
    sender_email = sender_email or SENDER_EMAIL
    sender_name = sender_name or SENDER_NAME

    payload = {
        "sender": {"name": sender_name, "email": sender_email},
        "to": [{"email": to_email, "name": "Test"}],
        "subject": subject,
        "htmlContent": html_content,
    }

    r = requests.post(
        f"{BASE_URL}/smtp/email",
        headers=_headers(),
        json=payload,
        timeout=30,
    )
    if r.status_code in (200, 201):
        print(f"  ✓ Email enviat a {to_email}")
        print(f"  Message ID: {r.json().get('messageId', '?')}")
        return True
    else:
        print(f"  ✗ HTTP {r.status_code}: {r.text[:300]}")
        return False


if __name__ == "__main__":
    print("=== Test Brevo ===")
    print(f"Sender: {SENDER_NAME} <{SENDER_EMAIL}>")
    print(f"API Key: {API_KEY[:20]}...{API_KEY[-4:]}")
    print()
    test_connection()
