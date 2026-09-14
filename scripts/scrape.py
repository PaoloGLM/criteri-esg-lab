"""
scrape.py — Orquestrador principal de la recerca automàtica d'informes ESG.

Flux:
1. Carrega manifest.json LOCAL (dedup) — scripts/state/manifest.json
2. Per cada font de sources.yaml:
   a. Descarrega HTML (requests si static, Playwright si dynamic)
   b. Extreu enllaços a PDFs (BS4)
   c. Filtra: nous (no al manifest) + publicats últims 4 dies
   d. Descarrega PDF i classifica'l (Nemotron, 2 capes)
   e. PRESELECCIONATS i DUBTES → cua local data/informes/pendents-revisio/
      (GATE PAOLO: l'usuari mou a 0-originals/ el que validi abans del flux)
   f. REBUTJATS → esborrats
3. Actualitza manifest LOCAL
4. Resum a state/last_run_summary.json (el cron no_agent l'envia només si hi ha cua)

Mode local des de 14-set-2026: no es puja res a Drive (SA sense quota → 403).
L'alternativa Drive queda codificada i s'activa amb USE_DRIVE=True.

Ús:
    python scrape.py [--dry-run] [--limit N] [--source slug]
"""
import sys
import os
import json
import time
import shutil
import hashlib
import random
import argparse
import re
import unicodedata
from pathlib import Path
from datetime import datetime, timedelta

import requests
import yaml

sys.path.insert(0, os.path.dirname(__file__))

SOURCES_FILE = Path(__file__).parent / "sources.yaml"
STATE_DIR = Path(__file__).parent / "state"
STATE_DIR.mkdir(exist_ok=True)
MANIFEST_LOCAL = STATE_DIR / "manifest.json"

REPO_ROOT = Path(__file__).resolve().parent.parent
# Cua local de revisió humana (mode local 14-set-2026: sense Drive)
CUA_REVISIO_DIR = REPO_ROOT / "data" / "informes" / "pendents-revisio"

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "ca,en;q=0.9,es;q=0.8",
    "Accept-Encoding": "gzip, deflate",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

DIAS_RECIENTES = 4
MAX_PDF_SIZE = 60 * 1024 * 1024  # 60 MB
TIMEOUT_HTTP = 30
# Mode local (decisió Paolo 14-set-2026): el Drive del SA dona 403 (sense quota) i el
# flux ja llegeix local + backup mensual a disc E:. Si algun dia hi ha shared drive,
# tornar a posar-ho a True.
USE_DRIVE = False


def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


def load_sources() -> list:
    return yaml.safe_load(SOURCES_FILE.read_text(encoding="utf-8"))


def load_manifest() -> dict:
    """Carrega manifest local (única font de veritat en mode local)."""
    if MANIFEST_LOCAL.exists():
        return json.loads(MANIFEST_LOCAL.read_text(encoding="utf-8"))
    if USE_DRIVE:
        try:
            from drive_helper import download_manifest
            data = download_manifest()
            if data:
                MANIFEST_LOCAL.write_text(json.dumps(data, indent=2), encoding="utf-8")
                return data
        except Exception as e:
            log(f"  [manifest] No s'ha pogut baixar de Drive: {e}")
    return {}


def save_manifest(manifest: dict):
    MANIFEST_LOCAL.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    if USE_DRIVE:
        try:
            from drive_helper import upload_manifest
            upload_manifest(MANIFEST_LOCAL)
        except Exception as e:
            log(f"  [manifest] No s'ha pogut pujar a Drive: {e}")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def slugify(titulo: str, max_len: int = 70) -> str:
    """'ESMA TRV Risk Monitor No. 2, 2026' -> 'esma-trv-risk-monitor-no-2-2026'."""
    s = unicodedata.normalize("NFKD", titulo or "").encode("ascii", "ignore").decode()
    s = re.sub(r"[^-\s\w]", "", s).strip().lower()
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-{2,}", "-", s)
    return s[:max_len].strip("-") or "sense-titol"


def arxivar_a_cua(pdf_path: Path, cua_dir: Path, titol: str, data_pub: str) -> Path:
    """Mou el PDF tmp a la cua local de revisió amb nom net ANNA-data-slug.pdf.
    Mode local (decisió Paolo 14-set-2026): no es puja res a Drive — el SA no té
    quota i el flux ja llegeix local. Backup mensual a disc E: cobreix la pèrdua."""
    prefix = (data_pub or datetime.now().strftime("%Y-%m-%d"))[:10]
    dest = cua_dir / f"{prefix}_{slugify(titol)}.pdf"
    n = 2
    while dest.exists():
        dest = cua_dir / f"{prefix}_{slugify(titol)}-{n}.pdf"
        n += 1
    shutil.move(str(pdf_path), str(dest))
    return dest


def fetch_html(url: str, source_type: str = "static") -> str | None:
    """Descarrega HTML. static=requests, dynamic=Playwright."""
    if source_type == "dynamic":
        try:
            from dynamic_fetch import fetch_with_playwright
            return fetch_with_playwright(url)
        except ImportError:
            log("    [dynamic] Playwright no disponible; fent fallback a requests")
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT_HTTP)
        if r.status_code == 200:
            return r.text
        log(f"    HTTP {r.status_code}")
    except Exception as e:
        log(f"    ERROR: {e}")
    return None


