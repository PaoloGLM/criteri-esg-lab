"""
Genera PDF d'informe Criteri ESG amb la plantilla HTML oficial.

Fa servir la mateixa plantilla que pilot-informe-foretica-amb-semafor-i-mes-enlla.html
i la converteix a PDF via weasyprint.

Ús:
    scripts/.venv/bin/python scripts/genera-pdf-informe.py <slug>
"""
import sys
import json
import re
import subprocess
import tempfile
from pathlib import Path

DATA_DIR = Path("./data/informes")
REVISATS_DIR = DATA_DIR / "4-revisats-ortografia"

# === Plantilla HTML (basada en pilot-informe-foretica) ===
# Es genera dinàmicament a partir del ReportBlock

CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #F2F5F1; --bg-deep: #141B18; --card: #FFFFFF;
  --ink: #26312B; --ink-deep: #141B18; --ink-soft: #4A5F53;
  --accent: #5E8772; --accent-deep: #3F6653; --accent-soft: #AAC9B6;
  --muted: #E4ECE6; --rule: #D8E2DA; --crema: #F2F5F1;
  --sem-g: #5C8A5C; --sem-y: #C9A961; --sem-r: #A0522D;
}

@page { size: A4; margin: 0 0 12mm 0; }

body {
  background: var(--bg); font-family: 'DM Sans', system-ui, sans-serif;
  color: var(--ink); line-height: 1.6; font-size: 14px;
}
.page { width: 210mm; min-height: 100vh; }

