"""
Pas 6 (nou): puja l'informe corregit (pas 5) a preproducció de la web.

FONT DE VERITAT: els Markdown validats del pas 5 (4-revisats-ortografia/),
NO el destil·lat JSON del pas 2. Aquest script:
  1. Parseja el .ca.md i .es.md (estructura coneguda: blocs, taules, llistes).
  2. Enricheix amb el destil·lat JSON quan existeix (evidència de pàgines,
   coverage dels crossRefs) — mai inventa res.
  3. Fa POST /api/admin/reports/import → crea/actualitza un ESBORRANY.
  4. Paolo revisa/edita a /admin/informes/<slug> i prem «Publicar».

Les metadades del front-matter del pas 5 poden ser velles (template del
destil·lat); es poden sobreescriure amb --date/--pages/--url.

Ús:
    scripts/.venv/Scripts/python.exe scripts/06-puja-a-preprod.py <slug> \
        [--date YYYY-MM-DD] [--pages N] [--url URL] [--dry-run] [--local]

Requisits (a assets/web/.env.local):
    PIPELINE_API_SECRET  — secret compartit amb l'endpoint import
"""
import sys
import json
import re
import argparse
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent))
from config import ENV_FILE  # .env.local de la carpeta web

DATA_DIR = Path("./data/informes")
DISTILATS_DIR = DATA_DIR / "1-distilats"
REVISATS_DIR = DATA_DIR / "4-revisats-ortografia"

# ── utilitats markdown ──────────────────────────────────────────────

def parse_frontmatter(md_text: str) -> dict:
    if not md_text.startswith("---"):
        return {}
    end = md_text.find("\n---", 3)
    if end == -1:
        return {}
    out = {}
    for line in md_text[3:end].splitlines():
        m = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if m:
            out[m.group(1)] = m.group(2).strip().strip('"')
    return out


def md_tables(text: str):
    """Taula -> llista de files de cel·les (sense capçalera ni separadors)."""
    rows = []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
            continue  # fila separador
        rows.append(cells)
    return rows[1:] if rows else []  # sense capçalera


def block_section(md: str, num: int) -> str:
    """Contingut cru del 'Bloc/Bloque N' (fins al següent '## Bloc')."""
    m = re.search(
        r"^##\s*Blo\w{0,3}\s+%d[^\n]*\n(.*?)(?=^##\s*Blo\w{0,3}\s+\d|\Z)" % num,
        md, re.M | re.S,
    )
    return m.group(1) if m else ""


def strip_fmt(s: str) -> str:
    """Treura negretes/cursives residuals; conserva text pla."""
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"\*(.+?)\*", r"\1", s)
    return s.strip()


def strip_cites(s: str) -> str:
    """Elimina cites de font al final del paràgraf (estil antic del pas 4):
    «— *p. 53, 42*» o «Fonts: EEA p. 78, 98.» — ara es citen inline (p. X)
    i el front les renderitza com a tooltip. Les (p. X) inline es CONSERVEN."""
    s = s.strip()
    s = re.sub(r"\s*[—-]\s*\*?\s*[Pp]àg?\.?\s*[\d][\d,\s\-–\.]*\*?\s*$", "", s)
    s = re.sub(r"\s*(?:Fonts?|Fuentes?):\s*[^.\n]*\.?\s*$", "", s)
    return s.strip()

# ── normalització de valors ─────────────────────────────────────────

def norm_status(cell: str) -> str:
    c = cell.strip()
    if "🟢" in c or "verd" in c.lower():
        return "verd"
    if "🔴" in c or "vermell" in c.lower() or "rojo" in c.lower():
        return "vermell"
    return "groc"


def status_label(status: str, lang: str) -> str:
    if lang == "es":
        return {"verd": "Sólido", "groc": "Limitado", "vermell": "Débil"}[status]
    return {"verd": "Sòlid", "groc": "Limitat", "vermell": "Feble"}[status]


def norm_coverage_to_impact(coverage: str) -> str:
    c = coverage.strip().lower()
    if c in ("total", "completa", "complet", "alta", "full"):
        return "Alt"
    if c in ("parcial", "partial"):
        return "Mitjà"
    return "Baix"

# ── parser dels 8 blocs (estructura coneguda del pas 4/5) ───────────

