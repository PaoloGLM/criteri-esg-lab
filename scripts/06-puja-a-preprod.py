"""
Pas 6 (nou): puja l'informe corregit (pas 5) a preproducció de la web.

Després que Gemini hagi fet la revisió ortogràfica (pas 5), aquest script
agafa el contingut i el puja a la web com a ESBORRANY (status="draft"),
via POST /api/admin/reports/import. La web el normalitza i Paolo el veu a
/admin/informes/<slug> per revisar-lo, editar-lo i prémer «Publicar».

Els passos previs (2-4) segueixen sent material de treball intern optimitzat
per tokens; la font de veritat del que es publica és la SORTIDA DEL PAS 5.

Ús:
    scripts/.venv/Scripts/python.exe scripts/06-puja-a-preprod.py <slug>

Requisits (a assets/web/.env.local):
    PIPELINE_API_SECRET  — secret compartit amb l'endpoint import
    WEB_URL              — ex: https://www.criteriesg.com (o http://localhost:3000)
"""
import sys
import json
import re
import os
from pathlib import Path

import requests

sys.path.insert(0, "./scripts")
from config import ENV_FILE  # .env.local de la carpeta web

DATA_DIR = Path("./data/informes")
DISTILATS_DIR = DATA_DIR / "1-distilats"
REVISATS_DIR = DATA_DIR / "4-revisats-ortografia"


def load_env():
    """Llegeix .env.local (sense dependre de dotenv per als noms nous)."""
    env = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def parse_frontmatter(md_text: str) -> dict:
    """Extreu el front-matter YAML simple (slug/title/institution/date/lang)."""
    if not md_text.startswith("---"):
        return {}
    end = md_text.find("\n---", 3)
    if end == -1:
        return {}
    block = md_text[3:end]
    out = {}
    for line in block.splitlines():
        m = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if m:
            out[m.group(1)] = m.group(2).strip().strip('"')
    return out


def find_date(slug: str) -> str:
    """La data ve del front-matter del Markdown corregit (pas 5)."""
    for md in REVISATS_DIR.glob(f"{slug}.*.md"):
        fm = parse_frontmatter(md.read_text(encoding="utf-8"))
        if fm.get("date"):
            return fm["date"]
    return ""


def main():
    slug = sys.argv[1] if len(sys.argv) > 1 else None
    if not slug:
        print("Ús: 06-puja-a-preprod.py <slug>")
        sys.exit(1)

    env = load_env()
    secret = env.get("PIPELINE_API_SECRET", "")
    web_url = env.get("WEB_URL", "https://www.criteriesg.com").rstrip("/")
    if not secret:
        print("✗ PIPELINE_API_SECRET no configurada a assets/web/.env.local")
        sys.exit(1)

    distilat_path = DISTILATS_DIR / f"{slug}.json"
    if not distilat_path.exists():
        print(f"✗ No hi ha destil·lat per a {slug} (pas 2).")
        sys.exit(1)

    data = json.loads(distilat_path.read_text(encoding="utf-8"))
    # El slug canònic és el del destil·lat (el que encaixa amb la web).
    canon_slug = data.get("slug", slug)
    date = find_date(slug) or find_date(canon_slug) or ""

    payload = {
        "slug": canon_slug,
        "title": data.get("title", ""),
        "institution": data.get("institution", ""),
        "date": date,
        "pages": 0,
        "type": "official",
        "scope": "EU",
        "tags": [],
        "certifications": [],
        "summary": "",
        "url": "",
        "content_ca": data.get("content_ca"),
        "content_es": data.get("content_es"),
    }

    if not payload["title"] or not payload["institution"]:
        print("✗ Falten title/institution al destil·lat.")
        sys.exit(1)
    if not payload["date"]:
        print("⚠ Sense data (no s'ha trobat front-matter del pas 5). Revisa-ho a l'admin.")

    print(f"→ Pujant {canon_slug} com a draft a {web_url} …")
    try:
        r = requests.post(
            f"{web_url}/api/admin/reports/import",
            json=payload,
            headers={"X-Pipeline-Secret": secret, "Content-Type": "application/json"},
            timeout=60,
        )
    except requests.RequestException as e:
        print(f"✗ Error de xarxa: {e}")
        sys.exit(1)

    if r.status_code in (200, 201):
        print(f"✓ Pujat com a draft. Revisa-ho a {web_url}/admin/informes/{canon_slug}")
    else:
        body = r.text[:300]
        print(f"✗ HTTP {r.status_code}: {body}")
        sys.exit(1)


if __name__ == "__main__":
    main()
