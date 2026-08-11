"""
Flux OAuth d'usuari per Criteri ESG (mode production = tokens que no caduquen).

Obre el navegador, l'usuari autoritza, i guarda els tokens a .gcp-oauth-tokens.json.
Ús:
    python scripts/oauth_setup.py
"""
import json
import sys
import time
import threading
import webbrowser
import http.server
import urllib.parse
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parent
CLIENT_PATH = BASE_DIR / ".gcp-oauth-client.json"
TOKENS_PATH = BASE_DIR / ".gcp-oauth-tokens.json"

# Scopes: Drive complet (pujar/baixar) + Gmail send (enviar emails)
SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/gmail.send",
]
PORT = 8080
REDIRECT = f"http://localhost:{PORT}"

# --- Carregar client info ---
data = json.loads(CLIENT_PATH.read_text())
inst = data.get("installed", data)
CLIENT_ID = inst["client_id"]
CLIENT_SECRET = inst["client_secret"]

# --- Servidor local per capturar el callback ---
code_holder = {"code": None, "error": None}

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(q.query)
        if "code" in params:
            code_holder["code"] = params["code"][0]
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(
                b"<html><body style='font-family:sans-serif;text-align:center;padding-top:80px'>"
                b"<h2>&#9989; Autoritzat correctament!</h2>"
                b"<p>Ja pots tancar aquesta pestanya i tornar a Hermes.</p>"
                b"</body></html>"
            )
        elif "error" in params:
            code_holder["error"] = params["error"][0]
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Error: " + params["error"][0].encode())
        else:
            self.send_response(404)
            self.end_headers()
        self.server.shutdown()

    def log_message(self, *args):
        pass  # silenciar logs

server = http.server.HTTPServer(("localhost", PORT), Handler)

# --- Construir URL d'autorització ---
auth_url = (
    "https://accounts.google.com/o/oauth2/auth?"
    + urllib.parse.urlencode({
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
        "include_granted_scopes": "true",
    })
)

print("=" * 60)
print("  CRITERI ESG — Autorització Google OAuth")
print("=" * 60)
print(f"  Client ID: {CLIENT_ID[:35]}...")
print(f"  Scopes: Drive + Gmail send")
print()
print("  S'obrirà el navegador. Autoritza amb el compte de Paolo.")
print("  Si veus 'Google hasn't verified this app':")
print("    → clica 'Advanced' → 'Go to criteri-esg (unsafe)'")
print("    → Accepta els permisos.")
print()
print("  Esperant autorització...")

# Obriu el navegador en un fil perquè el servidor pugui esperar
threading.Timer(1.0, lambda: webbrowser.open(auth_url)).start()

try:
    server.serve_forever()
except Exception as e:
    print(f"  ✗ Error al servidor: {e}")
    sys.exit(1)

# --- Intercanviar code per tokens ---
if code_holder["error"]:
    print(f"  ✗ Error d'autorització: {code_holder['error']}")
    sys.exit(1)

code = code_holder["code"]
print("  ✓ Code rebut, intercanviant per tokens...")

r = requests.post(
    "https://oauth2.googleapis.com/token",
    data={
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT,
    },
    timeout=30,
)
if r.status_code != 200:
    print(f"  ✗ Error intercanviant: HTTP {r.status_code}: {r.text[:300]}")
    sys.exit(1)

tokens = r.json()
tokens["expires_at"] = int(time.time()) + tokens.get("expires_in", 3600) - 60

TOKENS_PATH.write_text(json.dumps(tokens, indent=2))
print(f"  ✓ Tokens guardats a: {TOKENS_PATH}")
print(f"  ✓ refresh_token: {'OK (no caduca en production)' if tokens.get('refresh_token') else 'FALTA!'}")
print()
print("  FET! Ara pots tornar a Hermes i dir-me que continuï.")