def parse_md(md: str, lang: str) -> dict:
    """Markdown del pas 5 -> dict amb les claus que espera normalizeReportBlock()."""
    out: dict = {}

    # Bloc 0 — semàfor
    sec0 = block_section(md, 0)
    rows = md_tables(sec0)
    indicators = []
    for r in rows:
        if len(r) >= 3:
            st = norm_status(r[1])
            indicators.append({
                "name": strip_fmt(r[0]),
                "status": st,
                "label": status_label(st, lang),
                "note": strip_fmt(r[2]),
            })
    grade, grade_label = "", ""
    m = re.search(r"\*\*Nota\s+global:\s*([A-D])\*\*\s*[—-]?\s*(.*)", sec0)
    if m:
        grade = m.group(1)
        tail = re.split(r"(?<=[.!?])\s+", strip_fmt(m.group(2)))
        grade_label = tail[0] if tail else ""
    semafor = {"indicators": indicators}
    if grade:
        semafor["grade"] = grade
    if grade_label:
        semafor["gradeLabel"] = grade_label
    out["semafor"] = semafor

    # Bloc 2 — dades clau: 1. **valor** etiqueta — *p. X*
    dades = []
    for line in block_section(md, 2).splitlines():
        m = re.match(r"^\d+\.\s+\*\*(.+?)\*\*\s*(.*)$", line.strip())
        if not m:
            continue
        rest = m.group(2).strip()
        page = ""
        mp = re.search(r"[—-]\s*\*?\s*p[àa]?\.\s*([\d\-–,\s]+)\s*\*?$", rest)
        if mp:
            page = mp.group(1).strip()
            rest = rest[: mp.start()].strip().rstrip("—-").strip()
        dades.append({"value": m.group(1).strip(), "label": rest, "page": page})
    out["dadesClau"] = dades

    # Bloc 3 — resum executiu (paràgrafs; cites inline (p. X) conservades,
    # cites al final d'estil antic eliminades)
    out["resumExecutiu"] = "\n\n".join(
        strip_cites(strip_fmt(p)) for p in block_section(md, 3).split("\n\n")
        if p.strip() and not p.strip().startswith(("##", ">"))
    )

    # Bloc 4 — implicacions + més enllà del compliment
    sec4 = block_section(md, 4)
    impl = {}
    for key, pat in (
        ("empreses", r"\*\*Empres[ae]s:\*\*\s*(.+)"),
        ("reguladors", r"\*\*Regulador(?:s|es):\*\*\s*(.+)"),
        ("ciutadans", r"\*\*Ciutadans:\*\*\s*(.+)|\*\*Ciudadanos:\*\*\s*(.+)"),
    ):
        m = re.search(pat, sec4)
        if m:
            impl[key] = strip_cites(strip_fmt(m.group(1) or m.group(2) or ""))
    out["implicacions"] = impl
    # "Més enllà del compliment formal — TITOL:" / "Más allá del trámite formal — TITOL:"
    m = re.search(r"\*\*M[éeá]s[^\n*]{2,40}?formal\s*[—-]\s*(.+?):\*\*\s*(.+)", sec4)
    if m:
        out["mesEnllaCheckbox"] = {"criteri": strip_fmt(m.group(1)), "body": strip_fmt(m.group(2))}
    else:
        out["mesEnllaCheckbox"] = {"criteri": "", "body": ""}

    # Bloc 5 — connexions: - **Tipus — Target:** desc
    connexions = []
    for line in block_section(md, 5).splitlines():
        m = re.match(r"^-\s+\*\*(.+?)[:*]*\*\*\s*(.*)$", line.strip())
        if not m or not m.group(1):
            continue
        head = m.group(1).strip().rstrip("*").strip()
        parts = re.split(r"\s*[—-]{1,2}\s+", head, maxsplit=1)
        connexions.append({
            "type": parts[0].strip(),
            "target": parts[1].strip() if len(parts) > 1 else "",
            "desc": strip_fmt(m.group(2)),
        })
    out["connexions"] = connexions

    # Bloc 6 — accions: | 01 | Acció | Esforç | Impacte |
    accions = []
    for r in md_tables(block_section(md, 6)):
        if len(r) >= 4:
            accions.append({
                "num": r[0].strip(),
                "title": strip_fmt(r[1]),
                "desc": strip_fmt(r[1]),
                "effort": strip_fmt(r[2]),
                "impact": strip_fmt(r[3]),
            })
    out["accions"] = accions

    # Bloc 7 — crossRefs: | Marc | Criteri | Cobertura | Acció |
    cross = []
    for r in md_tables(block_section(md, 7)):
        if len(r) >= 3:
            cross.append({
                "framework": strip_fmt(r[0]),
                "criterion": strip_fmt(r[1]),
                "coverage": strip_fmt(r[2]),
                "impact": norm_coverage_to_impact(r[2]),
                "action": strip_fmt(r[3]) if len(r) >= 4 else "",
            })
    out["crossRefs"] = cross
    return out


