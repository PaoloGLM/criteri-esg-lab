"""Test de tots els endpoints de Beehiiv V2 per veure quins funcionen al pla free."""
import os, sys, json, requests
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path("/home/z/my-project/criteri-esg-lab/assets/web/.env.local"))

API_KEY = os.getenv("BEEHIIV_API_KEY", "")
PUB_ID = os.getenv("BEEHIIV_PUBLICATION_ID", "")
BASE = "https://api.beehiiv.com/v2"
H = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

tests = [
    ("GET publications", f"{BASE}/publications/{PUB_ID}", "GET", None),
    ("GET subscribers (llista)", f"{BASE}/publications/{PUB_ID}/subscriptions?limit=5", "GET", None),
    ("GET posts (llista)", f"{BASE}/publications/{PUB_ID}/posts?limit=5", "GET", None),
    ("GET segments", f"{BASE}/publications/{PUB_ID}/segments?limit=5", "GET", None),
    ("GET boosts", f"{BASE}/publications/{PUB_ID}/boosts?limit=5", "GET", None),
    ("GET custom fields", f"{BASE}/publications/{PUB_ID}/custom_fields?limit=5", "GET", None),
    ("GET post categories", f"{BASE}/publications/{PUB_ID}/post_categories?limit=5", "GET", None),
]

for name, url, method, body in tests:
    print(f"\n=== {name} ===")
    print(f"  {method} {url.replace(PUB_ID, 'pub_xxx')}")
    try:
        if method == "GET":
            r = requests.get(url, headers=H, timeout=15)
        else:
            r = requests.post(url, headers=H, json=body, timeout=15)

        status = r.status_code
        if status == 200:
            data = r.json()
            d = data.get("data", data)
            if isinstance(d, list):
                print(f"  ✓ 200 OK - {len(d)} elements")
            elif isinstance(d, dict):
                print(f"  ✓ 200 OK - camps: {list(d.keys())[:6]}")
            else:
                print(f"  ✓ 200 OK")
        else:
            try:
                err = r.json()
                msg = err.get("errors", [{}])[0].get("message", r.text[:200])
                code = err.get("errors", [{}])[0].get("code", "")
                print(f"  ✗ {status} ({code}): {msg[:200]}")
            except:
                print(f"  ✗ {status}: {r.text[:200]}")
    except Exception as e:
        print(f"  ✗ Error: {str(e)[:200]}")

# POST: crear subscriber de test
print("\n=== POST subscriber (test) ===")
test_email = f"test-{int(__import__('time').time())}@criteriesg.com"
body = {"email": test_email, "utm_source": "test_api"}
try:
    r = requests.post(f"{BASE}/publications/{PUB_ID}/subscriptions", headers=H, json=body, timeout=15)
    print(f"  HTTP {r.status_code}")
    if r.status_code == 201:
        d = r.json().get("data", {})
        print(f"  ✓ Subscriptor creat: {d.get('id','?')} - {test_email}")
        # Esborrar
        sid = d.get("id")
        if sid:
            r2 = requests.delete(f"{BASE}/publications/{PUB_ID}/subscriptions/{sid}", headers=H, timeout=15)
            print(f"  Cleanup: {r2.status_code}")
    else:
        print(f"  Resposta: {r.text[:300]}")
except Exception as e:
    print(f"  Error: {e}")