def extract_pdf_links(html: str, base_url: str) -> list[dict]:
    """Extreu enllaços a PDFs del HTML (amb text de l'enllaç com a títol)."""
    from bs4 import BeautifulSoup
    from urllib.parse import urljoin

    soup = BeautifulSoup(html, "html.parser")
    links = []
    seen = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]
        text = a.get_text(strip=True)[:120] or ""
        full = urljoin(base_url, href)

        # Cas 1: enllaç directe .pdf
        is_pdf = href.lower().endswith(".pdf") or "format=pdf" in href.lower() or "/pdf/" in href.lower()
        # Cas 2: pàgina de publicació que probablement enllaça un PDF (heurística)
        looks_like_pub = any(k in text.lower() for k in ["report", "informe", "publication", "study", "review", "survey", "guide", "opinion", "standard"])

        if is_pdf:
            key = full
            if key not in seen:
                seen.add(key)
                links.append({"url": full, "title": text, "direct": True})
        elif looks_like_pub and ("2026" in text or "2025" in text or "2024" in text):
            # Enllaç a pàgina de publicació — el guardem per scraping secundari si cal
            if full not in seen:
                seen.add(full)
                links.append({"url": full, "title": text, "direct": False})
    return links


def is_recent(title: str) -> bool:
    """Heurística: el títol conté l'any en curs o mesos recents."""
    now = datetime.now()
    year = str(now.year)
    if year in title:
        return True
    # Check for recent month names
    months = {
        "en": ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
        "es": ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        "ca": ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
    }
    title_lower = title.lower()
    # Check current and previous month
    cur_month = now.month
    for lang in months.values():
        if lang[cur_month - 1] in title_lower or lang[(cur_month - 2) % 12] in title_lower:
            return True
    return False


def already_known(url: str, manifest: dict) -> bool:
    return url in manifest or hashlib.sha256(url.encode()).hexdigest()[:16] in manifest


def mark_known(url: str, manifest: dict, sha: str | None = None):
    key = url
    manifest[key] = {
        "sha256": sha or "",
        "first_seen": datetime.now().isoformat(),
    }
    # També index per hash curt de URL
    manifest[hashlib.sha256(url.encode()).hexdigest()[:16]] = manifest[key]


def download_pdf(url: str, dest_dir: Path) -> Path | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=120, stream=True)
        if r.status_code != 200:
            log(f"    [pdf] HTTP {r.status_code}")
            return None
        content = b""
        for chunk in r.iter_content(chunk_size=65536):
            content += chunk
            if len(content) > MAX_PDF_SIZE:
                log(f"    [pdf] Massa gran (>60MB), saltant")
                return None
        if len(content) < 10000:
            log(f"    [pdf] Massa petit ({len(content)}b), probablement error")
            return None
        # Validar magic bytes PDF
        if not content.startswith(b"%PDF"):
            log(f"    [pdf] No és un PDF vàlid")
            return None
        tmp = dest_dir / f"tmp_{int(time.time())}.pdf"
        tmp.write_bytes(content)
        return tmp
    except Exception as e:
        log(f"    [pdf] ERROR: {e}")
        return None