/* ---------- Breadcrumb ---------- */
.breadcrumb {
  background: var(--bg); border-bottom: 1px solid var(--rule);
  padding: 16px 56px; display: flex; justify-content: space-between; align-items: baseline;
}
.breadcrumb .crumb { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .16em; color: #4A5F53; }
.breadcrumb .crumb a { color: #3F6653; text-decoration: none; }
.breadcrumb .crumb .sep { color: #D8E2DA; margin: 0 12px; }
.breadcrumb .crumb .here { color: #26312B; }
.breadcrumb .right { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .16em; font-weight: 600; color: #3F6653; }

/* ---------- Header fitxa tecnica ---------- */
.fitxa-header { padding: 40px 56px 24px 56px; border-bottom: 1px solid #141B18; page-break-after: avoid; }
.badges { margin-bottom: 16px; }
.badge {
  display: inline-block; font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 9.5px; text-transform: uppercase; letter-spacing: .16em; font-weight: 600;
  padding: 5px 10px; margin-right: 8px;
}
.badge-type { background: rgba(92,58,30,0.12); color: #141B18; }
.badge-free { background: rgba(92,138,92,0.12); color: #4A6B3A; }
.fitxa-header h1 {
  font-family: 'Newsreader', Georgia, serif; font-size: 36px; font-weight: 500;
  line-height: 1.15; letter-spacing: -0.022em; color: #141B18; margin-bottom: 16px;
}
.meta-row { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; color: #4A5F53; }
.meta-row strong { color: #26312B; }
.meta-row .msep { margin: 0 14px; color: #D8E2DA; }

/* ---------- Bloc 01 Semafor (fosc full-width) ---------- */
.semafor { background: #26312B; color: #F2F5F1; padding: 44px 56px; break-inside: avoid; page-break-inside: avoid; }
.semafor-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 40px; align-items: center; }
.kicker-dark { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: .22em; font-weight: 600; color: #AAC9B6; margin-bottom: 16px; }
.grade-row { display: flex; align-items: baseline; gap: 16px; }
.grade-letter { font-family: 'Newsreader', Georgia, serif; font-size: 96px; font-weight: 400; line-height: 1; letter-spacing: -0.04em; }
.grade-label { font-family: 'Newsreader', Georgia, serif; font-size: 22px; font-style: italic; color: #F2F5F1; }
.ind-row { padding: 12px 0; border-bottom: 1px solid rgba(217,165,116,0.2); break-inside: avoid; page-break-inside: avoid; }
.ind-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.ind-name { font-family: 'Newsreader', Georgia, serif; font-size: 16px; font-weight: 500; color: #F2F5F1; }
.dots { display: flex; gap: 6px; }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.ind-label { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: .14em; font-weight: 600; margin-left: 8px; }
.ind-note { font-size: 12px; line-height: 1.55; margin-top: 6px; color: rgba(245,239,230,0.55); }

/* ---------- Sections de contingut ---------- */
.seccio { padding: 32px 56px; border-bottom: 1px solid #D8E2DA; }
.kicker { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: .22em; font-weight: 600; color: #5E8772; margin-bottom: 6px; break-after: avoid; page-break-after: avoid; }
.seccio h2 {
  font-family: 'Newsreader', Georgia, serif; font-size: 24px; font-weight: 500;
  color: #141B18; margin-bottom: 24px; break-after: avoid; page-break-after: avoid;
}
.body-serif { font-family: 'Newsreader', Georgia, serif; font-size: 16px; line-height: 1.75; color: #26312B; }
.body-serif p { margin-bottom: 10px; }

/* Dades clau (files numerades, com la web) */
.dades-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
.dades-row { display: grid; grid-template-columns: 26px 1fr; gap: 12px; align-items: baseline; padding: 12px 0; border-bottom: 1px solid rgba(201,184,154,0.5); break-inside: avoid; page-break-inside: avoid; }
.dades-num { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 11px; font-weight: 600; color: #5E8772; }
.dades-val { font-family: 'Newsreader', Georgia, serif; font-size: 18px; font-weight: 600; color: #141B18; }
.dades-label { font-size: 14px; color: #26312B; }
.dades-page { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9px; color: #9C8B7A; text-transform: uppercase; letter-spacing: .1em; }

/* Implicacions 3 columnes amb top border de color */
.impl-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 28px; margin-bottom: 28px; }
.impl-col { border-top: 2px solid #141B18; padding-top: 16px; break-inside: avoid; page-break-inside: avoid; }
.impl-col.reg { border-top-color: #5E8772; }
.impl-col.ciut { border-top-color: #AAC9B6; }
.impl-actor { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .2em; font-weight: 600; color: #141B18; margin-bottom: 10px; }
.impl-col.reg .impl-actor { color: #5E8772; }
.impl-col.ciut .impl-actor { color: #8A6D2B; }
.impl-body { font-size: 13px; line-height: 1.65; color: #26312B; }
.impl-body p { margin-bottom: 8px; }

/* Mes enlla del Checkbox (fosc) */
.mes-enlla { background: #26312B; color: #F2F5F1; border-left: 4px solid #5E8772; padding: 24px 28px; break-inside: avoid; page-break-inside: avoid; }
.mes-enlla .kicker-dark { margin-bottom: 12px; }
.mes-enlla .criteri { font-family: 'Newsreader', Georgia, serif; font-size: 18px; font-style: italic; color: #F2F5F1; }
.mes-enlla .body { font-size: 13px; line-height: 1.7; margin-top: 12px; color: rgba(245,239,230,0.75); }
.mes-enlla .body p { margin-bottom: 8px; }

/* Connexions */
.conn-box { border: 1px solid #D8E2DA; background: #FFFFFF; padding: 16px 18px; margin-bottom: 12px; break-inside: avoid; page-break-inside: avoid; }
.conn-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.conn-type { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; font-weight: 600; padding: 3px 9px; }
.conn-target { font-family: 'Newsreader', Georgia, serif; font-size: 15px; font-weight: 600; color: #26312B; }
.conn-desc { font-size: 13px; line-height: 1.6; color: #141B18; }

/* Accions recomanades (banda destacada com la web) */
.band-accions { background: rgba(184,115,51,0.06); border-top: 1px solid #5E8772; border-bottom: 1px solid #5E8772; padding: 44px 56px; break-inside: avoid; page-break-inside: avoid; }
.accions-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
.accio-item { display: flex; flex-direction: column; gap: 14px; break-inside: avoid; page-break-inside: avoid; }
.accio-circle { width: 44px; height: 44px; border-radius: 50%; background: #5E8772; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-family: 'Newsreader', Georgia, serif; font-size: 19px; font-weight: 600; }
.accio-desc { font-size: 13.5px; font-weight: 500; line-height: 1.6; color: #26312B; }

/* Cross-reference (taula amb capcalera fosca com la web) */
table.xref-table { width: 100%; border-collapse: collapse; }
.xref-table th { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9.5px; text-transform: uppercase; letter-spacing: .18em; font-weight: 600; background: #141B18; color: #F2F5F1; text-align: left; padding: 12px 14px; }
.xref-table td { padding: 14px; border-bottom: 1px solid #D8E2DA; vertical-align: top; break-inside: avoid; page-break-inside: avoid; }
.xref-fw { font-family: 'Newsreader', Georgia, serif; font-size: 15px; font-weight: 600; color: #26312B; }
.xref-cr { font-size: 13px; line-height: 1.55; color: #26312B; }
.xref-imp { display: inline-block; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; font-weight: 600; padding: 4px 10px; }

/* Footer + disclaimer */
.footer-line { margin: 32px 56px 0 56px; padding-top: 20px; border-top: 1px solid #26312B; display: flex; justify-content: space-between; align-items: baseline; }
.footer-line .frase { font-family: 'Newsreader', Georgia, serif; font-size: 14px; font-style: italic; color: #141B18; }
.footer-line .font-link { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; font-weight: 600; color: #3F6653; }
.disclaimer { padding: 24px 56px 40px 56px; text-align: center; font-family: 'Newsreader', Georgia, serif; font-size: 12px; font-style: italic; line-height: 1.6; color: rgba(38,49,43,0.6); }
"""

# Colors segons status (v7 — harmonitzats amb la paleta salvia)
STATUS_COLORS = {
    "verd": "#5C8A5C",
    "groc": "#C9A961",
    "vermell": "#A0522D",
}

# Colors segons grade
GRADE_BG = {
    "A": "#5C8A5C",
    "B": "#C9A961",
    "C": "#C9A961",
    "D": "#A0522D",
}


def esc(s):
    """Escape HTML."""
    if not s:
        return ""
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def md_table_to_rows(body: str) -> list:
    """Converteix taules Markdown a llistes de files (diccionaris per capçalera).

    Accepta qualsevol nombre de columnes. Retorna [] si no hi ha cap taula.
    Exemple:
        | # | Títol | Descripció | Esforç | Impacte |
        |---|-------|------------|--------|---------|
        | 01 | X | Y | Mitjà | Alt |
    → [{"#": "01", "Títol": "X", "Descripció": "Y", "Esforç": "Mitjà", "Impacte": "Alt"}]
    """
    rows = []
    lines = [l.strip() for l in body.split("\n") if l.strip().startswith("|")]
    if len(lines) < 2:
        return rows
    # Capçalera: primera línia, separador: segona
    header = [c.strip() for c in lines[0].strip("|").split("|")]
    if not all(re.match(r"^:?-+:?$", c) for c in [x.strip() for x in lines[1].strip("|").split("|")]):
        return rows  # no és una taula Markdown vàlida
    for line in lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) != len(header):
            continue
        rows.append({h: cells[i] for i, h in enumerate(header)})
    return rows


def md_to_html(text):
    """Converteix Markdown bàsic a HTML (per als textos de GLM que venen en MD)."""
    if not text:
        return ""
    # Headers
    text = re.sub(r"^### (.+)$", r"<strong>\1</strong><br>", text, flags=re.MULTILINE)
    text = re.sub(r"^## (.+)$", r"<strong>\1</strong><br>", text, flags=re.MULTILINE)
    text = re.sub(r"^# (.+)$", r"<strong>\1</strong><br>", text, flags=re.MULTILINE)
    # Bold
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    # Italic
    text = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", text)
    # Paràgrafs
    paragraphs = text.strip().split("\n\n")
    return "".join(f"<p>{p.strip()}</p>" for p in paragraphs if p.strip())


def parse_md_to_reportblock(md_text: str, lang: str = "ca") -> dict:
    """Parseja un Markdown del pas 4/5 a una estructura ReportBlock."""
    # Treure front-matter
    if md_text.startswith("---"):
        end = md_text.find("---", 3)
        if end > 0:
            front = md_text[3:end].strip()
            md_text = md_text[end+3:].strip()
            # Extreure camps del front-matter
            meta = {}
            for line in front.split("\n"):
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
        else:
            meta = {}
    else:
        meta = {}

    # Heuristic: extreure blocs per headers
    sections = re.split(r"^## ", md_text, flags=re.MULTILINE)
    result = {
        "title": meta.get("title", ""),
        "institution": meta.get("institution", ""),
        "date": meta.get("date", ""),
        "lang": lang,
        "semafor": {"grade": "C", "gradeLabel": "", "indicators": []},
        "dadesClau": [],
        "resumExecutiu": "",
        "implicacions": {"empreses": "", "reguladors": "", "ciutadans": ""},
        "mesEnllaCheckbox": {"criteri": "", "body": ""},
        "connexions": [],
        "accions": [],
        "crossRefs": [],
    }

    for section in sections[1:]:  # skip primer (abans del primer ##)
        lines = section.strip().split("\n")
        title = lines[0].strip()
        body = "\n".join(lines[1:]).strip()
        title_es = title.replace("Bloque", "Bloc", 1).lstrip("#").strip()  # normalitza "## Bloque 0" → "Bloc 0" (castellà + treu ##)

        if title_es.startswith("Bloc 0") or "Semàfor" in title_es:
            # Nota global (format antic) o Grau:/Grado: (format nou, CA i ES)
            m = re.search(r"(?:Nota global|Global)[:\s]*([A-D])\s*[·-]?\s*(.+?)(?:\n|$)", body)
            if not m:
                m = re.search(r"\*?\*?Grau:?\*?\*?\s*([A-D])\s*[·—-]?\s*(.+?)(?:\n|$)", body)
            if not m:
                m = re.search(r"\*?\*?Grado:?\*?\*?\s*([A-D])\s*[·—-]?\s*(.+?)(?:\n|$)", body)
            if m:
                result["semafor"]["grade"] = m.group(1)
                result["semafor"]["gradeLabel"] = m.group(2).strip()
            # Indicators: format antic (llistes) o format nou (taula)
            table_rows = md_table_to_rows(body)
            if table_rows:
                for row in table_rows:
                    # Columnes possibles: Indicador/Indicador|Estat|Nota (ca) o Indicador|Estado|Nota (es)
                    name = row.get("Indicador") or row.get("Indicador") or ""
                    status_str = row.get("Estat") or row.get("Estado") or ""
                    note = row.get("Nota", "")
                    if not name:
                        continue
                    status_map = {"verd": "verd", "groc": "groc", "vermell": "vermell", "verda": "verd", "groga": "groc", "vermella": "vermell", "verde": "verd", "amarillo": "groc", "rojo": "vermell"}
                    status = status_map.get(status_str.strip().lower(), "groc")
                    label_map = {"verd": "Quantificat", "groc": "Esmentat", "vermell": "Ignorat"}
                    result["semafor"]["indicators"].append({
                        "name": name,
                        "status": status,
                        "label": label_map.get(status, "Esmentat"),
                        "note": note,
                    })
            else:
                for line in body.split("\n"):
                    # Format antic: - **Nom**: estat — nota (CA)
                    m = re.match(r"-\s*\*\*([^*]+)\*\*:\s*(\w+)\s*[—-]\s*(.+)", line)
                    if m:
                        name = m.group(1).strip()
                        status_str = m.group(2).strip().lower()
                        note = m.group(3).strip()
                    else:
                        # Format ES: - **Verde** · Nombre: valor — cuantificado
                        m = re.match(r"-\s*\*\*(Verde|Amarillo|Rojo|Verd|Groc|Vermell|verde|amarillo|rojo)\*\*\s*[·•]\s*([^:]+):\s*(.+)", line)
                        if m:
                            name = m.group(2).strip()
                            status_str = m.group(1).strip().lower()
                            note = m.group(3).strip()
                        else:
                            continue
                    status_map = {"verd": "verd", "groc": "groc", "vermell": "vermell", "verda": "verd", "groga": "groc", "vermella": "vermell", "verde": "verd", "amarillo": "groc", "rojo": "vermell"}
                    status = status_map.get(status_str, "groc")
                    label_map = {"verd": "Quantificat", "groc": "Esmentat", "vermell": "Ignorat"}
                    result["semafor"]["indicators"].append({
                        "name": name,
                        "status": status,
                        "label": label_map.get(status, "Esmentat"),
                        "note": note,
                    })

        elif title_es.startswith("Bloc 1") or "Fitxa" in title_es:
            result["fitxa"] = body

        elif title_es.startswith("Bloc 2") or "dades clau" in title_es.lower():
            # Buscar entrades "1. **valor** — label (p. X)"
            for line in body.split("\n"):
                m = re.match(r"\d+\.\s*\*\*([^*]+)\*\*\s*[—-]\s*(.+?)(?:\s*\(p\.\s*([^)]+)\))?$", line)
                if m:
                    result["dadesClau"].append({
                        "value": m.group(1).strip(),
                        "label": m.group(2).strip(),
                        "page": m.group(3) or "",
                    })

        elif title_es.startswith("Bloc 3") or "Resum" in title_es:
            result["resumExecutiu"] = body

        elif title_es.startswith("Bloc 4") or "Implicacions" in title_es:
            # Subseccions: format antic (### Empreses) o format nou (**Empreses**)
            # Normalitzar: convertir negretes de subsecció a headers temporals
            # (captura també la "línia dura" de Markdown: **Empreses** seguit de 2 espais,
            #  i la variant amb punt: **Empreses.** text a la mateixa línia)
            # Regla: es normalitzen les negretes CURTES (subseccions) o les que
            # contenen "més enllà"/"más allá" (checkbox). Les negretes llargues que
            # no són subseccions (ex: **Criterios éticos: ...**) es deixen intactes.
            def _norm_subsection(m):
                label = m.group(1)
                if len(label) <= 30 or "enllà" in label or "allà" in label or "allá" in label or "alla" in label:
                    return f"### {label}\n"
                return m.group(0)

            body_norm = re.sub(r"^\*\*(.+?)\*\*\.?[ \t]*(?=\r?$| )", _norm_subsection, body, flags=re.MULTILINE)
            for sub in re.split(r"^### ", body_norm, flags=re.MULTILINE)[1:]:
                sub_lines = sub.split("\n")
                sub_title = sub_lines[0].strip().lower()
                sub_body = "\n".join(sub_lines[1:]).strip()
                if "empres" in sub_title:
                    result["implicacions"]["empreses"] = sub_body
                elif "regulador" in sub_title:
                    result["implicacions"]["reguladors"] = sub_body
                elif "ciutada" in sub_title or "ciudad" in sub_title:
                    result["implicacions"]["ciutadans"] = sub_body
                elif "checkbox" in sub_title or "enll" in sub_title:
                    # Més enllà del checkbox
                    m = re.search(r"(?:Criteri|Criterios? éticos?|Criterios?)\s*:\s*(.+?)(?:\n|$)", sub_body)
                    if m:
                        result["mesEnllaCheckbox"]["criteri"] = m.group(1).strip()
                        sub_body = re.sub(r"(?:Criteri|Criterios? éticos?|Criterios?)\s*:\s*.+?\n", "", sub_body, count=1)
                    result["mesEnllaCheckbox"]["body"] = sub_body.strip()

        elif title_es.startswith("Bloc 5") or "Connexions" in title_es:
            # Format nou (taula): | Tipus | Objectiu | Descripció |
            table_rows = md_table_to_rows(body)
            if table_rows:
                for row in table_rows:
                    typ = row.get("Tipus") or row.get("Tipo") or row.get("Type") or ""
                    target = row.get("Objectiu") or row.get("Objetivo") or row.get("Target") or ""
                    desc = row.get("Descripció") or row.get("Descripcion") or row.get("Descripción") or ""
                    if typ or target or desc:
                        result["connexions"].append({"type": typ, "target": target, "desc": desc})
            # Format antic: - **Type** — target: desc
            for line in body.split("\n"):
                m = re.match(r"-\s*\*\*([^*]+)\*\*\s*[—-]\s*([^:]+):\s*(.+)", line)
                if m:
                    result["connexions"].append({
                        "type": m.group(1).strip(),
                        "target": m.group(2).strip(),
                        "desc": m.group(3).strip(),
                    })
                else:
                    # Format nou (llista): - **Evolució:** X → Y  o  - **Complement:** X → Y
                    # Nota: el dos punts pot anar DINS (**Evolució:**) o FORA (**Evolució**:) de la negreta
                    m2 = re.match(r"-\s*\*\*([^*]+?)\*?\*?:\*?\*?\s*(.+)", line)
                    if m2:
                        typ = m2.group(1).strip()
                        rest = m2.group(2).strip()
                        # Separar target / desc si hi ha fletxa
                        if "→" in rest or "->" in rest:
                            parts = re.split(r"\s*(?:→|->)\s*", rest, maxsplit=1)
                            target, desc = parts[0], parts[1] if len(parts) > 1 else ""
                        else:
                            target, desc = rest, ""
                        result["connexions"].append({"type": typ, "target": target, "desc": desc})

        elif title_es.startswith("Bloc 6") or "Accions" in title_es:
            # Format nou: taula | # | Títol | Descripció | Esforç | Impacte |
            table_rows = md_table_to_rows(body)
            if table_rows:
                for row in table_rows:
                    num = row.get("#") or row.get("Nº") or row.get("Num") or ""
                    t = row.get("Títol") or row.get("Titulo") or row.get("Título") or ""
                    desc = row.get("Descripció") or row.get("Descripcion") or row.get("Descripción") or ""
                    effort = row.get("Esforç") or row.get("Esfuerzo") or "Mitjà"
                    impact = row.get("Impacte") or row.get("Impacto") or "Mitjà"
                    if not t:
                        continue
                    result["accions"].append({
                        "num": num,
                        "title": t,
                        "desc": desc,
                        "effort": effort,
                        "impact": impact,
                    })
            else:
                # Format inline nou (una acció per línia): 1. **títol** — Esforç: X; Impacte: Y. desc
                inline_found = False
                for line in body.split("\n"):
                    line = line.strip()
                    m = re.match(
                        r"(\d+)[.)]\s*\*\*([^*]+)\*\*\s*[—-]\s*Esfor[:ç]c?\s*:\s*(\w+)\s*[;·]\s*Impacte?\s*:\s*(\w+)[.;:]?\s*(.*)",
                        line,
                    )
                    if m:
                        inline_found = True
                        result["accions"].append({
                            "num": m.group(1),
                            "title": m.group(2).strip(),
                            "desc": m.group(5).strip(),
                            "effort": m.group(3).strip(),
                            "impact": m.group(4).strip(),
                        })
                if inline_found:
                    pass  # ja processat amb format inline per línia
                else:
                    # Format ES: **01 — Títol**\ndesc\n*Esfuerzo: Medio | Impacto: Alto*
                    blocks = re.split(r"\n\s*\n", body)
                    for block in blocks:
                        m = re.match(
                            r"\*\*(\d+)\s*[—-]\s*(.+?)\*\*[ \t]*\r?\n+(.+?)\n\*Esfuerzo:?\s*:?\s*(.+?)\s*[|·]\s*Impacto:?\s*:?\s*(.+?)\*",
                            block.strip(),
                        )
                        if m:
                            result["accions"].append({
                                "num": m.group(1),
                                "title": m.group(2).strip(),
                                "desc": m.group(3).strip(),
                                "effort": m.group(4).strip(),
                                "impact": m.group(5).strip(),
                            })
                            continue
                        # Format antic: 01. **títol** — desc\n   - Esforç: X · Impacte: Y
                        m = re.match(r"(\d+)\.\s*\*\*([^*]+)\*\*\s*[—-]\s*(.+?)(?:\n\s*-\s*Esfor[:ç]c?\s*:\s*(\w+)\s*[·-]\s*Impacte?\s*:\s*(\w+))?", block.strip())
                        if m:
                            result["accions"].append({
                                "num": m.group(1),
                                "title": m.group(2).strip(),
                                "desc": m.group(3).strip(),
                                "effort": m.group(4) or "Mitjà",
                                "impact": m.group(5) or "Mitjà",
                            })
                            continue
                        # Format inline (un bloc per línia): 1. **títol** — Esforç: Alt; Impacte: Alt. desc
                        m = re.match(
                            r"(\d+)[.)]\s*\*\*([^*]+)\*\*\s*[—-]\s*Esfor[:ç]c?\s*:\s*(\w+)\s*[;·]\s*Impacte?\s*:\s*(\w+)[.;:]?\s*(.*)",
                            block.strip(),
                        )
                        if m:
                            result["accions"].append({
                                "num": m.group(1),
                                "title": m.group(2).strip(),
                                "desc": m.group(5).strip(),
                                "effort": m.group(3).strip(),
                                "impact": m.group(4).strip(),
                            })
                            continue
                        # Format ES inline: 01 **títol** — desc. Esfuerzo alto, impacto alto.
                        m = re.match(
                            r"(\d+)\s*\*\*([^*]+)\*\*\s*[—-]\s*(.+?)\.\s*Esfuerzo\s+(\w+),\s*impacto\s+(\w+)\.?\s*$",
                            block.strip(),
                        )
                        if m:
                            result["accions"].append({
                                "num": m.group(1),
                                "title": m.group(2).strip(),
                                "desc": m.group(3).strip(),
                                "effort": m.group(4).strip(),
                                "impact": m.group(5).strip(),
                            })

        elif title_es.startswith("Bloc 7") or "Cross" in title_es or "cross" in title_es:
            # Format nou (taula): | Marc de referència | Criteri | Impacte |
            table_rows = md_table_to_rows(body)
            if table_rows:
                for row in table_rows:
                    framework = row.get("Marc de referència") or row.get("Marco de referencia") or row.get("Marco de referencia") or row.get("Marc") or row.get("Framework") or row.get("Marco") or ""
                    criterion = row.get("Criteri") or row.get("Criterio") or ""
                    impact = row.get("Impacte") or row.get("Impacto") or ""
                    if framework:
                        result["crossRefs"].append({
                            "framework": framework,
                            "criterion": criterion,
                            "impact": impact,
                        })
            # Format antic: - **Marc** — criteri: impact
            # Format nou: - **CSRD/ESRS:** text (dos punts DINS la negreta)
            for line in body.split("\n"):
                m = re.match(r"-\s*\*\*([^*]+)\*\*\s*[—-]\s*([^:]+):\s*(.+)", line)
                if m:
                    result["crossRefs"].append({
                        "framework": m.group(1).strip(),
                        "criterion": m.group(2).strip(),
                        "impact": m.group(3).strip(),
                    })
                    continue
                m = re.match(r"-\s*\*\*([^*:]+):\*\*\s*(.+)", line)
                if m:
                    result["crossRefs"].append({
                        "framework": m.group(1).strip(),
                        "criterion": "",
                        "impact": m.group(2).strip(),
                    })

    return result


def generate_html(report: dict) -> str:
    """Genera HTML replica de la pagina d'informe de la web v7 (salvia/ink)."""
    lang = report.get("lang", "ca")
    is_ca = lang == "ca"

    GC = {"A": "#5C8A5C", "B": "#C9A961", "C": "#C9A961", "D": "#A0522D"}
    SC = {"verd": "#5C8A5C", "groc": "#C9A961", "vermell": "#A0522D"}
    TYPE_LABEL = {"regulatory": "Regulador", "framework": "Framework", "rating": "Rating",
                  "industry": "Sectorial", "official": "Oficial"}
    SCOPE_LABEL = {"CAT": "Catalunya", "ES": "Espanya", "EU": "UE", "GLOBAL": "Global"}

    t = {
        "minuts": "5 min · 8 blocs" if is_ca else "5 min · 8 bloques",
        "gratis": "Gratis",
        "semafor_kicker": "Bloc 01 · Semàfor metodològic" if is_ca else "Bloque 01 · Semáforo metodológico",
        "fitxa_kicker": "Bloc 02 · Fitxa tècnica" if is_ca else "Bloque 02 · Ficha técnica",
        "dades_kicker": "Bloc 03 · 5 dades clau" if is_ca else "Bloque 03 · 5 datos clave",
        "dades_h2": "El que diu l'informe, en xifres" if is_ca else "Lo que dice el informe, en cifras",
        "resum_kicker": "Bloc 04 · Resum executiu" if is_ca else "Bloque 04 · Resumen ejecutivo",
        "resum_h2": "Què diu en llenguatge clar" if is_ca else "Qué dice en lenguaje claro",
        "impl_kicker": "Bloc 05 · Implicacions" if is_ca else "Bloque 05 · Implicaciones",
        "impl_h2": "Per a empreses, reguladors, ciutadans" if is_ca else "Para empresas, reguladores, ciudadanos",
        "empreses": "Empreses" if is_ca else "Empresas",
        "reguladors": "Reguladors" if is_ca else "Reguladores",
        "ciutadans": "Ciutadans" if is_ca else "Ciudadanos",
        "mes_enlla": "Més enllà del Checkbox" if is_ca else "Más allá del Checkbox",
        "conn_kicker": "Bloc 06 · Connexions" if is_ca else "Bloque 06 · Conexiones",
        "conn_h2": "Relacions amb altres informes" if is_ca else "Relaciones con otros informes",
        "acc_kicker": "Bloc 07 · Accions recomanades ⭐" if is_ca else "Bloque 07 · Acciones recomendadas ⭐",
        "acc_h2": "3 accions operatives per aquesta setmana" if is_ca else "3 acciones operativas para esta semana",
        "xref_kicker": "Bloc 08 · Cross-reference ⭐" if is_ca else "Bloque 08 · Cross-reference ⭐",
        "xref_h2": "Com t'afecta segons les teves certificacions" if is_ca else "Cómo te afecta según tus certificaciones",
        "xref_th1": "Certificació" if is_ca else "Certificación",
        "xref_th2": "Com t'afecta" if is_ca else "Cómo te afecta",
        "xref_th3": "Impacte" if is_ca else "Impacto",
        "frase": "5 minuts de lectura. 8 blocs que canvien el teu criteri sobre un informe de {n} pàgines." if is_ca else "5 minutos de lectura. 8 bloques que cambian tu criterio sobre un informe de {n} páginas.",
        "font_orig": "Veure font original →" if is_ca else "Ver fuente original →",
        "disclaimer": "Criteri ESG aplica un flux de doble revisió per a cada informe: GLM redacta, Gemini fa d'advocat del diable, i l'equip humà valida sempre cada bloc abans de publicar." if is_ca else "Criteri ESG aplica un flujo de doble revisión para cada informe: GLM redacta, Gemini hace de abogado del diablo, y el equipo humano valida siempre cada bloque antes de publicar.",
    }

    sem = report.get("semafor", {})
    grade = sem.get("grade", "C")
    grade_label = sem.get("gradeLabel", "")
    grade_color = GC.get(grade, "#A0522D")

    # Indicadors del semafor (estil web: 3 dots + label + nota)
    indicators_html = ""
    for ind in sem.get("indicators", []):
        st = ind.get("status", "groc")
        color = SC.get(st, "#C9A961")
        op = lambda s: "1" if s == st else "0.3"
        indicators_html += f"""
        <div class="ind-row">
          <div class="ind-top">
            <span class="ind-name">{esc(ind.get('name', ''))}</span>
            <div style="display:flex; align-items:center;">
              <div class="dots">
                <span class="dot" style="background:{SC['verd']}; opacity:{op('verd')};"></span>
                <span class="dot" style="background:{SC['groc']}; opacity:{op('groc')};"></span>
                <span class="dot" style="background:{SC['vermell']}; opacity:{op('vermell')};"></span>
              </div>
              <span class="ind-label" style="color:{color};">{esc(ind.get('label', ''))}</span>
            </div>
          </div>
          <p class="ind-note">{esc(ind.get('note', ''))}</p>
        </div>"""

    # Dades clau (files numerades com la web)
    dades_html = ""
    for i, d in enumerate(report.get("dadesClau", [])):
        page_html = f'<span class="dades-page"> · {esc(d.get("page", ""))}</span>' if d.get("page") else ""
        dades_html += f"""
        <div class="dades-row">
          <span class="dades-num">{str(i + 1).zfill(2)}</span>
          <div><span class="dades-val">{esc(d.get('value', ''))}</span> <span class="dades-label">{esc(d.get('label', ''))}</span>{page_html}</div>
        </div>"""

    # Implicacions
    impl = report.get("implicacions", {})
    impl_html = ""
    for key, cls, label in [("empreses", "", t["empreses"]), ("reguladors", "reg", t["reguladors"]), ("ciutadans", "ciut", t["ciutadans"])]:
        body = impl.get(key, "")
        if body:
            impl_html += f"""
        <div class="impl-col {cls}">
          <div class="impl-actor">{label}</div>
          <div class="impl-body">{md_to_html(body)}</div>
        </div>"""

    # Mes enlla
    me = report.get("mesEnllaCheckbox", {})
    mes_enlla_html = ""
    if me.get("body") or me.get("criteri"):
        crit = f'<p class="criteri">{esc(me.get("criteri", ""))}</p>' if me.get("criteri") else ""
        mes_enlla_html = f"""
        <div class="mes-enlla">
          <div class="kicker-dark">{t['mes_enlla']}</div>
          {crit}
          <div class="body">{md_to_html(me.get('body', ''))}</div>
        </div>"""

    # Connexions
    conn_html = ""
    for c in report.get("connexions", []):
        ct = c.get("type", "")
        if "Contrad" in ct:
            pill_bg, pill_c = "rgba(160,82,45,0.15)", "#A0522D"
        elif "Complement" in ct:
            pill_bg, pill_c = "rgba(92,138,92,0.15)", "#4A6B3A"
        else:
            pill_bg, pill_c = "rgba(184,115,51,0.12)", "#3F6653"
        conn_html += f"""
        <div class="conn-box">
          <div class="conn-head">
            <span class="conn-type" style="background:{pill_bg}; color:{pill_c};">{esc(ct)}</span>
            <span class="conn-target">{esc(c.get('target', ''))}</span>
          </div>
          <p class="conn-desc">{esc(c.get('desc', ''))}</p>
        </div>"""

    # Accions (nomes desc com la web)
    accions_html = ""
    for a in report.get("accions", []):
        txt = a.get("desc") or a.get("title", "")
        accions_html += f"""
        <div class="accio-item">
          <div class="accio-circle">{esc(a.get('num', ''))}</div>
          <p class="accio-desc">{esc(txt)}</p>
        </div>"""

    # Cross-references (taula)
    xref_rows = ""
    for x in report.get("crossRefs", []):
        imp = x.get("impact", "")
        if imp in ("Alt", "Alto"):
            ib, ic = "rgba(160,82,45,0.15)", "#A0522D"
        elif imp in ("Mitjà", "Mitja", "Medio"):
            ib, ic = "rgba(201,169,97,0.18)", "#8A6D2B"
        else:
            ib, ic = "rgba(139,115,85,0.1)", "#4A5F53"
        xref_rows += f"""
        <tr>
          <td><span class="xref-fw">{esc(x.get('framework', ''))}</span></td>
          <td><span class="xref-cr">{esc(x.get('criterion', ''))}</span></td>
          <td><span class="xref-imp" style="background:{ib}; color:{ic};">{esc(imp)}</span></td>
        </tr>"""

    # Badges + meta (fitxa tecnica)
    rtype = report.get("type", "") or ""
    badge_type = TYPE_LABEL.get(rtype, rtype)
    badges = ""
    if badge_type:
        badges += f'<span class="badge badge-type">{esc(badge_type)}</span>'
    badges += f'<span class="badge badge-free">{t["gratis"]}</span>'

    meta_parts = [f"<strong>{esc(report.get('institution', ''))}</strong>"]
    if report.get("date"):
        meta_parts.append(esc(report.get("date")))
    if report.get("pages"):
        pg = str(report.get("pages"))
        meta_parts.append(f"{esc(pg)} {'pàg' if is_ca else 'pág'}")
    meta_html = '<span class="msep">·</span>'.join(meta_parts)

    fitxa = report.get("fitxa", "")
    fitxa_section = ""
    if fitxa:
        fitxa_section = f"""
    <section class="seccio">
      <div class="kicker">{t['fitxa_kicker']}</div>
      <div class="body-serif">{md_to_html(fitxa)}</div>
    </section>"""

    n_pages = report.get("pages", "")
    frase = t["frase"].replace("{n}", str(n_pages) if n_pages else "—")
    url = report.get("url", "")
    font_link = f'<span class="font-link">{t["font_orig"]}</span>' if url else ""

    html = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<title>{esc(report.get('title', ''))} — Criteri ESG</title>
<style>{CSS}</style>
</head>
<body>
<div class="page">

  <div class="breadcrumb">
    <p class="crumb"><a>Biblioteca</a><span class="sep">/</span><a>Informes</a><span class="sep">/</span><span class="here">{esc(report.get('title', ''))}</span></p>
    <span class="right">{t['minuts']}</span>
  </div>

  <header class="fitxa-header">
    <div class="badges">{badges}</div>
    <h1>{esc(report.get('title', ''))}</h1>
    <div class="meta-row">{meta_html}</div>
  </header>

  <section class="semafor">
    <div class="semafor-grid">
      <div>
        <div class="kicker-dark">{t['semafor_kicker']}</div>
        <div class="grade-row">
          <span class="grade-letter" style="color:{grade_color};">{esc(grade)}</span>
          <span class="grade-label">{esc(grade_label)}</span>
        </div>
      </div>
      <div>{indicators_html}</div>
    </div>
  </section>

  {fitxa_section}

  <section class="seccio">
    <div class="kicker">{t['dades_kicker']}</div>
    <h2>{t['dades_h2']}</h2>
    <div class="dades-grid">{dades_html}</div>
  </section>

  <section class="seccio">
    <div class="kicker">{t['resum_kicker']}</div>
    <h2>{t['resum_h2']}</h2>
    <p class="body-serif">{esc(report.get('resumExecutiu', ''))}</p>
  </section>

  <section class="seccio">
    <div class="kicker">{t['impl_kicker']}</div>
    <h2>{t['impl_h2']}</h2>
    <div class="impl-grid">{impl_html}</div>
    {mes_enlla_html}
  </section>

  <section class="seccio">
    <div class="kicker">{t['conn_kicker']}</div>
    <h2>{t['conn_h2']}</h2>
    {conn_html}
  </section>

  <section class="band-accions">
    <div class="kicker">{t['acc_kicker']}</div>
    <h2>{t['acc_h2']}</h2>
    <div class="accions-grid">{accions_html}</div>
  </section>

  <section class="seccio">
    <div class="kicker">{t['xref_kicker']}</div>
    <h2>{t['xref_h2']}</h2>
    <table class="xref-table">
      <thead>
        <tr><th>{t['xref_th1']}</th><th>{t['xref_th2']}</th><th>{t['xref_th3']}</th></tr>
      </thead>
      <tbody>{xref_rows}</tbody>
    </table>
  </section>

  <div class="footer-line">
    <span class="frase">{frase}</span>
    {font_link}
  </div>

  <div class="disclaimer">{t['disclaimer']}</div>

</div>
</body>
</html>"""
    return html


def html_to_pdf(html: str, pdf_path: Path):
    """Converteix HTML a PDF.

    Backend preferit a Windows: Edge/Chrome headless (weasyprint falla
    per libgobject-2.0-0 absent). Detecta el navegador disponible.
    """
    import shutil

    # Possibles ubicacions del navegador (Windows) — Chrome primer (verificat 13-agost-2026)
    browsers = [
        shutil.which("chrome"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        shutil.which("msedge"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    browser = next((b for b in browsers if b and Path(b).exists()), None)
    if not browser:
        raise Exception(
            "Cap navegador (Edge/Chrome) disponible per generar PDF. "
            "Instal·la Microsoft Edge o Chrome."
        )

    with tempfile.NamedTemporaryFile(mode="w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html)
        html_path = f.name
    profile_dir = tempfile.mkdtemp(prefix="hermes-pdf-profile-")

    try:
        result = subprocess.run(
            [
                browser, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                f"--user-data-dir={profile_dir}",
                f"--print-to-pdf={str(pdf_path.resolve())}",
                Path(html_path).as_uri(),
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode != 0 or not pdf_path.exists():
            raise Exception(f"Error navegador: {result.stderr[:300]}")
    finally:
        Path(html_path).unlink(missing_ok=True)
        import shutil as _shutil
        _shutil.rmtree(profile_dir, ignore_errors=True)


def main():
    if len(sys.argv) < 2:
        print("Ús: genera-pdf-informe.py <slug>")
        sys.exit(1)

    slug = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else "ca"

    md_path = REVISATS_DIR / f"{slug}.{lang}.md"
    if not md_path.exists():
        print(f"✗ No s'ha trobat {md_path}")
        sys.exit(1)

    print(f"=== Generant PDF per {slug} ({lang}) ===")
    md_text = md_path.read_text(encoding="utf-8")
    print(f"  → Parsejant Markdown...")
    report = parse_md_to_reportblock(md_text, lang)
    print(f"  ✓ {len(report.get('dadesClau', []))} dades clau, {len(report.get('accions', []))} accions")

    print(f"  → Generant HTML...")
    html = generate_html(report)

    pdf_path = REVISATS_DIR / f"{slug}.{lang}.pdf"
    print(f"  → Convertint a PDF...")
    html_to_pdf(html, pdf_path)
    print(f"  ✓ PDF generat: {pdf_path} ({pdf_path.stat().st_size/1024:.1f} KB)")


if __name__ == "__main__":
    main()
