"""
gen_sources_yaml.py — Genera scripts/sources.yaml des de 16-BASE-DADES-FONTS.md (v2.1)
aplicant les correccions de scraper_urls_corregit.xlsx (paolo).

Aparellament de correccions (en ordre):
1. URL exacta: Excel "URL actual" == URL del MD (sense barra final)
2. Prefix de domini: un dels dos camins és prefix de l'altre (mateix domini, per límits de ruta)
3. Tokens de nom: coincidència única per subconjunt de tokens normalitzats (sense accents)

Efectes: "URL nova verificada" substitueix la URL; "NO" elimina la font;
correccions sense cap font al MD amb URL nova → ALTA nova.

Ús: python gen_sources_yaml.py [--check]
"""
import re
import sys
import unicodedata
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "16-BASE-DADES-FONTS.md"
XLSX = ROOT / "scripts" / "scraper_urls_corregit.xlsx"
OUT = ROOT / "scripts" / "sources.yaml"

DYNAMIC_DOMAINS = {
    "eea.europa.eu", "law-tracker.europa.eu", "intelligence.weforum.org",
    "elibrary.imf.org", "accio.gencat.cat", "www.ces.es",
}


def norm_tokens(name: str) -> set:
    t = unicodedata.normalize("NFKD", name)
    t = t.encode("ascii", "ignore").decode().lower()
    return {w for w in re.split(r"[^a-z0-9]+", t) if w}


def norm_url(u: str) -> str:
    return (u or "").strip().rstrip("/")


def host_of(u: str) -> str:
    from urllib.parse import urlparse
    return urlparse(norm_url(u)).netloc.lower()


def slugify(name: str, idx: str) -> str:
    t = unicodedata.normalize("NFKD", name)
    t = t.encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()
    return f"{t}-{idx}"


def load_excel_fixes() -> dict:
    import openpyxl

    wb = openpyxl.load_workbook(XLSX)
    ws = wb["URLs a corregir"]
    fixes = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        font, url_actual, url_nova = (row + (None, None, None))[:3]
        if not font:
            continue
        fixes.append({"font": str(font).strip(), "actual": url_actual, "nova": url_nova})
    return fixes


def parse_md() -> list:
    entries = []
    for line in MD.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\|\s*([\d+a-zA-Z]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(https?://\S+?)\s*\|", line)
        if m and "https" in line and "---" not in line[:10]:
            num, name, tipus, url = m.group(1), m.group(2).strip(), m.group(3).strip(), m.group(4).strip()
            entries.append({"num": num, "name": name, "tipus": tipus, "url": url})
    return entries


def match_fix(fix: dict, entries: list):
    """Retorna (entry|None, mode) per una correcció de l'Excel.
    Ordre: url-exacta → url-prefix → nom (tokens llargs) → domini-únic."""
    actual = norm_url(fix["actual"])
    nova = norm_url(fix["nova"])
    if actual:
        # 1. URL exacta
        for e in entries:
            if norm_url(e["url"]) == actual:
                return e, "url-exacta"
        # 2. prefix de domini+path (mateix host, un path prefix de l'altre)
        cands = []
        for e in entries:
            eu = norm_url(e["url"])
            if host_of(eu) == host_of(actual):
                if eu == actual or eu.startswith(actual + "/") or actual.startswith(eu + "/"):
                    cands.append(e)
        if len(cands) == 1:
            return cands[0], "url-prefix"
        if len(cands) > 1:
            # desambigua pel nom de l'Excel: tokens de fix['font'] dins el nom del candidat
            key = norm_tokens(fix["font"])
            scored = [(sum(1 for t in key if t in norm_tokens(e["name"])), e) for e in cands]
            scored.sort(key=lambda x: -x[0])
            if scored[0][0] > scored[1][0]:
                return scored[0][1], "url-prefix-nom"
            return None, f"ambig-url-prefix:{[e['name'] for e in cands]}"
        # 3. nom: tots els tokens llargs (>3) del fix presents a la font, o inter>=2
        key = norm_tokens(fix["font"])
        longs = {w for w in key if len(w) > 3}
        hits = {}
        for e in entries:
            toks = norm_tokens(e["name"])
            if (longs and longs <= toks) or len(key & toks) >= 2:
                hits[id(e)] = e
        if len(hits) == 1:
            return next(iter(hits.values())), "nom"
        if len(hits) > 1:
            return None, f"ambig-nom:{[e['name'] for e in hits.values()]}"
        # 4. domini únic (només si és una substitució real, no una simple verificació)
        dom = host_of(actual)
        same = [e for e in entries if host_of(e["url"]) == dom]
        if len(same) == 1 and nova and nova != actual:
            return same[0], "domini-unic"
        return None, "sense-font"
    # sense URL actual: és una font que Paolo vol AFEGIR
    return None, "alta-nova"


def main() -> None:
    check_only = "--check" in sys.argv

    fixes = load_excel_fixes()
    entries = parse_md()
    print(f"MD: {len(entries)} fonts amb URL | Excel: {len(fixes)} correccions")

    sources = []
    removed, replaced, added_new, kept_same = 0, 0, 0, 0
    unresolved = []
    log = []

    for fix in fixes:
        nova = fix["nova"]
        entry, mode = match_fix(fix, entries)
        if entry is None:
            if nova and nova != "NO" and nova.startswith("http"):
                # correcció sobre una font que no és al MD → ALTA nova
                slug = slugify(fix["font"], "n")
                domain = nova.split("/")[2]
                sources.append({
                    "slug": slug, "name": fix["font"], "url": nova,
                    "type": "dynamic" if any(d in nova for d in DYNAMIC_DOMAINS) else "static",
                    "category": "Nova", "drive_id": "nova", "domain": domain,
                })
                added_new += 1
                log.append(f"  ALTA NOVA: {fix['font']} ({mode})")
            else:
                unresolved.append(f"  {fix['font']} [{mode}] nova={nova}")
            continue
        if nova == "NO":
            entries.remove(entry)
            removed += 1
            log.append(f"  ELIMINADA: {entry['name']} ({mode})")
        elif nova and norm_url(nova) != norm_url(entry["url"]):
            entry["url"] = nova
            replaced += 1
            log.append(f"  URL NOVA: {entry['name']} ({mode})")
        else:
            kept_same += 1

    for e in entries:
        url = e["url"]
        sources.append({
            "slug": slugify(e["name"], e["num"]),
            "name": e["name"],
            "url": url,
            "type": "dynamic" if any(d in url for d in DYNAMIC_DOMAINS) else "static",
            "category": e["tipus"],
            "drive_id": e["num"],
            "domain": url.split("/")[2],
        })

    print(f"\nResultat: {len(sources)} fonts | {replaced} URL substituïdes | {removed} eliminades | {added_new} altes noves | {kept_same} sense canvi")
    print("\n--- Correccions aplicades ---")
    for l in log:
        print(l)
    if unresolved:
        print("\n--- SENSE RESOLDRE (revisar) ---")
        for u in unresolved:
            print(u)

    if check_only:
        return

    header = """# sources.yaml — generat per gen_sources_yaml.py. NO EDITAR A MÀ
# Origen: 16-BASE-DADES-FONTS.md v2.1 (192 fonts) + scraper_urls_corregit.xlsx (correccions Paolo)
# Regenerar: python scripts/gen_sources_yaml.py
"""
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(header)
        yaml.safe_dump(sources, fh, allow_unicode=True, sort_keys=False, width=250)
    print(f"\nEscrit: {OUT}")


if __name__ == "__main__":
    main()