def process_source(source: dict, manifest: dict, dest_dir: Path, dry_run: bool = False) -> dict:
    stats = {"found": 0, "new": 0, "downloaded": 0, "preseleccionats": 0, "dubtes": 0, "rebutjats": 0, "errors": 0}
    name = source["name"]
    url = source["url"]
    stype = source.get("type", "static")
    log(f"▶ {name} ({stype})")

    html = fetch_html(url, stype)
    if not html:
        stats["errors"] += 1
        return stats

    links = extract_pdf_links(html, url)
    stats["found"] = len(links)
    log(f"    {len(links)} enllaços candidats")

    for link in links:
        if already_known(link["url"], manifest):
            continue
        if not is_recent(link["title"]):
            continue

        stats["new"] += 1
        log(f"    NEW: {link['title'][:80]}")

        if dry_run:
            continue

        if link["direct"]:
            pdf_path = download_pdf(link["url"], dest_dir)
            if pdf_path:
                # CAPA 2: classificació (mín. 8 pàgines + Nemotron)
                from classify import classify_pdf
                cls = classify_pdf(pdf_path, url=link["url"], source_name=name)
                log(f"    [cls] {cls['veredicte']} ({cls['pages']}p, tipus={cls.get('llm', {}).get('tipus', '?') if cls.get('llm') else 'filtre-pagines'}) {cls.get('rao', '')[:60]}")

                if cls["veredicte"] == "REBUTJAT":
                    stats["rebutjats"] += 1
                    mark_known(link["url"], manifest)
                    pdf_path.unlink()  # esborra el PDF rebutjat
                    continue

                sha = sha256_file(pdf_path)
                mark_known(link["url"], manifest, sha)
                stats["downloaded"] += 1

                # Metadades per al manifest
                entry = manifest[link["url"]]
                entry["titol"] = cls.get("titol", "")
                entry["autors"] = cls.get("autors", [])
                entry["data_publicacio"] = cls.get("data_publicacio", "")
                entry["pages"] = cls.get("pages", 0)
                entry["veredicte"] = cls["veredicte"]

                # GATE PAOLO (regla permanent des de 14-set-2026): cap document entra al
                # flux de destil·lat/redactat sense revisió humana prèvia. El veredicte del
                # classificador només és una PRESELECCIÓ. Tot (aprovat i dubte) va a la cua
                # local pendents-revisio/ amb nom net; Paolo mou manualment a 0-originals/
                # el que validi (igual que fa al pas 6 amb els informes redactats).
                if cls["veredicte"] == "DUBTE":
                    stats["dubtes"] += 1
                else:
                    stats["preseleccionats"] += 1
                try:
                    dest = arxivar_a_cua(pdf_path, CUA_REVISIO_DIR,
                                         cls.get("titol") or link["title"],
                                         cls.get("data_publicacio", ""))
                    entry["cua_local"] = str(dest.relative_to(REPO_ROOT).as_posix())
                    entry["revisat_per_paolo"] = False
                    log(f"    ⏳ A cua de revisió local: {dest.name}")
                except Exception as e:
                    log(f"    [cua] ERROR arxivant: {e}")
            else:
                stats["errors"] += 1
                mark_known(link["url"], manifest)  # Marcar com a vist per no repetir
        else:
            # Enllaç indirecte: marcar com a vist (MVP no fa scraping secundari)
            mark_known(link["url"], manifest)

        time.sleep(random.uniform(1, 3))  # rate limit

    return stats


def main():
    parser = argparse.ArgumentParser(description="Recerca automàtica d'informes ESG nous")
    parser.add_argument("--dry-run", action="store_true", help="Detecta però no descarrega")
    parser.add_argument("--limit", type=int, default=None, help="Màxim N fonts a processar")
    parser.add_argument("--source", type=str, default=None, help="Processar només aquesta font (slug)")
    args = parser.parse_args()

    sources = load_sources()
    if args.source:
        sources = [s for s in sources if s["slug"] == args.source]
    if args.limit:
        sources = sources[:args.limit]

    log(f"=== Recerca d'informes nous ESG ===")
    log(f"Fonts a processar: {len(sources)}")
    log(f"Mode: {'DRY-RUN' if args.dry_run else 'EXECUCIÓ'}\n")

    manifest = load_manifest()
    log(f"Manifest: {len(manifest)} entrades conegudes\n")

    CUA_REVISIO_DIR.mkdir(parents=True, exist_ok=True)
    dest_dir = CUA_REVISIO_DIR / ".tmp"  # només fitxers temporals; la cua definitiva és un nivell amunt
    dest_dir.mkdir(parents=True, exist_ok=True)

    total = {"found": 0, "new": 0, "downloaded": 0, "preseleccionats": 0, "dubtes": 0, "rebutjats": 0, "errors": 0}
    results = []

    for i, source in enumerate(sources, 1):
        try:
            stats = process_source(source, manifest, dest_dir, args.dry_run)
            for k in total:
                total[k] += stats[k]
            results.append({"slug": source["slug"], "name": source["name"], **stats})
        except Exception as e:
            log(f"  ✗ ERROR crític: {e}")
            total["errors"] += 1
        time.sleep(random.uniform(2, 5))

    if not args.dry_run:
        save_manifest(manifest)

    # Netegar fitxers temporals sobrants (els rebutjats ja s'esborren; tmp_* vius = avorts)
    for sobrant in dest_dir.glob("tmp_*.pdf"):
        sobrant.unlink(missing_ok=True)

    # Resum final
    log(f"\n{'='*50}")
    log(f"RESUM FINAL")
    log(f"{'='*50}")
    log(f"Fonts processades: {len(sources)}")
    log(f"Enllaços trobats: {total['found']}")
    log(f"Nous detectats: {total['new']}")
    log(f"Descarregats: {total['downloaded']}")
    log(f"  ✅ Preseleccionats (INFORME, esperen la teva revisió): {total['preseleccionats']}")
    log(f"  ⏳ Dubtes (cal revisió teva): {total['dubtes']}")
    log(f"  ❌ Rebutjats (no són informes o fora de tema): {total['rebutjats']}")
    log(f"Errors: {total['errors']}")
    if total["preseleccionats"] or total["dubtes"]:
        log(f"\n📁 Cua de revisió: {CUA_REVISIO_DIR}")
        log(f"   Mou a 0-originals/ només el que validis (gate Paolo).")

    # Guardar resum per notificació
    summary_path = STATE_DIR / "last_run_summary.json"
    summary_path.write_text(json.dumps({
        "run_at": datetime.now().isoformat(),
        "sources_processed": len(sources),
        **total,
        "details": results,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    log(f"\nResum guardat a {summary_path}")


if __name__ == "__main__":
    main()