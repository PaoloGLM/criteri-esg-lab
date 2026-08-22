#!/usr/bin/env python
"""Vigilància de canvis en estàndards ESG — alerta com "Google Alerts".

Comprova periòdicament les fonts oficials de cada estàndard (feeds RSS/Atom
i pàgines de notícies) i avisa quan hi ha publicacions NOVES respecte a
l'última execució. L'estat es desa a data/vigilancia-estandards.json.

Ús (cron diari/setmanal):
    python scripts/vigila-estandards.py
    → stdout: llista de novetats, o res si no n'hi ha (silenciós = sense canvis)

Exemple de sortida:
    🔔 GRI: "GRI 104 Climate Change exposure draft" https://...
    🔔 IFRS/ISSB: "IFRS S2 amendments published" https://...
"""

import hashlib
import json
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path
from xml.etree import ElementTree as ET

BASE = Path(__file__).resolve().parent.parent
STATE_FILE = BASE / "data" / "vigilancia-estandards.json"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# ── Fonts oficials per estàndard ─────────────────────────────────────────────
# Cada entrada: nom, tipus ("rss" = feed XML | "html" = pàgina de notícies),
# url, i (opcional) regex per extreure (títol, enllaç) del HTML.
FONTS = [
    {"nom": "GRI", "tipus": "html",
     "url": "https://www.globalreporting.org/standards/",
     "regex": r'<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{15,150})</a>'},
    {"nom": "IFRS/ISSB", "tipus": "html",
     "url": "https://www.ifrs.org/news-and-events/news/",
     "regex": r'<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{15,150})</a>'},
    {"nom": "EFRAG", "tipus": "html",
     "url": "https://www.efrag.org/News/",
     "regex": r'<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{15,150})</a>'},
    {"nom": "Comissió Europea (Finançament sostenible)", "tipus": "html",
     "url": "https://finance.ec.europa.eu/news_en",
     "regex": r'<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{15,150})</a>'},
    {"nom": "EcoVadis", "tipus": "html",
     "url": "https://ecovadis.com/blog/",
     "regex": r'<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{15,150})</a>'},
    # CDP (cdp.net/articles → 404 per bots) i B Corp (bcorporation.net → 403 Cloudflare)
    # queden fora del monitor automàtic; es revisen manualment a la revisió mensual.
    {"nom": "TNFD", "tipus": "rss",
     "url": "https://tnfd.global/feed/"},
    {"nom": "SASB/ISSB", "tipus": "html",
     "url": "https://sasb.ifrs.org/",
     "regex": r'<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{15,150})</a>'},
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def items_from_rss(xml_text: str) -> list[tuple[str, str]]:
    """Extreu (títol, enllaç) d'un feed RSS o Atom."""
    out = []
    try:
        root = ET.fromstring(xml_text)
        for item in root.iter():
            if item.tag.endswith("item") or item.tag.endswith("entry"):
                t = e = ""
                for child in item:
                    if child.tag.endswith("title"):
                        t = (child.text or "").strip()
                    if child.tag.endswith("link"):
                        e = child.text.strip() if child.text else child.get("href", "")
                if t:
                    out.append((t, e))
    except ET.ParseError:
        pass
    return out[:12]


def items_from_html(html: str, regex: str, base_url: str = "") -> list[tuple[str, str]]:
    """Extreu (títol, enllaç) d'una pàgina HTML amb regex; resol enllaços relatius."""
    from urllib.parse import urljoin

    out = []
    seen = set()
    for href, text in re.findall(regex, html, re.IGNORECASE)[:60]:
        text = re.sub(r"<[^>]+>", "", text).strip()
        if len(text) < 15:
            continue
        if not href.startswith("http"):
            href = urljoin(base_url, href)
        key = text[:60].lower()
        if key in seen:
            continue
        seen.add(key)
        out.append((text, href))
    return out[:12]


def load_state() -> dict:
    if STATE_FILE.exists():
        data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
        return {k: set(v) for k, v in data.items()}
    return {}


def save_state(state: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(
        json.dumps({k: sorted(v) for k, v in state.items()}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def main():
    state = load_state()
    novetats = []
    errors = []

    for f in FONTS:
        nom = f["nom"]
        try:
            raw = fetch(f["url"])
            if f["tipus"] == "rss":
                items = items_from_rss(raw)
            else:
                items = items_from_html(raw, f["regex"], base_url=f["url"])
        except Exception as e:
            errors.append(f"⚠️ {nom}: error de connexió ({e.__class__.__name__})")
            continue

        if not items:
            errors.append(f"⚠️ {nom}: no s'han pogut llegir notícies (estructura canviada?)")
            continue

        # Identificador estable per element (títol + hash de l'enllaç)
        nous = []
        vistos = state.get(nom, set())
        for t, u in items:
            key = hashlib.sha1(f"{t}|{u}".encode()).hexdigest()[:12]
            if key not in vistos:
                nous.append((t, u))
            vistos.add(key)
        state[nom] = vistos

        for t, u in nous:
            novetats.append(f"🔔 {nom}: \"{t[:120]}\" {u[:200]}")

    # Només alerta si hi ha novetats REALS (no a la primera execució)
    if STATE_FILE.exists():
        for n in novetats:
            print(n)
        for e in errors:
            print(e)
    save_state(state)


if __name__ == "__main__":
    main()
