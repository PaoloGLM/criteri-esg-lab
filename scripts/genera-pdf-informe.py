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
  --muted: #E4ECE6; --rule: #D8E2DA; --highlight: #F5E381;
  --sem-g: #5C8A5C; --sem-y: #C9A961; --sem-r: #A0522D;
}

@page { size: A4; margin: 0; }

body {
  background: var(--bg); font-family: 'DM Sans', system-ui, sans-serif;
  color: var(--ink); line-height: 1.6; font-size: 13px;
}
.page { width: 210mm; }
/* Contenidor de blocs: font-size 0 elimina espais entre inline-blocks.
   TRUC CLAU: cada bloc es display:inline-block + width:100% -> Chromium print
   MAI no el divideix entre pagines (el mou sencer a la seguent). */
.sections { font-size: 0; }

/* ---------- Breadcrumb ---------- */
.breadcrumb {
  background: var(--bg); border-bottom: 1px solid var(--rule);
  padding: 14px 48px; display: flex; justify-content: space-between; align-items: baseline;
}
.breadcrumb .crumb { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .16em; color: #4A5F53; }
.breadcrumb .crumb .sep { color: #D8E2DA; margin: 0 12px; }
.breadcrumb .crumb .here { color: #26312B; }
.breadcrumb .right { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .16em; font-weight: 600; color: #3F6653; }

/* ---------- Header fitxa tecnica ---------- */
.fitxa-header { padding: 36px 48px 26px 48px; border-bottom: 3px solid var(--accent); page-break-after: avoid; break-after: avoid; }
.badges { margin-bottom: 14px; }
.badge {
  display: inline-block; font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 9.5px; text-transform: uppercase; letter-spacing: .16em; font-weight: 600;
  padding: 5px 10px; margin-right: 8px;
}
.badge-type { background: rgba(92,58,30,0.12); color: #141B18; }
.badge-free { background: rgba(92,138,92,0.12); color: #4A6B3A; }
.fitxa-header h1 {
  font-family: 'Newsreader', Georgia, serif; font-size: 31px; font-weight: 500;
  line-height: 1.18; letter-spacing: -0.022em; color: #141B18; margin-bottom: 14px;
}
.meta-row { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; color: #4A5F53; }
.meta-row strong { color: #26312B; }
.meta-row .msep { margin: 0 14px; color: #D8E2DA; }

/* ---------- Bloc 01 Semafor (banda fosca full-width, columna esquerra compacta) ---------- */
.semafor {
  background: var(--ink); color: #F2F5F1; padding: 38px 48px;
  margin: 0; break-inside: avoid; page-break-inside: avoid;
  display: inline-block; width: 100%; font-size: 13px; box-sizing: border-box; vertical-align: top;
}
.semafor-grid { display: grid; grid-template-columns: 0.72fr 1.78fr; gap: 34px; align-items: center; }
.kicker-dark { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10.5px; text-transform: uppercase; letter-spacing: .22em; font-weight: 600; color: var(--accent-soft); margin-bottom: 14px; }
.grade-row { display: flex; align-items: baseline; gap: 14px; }
.grade-letter { font-family: 'Newsreader', Georgia, serif; font-size: 66px; font-weight: 400; line-height: 1; letter-spacing: -0.04em; }
.grade-label { font-family: 'Newsreader', Georgia, serif; font-size: 17px; font-style: italic; color: #F2F5F1; }
.ind-row { padding: 10px 0; border-bottom: 1px solid rgba(217,165,116,0.2); break-inside: avoid; page-break-inside: avoid; }
.ind-row:last-child { border-bottom: none; }
.ind-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.ind-name { font-family: 'Newsreader', Georgia, serif; font-size: 15px; font-weight: 500; color: #F2F5F1; }
.dots { display: flex; gap: 6px; }
.dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
.ind-label { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: .14em; font-weight: 600; margin-left: 8px; }
.ind-note { font-size: 12px; line-height: 1.55; margin-top: 4px; color: rgba(245,239,230,0.55); }

/* ---------- Targetes de contingut (mai partidos) ---------- */
.card {
  background: var(--card); border: 1px solid var(--rule);
  margin: 16px 48px; padding: 26px 34px;
  break-inside: avoid; page-break-inside: avoid;
  display: inline-block; width: calc(100% - 96px); font-size: 13px;
  box-sizing: border-box; vertical-align: top;
}
.card-dark { background: var(--ink); color: #F2F5F1; border: none; border-left: 5px solid var(--accent); }
.band {
  background: var(--muted); border-top: 2px solid var(--accent); border-bottom: 2px solid var(--accent);
  margin: 16px 0; padding: 34px 48px;
  break-inside: avoid; page-break-inside: avoid;
  display: inline-block; width: 100%; font-size: 13px; box-sizing: border-box; vertical-align: top;
}

.kicker { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10.5px; text-transform: uppercase; letter-spacing: .22em; font-weight: 600; color: var(--accent-deep); margin-bottom: 6px; }
.card-dark .kicker { color: var(--accent-soft); }
.seccio h2, .card h2, .band h2 {
  font-family: 'Newsreader', Georgia, serif; font-size: 20px; font-weight: 500;
  color: var(--ink-deep); margin-bottom: 18px;
  display: flex; align-items: baseline; gap: 10px;
  break-after: avoid; page-break-after: avoid;
}
.card-dark h2 { color: #F2F5F1; }
/* tick groc: detall curios de la paleta */
h2 .tick { display: inline-block; width: 24px; height: 8px; background: var(--highlight); flex: none; }

/* Contingut: mida uniforme 13px (bloc implicacions) */
.body-txt { font-size: 13px; line-height: 1.7; color: var(--ink); }
.body-serif { font-family: 'Newsreader', Georgia, serif; font-size: 13px; line-height: 1.75; color: var(--ink); }
.body-serif p, .body-txt p { margin-bottom: 8px; }

/* Dades clau: mateixa mida, xifra serif discreta */
.dades-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 30px; }
.dades-row { display: grid; grid-template-columns: 24px 1fr; gap: 10px; align-items: baseline; padding: 9px 0; border-bottom: 1px solid rgba(201,184,154,0.5); break-inside: avoid; page-break-inside: avoid; }
.dades-num { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10.5px; font-weight: 600; color: var(--accent-deep); }
.dades-val { font-family: 'Newsreader', Georgia, serif; font-size: 14px; font-weight: 600; color: var(--ink-deep); }
.dades-label { font-size: 13px; color: var(--ink); }
.dades-page { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9px; color: #9C8B7A; text-transform: uppercase; letter-spacing: .1em; }

/* Implicacions 3 columnes */
.impl-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
.impl-col { border-top: 2px solid var(--ink-deep); padding-top: 12px; break-inside: avoid; page-break-inside: avoid; }
.impl-col.reg { border-top-color: var(--accent); }
.impl-col.ciut { border-top-color: var(--accent-soft); }
.impl-actor { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .2em; font-weight: 600; color: var(--ink-deep); margin-bottom: 8px; }
.impl-col.reg .impl-actor { color: var(--accent-deep); }
.impl-col.ciut .impl-actor { color: #8A6D2B; }
.impl-body { font-size: 13px; line-height: 1.65; color: var(--ink); }
.impl-body p { margin-bottom: 7px; }

/* Mes enlla del Checkbox (targeta fosca numerada) */
.mes-enlla .criteri { font-family: 'Newsreader', Georgia, serif; font-size: 16px; font-style: italic; color: #F2F5F1; margin-bottom: 10px; }
.mes-enlla .body { font-size: 13px; line-height: 1.7; color: rgba(245,239,230,0.78); }
.mes-enlla .body p { margin-bottom: 7px; }

/* Connexions */
.conn-box { border: 1px solid var(--rule); background: #FFFFFF; padding: 13px 16px; margin-bottom: 10px; break-inside: avoid; page-break-inside: avoid; }
.conn-box:last-child { margin-bottom: 0; }
.conn-head { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; flex-wrap: wrap; }
.conn-type { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9.5px; text-transform: uppercase; letter-spacing: .14em; font-weight: 600; padding: 3px 9px; }
.conn-target { font-family: 'Newsreader', Georgia, serif; font-size: 14px; font-weight: 600; color: var(--ink); }
.conn-desc { font-size: 13px; line-height: 1.6; color: var(--ink); }

/* Accions */
.accions-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 28px; }
.accio-item { display: flex; flex-direction: column; gap: 12px; break-inside: avoid; page-break-inside: avoid; }
.accio-circle { width: 40px; height: 40px; border-radius: 50%; background: var(--accent); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-family: 'Newsreader', Georgia, serif; font-size: 17px; font-weight: 600; }
.accio-desc { font-size: 13px; font-weight: 500; line-height: 1.6; color: var(--ink); }

/* Cross-reference */
table.xref-table { width: 100%; border-collapse: collapse; }
.xref-table th { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9.5px; text-transform: uppercase; letter-spacing: .18em; font-weight: 600; background: var(--bg-deep); color: #F2F5F1; text-align: left; padding: 11px 14px; }
.xref-table td { padding: 12px 14px; border-bottom: 1px solid var(--rule); vertical-align: top; break-inside: avoid; page-break-inside: avoid; }
.xref-fw { font-family: 'Newsreader', Georgia, serif; font-size: 14px; font-weight: 600; color: var(--ink); }
.xref-cr { font-size: 13px; line-height: 1.55; color: var(--ink); }
.xref-imp { display: inline-block; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9.5px; text-transform: uppercase; letter-spacing: .14em; font-weight: 600; padding: 4px 10px; }

/* Footer + disclaimer */
.footer-line { margin: 26px 48px 0 48px; padding-top: 18px; border-top: 1px solid var(--ink); display: flex; justify-content: space-between; align-items: baseline; break-inside: avoid; page-break-inside: avoid; }
.footer-line .frase { font-family: 'Newsreader', Georgia, serif; font-size: 13px; font-style: italic; color: var(--ink-deep); }
.footer-line .font-link { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; font-weight: 600; color: var(--accent-deep); }
.disclaimer { padding: 20px 48px 36px 48px; text-align: center; font-family: 'Newsreader', Georgia, serif; font-size: 12px; font-style: italic; line-height: 1.6; color: rgba(38,49,43,0.6); }
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
    """Genera HTML replica de la web v7. Numeracio dinamica: cada bloc present
    rep numero sequencial (01, 02, ...); Mes enlla del Checkbox te numero propi.
    Cada bloc es una unitat indecomposable (page-break-inside: avoid)."""
    lang = report.get("lang", "ca")
    is_ca = lang == "ca"

    GC = {"A": "#5C8A5C", "B": "#C9A961", "C": "#C9A961", "D": "#A0522D"}
    SC = {"verd": "#5C8A5C", "groc": "#C9A961", "vermell": "#A0522D"}
    TYPE_LABEL = {"regulatory": "Regulador", "framework": "Framework", "rating": "Rating",
                  "industry": "Sectorial", "official": "Oficial"}

    L = {
        "semafor": "Semàfor metodològic" if is_ca else "Semáforo metodológico",
        "fitxa": "Fitxa tècnica" if is_ca else "Ficha técnica",
        "dades": "5 dades clau" if is_ca else "5 datos clave",
        "dades_h2": "El que diu l'informe, en xifres" if is_ca else "Lo que dice el informe, en cifras",
        "resum": "Resum executiu" if is_ca else "Resumen ejecutivo",
        "resum_h2": "Què diu en llenguatge clar" if is_ca else "Qué dice en lenguaje claro",
        "impl": "Implicacions" if is_ca else "Implicaciones",
        "impl_h2": "Per a empreses, reguladors, ciutadans" if is_ca else "Para empresas, reguladores, ciudadanos",
        "empreses": "Empreses" if is_ca else "Empresas",
        "reguladors": "Reguladors" if is_ca else "Reguladores",
        "ciutadans": "Ciutadans" if is_ca else "Ciudadanos",
        "mes_enlla": "Més enllà del Checkbox" if is_ca else "Más allá del Checkbox",
        "conn": "Connexions" if is_ca else "Conexiones",
        "conn_h2": "Relacions amb altres informes" if is_ca else "Relaciones con otros informes",
        "acc": "Accions recomanades ⭐" if is_ca else "Acciones recomendadas ⭐",
        "acc_h2": "3 accions operatives per aquesta setmana" if is_ca else "3 acciones operativas para esta semana",
        "xref": "Cross-reference ⭐" if is_ca else "Cross-reference ⭐",
        "xref_h2": "Com t'afecta segons les teves certificacions" if is_ca else "Cómo te afecta según tus certificaciones",
        "xref_th1": "Certificació" if is_ca else "Certificación",
        "xref_th2": "Com t'afecta" if is_ca else "Cómo te afecta",
        "xref_th3": "Impacte" if is_ca else "Impacto",
        "frase": "{n} blocs que canvien el teu criteri sobre un informe de {p} pàgines. 5 minuts de lectura." if is_ca else "{n} bloques que cambian tu criterio sobre un informe de {p} páginas. 5 minutos de lectura.",
        "font_orig": "Veure font original →" if is_ca else "Ver fuente original →",
        "disclaimer": "Criteri ESG aplica un flux de doble revisió per a cada informe: GLM redacta, Gemini fa d'advocat del diable, i l'equip humà valida sempre cada bloc abans de publicar." if is_ca else "Criteri ESG aplica un flujo de doble revisión para cada informe: GLM redacta, Gemini hace de abogado del diablo, y el equipo humano valida siempre cada bloque antes de publicar.",
        "minuts": "5 min de lectura" if is_ca else "5 min de lectura",
        "gratis": "Gratis",
        "pag": "pàg" if is_ca else "pág",
    }

    sem = report.get("semafor", {})
    grade = sem.get("grade", "C")
    grade_label = sem.get("gradeLabel", "")
    grade_color = GC.get(grade, "#A0522D")

    # ---- indicadors del semafor ----
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

    # ---- dades clau ----
    dades_html = ""
    for i, d in enumerate(report.get("dadesClau", [])):
        page_html = f' <span class="dades-page">· {esc(d.get("page", ""))}</span>' if d.get("page") else ""
        dades_html += f"""
        <div class="dades-row">
          <span class="dades-num">{str(i + 1).zfill(2)}</span>
          <div><span class="dades-val">{esc(d.get('value', ''))}</span> <span class="dades-label">{esc(d.get('label', ''))}</span>{page_html}</div>
        </div>"""

    # ---- implicacions ----
    impl = report.get("implicacions", {})
    impl_html = ""
    for key, cls, label in [("empreses", "", L["empreses"]), ("reguladors", "reg", L["reguladors"]), ("ciutadans", "ciut", L["ciutadans"])]:
        body = impl.get(key, "")
        if body:
            impl_html += f"""
        <div class="impl-col {cls}">
          <div class="impl-actor">{label}</div>
          <div class="impl-body">{md_to_html(body)}</div>
        </div>"""

    # ---- connexions ----
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

    # ---- accions ----
    accions_html = ""
    for a in report.get("accions", []):
        txt = a.get("desc") or a.get("title", "")
        accions_html += f"""
        <div class="accio-item">
          <div class="accio-circle">{esc(a.get('num', ''))}</div>
          <p class="accio-desc">{esc(txt)}</p>
        </div>"""

    # ---- cross-refs ----
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

    # ---- badges + meta ----
    rtype = report.get("type", "") or ""
    badge_type = TYPE_LABEL.get(rtype, rtype)
    badges = f'<span class="badge badge-type">{esc(badge_type)}</span>' if badge_type else ""
    badges += f'<span class="badge badge-free">{L["gratis"]}</span>'

    meta_parts = [f"<strong>{esc(report.get('institution', ''))}</strong>"]
    if report.get("date"):
        meta_parts.append(esc(report.get("date")))
    if report.get("pages"):
        meta_parts.append(f"{esc(str(report.get('pages')))} {L['pag']}")
    meta_html = '<span class="msep">·</span>'.join(meta_parts)

    NUM = "{NUM}"

    sections = []

    # Bloc 1 (sempre): semafor
    sections.append(f"""<section class="semafor">
    <div class="semafor-grid">
      <div>
        <div class="kicker-dark">Bloc {NUM} · {L['semafor']}</div>
        <div class="grade-row">
          <span class="grade-letter" style="color:{grade_color};">{esc(grade)}</span>
          <span class="grade-label">{esc(grade_label)}</span>
        </div>
      </div>
      <div>{indicators_html}</div>
    </div>
  </section>""")

    fitxa = report.get("fitxa", "")
    if fitxa:
        sections.append(f"""<section class="card">
    <div class="kicker">Bloc {NUM} · {L['fitxa']}</div>
    <div class="body-txt">{md_to_html(fitxa)}</div>
  </section>""")

    if dades_html:
        sections.append(f"""<section class="card">
    <div class="kicker">Bloc {NUM} · {L['dades']}</div>
    <h2><span class="tick"></span>{L['dades_h2']}</h2>
    <div class="dades-grid">{dades_html}</div>
  </section>""")

    if report.get("resumExecutiu", ""):
        sections.append(f"""<section class="card">
    <div class="kicker">Bloc {NUM} · {L['resum']}</div>
    <h2><span class="tick"></span>{L['resum_h2']}</h2>
    <p class="body-serif">{esc(report.get('resumExecutiu', ''))}</p>
  </section>""")

    if impl_html:
        sections.append(f"""<section class="card">
    <div class="kicker">Bloc {NUM} · {L['impl']}</div>
    <h2><span class="tick"></span>{L['impl_h2']}</h2>
    <div class="impl-grid">{impl_html}</div>
  </section>""")

    me = report.get("mesEnllaCheckbox", {})
    if me.get("body") or me.get("criteri"):
        crit = f'<p class="criteri">{esc(me.get("criteri", ""))}</p>' if me.get("criteri") else ""
        sections.append(f"""<section class="card card-dark mes-enlla">
    <div class="kicker">Bloc {NUM} · {L['mes_enlla']}</div>
    {crit}
    <div class="body">{md_to_html(me.get('body', ''))}</div>
  </section>""")

    if conn_html:
        sections.append(f"""<section class="card">
    <div class="kicker">Bloc {NUM} · {L['conn']}</div>
    <h2><span class="tick"></span>{L['conn_h2']}</h2>
    {conn_html}
  </section>""")

    if accions_html:
        sections.append(f"""<section class="band">
    <div class="kicker">Bloc {NUM} · {L['acc']}</div>
    <h2><span class="tick"></span>{L['acc_h2']}</h2>
    <div class="accions-grid">{accions_html}</div>
  </section>""")

    if xref_rows:
        sections.append(f"""<section class="card">
    <div class="kicker">Bloc {NUM} · {L['xref']}</div>
    <h2><span class="tick"></span>{L['xref_h2']}</h2>
    <table class="xref-table">
      <thead>
        <tr><th>{L['xref_th1']}</th><th>{L['xref_th2']}</th><th>{L['xref_th3']}</th></tr>
      </thead>
      <tbody>{xref_rows}</tbody>
    </table>
  </section>""")

    # Numeracio sequencial dels blocs presents
    n_blocs = len(sections)
    sections_html = ""
    for i, s in enumerate(sections, 1):
        sections_html += s.replace("{NUM}", f"{i:02d}") + "\n"

    frase = L["frase"].replace("{n}", str(n_blocs)).replace("{p}", str(report.get("pages") or "—"))
    url = report.get("url", "")
    font_link = f'<span class="font-link">{L["font_orig"]}</span>' if url else ""

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
    <p class="crumb">Biblioteca<span class="sep">/</span>Informes<span class="sep">/</span><span class="here">{esc(report.get('title', ''))}</span></p>
    <span class="right">{L['minuts']}</span>
  </div>

  <header class="fitxa-header">
    <div class="badges">{badges}</div>
    <h1>{esc(report.get('title', ''))}</h1>
    <div class="meta-row">{meta_html}</div>
  </header>

  <div class="sections">
  {sections_html}
  </div>

  <div class="footer-line">
    <span class="frase">{frase}</span>
    {font_link}
  </div>

  <div class="disclaimer">{L['disclaimer']}</div>

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
