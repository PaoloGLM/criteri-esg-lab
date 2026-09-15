"""
scrape.py — Orquestrador principal de la recerca automàtica d'informes ESG.

Flux:
1. Carrega manifest.json LOCAL (dedup) — scripts/state/manifest.json
2. Per cada font de sources.yaml:
   a. Descarrega HTML (requests si static, Playwright si dynamic)
   b. Extreu PDFs directes + enllaços candidats a pàgines intermèdies (BS4)
   b2. Follow-through BFS: llistat -> notícia -> pàgina publicació -> PDF (prof. 2, pressupost 10)
   c. Filtra: nous (no al manifest) + títols de 2026 (reintent pendent a 5 dies)
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
# Follow-through de llistats de notícies (15-set-2026): llistat -> notícia -> pàg. publicació -> PDF
MAX_FOLLOW_DEPTH = 2          # màxim de salts des del llistat
MAX_FOLLOWS_PER_SOURCE = 10   # pressupost de pàgines seguides per font i execució
MAX_INDIRECT_PER_PAGE = 8     # màx. enllaços candidats seguidos per pàgina (ordre DOM = recents primer)
MAX_PDFS_PER_PAGE = 5         # màx. PDFs processats per pàgina
MAX_GLOBAL_FOLLOWS = 150        # màx. pàgines seguides en TOTA l'execució
RETRY_PAGE_DAYS = 5           # peça anunciada encara sense PDF -> reconfirmar d'aquí a 5 dies
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


def _url_key(url: str) -> str:
    """Clau normalitzada per al manifest: sense paràmetres de tracking ni / final."""
    from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
    parts = urlsplit(url)
    keep = [(k, v) for k, v in parse_qsl(parts.query, keep_blank_values=True)
            if not k.lower().startswith("utm_")
            and k.lower() not in ("gclid", "fbclid", "mc_cid", "mc_eid")]
    path = parts.path.rstrip("/") or "/"
    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), path,
                       urlencode(keep, safe="/:,"), ""))


PUB_KEYWORDS = [
    "report", "informe", "publication", "study", "review", "survey", "outlook",
    "guide", "opinion", "standard", "monitor", "agenda", "roadmap", "briefing",
    "white paper", "position paper", "key issue", "perspective", "working paper",
    "policy paper", "insight",
]
PAGE_INDEX_NOISE = [
    "all publications", "all reports", "view all", "see all", "all news",
    "todas las publicaciones", "totes les publicacions", "veure tot", "ver todo",
    "read more", "legeix més", "més notícies", "more news", "press releases",
    "notes de premsa", "events",
]


def extract_candidates(html: str, base_url: str):
    """D'una pàgina HTML en surten (pdfs_directes, pages_candidates).

    pdfs: <a href> .pdf / /pdf/ / format=pdf / /download.
    pages: àncores descriptives (>15 chars) amb paraula clau de publicació,
           mateix domini que la base, sense soroll d'índex. Es conserva el text
           sencer (fins a 300) perquè és on van les dates.
    """
    from bs4 import BeautifulSoup
    from urllib.parse import urljoin, urlsplit

    soup = BeautifulSoup(html, "html.parser")
    base_domain = _site_domain(urlsplit(_url_key(base_url)).netloc)
    pdfs, pages = [], []
    seen_pdf, seen_page = set(), set()

    def add_pdf(url, title):
        full = _url_key(url)
        if full not in seen_pdf:
            seen_pdf.add(full)
            pdfs.append({"url": full, "title": (title or "")[:120], "direct": True})

    # Meta estàndard citation_pdf_url (present en molts catàlegs publicadors, DSpace...)
    meta = soup.find("meta", attrs={"name": re.compile("^citation_pdf_url$", re.I)})
    if meta and meta.get("content"):
        add_pdf(meta["content"], "")

    for a in soup.find_all("a", href=True):
        href = a["href"] or ""
        # els enllaços SPA (DSpace/Angular) sovint no tenen text: mirem aria-label/title
        text = (a.get_text(" ", strip=True) or a.get("aria-label", "")
                or a.get("title", "") or "")[:300]
        low = href.lower()
        full = _url_key(urljoin(base_url, href))

        if low.endswith(".pdf") or "format=pdf" in low or "/pdf/" in low or low.endswith("/download") \
                or "/bitstream" in low:
            add_pdf(full, text)
            continue

        tl = text.lower()
        if len(tl) < 4:
            continue
        wants = any(k in tl for k in PUB_KEYWORDS) or "full " in tl or "descarrega" in tl or "download" in tl
        # rutes típiques de catàleg de publicacions (DSpace/handle, repositoris...)
        href_ok = any(h in low for h in ("/handle/", "/publicacion", "/publication/", "/documents/"))
        if not (wants or href_ok):
            continue
        # amb href_ok el text pot ser curt ("Full report"): exigeix mínim 4 chars només si no
        if href_ok and len(tl) < 4:
            continue
        if not href_ok and len(tl) < 15:
            continue
        if any(n in tl for n in PAGE_INDEX_NOISE):
            continue
        # mateix lloc web: acceptem subdominis (www.unep.org i wedocs.unep.org = unep.org)
        if _site_domain(urlsplit(full).netloc) != base_domain:
            continue
        if full in seen_page:
            continue
        seen_page.add(full)
        pages.append({"url": full, "title": text})
    return pdfs, pages


def _site_domain(netloc: str) -> str:
    """Ultims 2 nivells del domini (aproximació eTLD+1, sense llista pública)."""
    host = (netloc or "").split(":")[0].lower().strip(".")
    parts = [p for p in host.split(".") if p]
    if len(parts) >= 3 and parts[-2] in ("co", "com", "gov", "org", "edu") and len(parts[-1]) == 2:
        return ".".join(parts[-3:])  # ex. agency.gov.gr
    return ".".join(parts[-2:]) if len(parts) >= 2 else host


def is_recent(title: str) -> bool:
    """Heurística estricta: NOMÉS 2026 (decisió Paolo 15-set-2026: 'no volem res
    anterior a 2026'). El títol/URL ha de contenir l'any en curs explícit.
    Mesos sense any NO compten (un 'June' genèric pot ser de qualsevol any)."""
    year = str(datetime.now().year)  # 2026
    return bool(re.search(rf"\b{year}\b", title))


def already_known(url: str, manifest: dict) -> bool:
    """True si ja el coneixem. Excepció: si l'entrada té 'reintent_despres' vencent,
    el tractem com a NO conegut per tornar-lo a visitar (peces anunciades sense PDF)."""
    entry = manifest.get(url)
    if entry is None:
        entry = manifest.get(hashlib.sha256(url.encode()).hexdigest()[:16])
    if not entry:
        return False
    due = entry.get("reintent_despres")
    if due:
        try:
            if datetime.fromisoformat(due) <= datetime.now():
                return False
        except (ValueError, TypeError):
            pass
    return True


def mark_known(url: str, manifest: dict, sha: str | None = None, extra: dict | None = None):
    key = url
    entry = {
        "sha256": sha or "",
        "first_seen": datetime.now().isoformat(),
    }
    if extra:
        entry.update(extra)
    manifest[key] = entry
    # També index per hash curt de URL
    manifest[hashlib.sha256(url.encode()).hexdigest()[:16]] = entry


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
        dest_dir.mkdir(parents=True, exist_ok=True)  # auto-reparació: el raspat intermedi pot haver estat esborrat
        tmp.write_bytes(content)
        return tmp
    except Exception as e:
        log(f"    [pdf] ERROR: {e}")
        return None


def _marca_pagina(url: str, manifest: dict, titol: str, pendent: bool):
    """Marca una pàgina intermèdia com a visitada. Si no hi havia cap PDF (pendent),
    hi deixa una data de reintent (peces anunciades que publiquen el PDF dies després)."""
    prev = manifest.get(url) or {}
    reintents = int(prev.get("reintents_pendent", 0))
    entry = {
        "sha256": "",
        "first_seen": prev.get("first_seen", datetime.now().isoformat()),
        "pagines": True,
        "titol": titol[:120],
    }
    if pendent and reintents < 4:
        entry["reintents_pendent"] = reintents + 1
        entry["reintent_despres"] = (datetime.now() + timedelta(days=RETRY_PAGE_DAYS)).isoformat()
    manifest[url] = entry
    manifest[hashlib.sha256(url.encode()).hexdigest()[:16]] = entry


def process_pdf_link(link: dict, manifest: dict, dest_dir: Path, source_name: str,
                     stats: dict, dry_run: bool = False) -> bool:
    """Descarrega/classifica/arxiva UN PDF directe. Retorna True si n'hem parlat.
    El títol de la pàgina d'origen (link['via_titol']) fa de context quan l'àncora
    és genèrica ('Download full report')."""
    if already_known(link["url"], manifest):
        return False
    title_for_ctx = link["title"] or link.get("via_titol", "")[:120]
    stats["new"] += 1
    log(f"    NEW: {title_for_ctx[:80]}")
    if dry_run:
        return True

    pdf_path = download_pdf(link["url"], dest_dir)
    if not pdf_path:
        stats["errors"] += 1
        mark_known(link["url"], manifest)
        return True

    # Duplicat de contingut (mateix sha per una URL distinta) -> esborra i prou
    sha = sha256_file(pdf_path)
    if any(v.get("sha256") == sha for v in manifest.values() if isinstance(v, dict)):
        log("    [dup] contingut ja conegut per una altra URL, descartant")
        stats["rebutjats"] += 1
        pdf_path.unlink(missing_ok=True)
        mark_known(link["url"], manifest, sha)
        return True

    from classify import classify_pdf
    cls = classify_pdf(pdf_path, url=link["url"], source_name=source_name)
    log(f"    [cls] {cls['veredicte']} ({cls['pages']}p, tipus={cls.get('llm', {}).get('tipus', '?') if cls.get('llm') else 'filtre-pagines'}) {cls.get('rao', '')[:60]}")

    # GATE 2026 ESTRICTE (Paolo 15-set-2026: "no volem res anterior a 2026").
    # Si el classificador extreu data de publicacio i NO es de 2026 -> rebutjat,
    # encara que el titol inclogui "2026" (cas ECB climate-risk: titol 2026 pero
    # editat el 2025 -> descartat per en Paolo).
    data_pub = str(cls.get("data_publicacio", ""))
    m_year = re.search(r"\b(20\d{2})\b", data_pub)
    if m_year and m_year.group(1) != str(datetime.now().year):
        log(f"    [2026-gate] rebutjat per data {m_year.group(1)}: {title_for_ctx[:60]}")
        stats["rebutjats"] += 1
        mark_known(link["url"], manifest, extra={"via": link.get("via", ""), "data": data_pub, "motiu": "no-2026"})
        pdf_path.unlink()
        return True

    if cls["veredicte"] == "REBUTJAT":
        stats["rebutjats"] += 1
        mark_known(link["url"], manifest, extra={"via": link.get("via", "")})
        pdf_path.unlink()
        return True

    mark_known(link["url"], manifest, sha, extra={"via": link.get("via", "")})
    stats["downloaded"] += 1

    entry = manifest[link["url"]]
    entry["titol"] = cls.get("titol", "") or title_for_ctx
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
                             cls.get("titol") or title_for_ctx,
                             cls.get("data_publicacio", ""))
        entry["cua_local"] = str(dest.relative_to(REPO_ROOT).as_posix())
        entry["revisat_per_paolo"] = False
        log(f"    ⏳ A cua de revisió local: {dest.name}")
    except Exception as e:
        log(f"    [cua] ERROR arxivant: {e}")
    return True


def process_source(source: dict, manifest: dict, dest_dir: Path, dry_run: bool = False,
                   global_budget: int | None = None) -> tuple[dict, int]:
    """Fonts amb follow-through: si un enllaç del llistat no és un PDF sinó una
    pàgina (notícia/peça), HI ENTRA i cerca el PDF real a dins, amb un segon
    salt si cal (llistat -> notícia -> pàgina publicació -> PDF). Pressupost per
    font i global per execució per no desbordar el cron.
    Retorna (stats, pàgines seguides)."""
    stats = {"found": 0, "new": 0, "downloaded": 0, "preseleccionats": 0,
             "dubtes": 0, "rebutjats": 0, "errors": 0, "pages_followed": 0}
    name = source["name"]
    url = source["url"]
    stype = source.get("type", "static")
    log(f"▶ {name} ({stype})")

    html = fetch_html(url, stype)
    if not html:
        stats["errors"] += 1
        return stats, 0

    pdfs, pages = extract_candidates(html, url)
    stats["found"] = len(pdfs) + len(pages)
    log(f"    {len(pdfs)} PDFs directes, {len(pages)} pàgines candidats")

    # 1) PDFs directes al llistat (com abans: cal títol recent)
    for link in pdfs:
        if not is_recent(link["title"] or link["url"]):
            continue
        try:
            process_pdf_link(link, manifest, dest_dir, name, stats, dry_run)
        except Exception as e:
            log(f"    [pdf] ERROR processant: {e}")
            stats["errors"] += 1
        time.sleep(random.uniform(1, 3))

    # 2) Follow-through BFS: pàgines intermèdies (màx. MAX_INDIRECT_PER_PAGE per nivell)
    follows = 0
    frontier = [dict(p, depth=1) for p in pages[:MAX_INDIRECT_PER_PAGE]
                if is_recent(p["title"]) and not already_known(p["url"], manifest)]
    while frontier:
        if follows >= MAX_FOLLOWS_PER_SOURCE:
            log(f"    [follow] pressupost per font ({MAX_FOLLOWS_PER_SOURCE}) exhaurit")
            break
        if global_budget is not None and global_budget <= 0:
            log("    [follow] pressupost global exhaurit")
            break
        node = frontier.pop(0)
        follows += 1
        if global_budget is not None:
            global_budget -= 1
        log(f"    [follow d{node['depth']}] {node['title'][:70]}")
        sub_html = fetch_html(node["url"], stype)
        if not sub_html:
            _marca_pagina(node["url"], manifest, node["title"], pendent=True)
            continue
        sub_pdfs, sub_pages = extract_candidates(sub_html, node["url"])
        # PDFs dins la pàgina (notícia/peça): el PDF real, amb context del títol
        pdfs_here = 0
        for d in sub_pdfs[:MAX_PDFS_PER_PAGE]:
            d["via"] = node["url"]
            d["via_titol"] = node["title"]
            if not d["title"]:
                d["title"] = node["title"][:120]
            try:
                if process_pdf_link(d, manifest, dest_dir, name, stats, dry_run):
                    pdfs_here += 1
            except Exception as e:
                log(f"      [pdf] ERROR: {e}")
                stats["errors"] += 1
            time.sleep(random.uniform(1, 3))
        # Segon salt només si la pàgina no tenia cap PDF però sí candidats (cas OECC:
        # notícia -> "Read the report" -> landing -> PDF) i ens queda profunditat
        if pdfs_here == 0 and node["depth"] < MAX_FOLLOW_DEPTH and not dry_run:
            for sp in sub_pages[:3]:
                if already_known(sp["url"], manifest):
                    continue
                sp["depth"] = node["depth"] + 1
                frontier.append(sp)
        _marca_pagina(node["url"], manifest, node["title"], pendent=(pdfs_here == 0))
        time.sleep(random.uniform(1, 3))

    stats["pages_followed"] = follows
    return stats, follows


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

    total = {"found": 0, "new": 0, "downloaded": 0, "preseleccionats": 0, "dubtes": 0,
             "rebutjats": 0, "errors": 0, "pages_followed": 0}
    results = []
    global_budget = MAX_GLOBAL_FOLLOWS

    for i, source in enumerate(sources, 1):
        try:
            stats, followed = process_source(source, manifest, dest_dir, args.dry_run,
                                             global_budget=global_budget)
            global_budget -= followed
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
    log(f"Pàgines intermèdies seguides (follow-through): {total['pages_followed']}")
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