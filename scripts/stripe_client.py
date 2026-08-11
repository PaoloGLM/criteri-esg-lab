"""
Client Stripe per Criteri ESG.

Gestió de subscripcions, clients i facturació per als plans:
- Premium: 39€/mes
- Ultra: 89€/mes

La clau API es llegeix de STRIPE_API_KEY (a ~/AppData/Local/hermes/.env o .env.local).
"""

import os
import re
from pathlib import Path

import stripe

# ── Càrrega de la clau ──────────────────────────────────────────────
def _load_key() -> str:
    """Llegeix STRIPE_API_KEY del .env d'Hermes o del .env local del projecte."""
    candidates = [
        Path.home() / "AppData/Local/hermes/.env",
        Path.cwd() / ".env.local",
        Path.cwd() / ".env",
    ]
    for path in candidates:
        if path.exists():
            m = re.search(r"STRIPE_API_KEY=(.+)", path.read_text(encoding="utf-8"))
            if m:
                return m.group(1).strip().strip('"').strip("'")
    raise RuntimeError("STRIPE_API_KEY no trobada. Afegeix-la al .env d'Hermes.")


stripe.api_key = _load_key()

# ── Productes i preus ───────────────────────────────────────────────
PRODUCTES = {
    "premium": {"product_id": "prod_V3SemkL1s3dygV", "price_id": "price_1U3Lj90cEXkLa7qZ1Un2TU03", "preu": 39.00},
    "ultra": {"product_id": "prod_V3SekQfENuwEua", "price_id": "price_1U3Lj90cEXkLa7qZI8SfuiSc", "preu": 89.00},
}

# ── Funcions principals ─────────────────────────────────────────────

def crear_client(email: str, nom: str = "", descripcio: str = "") -> dict:
    """Crea un client a Stripe i en retorna l'ID."""
    client = stripe.Customer.create(
        email=email,
        name=nom or None,
        description=descripcio or None,
    )
    return {"id": client.id, "email": client.email}


def crear_subscripcio(client_id: str, pla: str) -> dict:
    """
    Crea una subscripció mensual per a un client existent.

    Args:
        client_id: ID del client a Stripe (cus_...)
        pla: 'premium' (39€/mes) o 'ultra' (89€/mes)

    Returns:
        dict amb id, estat i preu de la subscripció
    """
    if pla not in PRODUCTES:
        raise ValueError(f"Pla desconegut: {pla}. Valors vàlids: {list(PRODUCTES)}")

    sub = stripe.Subscription.create(
        customer=client_id,
        items=[{"price": PRODUCTES[pla]["price_id"]}],
        payment_behavior="default_incomplete",
        payment_settings={"save_default_payment_method": "on_subscription"},
    )
    return {"id": sub.id, "status": sub.status, "pla": pla}


def assignar_targeta(client_id: str, token: str) -> str:
    """Assigna un mètode de pagament (targeta) a un client."""
    pm = stripe.PaymentMethod.create(type="card", card={"token": token})
    stripe.PaymentMethod.attach(pm.id, customer=client_id)
    return pm.id


def llistar_subscripcions(limit: int = 20) -> list:
    """Llista les subscripcions recents."""
    subs = stripe.Subscription.list(limit=limit)
    resultat = []
    for s in subs.data:
        resultat.append({
            "id": s.id,
            "client": s.customer,
            "estat": s.status,
            "producte": s.items.data[0].price.product if s.items.data else None,
        })
    return resultat


def obtenir_factures(client_id: str, limit: int = 10) -> list:
    """Llista les factures d'un client."""
    invs = stripe.Invoice.list(customer=client_id, limit=limit)
    return [{"id": i.id, "total": i.total / 100, "estat": i.status, "pdf": i.invoice_pdf} for i in invs.data]


def cancelar_subscripcio(sub_id: str) -> dict:
    """Cancela una subscripció (s'atura al final del període)."""
    sub = stripe.Subscription.modify(sub_id, cancel_at_period_end=True)
    return {"id": sub.id, "status": sub.status}


if __name__ == "__main__":
    # Autotest ràpid
    try:
        acct = stripe.Account.retrieve()
        print(f"✅ Connexió Stripe OK — compte {acct.id}")
        subs = llistar_subscripcions(limit=5)
        print(f"✅ {len(subs)} subscripcions al compte de test")
        if subs:
            print(f"   Exemple: {subs[0]}")
    except Exception as e:
        print(f"❌ Error: {e}")