def merge_with_distillate(parsed: dict, dist: dict | None) -> dict:
    """El .md mana; del destil·lat només s'enriqueix (mai substitueix text)."""
    if not dist:
        return parsed
    merged = json.loads(json.dumps(parsed))  # deep copy
    # crossRefs: afegir evidence/nature si l'ordre coincideix
    d_cr = (dist.get("crossRefs") or [])
    for i, cr in enumerate(merged.get("crossRefs", [])):
        if i < len(d_cr) and isinstance(d_cr[i], dict):
            for extra in ("evidence", "nature", "coverage"):
                if extra in d_cr[i] and extra not in cr:
                    cr[extra] = d_cr[i][extra]
    return merged

# ── muntatge del payload ────────────────────────────────────────────

def load_env() -> dict:
    env = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def build_payload(slug: str, args) -> dict:
    dist_path = DISTILATS_DIR / f"{slug}.json"
    dist = json.loads(dist_path.read_text(encoding="utf-8")) if dist_path.exists() else None

    ca_md_path = REVISATS_DIR / f"{slug}.ca.md"
    es_md_path = REVISATS_DIR / f"{slug}.es.md"
    if not ca_md_path.exists() or not es_md_path.exists():
        print(f"✗ Falten els Markdown del pas 5 per a {slug} (4-revisats-ortografia/).")
        print("  El pas 5 i el gate 5b (check-idiomes.py) són obligatoris abans de pujar.")
        sys.exit(1)

    ca_md = ca_md_path.read_text(encoding="utf-8")
    es_md = es_md_path.read_text(encoding="utf-8")
    fm_ca = parse_frontmatter(ca_md)
    fm_es = parse_frontmatter(es_md)

    content_ca = merge_with_distillate(parse_md(ca_md, "ca"), dist.get("content_ca") if dist else None)
    content_es = merge_with_distillate(parse_md(es_md, "es"), dist.get("content_es") if dist else None)

    if not content_ca["semafor"]["indicators"] or not content_ca["accions"]:
        print("✗ El parseig del .ca.md ha sortit buit (semàfor o accions). Estructura no reconeguda.")
        sys.exit(1)

    title = fm_ca.get("title") or (dist or {}).get("title") or slug
    institution = (dist or {}).get("institution") or fm_ca.get("institution") or ""
    date = args.date or fm_ca.get("date") or ""
    pages = args.pages or (dist or {}).get("pages") or 0
    url = args.url or (dist or {}).get("url") or (dist or {}).get("source_url") or ""

    # summary: primera frase del resum CA (≤200 chars, tallat paraula a paraula)
    first = re.split(r"(?<=[.!?])\s+", content_ca["resumExecutiu"].split("\n\n")[0])
    summary = ""
    for sent in first:
        if len(summary) + len(sent) > 197 and summary:
            break
        summary = (summary + " " + sent).strip()

    frameworks = list(dict.fromkeys(
        cr["framework"] for cr in content_ca["crossRefs"] if cr["framework"]
    ))
    tags = frameworks[:3] or (dist or {}).get("tags", [])

    return {
        "slug": slug,
        "title": title,
        "institution": institution,
        "date": date,
        "pages": int(pages),
        "type": "official",
        "scope": "EU",
        "tags": tags,
        "certifications": [institution] if institution else [],
        "summary": summary,
        "url": url,
        "content_ca": content_ca,
        "content_es": content_es,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--date", default="")
    ap.add_argument("--pages", type=int, default=0)
    ap.add_argument("--url", default="")
    ap.add_argument("--dry-run", action="store_true", help="Només imprimeix el payload")
    ap.add_argument("--local", action="store_true", help="Apunta a http://localhost:3000")
    args = ap.parse_args()

    payload = build_payload(args.slug, args)

    if args.dry_run:
        print(json.dumps(payload, ensure_ascii=False, indent=1)[:4000])
        print("\n[dry-run] no s'ha enviat res.")
        return

    env = load_env()
    secret = env.get("PIPELINE_API_SECRET", "")
    web_url = "http://localhost:3000" if args.local else env.get("WEB_URL", "https://www.criteriesg.com").rstrip("/")
    if not secret:
        print("✗ PIPELINE_API_SECRET no configurada a assets/web/.env.local")
        sys.exit(1)

    print(f"→ Pujant {payload['slug']} com a draft a {web_url} …")
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
        print(f"✓ Draft creat/actualitzat. Revisa'l a {web_url}/admin/informes/{payload['slug']}")
    else:
        print(f"✗ HTTP {r.status_code}: {r.text[:300]}")
        sys.exit(1)


if __name__ == "__main__":
    main()
